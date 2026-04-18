import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AppBar({ title }: { title: string }) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Calculate days until next period (mock: based on 28-day cycle)
  const daysUntilPeriod = 5;

  const notifications = [
    { id: 1, icon: 'water', color: '#FF69B4', title: 'Period Starting Soon', desc: `Your period is expected to start in ${daysUntilPeriod} days. Stock up on essentials!`, time: '2h ago', unread: true },
    { id: 2, icon: 'sparkles', color: '#FF9800', title: 'Ovulation Window', desc: 'Your fertile window begins in 10 days. Plan accordingly.', time: '1d ago', unread: true },
    { id: 3, icon: 'nutrition', color: '#4CAF50', title: 'Nutrition Tip', desc: 'Increase iron-rich foods during your luteal phase to prevent fatigue.', time: '2d ago', unread: false },
    { id: 4, icon: 'fitness', color: '#2196F3', title: 'Fitness Reminder', desc: 'Light yoga is recommended during menstruation. Try a 15-min session!', time: '3d ago', unread: false },
  ];

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
          <TouchableOpacity style={styles.bellContainer} onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Period Countdown Banner */}
        <View style={styles.countdownBanner}>
          <Ionicons name="water" size={16} color="#FF69B4" />
          <Text style={styles.countdownText}>
            Your period is expected in <Text style={styles.countdownBold}>{daysUntilPeriod} days</Text>
          </Text>
        </View>

        {/* Notifications Modal */}
        <Modal visible={showNotifications} animationType="slide" transparent onRequestClose={() => setShowNotifications(false)}>
          <View style={styles.notifOverlay}>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <Ionicons name="close-circle" size={28} color="#DCDCDC" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {notifications.map(n => (
                  <View key={n.id} style={[styles.notifCard, n.unread && styles.notifCardUnread]}>
                    <View style={[styles.notifIconBox, { backgroundColor: n.color + '15' }]}>
                      <Ionicons name={n.icon as any} size={22} color={n.color} />
                    </View>
                    <View style={styles.notifTextArea}>
                      <View style={styles.notifTitleRow}>
                        <Text style={styles.notifCardTitle}>{n.title}</Text>
                        {n.unread && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notifDesc}>{n.desc}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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

  // Period Countdown Banner
  countdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  countdownText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
    marginLeft: 10,
  },
  countdownBold: {
    fontWeight: '900',
    color: '#FF69B4',
  },

  // Notifications Modal
  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  notifContent: { backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 50, maxHeight: '75%' },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  notifTitle: { fontSize: 24, fontWeight: '900', color: '#2C3E50' },

  notifCard: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 10, borderRadius: 18, marginBottom: 8 },
  notifCardUnread: { backgroundColor: '#FFF0F508' },
  notifIconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  notifTextArea: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notifCardTitle: { fontSize: 16, fontWeight: '800', color: '#2C3E50', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF69B4', marginLeft: 8 },
  notifDesc: { fontSize: 14, color: '#555', lineHeight: 20, fontWeight: '500', marginBottom: 6 },
  notifTime: { fontSize: 12, color: '#B0B0B0', fontWeight: '600' },

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
