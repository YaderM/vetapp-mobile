import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PropietariosScreen() {
  const router = useRouter();
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Formulario Nuevo Cliente
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const BASE_URL = 'https://vetapp-web-completo.vercel.app/api';

  const fetchPropietarios = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${global.userToken}` } };
      const res = await axios.get(`${BASE_URL}/propietarios`, config);
      setPropietarios(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPropietarios(); }, []);

  const agregarPropietario = async () => {
    if (!nombre || !email) { Alert.alert("Error", "Nombre y Email obligatorios"); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${global.userToken}` } };
      await axios.post(`${BASE_URL}/propietarios`, { nombre, apellido, email, telefono }, config);
      Alert.alert("¡Éxito!", "Cliente registrado");
      setModalVisible(false); fetchPropietarios();
    } catch (error) { Alert.alert("Error", "No se pudo crear el cliente."); }
  };

  return (
    <View style={styles.container}>
      {/* Header Morado para Propietarios */}
      <View style={[styles.header, { backgroundColor: '#4f46e5' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Clientes ({propietarios.length})</ThemedText>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.body}>
        {loading ? <ActivityIndicator color="#4f46e5" /> : (
          propietarios.map((p: any) => (
            <View key={p.id} style={styles.card}>
              <View style={styles.iconCircle}>
                <IconSymbol name="person.fill" size={24} color="#4f46e5" />
              </View>
              <View style={{flex: 1}}>
                <ThemedText style={styles.cardTitle}>{p.nombre} {p.apellido}</ThemedText>
                <ThemedText style={styles.cardSub}>{p.email}</ThemedText>
                <ThemedText style={{fontSize: 12, color: '#4f46e5'}}>{p.telefono}</ThemedText>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { backgroundColor: '#4f46e5' }]} onPress={() => setModalVisible(true)}>
        <IconSymbol name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Nuevo Cliente</ThemedText>
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Teléfono" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btn, {backgroundColor:'#ccc'}]}><ThemedText>Cancelar</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={agregarPropietario} style={[styles.btn, {backgroundColor:'#4f46e5'}]}><ThemedText style={{color:'#fff'}}>Guardar</ThemedText></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  body: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
  iconCircle: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#666' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' }
});