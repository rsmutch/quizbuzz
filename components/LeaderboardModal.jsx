import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, Portal, Modal } from 'react-native-paper';
import { firebase } from '../src/firebaseConfig';
import Leaderboard from 'react-native-leaderboard';

const LeaderboardModal = ({ gameId, currentUser }) => {
  const [gameScoreData, setGameScoreData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const playersRef = firebase
      .firestore()
      .collection('games')
      .doc(gameId)
      .collection('users');

    const getScores = playersRef.onSnapshot((players) => {
      const playersArray = [];
      players.forEach((player) => {
        playersArray.push(player.data());
        if (player.data().id === currentUser.id) {
          console.log(player.data().score);
          setScore(player.data().score);
        }
      });
      setGameScoreData(playersArray);
    });
  }, []);

  const handleShowLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <>
      <View style={styles.lbToggleContainer}>
        <Button mode="contained" onPress={handleShowLeaderboard}>
          {score} points
        </Button>
      </View>
      <Portal>
        <Modal
          visible={showLeaderboard}
          onDismiss={handleShowLeaderboard}
          contentContainerStyle={containerStyle}
        >
          <Leaderboard data={gameScoreData} sortBy="score" labelBy="username" />
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  lbToggleContainer: { flex: 1 }
});

const containerStyle = { backgroundColor: 'white', padding: 20 };

export default LeaderboardModal;
