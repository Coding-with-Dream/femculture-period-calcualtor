import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableWithoutFeedback, Modal, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/AppBar';

const { width } = Dimensions.get('window');

const BounceButton = ({ onPress, style, children }: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => { Animated.spring(scaleValue, { toValue: 0.94, useNativeDriver: true, speed: 24, bounciness: 12 }).start(); };
  const handlePressOut = () => { Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 12 }).start(); };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function HomeScreen() {
  const [weekDays, setWeekDays] = useState<any[]>([]);
  const [activeDateObj, setActiveDateObj] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    const week = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayString = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
      week.push({ dateObj: d, day: dayString, date: d.getDate() });
    }
    setWeekDays(week);
  }, []);

  const [isLogModalVisible, setLogModalVisible] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  const [isSetupVisible, setSetupVisible] = useState(false);

  const initStart = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const initEnd = new Date().toISOString().split('T')[0];

  const [startDateStr, setStartDateStr] = useState(initStart);
  const [endDateStr, setEndDateStr] = useState(initEnd);
  const [cycleLengthInput, setCycleLengthInput] = useState("28");

  const [lastPeriodDate, setLastPeriodDate] = useState<Date>(new Date(initStart));
  const [periodEndDate, setPeriodEndDate] = useState<Date>(new Date(initEnd));
  const [cycleLength, setCycleLength] = useState(28);

  const saveCycleData = () => {
    setLastPeriodDate(new Date(startDateStr));
    setPeriodEndDate(new Date(endDateStr));
    setCycleLength(parseInt(cycleLengthInput || "28"));
    setSetupVisible(false);
  };

  const calculatePhase = (targetDate: Date) => {
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const lastP = new Date(lastPeriodDate.getFullYear(), lastPeriodDate.getMonth(), lastPeriodDate.getDate());
    const endP = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth(), periodEndDate.getDate());

    const diffTime = target.getTime() - lastP.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let cycleDay = (diffDays % cycleLength) + 1;
    if (cycleDay <= 0) {
      cycleDay = cycleLength + cycleDay;
    }

    const bloodDurationDays = Math.max(1, Math.floor((endP.getTime() - lastP.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const fertileStart = cycleLength - 17;
    const fertileEnd = cycleLength - 13;

    let phase = "Luteal Phase";
    let desc = "PMS Symptoms may occur. Low Chance of Pregnancy.";
    let risk = { text: 'Safe Day / Low Chance', color: '#2E8B57', bg: '#E8F5E9', icon: 'shield-checkmark' };

    if (cycleDay >= 1 && cycleDay <= bloodDurationDays) {
      phase = "Menstrual Phase";
      desc = "Active Period: Expect Bleeding & Cramps";
      risk = { text: 'Safe Day / Period Active', color: '#B0BEC5', bg: '#F4F6F7', icon: 'water' };
    } else if (cycleDay > bloodDurationDays && cycleDay < fertileStart) {
      phase = "Follicular Phase";
      desc = "Energy is rising! Low Chance of Pregnancy.";
    } else if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
      phase = "Ovulation Phase";
      desc = "Peak Fertility & Energy";
      risk = { text: 'Fertile Window / High Chance', color: '#FF69B4', bg: '#FFF0F5', icon: 'flame' };
    }

    return { cycleDay, phase, desc, risk };
  };

  const currentStats = calculatePhase(activeDateObj);

  const [pickerModalMode, setPickerModalMode] = useState<"start" | "end" | null>(null);
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(new Date());

  const openCalendarFor = (target: "start" | "end") => {
    setCalendarViewDate(new Date(target === "start" ? startDateStr : endDateStr));
    setPickerModalMode(target);
  };

  const selectCalendarDate = (day: number) => {
    const d = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), day);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const dateStr = d.toISOString().split('T')[0];

    if (pickerModalMode === 'start') setStartDateStr(dateStr);
    if (pickerModalMode === 'end') setEndDateStr(dateStr);
    setPickerModalMode(null);
  };

  const renderCustomCalendar = () => {
    const month = calendarViewDate.getMonth();
    const year = calendarViewDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const selectedDateMatch = pickerModalMode === 'start' ? startDateStr : endDateStr;

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => setCalendarViewDate(new Date(year, month - 1, 1))}>
            <Ionicons name="chevron-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.calendarMonthText}>{monthNames[month]} {year}</Text>
          <TouchableOpacity onPress={() => setCalendarViewDate(new Date(year, month + 1, 1))}>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarWeekRow}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <Text key={d} style={styles.calendarWeekText}>{d}</Text>)}
        </View>

        <View style={styles.calendarDaysGrid}>
          {blanks.map(b => <View key={`blank-${b}`} style={styles.calendarDayCell} />)}
          {days.map(d => {
            const compD = new Date(year, month, d);
            compD.setMinutes(compD.getMinutes() - compD.getTimezoneOffset());
            const compStr = compD.toISOString().split('T')[0];
            const isSelected = selectedDateMatch === compStr;

            return (
              <TouchableOpacity key={d} style={[styles.calendarDayCell, isSelected && styles.calendarDayCellActive]} onPress={() => selectCalendarDate(d)}>
                <Text style={[styles.calendarDayNum, isSelected && styles.calendarDayNumActive]}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const mockHistory = [
    { id: '1', month: 'March', start: 'Mar 10', end: 'Mar 14', length: '28 Days', bleed: '4 Days', symptoms: 'Cramps, Fatigue' },
    { id: '2', month: 'February', start: 'Feb 11', end: 'Feb 15', length: '29 Days', bleed: '4 Days', symptoms: 'Headaches' },
    { id: '3', month: 'January', start: 'Jan 13', end: 'Jan 18', length: '29 Days', bleed: '5 Days', symptoms: 'Bloating' },
    { id: '4', month: 'December', start: 'Dec 15', end: 'Dec 20', length: '28 Days', bleed: '5 Days', symptoms: 'Acne' },
    { id: '5', month: 'November', start: 'Nov 17', end: 'Nov 22', length: '30 Days', bleed: '5 Days', symptoms: 'Cramps' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <AppBar title="Home" />
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.calendarStrip}>
          {weekDays.map((item, index) => {
            const isActive = item.dateObj.toDateString() === activeDateObj.toDateString();
            return (
              <BounceButton
                key={index}
                style={[styles.dateItem, isActive && styles.activeDateItem]}
                onPress={() => setActiveDateObj(item.dateObj)}
              >
                <Text style={[styles.dayText, isActive && styles.activeDayText]}>{item.day}</Text>
                <Text style={[styles.dateNumText, isActive && styles.activeDateNumText]}>{item.date}</Text>
              </BounceButton>
            );
          })}
        </View>

        <BounceButton style={styles.cycleCard} onPress={() => setSetupVisible(true)}>
          {currentStats.phase === 'Menstrual Phase' && (
            <Image source={require('../../assets/menstruation.png')} style={styles.phaseArtwork} resizeMode="cover" />
          )}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cyclePhaseTitle}>{currentStats.phase}</Text>
            <Ionicons name="options-outline" size={20} color="#B0B0B0" />
          </View>

          <View style={styles.cycleInfoRow}>
            <View style={styles.cycleInfoLeft}>
              <Text style={styles.dayBigText}>Day {currentStats.cycleDay}</Text>
              <Text style={styles.cycleDescText}>{currentStats.desc}</Text>

              <View style={[styles.safeDayBadge, { backgroundColor: currentStats.risk.bg }]}>
                <Ionicons name={currentStats.risk.icon as any} size={14} color={currentStats.risk.color} />
                <Text style={[styles.safeDayText, { color: currentStats.risk.color }]}>{currentStats.risk.text}</Text>
              </View>
            </View>

            <BounceButton
              style={[styles.logButton, isLoggedToday && { backgroundColor: '#4CAF50', shadowColor: '#4CAF50' }]}
              onPress={() => setLogModalVisible(true)}
            >
              <Ionicons name={isLoggedToday ? "checkmark-circle" : "water"} size={24} color="#FFF" />
              <Text style={styles.logButtonText}>{isLoggedToday ? "Done" : "Log"}</Text>
            </BounceButton>
          </View>
        </BounceButton>

        {/* --- MOVED BEAUTIFUL CARD --- */}
        <Text style={styles.sectionTitle}>Previous Cycle</Text>
        <BounceButton style={styles.premiumHistoryCard} onPress={() => setHistoryVisible(true)}>
          <View style={styles.premiumHistoryRow}>
            <View>
              <Text style={styles.premiumHistoryMonth}>{mockHistory[0].month} Cycle</Text>
              <Text style={styles.premiumHistoryDates}>{mockHistory[0].start} - {mockHistory[0].end}</Text>
            </View>
            <View style={styles.premiumHistoryBadge}>
              <Text style={styles.premiumHistoryDays}>Length: {mockHistory[0].length}</Text>
            </View>
          </View>
          <View style={styles.premiumHistoryFooter}>
            <Ionicons name="sparkles" size={16} color="#FF69B4" />
            <Text style={styles.premiumHistoryFooterText}>Explore your exact dates & logs</Text>
            <Ionicons name="arrow-forward" size={16} color="#E3F2FD" style={{ marginLeft: 'auto' }} />
          </View>
        </BounceButton>

        <BounceButton style={styles.affirmationCard}>
          <Ionicons name="sparkles" size={24} color="#0D47A1" style={styles.quoteIcon} />
          <Text style={styles.affirmationTitle}>Affirmation of the Day</Text>
          <Text style={styles.affirmationBody}>"My body is incredible, and I trust perfectly in its natural timing."</Text>
          <BounceButton style={styles.shareButton}>
            <Ionicons name="share-outline" size={18} color="#0D47A1" />
            <Text style={styles.shareText}>Share</Text>
          </BounceButton>
        </BounceButton>

        <Text style={styles.sectionTitle}>Your Body on Day {currentStats.cycleDay}</Text>

        <View style={styles.lifestyleCard}>
          <BounceButton style={styles.lifestyleRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FF69B415' }]}>
              <Ionicons name="nutrition" size={24} color="#FF69B4" />
            </View>
            <View style={styles.lifestyleTextContainer}>
              <Text style={styles.lifestyleHeading}>Nutrition</Text>
              <Text style={styles.lifestyleSubtext}>
                {currentStats.phase === 'Menstrual Phase' ? 'Craving iron? Spinach and dark chocolate!' : 'Focus on protein and healthy fats today.'}
              </Text>
            </View>
          </BounceButton>

          <View style={styles.divider} />

          <BounceButton style={styles.lifestyleRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="barbell" size={24} color="#2196F3" />
            </View>
            <View style={styles.lifestyleTextContainer}>
              <Text style={styles.lifestyleHeading}>Fitness</Text>
              <Text style={styles.lifestyleSubtext}>
                {currentStats.phase === 'Ovulation Phase' ? 'High energy! Great day for cardio or HIIT.' : 'Gentle movement. Consider light yoga or walking.'}
              </Text>
            </View>
          </BounceButton>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <BounceButton style={styles.actionSquare} onPress={() => setLogModalVisible(true)}>
            <Ionicons name="pulse" size={28} color="#FF69B4" />
            <Text style={styles.actionText}>Symptoms</Text>
          </BounceButton>
          <BounceButton style={styles.actionSquare} onPress={() => setHistoryVisible(true)}>
            <Ionicons name="calendar-sharp" size={28} color="#2196F3" />
            <Text style={styles.actionText}>Cycle History</Text>
          </BounceButton>
          <BounceButton style={styles.actionSquare}>
            <Ionicons name="chatbubbles" size={28} color="#4CAF50" />
            <Text style={styles.actionText}>Community</Text>
          </BounceButton>
          <BounceButton style={styles.actionSquare}>
            <Ionicons name="heart-half" size={28} color="#9C27B0" />
            <Text style={styles.actionText}>Partner App</Text>
          </BounceButton>
        </View>

      </ScrollView>

      <Modal visible={isSetupVisible} animationType="fade" transparent={true} onRequestClose={() => { setSetupVisible(false); setPickerModalMode(null); }}>
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <View style={[styles.modalContent, { borderRadius: 30, paddingBottom: 40 }]}>

            {pickerModalMode !== null ? (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select {pickerModalMode === 'start' ? 'Start' : 'End'} Date</Text>
                  <TouchableOpacity onPress={() => setPickerModalMode(null)}>
                    <Ionicons name="close-circle" size={28} color="#DCDCDC" />
                  </TouchableOpacity>
                </View>
                {renderCustomCalendar()}
                <BounceButton style={[styles.saveLogBtn, { marginTop: 10, backgroundColor: '#F0F3F4' }]} onPress={() => setPickerModalMode(null)}>
                  <Text style={[styles.saveLogBtnText, { color: '#2C3E50' }]}>Back</Text>
                </BounceButton>
              </View>
            ) : (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set Period Dates</Text>
                  <TouchableOpacity onPress={() => setSetupVisible(false)}>
                    <Ionicons name="close-circle" size={28} color="#DCDCDC" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Period Start Date:</Text>
                <BounceButton style={styles.fakeInputRow} onPress={() => openCalendarFor('start')}>
                  <Text style={styles.fakeInputText}>{startDateStr}</Text>
                  <Ionicons name="calendar" size={22} color="#FF69B4" />
                </BounceButton>

                <Text style={styles.inputLabel}>Period End Date:</Text>
                <BounceButton style={styles.fakeInputRow} onPress={() => openCalendarFor('end')}>
                  <Text style={styles.fakeInputText}>{endDateStr}</Text>
                  <Ionicons name="calendar-outline" size={22} color="#FF69B4" />
                </BounceButton>

                <Text style={styles.inputLabel}>Average cycle length (days):</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  value={cycleLengthInput}
                  onChangeText={setCycleLengthInput}
                />

                <BounceButton style={[styles.saveLogBtn, { marginTop: 25 }]} onPress={saveCycleData}>
                  <Text style={styles.saveLogBtnText}>Save Settings</Text>
                </BounceButton>
              </View>
            )}

          </View>
        </View>
      </Modal>

      <Modal visible={isLogModalVisible} animationType="slide" transparent={true} onRequestClose={() => setLogModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log for Day {currentStats.cycleDay}</Text>
              <TouchableOpacity onPress={() => setLogModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#DCDCDC" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionTitle}>Symptoms</Text>
            <View style={styles.pillContainer}>
              {['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Tender Breasts'].map(sym => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <TouchableOpacity
                    key={sym}
                    style={[styles.symptomPill, isSelected && styles.symptomPillActive]}
                    onPress={() => {
                      if (isSelected) setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
                      else setSelectedSymptoms([...selectedSymptoms, sym]);
                    }}
                  >
                    <Text style={[styles.symptomPillText, isSelected && styles.symptomPillTextActive]}>{sym}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <BounceButton style={styles.saveLogBtn} onPress={() => { setLogModalVisible(false); setIsLoggedToday(true); }}>
              <Text style={styles.saveLogBtnText}>Save Log</Text>
            </BounceButton>
          </View>
        </View>
      </Modal>

      {/* Cycle History Modal */}
      <Modal visible={isHistoryVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setHistoryVisible(false)}>
        <View style={styles.historyModalContainer}>
          <View style={styles.historyModalHeader}>
            <TouchableOpacity onPress={() => setHistoryVisible(false)} style={styles.modalCloseBtn}>
              <Ionicons name="arrow-back" size={26} color="#2C3E50" />
            </TouchableOpacity>
            <Text style={styles.historyModalTitle}>Cycle History</Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView contentContainerStyle={styles.historyScroll}>
            {mockHistory.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyMonth}>{item.month}</Text>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyBadgeText}>{item.length}</Text>
                  </View>
                </View>

                <View style={styles.historyDataRow}>
                  <View style={styles.historyDataCol}>
                    <Text style={styles.historyDataLabel}>Dates</Text>
                    <Text style={styles.historyDataValue}>{item.start} - {item.end}</Text>
                  </View>
                  <View style={styles.historyDataCol}>
                    <Text style={styles.historyDataLabel}>Bleeding</Text>
                    <Text style={styles.historyDataValue}>{item.bleed}</Text>
                  </View>
                </View>

                <View style={styles.historyFooter}>
                  <Ionicons name="pulse" size={16} color="#FF69B4" />
                  <Text style={styles.historySymptoms}>Symptoms: {item.symptoms}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.exportDataBtn}>
              <Ionicons name="document-text" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.exportDataText}>Export PDF for Doctor</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB', },
  scrollArea: { flex: 1, },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 130, },
  calendarStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingVertical: 10, },
  dateItem: { alignItems: 'center', paddingVertical: 14, paddingHorizontal: 5, borderRadius: 20, width: 44, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, },
  activeDateItem: { backgroundColor: '#FF69B4', shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8, },
  dayText: { fontSize: 13, color: '#888', marginBottom: 6, fontWeight: '600', },
  activeDayText: { color: '#FFF', },
  dateNumText: { fontSize: 16, color: '#2C3E50', fontWeight: '800', },
  activeDateNumText: { color: '#FFF', },
  cycleCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 10, marginBottom: 20, },
  phaseArtwork: { width: '100%', height: 160, borderRadius: 20, marginBottom: 20, overflow: 'hidden' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, },
  cyclePhaseTitle: { fontSize: 14, color: '#FF69B4', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, },
  cycleInfoRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', },
  cycleInfoLeft: { flex: 1, },
  dayBigText: { fontSize: 34, fontWeight: '900', color: '#2C3E50', letterSpacing: -1, },
  cycleDescText: { fontSize: 14, color: '#7F8C8D', marginTop: 6, fontWeight: '500', },
  logButton: { backgroundColor: '#FF69B4', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 20, shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8, },
  logButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 6, },
  safeDayBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginTop: 12, alignSelf: 'flex-start', },
  safeDayText: { fontSize: 12, fontWeight: '800', marginLeft: 6, },

  premiumHistoryCard: { backgroundColor: '#1A1A2E', borderRadius: 28, padding: 24, shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12, marginBottom: 25 },
  premiumHistoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  premiumHistoryMonth: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: 0.5 },
  premiumHistoryDates: { fontSize: 14, color: '#A0A0A0', fontWeight: '600' },
  premiumHistoryBadge: { backgroundColor: '#FF69B420', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#FF69B450' },
  premiumHistoryDays: { color: '#FF69B4', fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
  premiumHistoryFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
  premiumHistoryFooterText: { fontSize: 14, color: '#DCDCDC', fontWeight: '600', marginLeft: 10 },

  affirmationCard: { backgroundColor: '#E3F2FD', borderRadius: 24, padding: 24, marginBottom: 25, position: 'relative', },
  quoteIcon: { position: 'absolute', top: 20, right: 20, opacity: 0.15, },
  affirmationTitle: { color: '#1565C0', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, },
  affirmationBody: { color: '#0D47A1', fontSize: 18, fontWeight: '600', lineHeight: 28, },
  shareButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, marginTop: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, },
  shareText: { color: '#0D47A1', fontWeight: '700', marginLeft: 6, fontSize: 13, },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2C3E50', marginBottom: 15, marginTop: 5, },
  lifestyleCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 8, marginBottom: 25, },
  lifestyleRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 15, },
  lifestyleTextContainer: { flex: 1, },
  lifestyleHeading: { fontSize: 15, fontWeight: '800', color: '#2C3E50', marginBottom: 4, },
  lifestyleSubtext: { fontSize: 13, color: '#7F8C8D', lineHeight: 18, },
  divider: { height: 1, backgroundColor: '#F0F3F4', marginVertical: 12, marginLeft: 63, },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
  actionSquare: { width: (width - 40 - 15) / 2, paddingVertical: 20, backgroundColor: '#FFFFFF', borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 5, marginBottom: 15 },
  actionText: { marginTop: 12, fontSize: 14, fontWeight: '700', color: '#2C3E50', },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 30, paddingTop: 30, paddingBottom: 50, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20, },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#2C3E50', },
  modalSectionTitle: { fontSize: 15, fontWeight: '800', color: '#2C3E50', marginBottom: 12, marginTop: 5, },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, },
  symptomPill: { backgroundColor: '#F0F3F4', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, marginRight: 10, marginBottom: 10, },
  symptomPillActive: { backgroundColor: '#FF69B4', },
  symptomPillText: { color: '#7F8C8D', fontWeight: '700', fontSize: 13, },
  symptomPillTextActive: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, },
  saveLogBtn: { backgroundColor: '#FF69B4', paddingVertical: 18, borderRadius: 25, alignItems: 'center', marginTop: 10, shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, },
  saveLogBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', },
  inputLabel: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginTop: 15, marginBottom: 8, },
  textInput: { backgroundColor: '#F0F3F4', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 18, fontWeight: '600', color: '#2C3E50', },
  fakeInputRow: { backgroundColor: '#F0F3F4', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fakeInputText: { fontSize: 18, fontWeight: '600', color: '#2C3E50', },
  calendarContainer: { marginVertical: 10, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#F0F3F4', padding: 15 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  calendarMonthText: { fontSize: 16, fontWeight: '800', color: '#2C3E50' },
  calendarWeekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  calendarWeekText: { fontSize: 13, color: '#888', fontWeight: 'bold', width: 35, textAlign: 'center' },
  calendarDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 2 },
  calendarDayCellActive: { backgroundColor: '#FF69B4', borderRadius: 20, shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  calendarDayNum: { fontSize: 15, fontWeight: '600', color: '#333' },
  calendarDayNumActive: { color: '#FFF', fontWeight: '800' },

  historyModalContainer: { flex: 1, backgroundColor: '#FAFAFB' },
  historyModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F3F4' },
  modalCloseBtn: { padding: 4 },
  historyModalTitle: { fontSize: 20, fontWeight: '800', color: '#2C3E50' },
  historyScroll: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 50 },
  historyCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 4 },
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyMonth: { fontSize: 20, fontWeight: '900', color: '#2C3E50' },
  historyBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  historyBadgeText: { color: '#2196F3', fontWeight: '800', fontSize: 13 },
  historyDataRow: { flexDirection: 'row', marginBottom: 15 },
  historyDataCol: { flex: 1 },
  historyDataLabel: { fontSize: 12, color: '#A0A0A0', fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  historyDataValue: { fontSize: 16, color: '#333', fontWeight: '800' },
  historyFooter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F5', padding: 12, borderRadius: 12 },
  historySymptoms: { fontSize: 13, color: '#FF69B4', fontWeight: '700', marginLeft: 8 },
  exportDataBtn: { flexDirection: 'row', backgroundColor: '#2C3E50', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 24, marginTop: 15 },
  exportDataText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
