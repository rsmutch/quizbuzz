import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Modal } from 'react-native-paper';
import { firebase } from '../src/firebaseConfig';
import Leaderboard from 'react-native-leaderboard';

const LeaderboardModal = ({
  handleShowLeaderboard,
  showLeaderboard,
  gameId,
  currentUser
}) => {
  const [gameScoreData, setGameScoreData] = useState([]);

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
      });
      setGameScoreData(playersArray);
    });
  }, []);
  return (
    <Modal
      visible={showLeaderboard}
      onDismiss={handleShowLeaderboard}
      contentContainerStyle={containerStyle}
    >
      <Leaderboard data={gameScoreData} sortBy="score" labelBy="username" />
    </Modal>
  );
};

const containerStyle = { backgroundColor: 'white', padding: 20 };

export default LeaderboardModal;
