import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
// ✅ Usamos la librería recomendada para quitar el Warning
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Usamos el servicio que creamos
import { getPacientes } from '../services/pacienteService';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PacientesScreen() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛡️ Guardia de seguridad
    if (!global.userToken) {
      router.replace('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPacientes(global.userToken);
      setPacientes(data);
    } catch (err) {
      console.log("Error al cargar pacientes");
      // Si el error es por token inválido, regresamos al login
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER LIMPIO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Pacientes Registrados</ThemedText>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {pacientes.length > 0 ? (
          pacientes.map((p: any) => (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardInfo}>
                <View style={styles.iconCircle}>
                  <IconSymbol name="pawprint.fill" size={20} color="#fff" />
                </View>
                <View>
                  <ThemedText style={styles.petName}>{p.nombre}</ThemedText>
                  <ThemedText style={styles.petDetail}>{p.especie} • {p.raza}</ThemedText>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No hay mascotas en el sistema.</ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  backBtn: { padding: 8, backgroundColor: '#f3f4f6', borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 20, marginRight: 15 },
  petName: { fontSize: 16, fontWeight: 'bold' },
  petDetail: { fontSize: 13, color: '#666' },
  emptyContainer: { marginTop: 50, alignItems: 'center' },
  emptyText: { color: '#888', fontStyle: 'italic' }
});