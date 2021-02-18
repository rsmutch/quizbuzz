import React, { useState } from 'react';
import { Button, Modal, Text, TextInput } from 'react-native-paper';
import { firebase } from '../src/firebaseConfig';

const AddTeam = ({ showAddTeam, setShowAddTeam, gameId }) => {
  const [teamName, setTeamName] = useState('');
  const [teamAdded, setTeamAdded] = useState(false);

  const gameRef = firebase.firestore().collection('games').doc(gameId);
  const teamsRef = gameRef.collection('teams');

  const postTeam = () => {
    const regex = /.*\S.*/;
    if (regex.test(teamName)) {
      teamsRef
        .doc(teamName)
        .set({ name: teamName, playerCount: 0, score: 0 })
        .then(() => {
          setTeamAdded(true);
          setTeamName('');
        });
    } else {
      console.log('empty string');
    }
  };
  return (
    <Modal
      visible={showAddTeam}
      onDismiss={() => {
        setTeamAdded(false);
        setShowAddTeam(false);
      }}
      contentContainerStyle={containerStyle}
    >
      <Text>New Team</Text>
      <TextInput
        onChangeText={(text) => {
          setTeamAdded(false);
          setTeamName(text);
        }}
        value={teamName}
      ></TextInput>
      {teamAdded && (
        <Text style={{ alignSelf: 'center', color: 'green', fontSize: 20 }}>
          Team Added
        </Text>
      )}
      <Button onPress={postTeam}>Create</Button>
    </Modal>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  margin: 20,
  borderRadius: 20
};

export default AddTeam;
