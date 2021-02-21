import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, BackHandler, Alert } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';
import ChangeQM from '../ChangeQM';
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

  const [buzzedUser, setBuzzedUser] = useState({ userColour: 'white' });
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isQM, setIsQM] = useState(false);
  const [qm, setQM] = useState({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [showChangeQM, setShowChangeQM] = useState(false);
  const [score, setScore] = useState(0);

  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');

  const whoBuzzedContainer = {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    backgroundColor: buzzedUser.userColour
  };

  useEffect(() => {
    gameRef.get().then((doc) => {
      if (doc.data().host.id === currentUser.id) {
        setIsHost(true);
      }
    });
    const listener = gameRef.onSnapshot((doc) => {
      const qmUser = doc.data().quizMaster;
      if (qmUser !== qm) {
        setQM(qmUser);
      }
      if (!isQM && qmUser.id === currentUser.id) {
        setIsQM(true);
      } else if (isQM && qmUser.id !== currentUser.id) {
        setShowChangeQM(false);
        setIsQM(false);
      }

      const buzzUser = doc.data().buzzed;
      if (buzzUser) {
        setShowLeaderboard(false);
        setBuzzedUser(buzzUser);
        setHasBuzzed(true);
      } else if (buzzUser === null) {
        setBuzzedUser({ userColour: 'white' });
        setHasBuzzed(false);
      }

      const gameIsActive = doc.data().gameIsActive;
      if (!gameIsActive) {
        listener();
        navigation.navigate('Leaderboard', { gameId, currentUser });
      }
    });

    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to leave?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel'
        },
        { text: 'YES', onPress: () => navigation.navigate('Main') }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  }, []);

  const handleBuzz = () => {
    gameRef.update({ buzzed: currentUser });
    if (Object.keys(buzzedUser).length === 0) {
    }
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const handleShowConfirmExit = () => {
    setShowConfirmExit(!showConfirmExit);
  };

  const handleShowChangeQM = () => {
    setShowChangeQM(!showChangeQM);
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
        <ChangeQM
          handleShowChangeQM={handleShowChangeQM}
          showChangeQM={showChangeQM}
          gameId={gameId}
          currentUser={currentUser}
          setIsQM={setIsQM}
          isHost={isHost}
        />
      </Portal>
      <Text>Quiz Master</Text>
      <Text>{qm.username}</Text>
      <View style={whoBuzzedContainer}>
        <Text style={styles.whoBuzzed}>
          {buzzedUser.username && buzzedUser.username.toUpperCase()}
        </Text>
      </View>
      {isQM && (
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
      <Text>QM:{isQM ? 'true' : 'false'}</Text>

      <Text>Host:{isHost ? 'true' : 'false'}</Text>
      {(isHost || isQM) && (
        <View style={{ flex: 1 }}>
          <Text>You are {isHost ? 'host' : 'QM'}</Text>
          <Button onPress={handleShowChangeQM}>Change QM</Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
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
