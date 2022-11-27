import React, {Component, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Drawer = createDrawerNavigator();
export function SideDrawer(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        {/* <Drawer.Section style={styles.drawerSection}> */}
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="home" color={color} size={size} />
          )}
          label="Flight Details"
          labelStyle={styles.drawerLabel}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'FlightDetails'}],
            });
            props.navigation.closeDrawer();
          }}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="home" color={color} size={size} />
          )}
          label="Flight Preparation"
          labelStyle={styles.drawerLabel}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'FlightPreparation'}],
            });
            props.navigation.closeDrawer();
          }}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="home" color={color} size={size} />
          )}
          label="Pre Arrival"
          labelStyle={styles.drawerLabel}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'PreArrival'}],
            });
            props.navigation.closeDrawer();
          }}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="home" color={color} size={size} />
          )}
          label="Arrival Service"
          labelStyle={styles.drawerLabel}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'ArrivalService'}],
            });
            props.navigation.closeDrawer();
          }}
        />
        {/* </Drawer.Section> */}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    flexShrink: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerLabel: {
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
  },
});
