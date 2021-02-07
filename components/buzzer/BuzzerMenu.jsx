import React from 'react';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';

import { firebase } from '../../src/firebaseConfig';

import { createRoom, joinRoom } from './NetworkFuncs';

const usersRef = firebase.firestore().collection('users');
const gamesRef = firebase.firestore().collection('games');

const Buzzer = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    usersRef
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        setCurrentUser(doc.data());
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteAllGames = () => {
    gamesRef
      .get()
      .then((querySnapshot) => {
        let batch = firebase.firestore().batch();
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        batch.commit();
      })
      .then(() => {
        console.log('deleted');
      })
      .catch((err) => {
        console.err(err);
      });
  };

  const { navigation } = props;

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View>
      <Button
        mode="contained"
        onPress={() => {
          createRoom(navigation, currentUser);
        }}
      >
        Create room
      </Button>
      <Divider style={{ marginTop: 5 }} />
      <TextInput
        style={{ margin: 20 }}
        mode="outlined"
        onChangeText={(text) => setRoomCode(text)}
        value={roomCode}
      />
      <Button
        mode="contained"
        onPress={() => {
          joinRoom(navigation, currentUser, roomCode);
        }}
      >
        Join room
      </Button>
      <Button
        onPress={() => {
          deleteAllGames();
        }}
      >
        Delete All Rooms
      </Button>
    </View>
  );
};

export default Buzzer;
