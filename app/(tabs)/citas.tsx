import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CitasScreen() {
  const router = useRouter();
  const [nombreMascota, setNombreMascota] = useState('Cargando mascota...'); 
  const [pacienteIdReal, setPacienteIdReal] = useState<number | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<any>(null);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [fechaCita, setFechaCita] = useState(new Date().toISOString().split('T')[0]); 

  const slots = [
    { label: '08:00 AM', value: '08:00:00' }, { label: '09:00 AM', value: '09:00:00' },
    { label: '10:00 AM', value: '10:00:00' }, { label: '11:00 AM', value: '11:00:00' },
    { label: '12:00 PM', value: '12:00:00' }, { label: '01:00 PM', value: '13:00:00' },
    { label: '02:00 PM', value: '14:00:00' }, { label: '03:00 PM', value: '15:00:00' },
    { label: '04:00 PM', value: '16:00:00' }, { label: '05:00 PM', value: '17:00:00' },
    { label: '06:00 PM', value: '18:00:00' }, { label: '07:00 PM', value: '19:00:00' },
  ];

  useEffect(() => { 
    fetchHistorial(); 
    fetchMascotaVinculada();
  }, []);

  const fetchMascotaVinculada = async () => {
    const userData = (global as any).userData;
    const token = (global as any).userToken;
    
    // Verificamos si los datos del usuario existen
    if (!userData?.id || !token) {
        setNombreMascota("Error: Inicia sesión de nuevo");
        return;
    }

    try {
      const response = await axios.get(`https://vetapp-web-completo.vercel.app/api/pacientes/usuario/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.length > 0) {
        const mascota = response.data[0];
        setNombreMascota(mascota.nombre);
        setPacienteIdReal(mascota.id);
      } else {
        setNombreMascota("No se encontró mascota");
      }
    } catch (e) {
      console.log("Error al obtener mascota:", e);
      setNombreMascota("Error al cargar mascota");
    }
  };

  const fetchHistorial = async () => {
    const token = (global as any).userToken;
    if (!token) return;
    try {
      const response = await axios.get('https://vetapp-web-completo.vercel.app/api/citas/mis-citas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(response.data);
    } catch (e) { setHistorial([]); }
  };

  const handleLogout = () => {
    (global as any).userToken = null;
    (global as any).userData = null;
    router.replace('/');
  };

  const handleAgendar = async () => {
    if (!pacienteIdReal || !horaSeleccionada || !motivo || !fechaCita) {
      Alert.alert("Error", "Por favor selecciona mascota, horario y motivo.");
      return;
    }

    setLoading(true);
    try {
      const token = (global as any).userToken;
      
      const datosCita = {
        fecha: fechaCita,           
        hora: horaSeleccionada.value, 
        motivo: motivo,             
        pacienteId: pacienteIdReal,
        estado: 'Pendiente'
      };

      await axios.post(
        'https://vetapp-web-completo.vercel.app/api/citas', 
        datosCita, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("¡Éxito!", "Cita guardada correctamente.");
      setMostrarForm(false);
      setMotivo(''); 
      setHoraSeleccionada(null);
      fetchHistorial();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la cita.");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.header}>
          <ThemedText style={styles.subtitle}>Gestione sus citas médicas 🐾</ThemedText>
          <TouchableOpacity onPress={handleLogout} style={styles.miniLogout}>
            <IconSymbol name="power" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {!mostrarForm ? (
          <TouchableOpacity style={styles.showBtn} onPress={() => setMostrarForm(true)}>
            <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>+ AGENDAR NUEVA CITA</ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <ThemedText style={styles.labelTitle}>Nueva Reserva</ThemedText>
              <TouchableOpacity onPress={() => setMostrarForm(false)}>
                <IconSymbol name="xmark.circle.fill" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.label}>Mascota</ThemedText>
            <View style={[styles.input, {backgroundColor: '#f3f4f6', justifyContent: 'center'}]}>
                <ThemedText style={{color: pacienteIdReal ? '#1f2937' : '#9ca3af'}}>
                    {nombreMascota}
                </ThemedText>
            </View>

            <ThemedText style={styles.label}>Motivo</ThemedText>
            <TextInput style={styles.input} placeholder="Ej: Limpieza, Vacuna..." value={motivo} onChangeText={setMotivo} />

            <ThemedText style={styles.label}>Fecha</ThemedText>
            <View style={styles.dateInputWrapper}>
              <IconSymbol name="calendar" size={18} color="#4F46E5" />
              <TextInput style={styles.dateInput} value={fechaCita} onChangeText={setFechaCita} keyboardType="numeric" />
            </View>

            <ThemedText style={styles.label}>Horario</ThemedText>
            <View style={styles.slotsGrid}>
              {slots.map((s) => (
                <TouchableOpacity 
                  key={s.value} 
                  style={[styles.slotBtn, horaSeleccionada?.value === s.value && styles.slotSelected]} 
                  onPress={() => setHoraSeleccionada(s)}
                >
                  <ThemedText style={[styles.slotText, horaSeleccionada?.value === s.value && {color: '#fff'}]}>{s.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
                style={[styles.mainBtn, !pacienteIdReal && {backgroundColor: '#9ca3af'}]} 
                onPress={handleAgendar} 
                disabled={loading || !pacienteIdReal}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>CONFIRMAR CITA</ThemedText>}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.historyContainer}>
          <ThemedText style={styles.sectionTitle}>Mi Historial</ThemedText>
          {historial.length === 0 ? (
            <ThemedText style={{textAlign: 'center', color: '#6B7280', marginTop: 20}}>No tienes citas registradas aún.</ThemedText>
          ) : (
            historial.map((item: any) => (
              <View key={item.id} style={styles.historyCard}>
                <View>
                  <ThemedText style={{fontWeight: 'bold'}}>{item.pacienteNombre || 'Mascota'}</ThemedText>
                  <ThemedText style={{fontSize: 12, color: '#6B7280'}}>{item.fecha} • {item.hora}</ThemedText>
                </View>
                <IconSymbol name="checkmark.circle.fill" size={22} color="#10b981" />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { paddingHorizontal: 25, marginTop: 40, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtitle: { color: '#6B7280', fontSize: 16, fontWeight: '500' },
  miniLogout: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 10 },
  showBtn: { backgroundColor: '#4F46E5', padding: 20, margin: 20, borderRadius: 18, alignItems: 'center' },
  formCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 25, elevation: 8 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  labelTitle: { fontSize: 18, fontWeight: 'bold' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginBottom: 5, marginTop: 10, textTransform: 'uppercase' },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 8, minHeight: 45 },
  dateInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 15, marginBottom: 5 },
  dateInput: { flex: 1, padding: 12, marginLeft: 5 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotBtn: { width: '31%', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#4F46E5', marginBottom: 8, alignItems: 'center' },
  slotSelected: { backgroundColor: '#4F46E5' },
  slotText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 10 },
  mainBtn: { backgroundColor: '#10b981', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 15 },
  historyContainer: { paddingHorizontal: 25, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  historyCard: { backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});