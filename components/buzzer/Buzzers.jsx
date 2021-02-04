import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';

const Buzzers = ({
  navigation,
  route: {
    params: { gameId, currentUser }
  }
}) => {
  const [buzzed, setBuzzed] = useState({});

  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');

  useEffect(() => {
    const whoBuzzed = gameRef.onSnapshot((doc) => {
      const buzzUser = doc.data().buzzed;
      if (buzzUser) {
        setBuzzed(buzzUser);
      }
    });
  }, []);

  const handleBuzz = () => {
    gameRef.update({ buzzed: currentUser });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{buzzed.username}</Text>
      <Button mode="contained" onPress={handleBuzz}>
        BUZZER
      </Button>
    </View>
  );
};

export default Buzzers;
