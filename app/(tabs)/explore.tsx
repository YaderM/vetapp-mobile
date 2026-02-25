import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SmartDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conteo, setConteo] = useState({ propietarios: 0, pacientes: 0, citas: 0, perfiles: 0 });

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir del panel administrativo?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Salir", 
        onPress: () => {
          (global as any).userToken = null;
          (global as any).userRole = null;
          router.replace('/'); 
        } 
      }
    ]);
  };

  useEffect(() => {
    // 🛡️ BLOQUEO ULTRA-ESTRICTO
    const rawRole = (global as any).userRole;
    const role = String(rawRole).toLowerCase();

    if (role === 'cliente') {
      console.log("Acceso no autorizado a Dashboard. Rebotando...");
      router.replace('/(tabs)/citas');
      return;
    }

    const fetchDatosReales = async () => {
      try {
        const token = (global as any).userToken;
        const urlBase = 'https://vetapp-web-completo.vercel.app/api';
        
        const [propRes, pacRes, citaRes, perfRes] = await Promise.all([
          axios.get(`${urlBase}/propietarios/count`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${urlBase}/pacientes/count`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${urlBase}/citas/hoy`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${urlBase}/usuarios/count`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setConteo({
          propietarios: propRes.data.total || 0,
          pacientes: pacRes.data.total || 0,
          citas: citaRes.data.total || 0,
          perfiles: perfRes.data.total || 0
        });
      } catch (error) {
        console.error("Error en Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'administrador' || role === 'veterinario') {
      fetchDatosReales();
    }
  }, []);

  // Si no hay rol o es cliente, no renderizamos absolutamente nada
  if (!(global as any).userRole || String((global as any).userRole).toLowerCase() === 'cliente') {
    return null;
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4f46e5" /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcome}>Panel Administrativo</ThemedText>
          <ThemedText style={styles.name}>Métricas del Sistema</ThemedText>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <IconSymbol name="power" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <View style={[styles.statCard, { borderLeftColor: '#4f46e5', borderLeftWidth: 5 }]}>
            <IconSymbol name="person.2.fill" size={28} color="#4f46e5" />
            <ThemedText style={styles.statNum}>{conteo.propietarios}</ThemedText>
            <ThemedText style={styles.statLabel}>Propietarios</ThemedText>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#10b981', borderLeftWidth: 5 }]}>
            <IconSymbol name="pawprint.fill" size={28} color="#10b981" />
            <ThemedText style={styles.statNum}>{conteo.pacientes}</ThemedText>
            <ThemedText style={styles.statLabel}>Pacientes</ThemedText>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#f59e0b', borderLeftWidth: 5 }]}>
            <IconSymbol name="calendar" size={28} color="#f59e0b" />
            <ThemedText style={styles.statNum}>{conteo.citas}</ThemedText>
            <ThemedText style={styles.statLabel}>Citas Hoy</ThemedText>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#ec4899', borderLeftWidth: 5 }]}>
            <IconSymbol name="person.crop.circle.badge.checkmark" size={28} color="#ec4899" />
            <ThemedText style={styles.statNum}>{conteo.perfiles}</ThemedText>
            <ThemedText style={styles.statLabel}>Perfiles</ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    padding: 25, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderColor: '#eee',
    paddingTop: 45, // Ajuste para barra de Android
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutBtn: { backgroundColor: '#ef4444', padding: 12, borderRadius: 14, elevation: 4 },
  welcome: { color: '#666', fontSize: 13, textTransform: 'uppercase' },
  name: { color: '#4f46e5', fontSize: 22, fontWeight: 'bold' },
  body: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { 
    width: '48%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15, 
    elevation: 3 
  },
  statNum: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 5 }
});