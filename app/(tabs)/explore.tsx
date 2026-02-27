import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2; 

export default function ExploreScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historial, setHistorial] = useState([]); // Estado para el historial

  // CAPTURAMOS LOS DATOS DEL USUARIO DINÁMICAMENTE
  const userData = (global as any).userData;
  const userName = userData?.nombre || "INVITADO";
  const userRole = userData?.rol || "cliente";

  const [stats, setStats] = useState({
    propietarios: 0,
    pacientes: 0,
    citasHoy: 0,
    perfiles: 0
  });

  const fetchDashboardData = async () => {
    try {
      const token = (global as any).userToken;
      if (!token) return;
      
      // 1. Cargar Estadísticas
      const resStats = await axios.get('https://vetapp-web-completo.vercel.app/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(resStats.data);

      // 2. Cargar Historial Dinámico (Solo las citas del usuario que entró)
      const resHist = await axios.get('https://vetapp-web-completo.vercel.app/api/citas/mis-citas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(resHist.data);

    } catch (error) {
      console.log("Error en Dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const StatCard = ({ title, value, icon, color, route }: any) => (
    <TouchableOpacity 
      style={[styles.card, { borderTopColor: color, borderTopWidth: 4 }]} 
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <IconSymbol name={icon} size={35} color={color} />
      <ThemedText style={styles.cardValue}>{value}</ThemedText>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <ThemedText style={styles.subtitle}>
            {userRole === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE'}: {userName.toUpperCase()} 👋
          </ThemedText>
          <ThemedText style={styles.title}>Dashboard General 📊</ThemedText>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.grid}>
              <StatCard title="Propietarios" value={stats.propietarios} icon="person.2.fill" color="#4F46E5" route="/propietarios" />
              <StatCard title="Pacientes" value={stats.pacientes} icon="pawprint.fill" color="#10B981" route="/pacientes" />
              <StatCard title="Citas Hoy" value={stats.citasHoy} icon="calendar" color="#F59E0B" route="/citas" />
              <StatCard title="Usuarios" value={stats.perfiles} icon="person.crop.circle" color="#EF4444" route="/perfiles" />
            </View>

            {/* SECCIÓN DE HISTORIAL AÑADIDA */}
            <View style={styles.historySection}>
              <ThemedText style={styles.sectionTitle}>Historial Reciente</ThemedText>
              {historial.length === 0 ? (
                <ThemedText style={styles.emptyText}>No hay citas para mostrar.</ThemedText>
              ) : (
                historial.map((item: any) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View>
                      <ThemedText style={styles.petName}>{item.mascota || 'Mascota'}</ThemedText>
                      <ThemedText style={styles.dateText}>{item.fecha} • {item.hora}</ThemedText>
                    </View>
                    <IconSymbol name="checkmark.circle.fill" size={22} color="#10b981" />
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 25, marginTop: 60, marginBottom: 30 },
  subtitle: { color: '#6B7280', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    width: cardSize,
    height: cardSize, 
    padding: 15,
    borderRadius: 22,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginVertical: 5 },
  cardTitle: { fontSize: 14, color: '#6B7280', fontWeight: 'bold', textAlign: 'center' },
  // ESTILOS DEL HISTORIAL
  historySection: { paddingHorizontal: 25, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 },
  historyCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 2 
  },
  petName: { fontWeight: 'bold', fontSize: 16, color: '#1F2937' },
  dateText: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 10, fontStyle: 'italic' }
});