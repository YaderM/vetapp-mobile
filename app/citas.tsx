import axios from 'axios';
import { useRouter } from 'expo-router'; // Para navegar
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CitasScreen() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados para el Formulario de Nueva Cita
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [idPaciente, setIdPaciente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy YYYY-MM-DD

  const BASE_URL = 'https://vetapp-web-completo.vercel.app/api';

  const fetchCitas = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${global.userToken}` } };
      const res = await axios.get(`${BASE_URL}/citas`, config);
      setCitas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCitas(); }, []);

  // FUNCIÓN PARA CREAR CITA
  const agendarCita = async () => {
    if (!nuevoMotivo || !idPaciente) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${global.userToken}` } };
      await axios.post(`${BASE_URL}/citas`, {
        fecha: fecha,
        motivo: nuevoMotivo,
        pacienteId: idPaciente,
        usuarioId: 5 // O el ID que tengas en global
      }, config);

      Alert.alert("¡Éxito!", "Cita agendada correctamente");
      setModalVisible(false);
      setNuevoMotivo('');
      fetchCitas(); // Recargar lista
    } catch (error) {
      Alert.alert("Error", "No se pudo agendar. Verifica el ID del paciente.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER con Botón Volver */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Gestión de Citas</ThemedText>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView style={styles.body}>
        {loading ? <ActivityIndicator color="#4f46e5" /> : (
          citas.map((c: any) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.dateBox}>
                <ThemedText style={styles.day}>{new Date(c.fecha).getDate()}</ThemedText>
                <ThemedText style={styles.month}>FEB</ThemedText>
              </View>
              <View style={{flex: 1}}>
                <ThemedText style={styles.cardTitle}>{c.motivo}</ThemedText>
                <ThemedText style={styles.cardSub}>ID Paciente: {c.pacienteId}</ThemedText>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTÓN FLOTANTE (+) */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <IconSymbol name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      {/* MODAL (FORMULARIO) */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Nueva Cita</ThemedText>
            
            <ThemedText style={styles.label}>Motivo de la consulta:</ThemedText>
            <TextInput style={styles.input} placeholder="Ej: Vacunación" value={nuevoMotivo} onChangeText={setNuevoMotivo} />

            <ThemedText style={styles.label}>ID del Paciente:</ThemedText>
            <TextInput style={styles.input} placeholder="Ej: 1" keyboardType="numeric" value={idPaciente} onChangeText={setIdPaciente} />

            <ThemedText style={styles.label}>Fecha (YYYY-MM-DD):</ThemedText>
            <TextInput style={styles.input} value={fecha} onChangeText={setFecha} />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btn, styles.btnCancel]}>
                <ThemedText style={{color:'#333'}}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={agendarCita} style={[styles.btn, styles.btnConfirm]}>
                <ThemedText style={{color:'#fff', fontWeight: 'bold'}}>Agendar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#4f46e5', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  body: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
  dateBox: { backgroundColor: '#fff7ed', padding: 10, borderRadius: 8, alignItems: 'center', marginRight: 15 },
  day: { fontSize: 18, fontWeight: 'bold', color: '#ea580c' },
  month: { fontSize: 10, color: '#ea580c' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#666' },
  
  // Botón Flotante
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#4f46e5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  btnCancel: { backgroundColor: '#e5e7eb' },
  btnConfirm: { backgroundColor: '#4f46e5' }
});