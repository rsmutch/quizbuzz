import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, DataTable, FAB, Portal, Button } from 'react-native-paper';
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
    console.log(team);
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
      {teams.length > 0 && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ flex: 1 }}>Join</DataTable.Title>
            <DataTable.Title style={{ flex: 2 }}>Name</DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}>Players</DataTable.Title>
          </DataTable.Header>

          {teams.map((team) => {
            return (
              <DataTable.Row key={team.name}>
                <View style={{ flex: 1, marginRight: 20 }}>
                  {team.name !== currentTeam && (
                    <Pressable
                      style={styles.joinButton}
                      onPress={() => handleJoinTeam(team.name)}
                    >
                      <Text style={styles.joinButtonText}>+</Text>
                    </Pressable>
                  )}
                </View>
                <DataTable.Cell style={{ flex: 5 }}>{team.name}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 1 }}>
                  {team.playerCount}
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      )}
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Image</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Team</DataTable.Title>
        </DataTable.Header>

        {users.map((user) => {
          return (
            <DataTable.Row key={user.id}>
              <DataTable.Cell style={{ flex: 1 }}></DataTable.Cell>
              <DataTable.Cell style={{ flex: 5 }}>
                {user.username}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>{user.team}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>
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
  joinButton: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'blueviolet',
    justifyContent: 'center',
    alignItems: 'center'
  },
  joinButtonText: {
    fontWeight: 'bold',
    color: 'white'
  }
});

export default WaitingRoom;
