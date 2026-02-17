import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VetAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [seccion, setSeccion] = useState<'menu' | 'citas'>('menu');

  // Datos de tus tablas reales (Simulados para estabilidad en la presentación)
  const resumen = [
    { id: 1, titulo: 'Propietarios', cantidad: '24', icono: 'person.2.fill', color: '#4f46e5' },
    { id: 2, titulo: 'Pacientes', cantidad: '38', icono: 'pawprint.fill', color: '#10b981' },
    { id: 3, titulo: 'Citas Hoy', cantidad: '5', icono: 'calendar', color: '#f59e0b' },
  ];

  const citasDetalle = [
    { id: 1, paciente: 'Max', dueño: 'Juan Pérez', hora: '08:00 AM', motivo: 'Vacuna' },
    { id: 2, paciente: 'Luna', dueño: 'Maria Sol', hora: '10:30 AM', motivo: 'Cirugía' },
  ];

  const horasDisponibles = ['02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => {
    const token = (global as any).userToken;
    if (!token) { router.replace('/'); return; }
    setTimeout(() => setLoading(false), 800);
  }, []);

  const agendarEspacio = (hora: string) => {
    Alert.alert("Éxito", `Cita agendada para las ${hora}. Registro sincronizado con el Token del Admin.`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4f46e5" /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcome}>VetApp Professional</ThemedText>
          <ThemedText style={styles.name}>{seccion === 'menu' ? 'Dashboard' : 'Gestión de Citas'}</ThemedText>
        </View>
        <TouchableOpacity style={styles.logout} onPress={() => seccion === 'citas' ? setSeccion('menu') : router.replace('/')}>
          <IconSymbol name={seccion === 'citas' ? 'arrow.left' : 'power'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        {seccion === 'menu' ? (
          <View>
            <ThemedText style={styles.sectionTitle}>Resumen General</ThemedText>
            <View style={styles.grid}>
              {resumen.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.statCard, { borderLeftColor: item.color, borderLeftWidth: 5 }]}
                  onPress={() => item.titulo === 'Citas Hoy' && setSeccion('citas')}
                >
                  <IconSymbol name={item.icono as any} size={28} color={item.color} />
                  <ThemedText style={styles.statNum}>{item.cantidad}</ThemedText>
                  <ThemedText style={styles.statLabel}>{item.titulo}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.mainCta} onPress={() => setSeccion('citas')}>
              <ThemedText style={styles.ctaText}>Ir a Control de Citas</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <ThemedText style={styles.sectionTitle}>Pacientes Citados</ThemedText>
            {citasDetalle.map((c) => (
              <View key={c.id} style={styles.citaCard}>
                <View style={styles.info}>
                  <ThemedText style={styles.petName}>{c.paciente} (Paciente)</ThemedText>
                  <ThemedText style={styles.ownerName}>Dueño: {c.dueño}</ThemedText>
                  <ThemedText style={styles.timeLabel}>{c.hora} - {c.motivo}</ThemedText>
                </View>
                <TouchableOpacity style={styles.btnVer} onPress={() => Alert.alert("Detalle", `Viendo historial clínico de ${c.paciente}`)}>
                  <IconSymbol name="eye.fill" size={20} color="#4f46e5" />
                </TouchableOpacity>
              </View>
            ))}

            <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>Agendar Nuevo Espacio</ThemedText>
            <View style={styles.horasGrid}>
              {horasDisponibles.map((h) => (
                <TouchableOpacity key={h} style={styles.horaBtn} onPress={() => agendarEspacio(h)}>
                  <ThemedText style={styles.horaBtnText}>{h}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 25, paddingVertical: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e5e7eb' },
  welcome: { color: '#666', fontSize: 13, textTransform: 'uppercase' },
  name: { color: '#4f46e5', fontSize: 22, fontWeight: 'bold' },
  logout: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 12 },
  body: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  statNum: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  statLabel: { color: '#6b7280', fontSize: 12 },
  mainCta: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  ctaText: { color: '#fff', fontWeight: 'bold' },
  citaCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  petName: { fontWeight: 'bold', fontSize: 16 },
  ownerName: { fontSize: 13, color: '#6b7280' },
  timeLabel: { color: '#4f46e5', fontWeight: 'bold', marginTop: 5 },
  btnVer: { backgroundColor: '#eef2ff', padding: 10, borderRadius: 10 },
  horasGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  horaBtn: { width: '30%', backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#4f46e5' },
  horaBtnText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 12 }
});