import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AppBar({ title }: { title: string }) {
  if (title === 'Home') {
    const currentHour = new Date().getHours();
    let timeGreeting = "Good morning,";
    if (currentHour >= 12 && currentHour < 17) {
      timeGreeting = "Good afternoon,";
    } else if (currentHour >= 17) {
      timeGreeting = "Good evening,";
    }

    return (
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#FAFAFB' }}>
        <View style={styles.homeContainer}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.textStack}>
              <Text style={styles.greetingSub}>{timeGreeting}</Text>
              <Text style={styles.greeting}>Juliya!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellContainer}>
            <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Default header for other screens
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#FAFAFB' }}>
      <View style={styles.defaultContainer}>
        <Text style={styles.defaultTitle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF69B420',
  },
  textStack: {
    marginLeft: 14,
    justifyContent: 'center',
  },
  greetingSub: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 2,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2C3E50',
    letterSpacing: -0.5,
  },
  bellContainer: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF69B4',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  defaultContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
  },
  defaultTitle: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: '800',
  },
});
