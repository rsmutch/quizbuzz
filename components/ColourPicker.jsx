import React from 'react';
import ColorPalette from 'react-native-color-palette';
import { Modal } from 'react-native-paper';
import { Text } from 'react-native';

const ColourPicker = ({
  showColourPicker,
  setShowColourPicker,
  userColour,
  setUserColour
}) => {
  return (
    <Modal
      visible={showColourPicker}
      onDismiss={() => setShowColourPicker(false)}
      contentContainerStyle={containerStyle}
    >
      <ColorPalette
        onChange={(color) => {
          setUserColour(color);
          setShowColourPicker(false);
        }}
        defaultColor={userColour}
        colors={['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653']}
        title={'Pick a colour'}
        icon={
          <Text>✔</Text>
          // Icon can just be text or ASCII
        }
      />
    </Modal>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  margin: 20,
  borderRadius: 20
};

export default ColourPicker;
