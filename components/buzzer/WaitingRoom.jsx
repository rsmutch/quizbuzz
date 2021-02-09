import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';

const WaitingRoom = ({
  navigation,
  route: {
    params: { currentUser, gameId, roomCode }
  }
}) => {
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState('');

  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');

  useEffect(() => {
    const showUsers = playersRef.onSnapshot((players) => {
      const currentUsers = [];
      players.forEach((user) => {
        if (user.data().isHost) {
          currentUsers.unshift(user.data());
          setHost(user.data().username);
        } else {
          currentUsers.push(user.data());
        }
      });
      setUsers(currentUsers);
    });
    const startGame = gameRef.onSnapshot((doc) => {
      if (doc.data().gameIsActive) {
        showUsers();
        startGame();
        // alert('game started!');
        navigation.navigate('Buzzers', {
          gameId,
          currentUser
        });
      }
    });
  }, []);

  const handleStart = () => {
    gameRef.update({ gameIsActive: true });
  };

  return (
    <View>
      <Text>{roomCode}</Text>
      {users.map((user) => {
        return <Text key={user.id}>{user.username}</Text>;
      })}
      <Button onPress={() => handleStart()}>Start Game</Button>
      <Button
        onPress={() => {
          gameRef.delete().then(() => {
            alert('Room Deleted');
            navigation.navigate('Main');
          });
        }}
      >
        Delete Room
      </Button>
    </View>
  );
};

export default WaitingRoom;
