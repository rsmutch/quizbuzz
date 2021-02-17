import React from 'react';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, Divider, Modal } from 'react-native-paper';

import { firebase } from '../../src/firebaseConfig';

import { createRoom, joinRoom } from './NetworkFuncs';

const usersRef = firebase.firestore().collection('users');

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

  const { navigation } = props;

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
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
        autoCapitalize="characters"
        onChangeText={(text) => setRoomCode(text)}
        value={roomCode}
      />
      <Button
        mode="contained"
        onPress={() => {
          joinRoom(navigation, currentUser, roomCode.toUpperCase());
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Buzzer;
