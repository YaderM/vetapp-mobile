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
  const [historial, setHistorial] = useState([]);

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
      
      // 1. Cargamos Citas Reales
      const resCitas = await axios.get('https://vetapp-web-completo.vercel.app/api/citas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setHistorial(resCitas.data);
      
      // 2. Intentamos cargar estadísticas y lista de usuarios para el contador
      try {
         const resStats = await axios.get('https://vetapp-web-completo.vercel.app/api/dashboard/stats', {
           headers: { Authorization: `Bearer ${token}` }
         });
         setStats(resStats.data);
      } catch (e) {
         // Fallback: Si falla stats, usamos el largo del array de citas
         setStats(prev => ({ ...prev, citasHoy: resCitas.data.length }));
         
         // Intentamos obtener el conteo de usuarios desde la ruta nueva
         try {
            const resUser = await axios.get('https://vetapp-web-completo.vercel.app/api/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(prev => ({ ...prev, perfiles: resUser.data.length }));
         } catch(err) { console.log("Ruta de usuarios aún no desplegada"); }
      }

    } catch (error) {
      console.log("Aviso: Error en carga de Dashboard.");
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
        {/* HEADER DEFINITIVO: Bajado a 150 para evitar obstrucciones */}
        <View style={styles.header}>
          <ThemedText style={styles.subtitle}>
            {userRole.toUpperCase()}: {userName.toUpperCase()} 👋
          </ThemedText>
          <ThemedText style={styles.title}>Dashboard General 📊</ThemedText>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.grid}>
              <StatCard title="Propietarios" value={stats.propietarios} icon="house.fill" color="#4F46E5" route="/propietarios" />
              <StatCard title="Pacientes" value={stats.pacientes} icon="pawprint.fill" color="#10B981" route="/pacientes" />
              <StatCard title="Citas Hoy" value={stats.citasHoy} icon="calendar" color="#F59E0B" route="/citas-admin" />
              <StatCard title="Usuarios" value={stats.perfiles} icon="person.2.fill" color="#EF4444" route="/usuarios" />
            </View>

            <View style={styles.historySection}>
              <ThemedText style={styles.sectionTitle}>Historial Reciente</ThemedText>
              {historial.length === 0 ? (
                <View style={styles.emptyCard}>
                    <ThemedText style={styles.emptyText}>No hay citas registradas.</ThemedText>
                </View>
              ) : (
                historial.slice(0, 5).map((item: any) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View>
                      <ThemedText style={styles.petName}>{item.pacienteNombre || item.mascota || 'Mascota'}</ThemedText>
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
  // AJUSTE FINAL DE MARGEN
  header: { paddingHorizontal: 25, marginTop: 150, marginBottom: 30 }, 
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginVertical: 5 },
  cardTitle: { fontSize: 14, color: '#6B7280', fontWeight: 'bold', textAlign: 'center' },
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
  emptyCard: { padding: 20, alignItems: 'center' },
  petName: { fontWeight: 'bold', fontSize: 16, color: '#1F2937' },
  dateText: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic' }
});