import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState();

  const onSignUp = () => {};

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
