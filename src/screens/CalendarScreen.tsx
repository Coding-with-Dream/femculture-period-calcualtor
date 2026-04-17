import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar integration (Mock)</Text>
      <View style={styles.mockCalendar}>
        {/* Simple mock rendering for calendar placeholder */}
        <Text style={styles.calendarText}>October 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 24,
  },
  mockCalendar: {
    width: '100%',
    height: 300,
    backgroundColor: colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  calendarText: {
    color: colors.secondary,
    fontSize: 24,
    fontWeight: '600',
  }
});
