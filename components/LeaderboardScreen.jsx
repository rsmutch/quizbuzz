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
  const [isDraw, setIsDraw] = useState(false);
  const [winnerArray, setWinnerArray] = useState([]);

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
    // returns the highest score in gameScoreData
    const highScore = Math.max.apply(
      null,
      gameScoreData.map((user) => {
        return user.score;
      })
    );

    const tempWinnerArray = [];
    gameScoreData.forEach((user) => {
      if (user.score === highScore) {
        tempWinnerArray.push(user);
      }
    });

    if (tempWinnerArray.length > 1) {
      setIsDraw(true);
    }
    setWinnerArray(tempWinnerArray);
    setShowWinnerModal(true);
  }, [gameScoreData]);

  useEffect(() => {}, [winnerArray]);

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
        {winnerArray.length > 0 && (
          <View style={styles.modalContainer}>
            {!isDraw && <Text>{winnerArray[0].username} HAS WON!</Text>}
            {isDraw && (
              <>
                <Text style={styles.drawText}>DRAW!</Text>
                <View style={styles.drawWinnersContainer}>
                  {winnerArray.map((user) => {
                    return (
                      <Text style={styles.drawWinnersText} id={user.id}>
                        {user.username.toUpperCase()}
                      </Text>
                    );
                  })}
                </View>
                <Text>HAVE WON</Text>
              </>
            )}
          </View>
        )}
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
  },
  modalContainer: {
    alignItems: 'center'
  },
  drawText: {
    fontSize: 42,
    textDecorationLine: 'underline'
  },
  drawWinnersContainer: {
    flexDirection: 'row'
  },
  drawWinnersText: {
    flex: 1,
    textAlign: 'center'
  }
});

export default LeaderboardScreen;
