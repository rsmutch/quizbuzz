import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { firebase } from '../../src/firebaseConfig';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState();

  const onSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            username: name,
            email,
            id: firebase.auth().currentUser.uid
          });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View>
      <TextInput placeholder="name" onChangeText={(name) => setName(name)} />

      <TextInput
        placeholder="email"
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        placeholder="password"
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />

      <Button onPress={() => onSignUp()} title="Sign Up" />
    </View>
  );
};

export default Register;
