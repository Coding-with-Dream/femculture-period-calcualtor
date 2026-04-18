import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, TouchableWithoutFeedback, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/AppBar';

const BounceButton = ({ onPress, style, children }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => { Animated.spring(scaleValue, { toValue: 0.94, useNativeDriver: true, speed: 24, bounciness: 12 }).start(); };
    const handlePressOut = () => { Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 12 }).start(); };
    return (
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
            <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>{children}</Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default function ProfileScreen() {
    const [isHistoryVisible, setHistoryVisible] = useState(false);
    const [notificationsOn, setNotificationsOn] = useState(true);
    const [darkModeOn, setDarkModeOn] = useState(false);

    const mockHistory = [
        { id: '1', month: 'March', start: 'Mar 10', end: 'Mar 14', length: '28 Days', bleed: '4 Days', symptoms: 'Cramps, Fatigue' },
        { id: '2', month: 'February', start: 'Feb 11', end: 'Feb 15', length: '29 Days', bleed: '4 Days', symptoms: 'Headaches' },
        { id: '3', month: 'January', start: 'Jan 13', end: 'Jan 18', length: '29 Days', bleed: '5 Days', symptoms: 'Bloating' },
        { id: '4', month: 'December', start: 'Dec 15', end: 'Dec 20', length: '28 Days', bleed: '5 Days', symptoms: 'Acne' },
        { id: '5', month: 'November', start: 'Nov 17', end: 'Nov 22', length: '30 Days', bleed: '5 Days', symptoms: 'Cramps' },
    ];

    const settingsItems = [
        { icon: 'notifications', label: 'Period Reminders', desc: 'Get notified before your period', hasToggle: true, toggleValue: notificationsOn, onToggle: setNotificationsOn },
        { icon: 'moon', label: 'Dark Mode', desc: 'Coming soon', hasToggle: true, toggleValue: darkModeOn, onToggle: setDarkModeOn },
        { icon: 'lock-closed', label: 'Privacy & Security', desc: 'Manage your data', hasToggle: false },
        { icon: 'language', label: 'Language', desc: 'English', hasToggle: false },
        { icon: 'help-circle', label: 'Help & Support', desc: 'FAQ & contact us', hasToggle: false },
        { icon: 'information-circle', label: 'About Femculture', desc: 'Version 1.0.0', hasToggle: false },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <AppBar title="Profile" />
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
                    <Text style={styles.userName}>Juliya</Text>
                    <Text style={styles.userEmail}>juliya@femculture.com</Text>
                    <BounceButton style={styles.editProfileBtn}>
                        <Ionicons name="pencil" size={16} color="#FF69B4" />
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </BounceButton>
                </View>

                {/* Stats Row */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>28</Text>
                        <Text style={styles.statLabel}>Avg Cycle</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statLabel}>Avg Period</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Cycles Logged</Text>
                    </View>
                </View>

                {/* Quick Links */}
                <View style={styles.quickLinksRow}>
                    <BounceButton style={styles.quickLink} onPress={() => setHistoryVisible(true)}>
                        <View style={[styles.quickLinkIcon, { backgroundColor: '#FFF0F5' }]}>
                            <Ionicons name="calendar" size={22} color="#FF69B4" />
                        </View>
                        <Text style={styles.quickLinkText}>Cycle History</Text>
                    </BounceButton>
                    <BounceButton style={styles.quickLink}>
                        <View style={[styles.quickLinkIcon, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="document-text" size={22} color="#2196F3" />
                        </View>
                        <Text style={styles.quickLinkText}>Export PDF</Text>
                    </BounceButton>
                    <BounceButton style={styles.quickLink}>
                        <View style={[styles.quickLinkIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="people" size={22} color="#4CAF50" />
                        </View>
                        <Text style={styles.quickLinkText}>Partner Sync</Text>
                    </BounceButton>
                </View>

                {/* Settings */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.settingsCard}>
                    {settingsItems.map((item, index) => (
                        <View key={item.label}>
                            <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
                                <View style={styles.settingsLeft}>
                                    <View style={styles.settingsIconBox}>
                                        <Ionicons name={item.icon as any} size={20} color="#FF69B4" />
                                    </View>
                                    <View>
                                        <Text style={styles.settingsLabel}>{item.label}</Text>
                                        <Text style={styles.settingsDesc}>{item.desc}</Text>
                                    </View>
                                </View>
                                {item.hasToggle ? (
                                    <Switch
                                        value={item.toggleValue}
                                        onValueChange={item.onToggle}
                                        trackColor={{ false: '#E0E0E0', true: '#FF69B480' }}
                                        thumbColor={item.toggleValue ? '#FF69B4' : '#B0B0B0'}
                                    />
                                ) : (
                                    <Ionicons name="chevron-forward" size={20} color="#DCDCDC" />
                                )}
                            </TouchableOpacity>
                            {index < settingsItems.length - 1 && <View style={styles.settingsDivider} />}
                        </View>
                    ))}
                </View>

                {/* Logout */}
                <BounceButton style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </BounceButton>

                <Text style={styles.madeWith}>Made with 💗 by Femculture</Text>

            </ScrollView>

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
    container: { flex: 1, backgroundColor: '#FAFAFB' },
    scrollArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 130 },

    profileHeader: { alignItems: 'center', paddingVertical: 30 },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#FF69B420', marginBottom: 16, borderWidth: 3, borderColor: '#FF69B430' },
    userName: { fontSize: 26, fontWeight: '900', color: '#2C3E50', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#7F8C8D', fontWeight: '500', marginBottom: 16 },
    editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
    editProfileText: { fontSize: 14, fontWeight: '700', color: '#FF69B4', marginLeft: 6 },

    statsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 22, justifyContent: 'space-around', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 4, marginBottom: 25 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 28, fontWeight: '900', color: '#FF69B4' },
    statLabel: { fontSize: 12, color: '#7F8C8D', fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
    statDivider: { width: 1, height: 40, backgroundColor: '#F0F3F4' },

    quickLinksRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    quickLink: { alignItems: 'center', flex: 1 },
    quickLinkIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickLinkText: { fontSize: 12, fontWeight: '700', color: '#2C3E50', textAlign: 'center' },

    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2C3E50', marginBottom: 15 },

    settingsCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 4, marginBottom: 25 },
    settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 14 },
    settingsLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    settingsIconBox: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    settingsLabel: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 2 },
    settingsDesc: { fontSize: 13, color: '#A0A0A0', fontWeight: '500' },
    settingsDivider: { height: 1, backgroundColor: '#F0F3F4', marginHorizontal: 14 },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 16, borderWidth: 1.5, borderColor: '#FF3B3020', marginBottom: 20 },
    logoutText: { fontSize: 16, fontWeight: '700', color: '#FF3B30', marginLeft: 8 },

    madeWith: { textAlign: 'center', color: '#A0A0A0', fontSize: 13, fontWeight: '600', marginBottom: 20 },

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
    exportDataText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
