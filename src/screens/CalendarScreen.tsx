import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/AppBar';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Mock prediction logic: let's pretend day 12-16 is period, day 24-28 is fertile
  const isPeriodDay = (d: number) => d >= 12 && d <= 16;
  const isFertileDay = (d: number) => d >= 24 && d <= 28;

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <AppBar title="Calendar" />
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Predictive Cycle</Text>
          <Text style={styles.headerSub}>Based on your recent logs</Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <Ionicons name="chevron-back" size={24} color="#2C3E50" />
            </TouchableOpacity>
            <Text style={styles.calendarMonthText}>{monthNames[month]} {year}</Text>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarWeekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <Text key={d} style={styles.calendarWeekText}>{d}</Text>)}
          </View>

          <View style={styles.calendarDaysGrid}>
            {blanks.map(b => <View key={`blank-${b}`} style={styles.calendarDayCell} />)}
            {days.map(d => {
              const pDay = isPeriodDay(d);
              const fDay = isFertileDay(d);

              return (
                <TouchableOpacity key={d} style={styles.calendarDayCell}>
                  <View style={[
                    styles.dayBubble,
                    pDay && { backgroundColor: '#FF69B4' },  // Hot Pink for Period
                    fDay && { backgroundColor: '#E3F2FD' }   // Sky Blue for Ovulation
                  ]}>
                    <Text style={[styles.calendarDayNum, (pDay) && { color: '#FFF' }, fDay && { color: '#2196F3', fontWeight: '800' }]}>{d}</Text>
                  </View>
                  {/* Subtle dots for logged symptoms */}
                  {d % 5 === 0 && <View style={styles.symptomDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#FF69B4' }]} />
            <Text style={styles.legendText}>Predicted Period</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#E3F2FD' }]} />
            <Text style={styles.legendText}>Fertile Window</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#FFB6C1', width: 6, height: 6 }]} />
            <Text style={styles.legendText}>Logged Symptoms</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 130 },
  headerBox: { marginBottom: 20, paddingHorizontal: 5 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#2C3E50', marginBottom: 4 },
  headerSub: { fontSize: 15, color: '#7F8C8D', fontWeight: '500' },
  calendarContainer: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 5, marginBottom: 25 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  calendarMonthText: { fontSize: 18, fontWeight: '900', color: '#2C3E50' },
  calendarWeekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  calendarWeekText: { fontSize: 13, color: '#A0A0A0', fontWeight: '800', width: 35, textAlign: 'center' },
  calendarDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'flex-start', alignItems: 'center', marginVertical: 4 },
  dayBubble: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  calendarDayNum: { fontSize: 16, fontWeight: '600', color: '#333' },
  symptomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFB6C1', marginTop: 4 },
  legendContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 15 },
  legendText: { fontSize: 15, color: '#2C3E50', fontWeight: '600' }
});
