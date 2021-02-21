import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, Button, Modal } from 'react-native-paper';
import { firebase } from '../src/firebaseConfig';

const ChangeQM = ({
  handleShowChangeQM,
  showChangeQM,
  gameId,
  setIsQM,
  currentUser,
  isHost
}) => {
  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    playersRef.get().then((querySnapshot) => {
      const tempUsers = [];
      querySnapshot.forEach((user) => {
        tempUsers.push(user.data());
      });
      setUsers(tempUsers);
    });
  }, []);

  const handleQMChange = (user) => {
    gameRef.update({
      quizMaster: {
        username: user.username,
        id: user.id,
        team: user.team
      }
    });
    if (user.id !== currentUser.id) {
      setIsQM(false);
    }
    setIsQM;
    handleShowChangeQM();
  };

  return (
    <Modal
      visible={showChangeQM}
      onDismiss={handleShowChangeQM}
      contentContainerStyle={containerStyle}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Change QM</Text>
      </View>
      {users.map((user) => {
        return (
          <View key={user.id} style={styles.usernameContainer}>
            <Pressable
              style={styles.usernamePress}
              onPress={() =>
                (user.id !== currentUser.id || isHost) && handleQMChange(user)
              }
            >
              <Text
                style={styles.username}
                style={
                  (user.id !== currentUser.id || isHost) && {
                    color: 'rebeccapurple',
                    textDecorationLine: 'underline'
                  }
                }
              >
                {user.username}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </Modal>
  );
};

const containerStyle = { backgroundColor: 'white', padding: 20 };

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  header: { fontSize: 20 },
  usernameContainer: {
    alignItems: 'center'
  },
  usernamePress: {},
  username: { fontSize: 18, fontWeight: 'bold' }
});

export default ChangeQM;
