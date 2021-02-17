import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Modal } from 'react-native-paper';

import { firebase } from '../src/firebaseConfig';

const ConfirmExit = ({
  handleShowConfirmExit,
  showConfirmExit,
  gameId,
  currentUser
}) => {
  const gameRef = firebase.firestore().collection('games').doc(gameId);

  return (
    <Modal
      visible={showConfirmExit}
      onDismiss={handleShowConfirmExit}
      contentContainerStyle={containerStyle}
    >
      <View style={styles.confirmQuestionContainer}>
        <Text style={styles.confirmQuestion}>Are you sure?</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.buttons}
          icon="check"
          mode="contained"
          onPress={() => {
            handleShowConfirmExit();
            gameRef.update({ gameIsActive: false });
          }}
        />
        <Button
          style={styles.buttons}
          icon="close"
          mode="contained"
          onPress={handleShowConfirmExit}
        />
      </View>
    </Modal>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  margin: 20,
  borderRadius: 20
};

const styles = StyleSheet.create({
  confirmQuestionContainer: { alignItems: 'center' },
  confirmQuestion: { fontSize: 30 },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttons: {
    margin: 5,
    paddingLeft: 15
  }
});

export default ConfirmExit;
