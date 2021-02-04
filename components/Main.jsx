import React from 'react';
import { useEffect } from 'react';

import { firebase } from '../src/firebaseConfig';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import Tools from './main/Tools';
const EmptyScreen = () => {
  return null;
};

const Tab = createMaterialBottomTabNavigator();
const iconSize = 26;

const Main = (props) => {
  useEffect(() => {
    props.fetchUser();
  }, []);

  const { currentUser } = props;
  return (
    <Tab.Navigator initialRouteName="Feed" labeled={false}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={iconSize} />
          )
        }}
      />
      <Tab.Screen
        name="Tools"
        component={Tools}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hammer-wrench"
              color={color}
              size={iconSize}
            />
          )
        }}
      />
      <Tab.Screen
        name="AddContainer"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('Add');
          }
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-box"
              color={color}
              size={iconSize}
            />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account"
              color={color}
              size={iconSize}
            />
          )
        }}
      />
      <Tab.Screen
        name="Logout"
        component={EmptyScreen}
        listeners={() => ({
          tabPress: (event) => {
            event.preventDefault();
            firebase
              .auth()
              .signOut()
              .then(() => {
                // Sign-out successful.
              })
              .catch((error) => {
                // An error happened.
              });
          }
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="logout"
              color={color}
              size={iconSize}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
