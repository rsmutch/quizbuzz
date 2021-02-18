import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import {
  Text,
  DataTable,
  FAB,
  Portal,
  Button,
  Divider
} from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';
import AddTeam from '../AddTeam';
import ColourPicker from '../ColourPicker';

const WaitingRoom = ({
  navigation,
  route: {
    params: { currentUser, gameId, roomCode, isHost }
  }
}) => {
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState('');
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState('');
  const [userColour, _setUserColour] = useState('#e76f51');

  const setUserColour = (colour) => {
    userColourRef.current = colour;
    _setUserColour(colour);
  };

  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');
  const teamsRef = gameRef.collection('teams');
  const userColourRef = useRef(userColour);

  useEffect(() => {
    const cancelUsersListener = playersRef.onSnapshot((players) => {
      const currentUsers = [];
      players.forEach((user) => {
        // if (user.data().team !== null) {
        //   setPlayersInTeams(playersInTeams + 1);
        // }
        if (user.data().isHost) {
          currentUsers.unshift(user.data());
          setHost(user.data().username);
        } else {
          currentUsers.push(user.data());
        }
      });
      setUsers(currentUsers);
    });

    const cancelGameListener = gameRef.onSnapshot((doc) => {
      if (doc.data().gameIsActive) {
        currentUser.userColour = userColourRef.current;
        cancelUsersListener();
        cancelGameListener();
        cancelTeamsListener();
        navigation.navigate('Buzzers', {
          gameId,
          currentUser
        });
      }
    });

    const cancelTeamsListener = teamsRef.onSnapshot((teams) => {
      const currentTeams = [];
      teams.forEach((team) => {
        currentTeams.push(team.data());
      });
      if (!currentTeams.includes(currentTeam.name)) {
        setCurrentTeam('');
      }
      setTeams(currentTeams);
    });
  }, []);

  useEffect(() => {}, [host, users]);

  const handleStart = () => {
    if (teams.length > 0) {
      if (
        users.every((user) => {
          return user.team === null;
        })
      ) {
        alert('there are teams but someone is not in a team');
      } else if (
        teams.some((team) => {
          return team.playerCount === 0;
        })
      ) {
        alert('there is a team with no one in it');
      } else {
        alert('there are teams and no one is not in a team');
      }
    } else {
      gameRef.update({ gameIsActive: true });
    }
  };

  const handleJoinTeam = (team) => {
    setCurrentTeam(team);
    playersRef
      .doc(currentUser.id)
      .get()
      .then((doc) => {
        const currentTeam = doc.data().team;
        if (currentTeam !== null) {
          teamsRef.doc(currentTeam).update({
            playerCount: firebase.firestore.FieldValue.increment(-1)
          });
        }
        teamsRef
          .doc(team)
          .update({ playerCount: firebase.firestore.FieldValue.increment(1) });
        playersRef.doc(currentUser.id).update({ team });
      });
  };

  const deleteTeam = (team) => {
    console.log(team);
    playersRef
      .where('team', '==', team)
      .get()
      .then((res) => {
        let batch = firebase.firestore().batch();
        res.docs.forEach((doc) => {
          const docRef = playersRef.doc(doc.id);
          batch.update(docRef, { team: null });
        });
        batch.commit().then(() => {
          console.log(`updated all documents`);
          teamsRef.doc(team).delete();
        });
      });
  };

  return (
    <View style={styles.container}>
      <Portal>
        <ColourPicker
          showColourPicker={showColourPicker}
          setShowColourPicker={setShowColourPicker}
          userColour={userColour}
          setUserColour={setUserColour}
        />
        <AddTeam
          showAddTeam={showAddTeam}
          setShowAddTeam={setShowAddTeam}
          gameId={gameId}
        />
      </Portal>
      <Text style={styles.roomCode}>{roomCode}</Text>
      {teams.length > 0 ? (
        <>
          <Text style={{ alignSelf: 'flex-start', fontSize: 25 }}>Teams</Text>
          {teams.map((team) => {
            return (
              <>
                <View style={styles.teamHeader} key={team.name}>
                  <Text style={styles.teamHeaderName}>{team.name}</Text>
                  <View style={styles.teamHeaderJoinContainer}>
                    {team.name !== currentTeam && (
                      <Pressable
                        style={styles.teamHeaderJoin}
                        onPress={() => handleJoinTeam(team.name)}
                      >
                        <Text style={styles.teamHeaderJoinText}>Join Team</Text>
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.teamHeaderPlayerCount}>
                    {`${team.playerCount} player` +
                      (team.playerCount !== 1 ? 's' : '')}
                  </Text>
                  {isHost && (
                    <View style={styles.teamHeaderDeleteContainer}>
                      <Pressable
                        style={styles.teamHeaderDelete}
                        onPress={() => {
                          deleteTeam(team.name);
                        }}
                      >
                        <Text style={styles.teamHeaderDeleteText}>X</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
                <Divider style={{ height: 5 }} />
                {users.map((user) => {
                  if (user.team === team.name) {
                    return (
                      <View key={user.id} style={styles.userRow}>
                        {/* <Image
                          styles={styles.avatar}
                          source={require('../../assets/avatar.jpg')}
                        /> */}
                        <Text style={styles.userRowUsername}>
                          {user.username}
                        </Text>
                      </View>
                    );
                  }
                })}
              </>
            );
          })}
          <View style={styles.teamHeader}>
            <Text style={styles.teamHeaderName}>No team</Text>
          </View>
          {users.map((user) => {
            if (user.team === null) {
              return (
                <View key={user.id} style={styles.userRow}>
                  {/* <Image
                    styles={styles.avatar}
                    source={require('../../assets/avatar.jpg')}
                  /> */}
                  <Text style={styles.userRowUsername}>{user.username}</Text>
                </View>
              );
            }
          })}
        </>
      ) : (
        <>
          {users.map((user) => {
            if (user.team === null) {
              return (
                <View key={user.id} style={styles.userRow}>
                  {/* <Image
                    styles={styles.avatar}
                    source={require('../../assets/avatar.jpg')}
                  /> */}
                  <Text style={styles.userRowUsername}>{user.username}</Text>
                </View>
              );
            }
          })}
        </>
      )}

      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start'
          }}
        >
          <FAB
            style={{ backgroundColor: userColour }}
            icon="water"
            onPress={() => setShowColourPicker(true)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button onPress={() => handleStart()}>Start Game</Button>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      {isHost && (
        <Button
          onPress={() => {
            setShowAddTeam(true);
          }}
        >
          Add Team
        </Button>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  roomCode: {
    fontSize: 40
  },
  teamHeader: {
    flexDirection: 'row',
    height: 20
  },
  teamHeaderJoinContainer: {
    flex: 1
  },
  teamHeaderJoin: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'blueviolet',
    justifyContent: 'center',
    alignItems: 'center'
  },
  teamHeaderJoinText: {
    fontWeight: 'bold',
    color: 'white'
  },
  teamHeaderName: {
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1
  },
  teamHeaderPlayerCount: {
    textAlign: 'center',
    flex: 1
  },
  teamHeaderDeleteContainer: {
    flex: 0.25
  },
  teamHeaderDelete: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'blueviolet',
    justifyContent: 'center',
    alignItems: 'center'
  },
  teamHeaderDeleteText: {
    fontWeight: 'bold',
    color: 'white'
  },
  userRow: {
    flexDirection: 'row'
    // width: '100%'
  },
  // avatar: {
  //   flex: 1,
  //   height: undefined,
  //   width: undefined,
  //   resizeMode: 'contain'
  // },
  userRowUsername: {
    flex: 5,
    fontSize: 25
  }
});

export default WaitingRoom;
