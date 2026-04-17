import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Current Cycle</Text>
        <Text style={styles.dayText}>Day 14</Text>
        <Text style={styles.subText}>Low Chance of Pregnancy</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.heading, { color: colors.white }]}>Next Period</Text>
        <Text style={[styles.dayText, { color: colors.white }]}>in 14 Days</Text>
        <Text style={[styles.subText, { color: colors.white }]}>Estimated: Oct 28</Text>
      </View>

      <TouchableOpacity style={styles.logButton}>
        <Text style={styles.logButtonText}>Log Period</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: colors.text,
  },
  logButton: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  logButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
