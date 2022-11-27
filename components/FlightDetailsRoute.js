import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {SideDrawer} from './SideDrawer';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FlightDetails from './FlightDetails';
import FlightPreparation from './FlightDetails/FlightPreparation';
import PreArrival from './FlightDetails/PreArrival';
import ArrivalService from './FlightDetails/ArrivalService';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const MainStackNavigator = ({navigation}) => (
  <Stack.Navigator options={{headerShown: false}}>
    <Stack.Screen
      name="FlightDetails"
      component={FlightDetails}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="FlightPreparation"
      component={FlightPreparation}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="PreArrival"
      component={PreArrival}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ArrivalService"
      component={ArrivalService}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
const FlightDetailsRoute = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <SideDrawer {...props} />}
      unmountOnBlur={true}>
      <Drawer.Screen
        name="DashboardStack"
        component={MainStackNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default FlightDetailsRoute;
