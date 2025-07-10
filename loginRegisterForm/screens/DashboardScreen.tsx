import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import auth from '@/services/firebaseAuth';
import { signOut } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }: any) {

  function handleLogout() {
    signOut(auth)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Logout Successful',
          text2: 'You have been logged out successfully.',
        }); 
        navigation.navigate('login');
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Logout Failed',
          text2: 'An error occurred while logging out. Please try again.',
        });
        console.error("Logout error:", error);
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.themedViewContainer}>
        <View style={styles.headerContainer}>
          <Ionicons name="rocket" size={48} color="#6366f1" style={styles.headerIcon} />
          <Text style={styles.headerText}>Welcome Back!</Text>
          <Text style={styles.subHeaderText}>You're now logged in to your dashboard</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={32} color="#6366f1" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Forms Created</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#6366f1" />
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Responses</Text>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="add" size={24} color="#6366f1" />
              </View>
              <Text style={styles.actionButtonText}>New Form</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="analytics" size={24} color="#6366f1" />
              </View>
              <Text style={styles.actionButtonText}>Analytics</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="settings" size={24} color="#6366f1" />
              </View>
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name="help-circle" size={24} color="#6366f1" />
              </View>
              <Text style={styles.actionButtonText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-done" size={20} color="#10b981" />
            <Text style={styles.activityText}>Form "Customer Feedback" published</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Ionicons name="mail-open" size={20} color="#3b82f6" />
            <Text style={styles.activityText}>New response received</Text>
            <Text style={styles.activityTime}>Yesterday</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  themedViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginVertical: 8,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonIcon: {
    backgroundColor: '#e0e7ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Inter_600SemiBold',
  },
  recentActivityContainer: {
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter_600SemiBold',
  },
});