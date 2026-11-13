import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useDashboardTabBarInset } from '@/components/screenLayout/dashboardLayout';
import { useFocusEffect } from '@react-navigation/native';
import LogoPng from '@assets/icons/logo.png';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { fetchGoalsApi, saveGoalsApi, completeGoalApi, type UserGoal } from '@/api/goals/goalsEndpoints';
import { styles } from './SmartGoalsScreen.styles';

type Slot = { id: number | null; goal: string };
const emptySlot = (): Slot => ({ id: null, goal: '' });
const padSlots = (goals: UserGoal[]): Slot[] => [...goals.slice(0, 4).map(g => ({ id: g.id, goal: g.goal })), ...Array.from({ length: Math.max(0, 4 - goals.length) }, emptySlot)];

export function SmartGoalsScreen({ navigation }: { navigation: any }) {
  const tabBarInset = useDashboardTabBarInset();
  const [slots, setSlots] = useState<Slot[]>(Array.from({ length: 4 }, emptySlot));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setSlots(padSlots((await fetchGoalsApi()).goals)); setDirty(false); }
    catch (error) { showApiErrorAlert(error, 'Failed to load SMART Goals'); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event: any) => {
      if (!dirty) return;
      event.preventDefault();
      Alert.alert('Unsaved SMART Goals', 'Discard your changes?', [
        { text: 'Stay', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(event.data.action) },
      ]);
    });
    return unsubscribe;
  }, [dirty, navigation]);

  const edit = (index: number, value: string) => {
    setSlots(previous => previous.map((s, i) => i === index ? { ...s, goal: value } : s));
    setDirty(true);
  };

  const save = async () => {
    if (slots.some(s => s.goal.trim().length > 255)) {
      Alert.alert('Goal too long', 'Each goal must be 255 characters or fewer.'); return;
    }
    setBusy(true);
    try {
      const result = await saveGoalsApi(slots.filter(s => s.goal.trim()).map(s => ({ id: s.id, goal: s.goal.trim() })));
      setSlots(padSlots(result.goals)); setDirty(false);
      Alert.alert('Saved', 'Your SMART Goals have been saved.');
    } catch (error) { showApiErrorAlert(error, 'Failed to save SMART Goals'); }
    finally { setBusy(false); }
  };

  const complete = (slot: Slot) => {
    if (!slot.id || busy) return;
    if (dirty) { Alert.alert('Unsaved changes', 'Save your SMART Goals before completing a goal.'); return; }
    Alert.alert('Complete goal?', 'Mark this goal as achieved?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: async () => {
        setBusy(true);
        try {
          await completeGoalApi(slot.id!);
          const result = await fetchGoalsApi();
          setSlots(padSlots(result.goals)); setDirty(false);
          Alert.alert('Congratulations', 'Congrats on completing that goal');
        } catch (error) { showApiErrorAlert(error, 'Failed to complete goal'); }
        finally { setBusy(false); }
      } },
    ]);
  };

  return (
    <DashboardScreenLayout header={<View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
      <View style={screenHeaderStyles.headerSide}>
        <ScreenHeaderBackButton onPress={() => navigation.goBack()} />
        <Image source={LogoPng} style={screenHeaderStyles.headerLogo} resizeMode="contain" />
      </View>
      <Text style={screenHeaderStyles.headerTitle}>SMART Goals</Text>
      <Text style={screenHeaderStyles.headerRight} />
    </View>}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(tabBarInset, 80) + 24 }]} >
        <Text style={styles.intro}>Set up to four goals and tap the smiley face when you achieve one.</Text>
        {loading ? <ActivityIndicator /> : slots.map((slot, index) => (
          <View key={slot.id ? `goal-${slot.id}` : `empty-${index}`} style={styles.card}>
            <View style={styles.cardHeading}>
              <Text style={styles.label}>Goal {index + 1}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`Complete goal ${index + 1}`}
                disabled={!slot.id || busy} onPress={() => complete(slot)}
                style={[styles.smileButton, (!slot.id || busy) && styles.disabled]}>
                <Text style={styles.smile}>☺</Text>
              </Pressable>
            </View>
            <TextInput style={styles.input} value={slot.goal} onChangeText={value => edit(index, value)}
              placeholder="Enter your SMART goal" placeholderTextColor="#8993A6" multiline maxLength={255}
              editable={!busy} accessibilityLabel={`Goal ${index + 1} description`} />
          </View>
        ))}
        <Pressable accessibilityRole="button" disabled={loading || busy} onPress={save} style={[styles.saveButton, (loading || busy) && styles.disabled]}>
          <Text style={styles.saveText}>{busy ? 'Please wait...' : 'Save SMART Goals'}</Text>
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
    </DashboardScreenLayout>
  );
}
