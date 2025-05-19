import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Platform, Modal, ActivityIndicator } from 'react-native';
import { getHealthcarePatients, removePatientFromHealthcare, getPatientStats } from '../services/userService';
import { Ionicons } from '@expo/vector-icons';

interface DoctorHomeScreenProps {
  user: any;
  onLogout: () => void;
  handleNavigate: (screen: string) => void;
}

export default function DoctorHomeScreen({ user, onLogout, handleNavigate }: DoctorHomeScreenProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [patientStats, setPatientStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patientEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const list = await getHealthcarePatients(user.id);
      setPatients(list);
      setFilteredPatients(list);
    } catch (err) {
      Alert.alert('Hata', 'Hasta listesi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientPress = async (patient: any) => {
    setSelectedPatient(patient);
    setPatientModalVisible(true);
    setStatsLoading(true);
    setStatsError(null);
    setPatientStats(null);
    try {
      const stats = await getPatientStats(patient.patientId);
      setPatientStats(stats);
    } catch (err) {
      setStatsError('İstatistikler yüklenemedi.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;
    try {
      await removePatientFromHealthcare(user.id, selectedPatient.patientEmail);
      setPatientModalVisible(false);
      setSelectedPatient(null);
      await loadPatients();
      Alert.alert('Başarılı', 'Hasta başarıyla silindi.');
    } catch (error) {
      Alert.alert('Hata', 'Hasta silinirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Doktor Paneli</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hastalarım</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Hasta Ara..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.listContainer}>
              {loading ? (
                <Text style={styles.loadingText}>Yükleniyor...</Text>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, idx) => (
                  <TouchableOpacity key={idx} style={styles.patientItem} onPress={() => handlePatientPress(patient)}>
                    <Text style={styles.patientName}>{patient.patientName}</Text>
                    <Text style={styles.patientEmail}>{patient.patientEmail}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noPatientsText}>
                  {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz hasta eklenmemiş'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={patientModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPatientModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hasta Detayları</Text>
              <TouchableOpacity onPress={() => setPatientModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {selectedPatient && (
              <>
                <View style={styles.patientDetail}>
                  <Text style={styles.detailLabel}>Ad Soyad:</Text>
                  <Text style={styles.detailValue}>{selectedPatient.patientName}</Text>
                </View>
                <View style={styles.patientDetail}>
                  <Text style={styles.detailLabel}>E-posta:</Text>
                  <Text style={styles.detailValue}>{selectedPatient.patientEmail}</Text>
                </View>
                {/* İstatistikler */}
                <View style={styles.statsSection}>
                  <Text style={styles.statsTitle}>İstatistikler</Text>
                  {statsLoading ? (
                    <ActivityIndicator size="small" color="#1976D2" />
                  ) : statsError ? (
                    <Text style={styles.statsError}>{statsError}</Text>
                  ) : patientStats ? (
                    <>
                      <Text style={styles.statsText}>Kan Şekeri Kayıtları: {patientStats.glucose.length}</Text>
                      <Text style={styles.statsText}>İnsülin Kayıtları: {patientStats.insulin.length}</Text>
                      <Text style={styles.statsText}>Öğün Kayıtları: {patientStats.meals.length}</Text>
                      {patientStats.glucose.length > 0 && (
                        <Text style={styles.statsText}>Son Kan Şekeri: {patientStats.glucose[patientStats.glucose.length-1].value} mg/dL</Text>
                      )}
                      {patientStats.insulin.length > 0 && (
                        <Text style={styles.statsText}>Son İnsülin: {patientStats.insulin[patientStats.insulin.length-1].value} ünite</Text>
                      )}
                      {patientStats.meals.length > 0 && (
                        <Text style={styles.statsText}>Son Öğün: {patientStats.meals[patientStats.meals.length-1].name || '-'}</Text>
                      )}
                    </>
                  ) : null}
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={handleDeletePatient}
                  >
                    <Text style={styles.buttonText}>Hastayı Sil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setPatientModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, styles.activeNavButton]} 
          onPress={() => handleNavigate('home')}
        >
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => handleNavigate('stats')}
        >
          <Ionicons name="stats-chart" size={24} color="#fff" />
          <Text style={styles.navButtonText}>İstatistikler</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => handleNavigate('settings')}
        >
          <Ionicons name="settings" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1976D2',
    borderBottomWidth: 1,
    borderBottomColor: '#1565C0',
  },
  titleContainer: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    marginTop: 10,
  },
  patientItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  noPatientsText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  patientDetail: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statsSection: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statsLoading: {
    fontSize: 14,
    color: '#1976D2',
  },
  statsError: {
    fontSize: 14,
    color: '#dc3545',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  closeButton: {
    backgroundColor: '#1976D2',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#1565C0',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    opacity: 0.7,
  },
  activeNavButton: {
    opacity: 1,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
}); 