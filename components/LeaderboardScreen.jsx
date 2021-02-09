import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, Modal } from 'react-native-paper';
import { firebase } from '../src/firebaseConfig';
import Leaderboard from 'react-native-leaderboard';

const LeaderboardScreen = ({
  navigation,
  route: {
    params: { gameId, currentUser }
  }
}) => {
  const [gameScoreData, setGameScoreData] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    const playersRef = firebase
      .firestore()
      .collection('games')
      .doc(gameId)
      .collection('users');

    playersRef.get().then((players) => {
      const playersArray = [];
      players.forEach((player) => {
        playersArray.push(player.data());
      });
      setGameScoreData(playersArray);
    });
  }, []);

  useEffect(() => {
    console.log(gameScoreData);
    setShowWinnerModal(true);
  }, [gameScoreData]);

  return (
    <View style={styles.container}>
      <Leaderboard data={gameScoreData} sortBy="score" labelBy="username" />
      <Modal
        visible={showWinnerModal}
        onDismiss={() => {
          setShowWinnerModal(false);
        }}
        contentContainerStyle={containerStyle}
      >
        <View>
          <Text></Text>
        </View>
      </Modal>
    </View>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  margin: 20,
  borderRadius: 20
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default LeaderboardScreen;
