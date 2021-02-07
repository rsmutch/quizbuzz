import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';
import LeaderboardModal from './LeaderboardModal';

const Buzzers = ({
  navigation,
  route: {
    params: { gameId, currentUser }
  }
}) => {
  // Delete these
  // const gameId = 'IWDW0iHRtdHBHaLXe0er';
  // const currentUser = {
  //   email: 'rsmutch@gmail.com',
  //   id: 'uIkmp94d40cBPIHwRetDwvtBgu12',
  //   username: 'ringo'
  // };

  const [buzzedUser, setBuzzedUser] = useState({});
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');

  useEffect(() => {
    playersRef
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.data().isHost) {
          setIsHost(true);
        }
      });
    const whoBuzzed = gameRef.onSnapshot((doc) => {
      const buzzUser = doc.data().buzzed;
      if (buzzUser) {
        setShowLeaderboard(false);
        setBuzzedUser(buzzUser);
        setHasBuzzed(true);
      } else if (buzzUser === null) {
        setBuzzedUser({});
        setHasBuzzed(false);
      }
    });
  }, []);

  const handleBuzz = () => {
    gameRef.update({ buzzed: currentUser });
    if (Object.keys(buzzedUser).length === 0) {
    }
  };

  const handleModal = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const handleCorrect = () => {
    playersRef
      .doc(buzzedUser.id)
      .update({ score: firebase.firestore.FieldValue.increment(1) });
    gameRef.update({ buzzed: null });
  };

  const handleIncorrect = () => {
    gameRef.update({ buzzed: null });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Portal>
        <LeaderboardModal
          handleModal={handleModal}
          showLeaderboard={showLeaderboard}
          gameId={gameId}
          currentUser={currentUser}
        />
      </Portal>
      <Text style={{ flex: 1 }}>{buzzedUser.username}</Text>
      <Button disabled={hasBuzzed} mode="contained" onPress={handleBuzz}>
        BUZZER
      </Button>
      {isHost && <Text style={{ flex: 1 }}>I AM THE HOST</Text>}
      {isHost && (
        <>
          <View style={{ flexDirection: 'row' }}>
            <Button
              icon="check"
              mode="contained"
              disabled={!hasBuzzed}
              onPress={handleCorrect}
            />
            <Button
              icon="close"
              mode="contained"
              disabled={!hasBuzzed}
              onPress={handleIncorrect}
            />
          </View>
          <Button style={{ flex: 1 }} mode="contained">
            End Game
          </Button>
        </>
      )}
      <Button style={{ flex: 1 }} onPress={handleModal}>
        Leaderboard
      </Button>
    </View>
  );
};

export default Buzzers;
