import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { firebase } from './src/firebaseConfig';

import { Provider as StoreProvider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import LoginScreen from './components/auth/Login';

import WaitingRoomScreen from './components/buzzer/WaitingRoom';
import BuzzerMenuScreen from './components/buzzer/BuzzerMenu';
import BuzzersScreen from './components/buzzer/Buzzers';

import { useState } from 'react';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
      setLoaded(true);
    });
  }, []);
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            {/*Landing*/}
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={navigation}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={navigation}
            />
            <Stack.Screen
              name="BuzzerMenu"
              component={BuzzerMenuScreen}
              navigation={navigation}
            />
            <Stack.Screen
              name="WaitingRoom"
              component={WaitingRoomScreen}
              navigation={navigation}
            />
            <Stack.Screen
              name="Buzzers"
              component={BuzzersScreen}
              navigation={navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}
