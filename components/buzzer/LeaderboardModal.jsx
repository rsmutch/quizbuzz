import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Modal } from 'react-native-paper';
import { firebase } from '../../src/firebaseConfig';
import Leaderboard from 'react-native-leaderboard';

const LeaderboardModal = ({
  handleModal,
  showLeaderboard,
  gameId,
  currentUser
}) => {
  const [gameScoreData, setGameScoreData] = useState([]);
  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const playersRef = gameRef.collection('users');
  const containerStyle = { backgroundColor: 'white', padding: 20 };
  useEffect(() => {
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
      onDismiss={handleModal}
      contentContainerStyle={containerStyle}
    >
      <Leaderboard data={gameScoreData} sortBy="score" labelBy="username" />
    </Modal>
  );
};

export default LeaderboardModal;
