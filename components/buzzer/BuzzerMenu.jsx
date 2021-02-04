import React from 'react';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';

import { firebase } from '../../src/firebaseConfig';

import { createRoom, joinRoom } from './NetworkFuncs';

const usersRef = firebase.firestore().collection('users');

const Buzzer = (props) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    usersRef
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        setUser(doc.data());
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          createRoom(navigation, user);
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
          joinRoom(navigation, user, roomCode);
        }}
      >
        Join room
      </Button>
      <Text>{user.name}</Text>
    </View>
  );
};

export default Buzzer;
