import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/AppBar';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const todayDate = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Predictive logic based on a 28-day cycle
  const isPeriodDay = (d: number) => d >= 12 && d <= 16;
  const isFertileDay = (d: number) => d >= 24 && d <= 28;
  const isOvulationDay = (d: number) => d === 26;
  const isToday = (d: number) => d === todayDate && month === todayMonth && year === todayYear;

  const getPhaseForDay = (d: number) => {
    if (isPeriodDay(d)) return { phase: 'Period', color: '#FF69B4', tip: 'Rest & nourish. Warm foods help.' };
    if (isOvulationDay(d)) return { phase: 'Ovulation', color: '#FF9800', tip: 'Peak fertility. Energy is at its highest!' };
    if (isFertileDay(d)) return { phase: 'Fertile Window', color: '#4FC3F7', tip: 'Higher chance of conception.' };
    if (d > 16 && d < 24) return { phase: 'Follicular', color: '#81C784', tip: 'Energy rising. Great for new projects.' };
    return { phase: 'Luteal', color: '#B0BEC5', tip: 'Wind down. Focus on self-care.' };
  };

  const selectedInfo = selectedDay ? getPhaseForDay(selectedDay) : null;

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <AppBar title="Calendar" />
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Predictive Cycle</Text>
          <Text style={styles.headerSub}>Based on your recent logs</Text>
        </View>

        {/* Month Insights Summary */}
        <View style={styles.insightsRow}>
          <View style={[styles.insightChip, { backgroundColor: '#FFF0F5' }]}>
            <Ionicons name="water" size={16} color="#FF69B4" />
            <Text style={styles.insightChipText}>5 Period Days</Text>
          </View>
          <View style={[styles.insightChip, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="sparkles" size={16} color="#2196F3" />
            <Text style={styles.insightChipText}>5 Fertile Days</Text>
          </View>
          <View style={[styles.insightChip, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="sunny" size={16} color="#FF9800" />
            <Text style={styles.insightChipText}>Ovulation</Text>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month - 1, 1))} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={22} color="#2C3E50" />
            </TouchableOpacity>
            <Text style={styles.calendarMonthText}>{monthNames[month]} {year}</Text>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month + 1, 1))} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={22} color="#2C3E50" />
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
              const oDay = isOvulationDay(d);
              const today = isToday(d);
              const isSelected = selectedDay === d;

              return (
                <TouchableOpacity key={d} style={styles.calendarDayCell} onPress={() => setSelectedDay(d)} activeOpacity={0.7}>
                  <View style={[
                    styles.dayBubble,
                    pDay && { backgroundColor: '#FF69B4' },
                    fDay && !oDay && { backgroundColor: '#E3F2FD' },
                    oDay && { backgroundColor: '#FF9800' },
                    today && !pDay && !fDay && { borderWidth: 2, borderColor: '#FF69B4' },
                    isSelected && { borderWidth: 2.5, borderColor: '#2C3E50' },
                  ]}>
                    <Text style={[
                      styles.calendarDayNum,
                      (pDay || oDay) && { color: '#FFF' },
                      fDay && !oDay && { color: '#2196F3', fontWeight: '800' },
                    ]}>{d}</Text>
                  </View>
                  {d % 5 === 0 && <View style={styles.symptomDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Day Detail Card */}
        {selectedInfo && (
          <View style={styles.dayDetailCard}>
            <View style={styles.dayDetailHeader}>
              <View style={[styles.dayDetailDot, { backgroundColor: selectedInfo.color }]} />
              <Text style={styles.dayDetailPhase}>{selectedInfo.phase}</Text>
              <Text style={styles.dayDetailDate}>{monthNames[month]} {selectedDay}</Text>
            </View>
            <Text style={styles.dayDetailTip}>{selectedInfo.tip}</Text>
          </View>
        )}

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#FF69B4' }]} />
              <Text style={styles.legendText}>Period</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#E3F2FD' }]} />
              <Text style={styles.legendText}>Fertile</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Ovulation</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#FFB6C1', width: 8, height: 8 }]} />
              <Text style={styles.legendText}>Symptoms</Text>
            </View>
          </View>
        </View>

        {/* Cycle Pattern Card */}
        <View style={styles.patternCard}>
          <View style={styles.patternHeader}>
            <Ionicons name="analytics" size={22} color="#FF69B4" />
            <Text style={styles.patternTitle}>Cycle Patterns</Text>
          </View>
          <View style={styles.patternStatsRow}>
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>28</Text>
              <Text style={styles.patternStatLabel}>Avg Length</Text>
            </View>
            <View style={styles.patternDivider} />
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>5</Text>
              <Text style={styles.patternStatLabel}>Period Days</Text>
            </View>
            <View style={styles.patternDivider} />
            <View style={styles.patternStat}>
              <Text style={styles.patternStatValue}>14</Text>
              <Text style={styles.patternStatLabel}>Ovulation</Text>
            </View>
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

  insightsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  insightChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16 },
  insightChipText: { fontSize: 12, fontWeight: '800', color: '#2C3E50', marginLeft: 6 },

  calendarContainer: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 5, marginBottom: 20 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  calendarMonthText: { fontSize: 18, fontWeight: '900', color: '#2C3E50' },
  navBtn: { padding: 6, backgroundColor: '#F0F3F4', borderRadius: 12 },
  calendarWeekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  calendarWeekText: { fontSize: 13, color: '#A0A0A0', fontWeight: '800', width: 35, textAlign: 'center' },
  calendarDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'flex-start', alignItems: 'center', marginVertical: 4 },
  dayBubble: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  calendarDayNum: { fontSize: 16, fontWeight: '600', color: '#333' },
  symptomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFB6C1', marginTop: 3 },

  dayDetailCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 4, marginBottom: 20 },
  dayDetailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dayDetailDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  dayDetailPhase: { fontSize: 18, fontWeight: '900', color: '#2C3E50', flex: 1 },
  dayDetailDate: { fontSize: 14, color: '#A0A0A0', fontWeight: '600' },
  dayDetailTip: { fontSize: 15, color: '#555', lineHeight: 22, fontWeight: '500' },

  legendContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  legendTitle: { fontSize: 14, fontWeight: '800', color: '#2C3E50', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  legendRow: { flexDirection: 'row', alignItems: 'center', width: '50%', marginVertical: 8 },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  legendText: { fontSize: 14, color: '#2C3E50', fontWeight: '600' },

  patternCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 4, marginBottom: 20 },
  patternHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  patternTitle: { fontSize: 18, fontWeight: '800', color: '#2C3E50', marginLeft: 10 },
  patternStatsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  patternStat: { alignItems: 'center' },
  patternStatValue: { fontSize: 28, fontWeight: '900', color: '#FF69B4' },
  patternStatLabel: { fontSize: 12, color: '#7F8C8D', fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  patternDivider: { width: 1, height: 40, backgroundColor: '#F0F3F4' },
});
