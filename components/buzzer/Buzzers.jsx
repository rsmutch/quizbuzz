import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';
import ConfirmExit from '../ConfirmExit';
import LeaderboardModal from '../LeaderboardModal';

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
  const [showConfirmExit, setShowConfirmExit] = useState(false);

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

  const handleShowLeaderboard = () => {
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

  const handleShowConfirmExit = () => {
    setShowConfirmExit(!showConfirmExit);
  };

  return (
    <View style={styles.container}>
      <Portal>
        <LeaderboardModal
          handleShowLeaderboard={handleShowLeaderboard}
          showLeaderboard={showLeaderboard}
          gameId={gameId}
          currentUser={currentUser}
        />
        <ConfirmExit
          handleShowConfirmExit={handleShowConfirmExit}
          showConfirmExit={showConfirmExit}
          gameId={gameId}
          currentUser={currentUser}
          navigation={navigation}
        />
      </Portal>
      {/* {isHost && (
        <View style={styles.hostOrNotContainer}>
          <Text>I AM THE HOST</Text>
        </View>
      )} */}
      <View style={styles.whoBuzzedContainer}>
        <Text style={styles.whoBuzzed}>
          {buzzedUser.username && buzzedUser.username.toUpperCase()}
        </Text>
      </View>
      {isHost && (
        <>
          <View style={styles.correctOrNotContainer}>
            <Button
              style={styles.correctOrNotButtons}
              icon="check"
              mode="contained"
              disabled={!hasBuzzed}
              onPress={handleCorrect}
            />
            <Button
              style={styles.correctOrNotButtons}
              icon="close"
              mode="contained"
              disabled={!hasBuzzed}
              onPress={handleIncorrect}
            />
          </View>
          <View style={styles.endGameBtnContainer}>
            <Button mode="contained" onPress={handleShowConfirmExit}>
              End Game
            </Button>
          </View>
        </>
      )}
      <View style={styles.lbToggleContainer}>
        <Button onPress={handleShowLeaderboard}>Leaderboard</Button>
      </View>
      <View style={styles.buzzerBtnContainer}>
        <Button disabled={hasBuzzed} mode="contained" onPress={handleBuzz}>
          BUZZER
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  whoBuzzedContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5
  },
  whoBuzzed: { fontSize: 50 },
  hostOrNotContainer: { flex: 1 },
  correctOrNotContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  correctOrNotButtons: {
    margin: 5,
    paddingLeft: 15
  },
  endGameBtnContainer: { flex: 1 },
  lbToggleContainer: { flex: 1 },
  buzzerBtnContainer: { flex: 1 }
});

export default Buzzers;
