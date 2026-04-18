import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/AppBar';

export default function ProfileScreen() {
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
            <AppBar title="Profile" />
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.profileHeader}>
                    <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatarLarge} />
                    <Text style={styles.userName}>Juliya</Text>
                    <Text style={styles.userEmail}>juliya@femculture.app</Text>

                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionMenu}>
                    <Text style={styles.menuTitle}>Settings</Text>

                    <TouchableOpacity style={styles.menuRow}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#FF69B415' }]}>
                            <Ionicons name="notifications" size={22} color="#FF69B4" />
                        </View>
                        <Text style={styles.menuText}>Notifications & Reminders</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                    </TouchableOpacity>
                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuRow} onPress={() => setHistoryVisible(true)}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="calendar" size={22} color="#2196F3" />
                        </View>
                        <Text style={styles.menuText}>Cycle History & Data</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                    </TouchableOpacity>
                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuRow}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="link" size={22} color="#4CAF50" />
                        </View>
                        <Text style={styles.menuText}>Partner Sync Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionMenu}>
                    <Text style={styles.menuTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuRow}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#F0F3F4' }]}>
                            <Ionicons name="help-circle" size={22} color="#7F8C8D" />
                        </View>
                        <Text style={styles.menuText}>Help Center</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Cycle History Modal Full Screen Overlay */}
            <Modal visible={isHistoryVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setHistoryVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setHistoryVisible(false)} style={styles.modalCloseBtn}>
                            <Ionicons name="arrow-back" size={26} color="#2C3E50" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Cycle History</Text>
                        <View style={{ width: 26 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.historyScroll}>
                        {mockHistory.map((item, index) => (
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
    container: { flex: 1, backgroundColor: '#FAFAFB' },
    scrollArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 130 },
    profileHeader: { alignItems: 'center', marginBottom: 30, backgroundColor: '#FFF', paddingVertical: 35, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.03, shadowRadius: 15, elevation: 4 },
    avatarLarge: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 4, borderColor: '#FFF0F5' },
    userName: { fontSize: 24, fontWeight: '900', color: '#2C3E50', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#7F8C8D', fontWeight: '500', marginBottom: 20 },
    editBtn: { backgroundColor: '#FF69B4', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    editBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
    sectionMenu: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, marginBottom: 25 },
    menuTitle: { fontSize: 15, fontWeight: '800', color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
    menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    menuIconBox: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    divider: { height: 1, backgroundColor: '#F0F3F4', marginLeft: 60, marginVertical: 4 },

    // History UI
    modalContainer: { flex: 1, backgroundColor: '#FAFAFB' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F3F4' },
    modalCloseBtn: { padding: 4 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#2C3E50' },
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
