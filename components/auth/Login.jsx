import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { firebase } from '../../src/firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="email"
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        placeholder="password"
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />

      <Button onPress={() => onSignIn()} title="Sign In" />
    </View>
  );
};

export default Login;
