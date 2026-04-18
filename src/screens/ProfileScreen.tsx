import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/AppBar';

export default function ProfileScreen() {
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

                    <TouchableOpacity style={styles.menuRow}>
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
    divider: { height: 1, backgroundColor: '#F0F3F4', marginLeft: 60, marginVertical: 4 }
});
