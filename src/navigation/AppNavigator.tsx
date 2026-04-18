import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ToDoScreen from '../screens/ToDoScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const themeColors = {
    primary: '#FF69B4',
    background: '#FFFFFF',
    inactive: '#DCDCDC',
    shadow: '#000000',
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
            tabBarIcon: ({ focused }) => {
              let iconName = '';
              let label = route.name;

              if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
              else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline';
              else if (route.name === 'To Do') iconName = focused ? 'checkbox' : 'checkbox-outline';
              else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

              return (
                <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
                  <Ionicons
                    name={iconName as any}
                    size={22}
                    color={focused ? themeColors.primary : '#A0A0A0'}
                  />
                  <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                    {label}
                  </Text>
                </View>
              );
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="To Do" component={ToDoScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFB',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderTopWidth: 0,
    elevation: 25,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    minWidth: 70,
  },
  iconContainerFocused: {
    backgroundColor: '#FF69B415',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 6,
    color: '#A0A0A0',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tabLabelFocused: {
    color: '#FF69B4',
    fontWeight: '800',
  },
});
