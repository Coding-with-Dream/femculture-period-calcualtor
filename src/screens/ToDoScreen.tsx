import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, TouchableWithoutFeedback, Modal } from 'react-native';
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

export default function ToDoScreen() {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Take daily vitamins / supplements', completed: false, category: 'Medical', color: '#FF69B4', icon: 'medical' },
        { id: 2, text: 'Drink 2L of water', completed: true, category: 'Self Care', color: '#2196F3', icon: 'water' },
        { id: 3, text: '15-min restorative yoga', completed: false, category: 'Fitness', color: '#4CAF50', icon: 'body' },
        { id: 4, text: 'Log today\'s symptoms', completed: false, category: 'Tracking', color: '#9C27B0', icon: 'pulse' },
        { id: 5, text: 'Apply heating pad for cramps', completed: false, category: 'Comfort', color: '#FF9800', icon: 'flame' },
        { id: 6, text: 'Eat iron-rich meal', completed: false, category: 'Nutrition', color: '#E91E63', icon: 'nutrition' },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Self Care');

    const categories = [
        { name: 'Medical', color: '#FF69B4', icon: 'medical' },
        { name: 'Self Care', color: '#2196F3', icon: 'heart' },
        { name: 'Fitness', color: '#4CAF50', icon: 'body' },
        { name: 'Tracking', color: '#9C27B0', icon: 'pulse' },
        { name: 'Nutrition', color: '#E91E63', icon: 'nutrition' },
    ];

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTask = () => {
        if (!newTaskText.trim()) return;
        const cat = categories.find(c => c.name === selectedCategory) || categories[1];
        setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), completed: false, category: cat.name, color: cat.color, icon: cat.icon }]);
        setNewTaskText('');
        setShowAddModal(false);
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    const pendingTasks = tasks.filter(t => !t.completed);
    const doneTasks = tasks.filter(t => t.completed);

    // Daily Tips
    const tips = [
        { icon: 'leaf', text: 'Magnesium-rich foods can ease cramps', bg: '#E8F5E9' },
        { icon: 'moon', text: 'Aim for 8 hours of sleep during your period', bg: '#E3F2FD' },
        { icon: 'cafe', text: 'Reduce caffeine to ease breast tenderness', bg: '#FFF3E0' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <AppBar title="To Do" />
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressTopRow}>
                        <View>
                            <Text style={styles.progressTitle}>Daily Habits</Text>
                            <Text style={styles.progressSub}>{completedCount} of {tasks.length} completed</Text>
                        </View>
                        <View style={styles.streakBadge}>
                            <Ionicons name="flame" size={18} color="#FF9800" />
                            <Text style={styles.streakText}>3 Day Streak</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarBG}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>
                    <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
                </View>

                {/* Daily Tip */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScroll} contentContainerStyle={{ gap: 12 }}>
                    {tips.map((tip, i) => (
                        <View key={i} style={[styles.tipCard, { backgroundColor: tip.bg }]}>
                            <Ionicons name={tip.icon as any} size={20} color="#2C3E50" />
                            <Text style={styles.tipText}>{tip.text}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Pending Tasks */}
                <Text style={styles.sectionTitle}>To Do ({pendingTasks.length})</Text>
                {pendingTasks.map(task => (
                    <BounceButton key={task.id} style={styles.taskCard} onPress={() => toggleTask(task.id)}>
                        <View style={[styles.taskIconBox, { backgroundColor: task.color + '15' }]}>
                            <Ionicons name={task.icon as any} size={20} color={task.color} />
                        </View>
                        <View style={styles.taskTextArea}>
                            <Text style={styles.taskText}>{task.text}</Text>
                            <Text style={[styles.categoryText, { color: task.color }]}>{task.category}</Text>
                        </View>
                        <View style={styles.checkbox}>
                            <View style={styles.checkboxInner} />
                        </View>
                    </BounceButton>
                ))}

                {/* Completed Tasks */}
                {doneTasks.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Completed ({doneTasks.length})</Text>
                        {doneTasks.map(task => (
                            <BounceButton key={task.id} style={[styles.taskCard, { opacity: 0.55 }]} onPress={() => toggleTask(task.id)}>
                                <View style={[styles.taskIconBox, { backgroundColor: task.color + '15' }]}>
                                    <Ionicons name={task.icon as any} size={20} color={task.color} />
                                </View>
                                <View style={styles.taskTextArea}>
                                    <Text style={[styles.taskText, { textDecorationLine: 'line-through', color: '#A0A0A0' }]}>{task.text}</Text>
                                    <Text style={[styles.categoryText, { color: task.color }]}>{task.category}</Text>
                                </View>
                                <View style={[styles.checkbox, { backgroundColor: task.color, borderColor: task.color }]}>
                                    <Ionicons name="checkmark" size={16} color="#FFF" />
                                </View>
                            </BounceButton>
                        ))}
                    </>
                )}

            </ScrollView>

            {/* Floating Add Button */}
            <BounceButton style={styles.fab} onPress={() => setShowAddModal(true)}>
                <Ionicons name="add" size={30} color="#FFF" />
            </BounceButton>

            {/* Add Task Modal */}
            <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Habit</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Ionicons name="close-circle" size={28} color="#DCDCDC" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>What would you like to track?</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="e.g. Take evening walk..."
                            placeholderTextColor="#B0B0B0"
                            value={newTaskText}
                            onChangeText={setNewTaskText}
                        />

                        <Text style={styles.inputLabel}>Category</Text>
                        <View style={styles.catRow}>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat.name}
                                    style={[styles.catChip, selectedCategory === cat.name && { backgroundColor: cat.color, borderColor: cat.color }]}
                                    onPress={() => setSelectedCategory(cat.name)}
                                >
                                    <Text style={[styles.catChipText, selectedCategory === cat.name && { color: '#FFF' }]}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <BounceButton style={styles.saveBtn} onPress={addTask}>
                            <Text style={styles.saveBtnText}>Add Habit</Text>
                        </BounceButton>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFB' },
    scrollArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 150 },

    progressCard: { backgroundColor: '#FF69B4', borderRadius: 28, padding: 24, shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8, marginBottom: 20 },
    progressTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    progressTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 6 },
    progressSub: { fontSize: 15, color: '#FFF0F5', fontWeight: '600' },
    streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
    streakText: { color: '#FFF', fontWeight: '800', fontSize: 13, marginLeft: 6 },
    progressBarBG: { height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5 },
    progressBarFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 5 },
    progressPercent: { color: '#FFF', fontSize: 13, fontWeight: '800', marginTop: 8, textAlign: 'right' },

    tipsScroll: { marginBottom: 25 },
    tipCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, width: 260 },
    tipText: { fontSize: 14, color: '#2C3E50', fontWeight: '600', marginLeft: 12, flex: 1 },

    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2C3E50', marginBottom: 15, paddingHorizontal: 5 },

    taskCard: { backgroundColor: '#FFF', borderRadius: 22, padding: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3 },
    taskIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    taskTextArea: { flex: 1 },
    taskText: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
    categoryText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    checkbox: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, borderColor: '#DCDCDC', justifyContent: 'center', alignItems: 'center' },
    checkboxInner: {},

    fab: { position: 'absolute', bottom: 110, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF69B4', justifyContent: 'center', alignItems: 'center', shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 10 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 30, paddingTop: 30, paddingBottom: 50 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#2C3E50' },
    inputLabel: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginTop: 10, marginBottom: 10 },
    textInput: { backgroundColor: '#F0F3F4', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, fontWeight: '600', color: '#2C3E50' },
    catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 25 },
    catChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: '#DCDCDC' },
    catChipText: { fontSize: 13, fontWeight: '700', color: '#555' },
    saveBtn: { backgroundColor: '#FF69B4', paddingVertical: 18, borderRadius: 25, alignItems: 'center', shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
    saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
