import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/AppBar';

export default function ToDoScreen() {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Take daily birth control pill', completed: false, category: 'Medical', color: '#FF69B4' },
        { id: 2, text: 'Drink 2L of water', completed: true, category: 'Self Care', color: '#2196F3' },
        { id: 3, text: '15-min restorative yoga', completed: false, category: 'Fitness', color: '#4CAF50' },
        { id: 4, text: 'Log today\'s symptoms', completed: false, category: 'Tracking', color: '#9C27B0' },
    ]);

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = (completedCount / tasks.length) * 100;

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <AppBar title="To Do" />
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.progressCard}>
                    <Text style={styles.progressTitle}>Daily Habits</Text>
                    <Text style={styles.progressSub}>{completedCount} of {tasks.length} completed today</Text>

                    <View style={styles.progressBarBG}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Tasks</Text>

                {tasks.map(task => (
                    <TouchableOpacity
                        key={task.id}
                        style={[styles.taskCard, task.completed && { opacity: 0.6 }]}
                        onPress={() => toggleTask(task.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.taskLeft}>
                            <View style={[styles.checkbox, task.completed && { backgroundColor: task.color, borderColor: task.color }]}>
                                {task.completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
                            </View>
                            <View>
                                <Text style={[styles.taskText, task.completed && { textDecorationLine: 'line-through', color: '#A0A0A0' }]}>{task.text}</Text>
                                <Text style={[styles.categoryText, { color: task.color }]}>{task.category}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFB' },
    scrollArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 130 },
    progressCard: { backgroundColor: '#FF69B4', borderRadius: 28, padding: 24, shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8, marginBottom: 30 },
    progressTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 6 },
    progressSub: { fontSize: 15, color: '#FFF0F5', fontWeight: '600', marginBottom: 20 },
    progressBarBG: { height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5 },
    progressBarFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 5 },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2C3E50', marginBottom: 15, paddingHorizontal: 5 },
    taskCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3 },
    taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: '#DCDCDC', marginRight: 15, justifyContent: 'center', alignItems: 'center' },
    taskText: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
    categoryText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }
});
