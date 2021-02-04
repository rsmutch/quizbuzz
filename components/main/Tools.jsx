import React from 'react';
import { Button, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tools = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Buzzers</Text>
      <TouchableOpacity>
        <MaterialCommunityIcons
          onPress={() => {
            navigation.navigate('BuzzerMenu');
          }}
          name="gesture-tap-button"
          color={'grey'}
          size={50}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Tools;
