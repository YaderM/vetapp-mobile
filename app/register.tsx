import { ThemedText } from '@/components/themed-text';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NUEVOS ESTADOS PARA LA MASCOTA
  const [mascotaNombre, setMascotaNombre] = useState('');
  const [mascotaEspecie, setMascotaEspecie] = useState('');
  
  const router = useRouter();

  const handleRegister = async () => {
    // Validación básica
    if (!nombre || !email || !password || !mascotaNombre) {
      Alert.alert("Error", "Por favor completa los campos obligatorios y el nombre de tu mascota.");
      return;
    }

    try {
      // Enviamos los datos al backend incluyendo los campos de la mascota
      await axios.post('https://vetapp-web-completo.vercel.app/api/auth/register', {
        nombre, 
        email, 
        password, 
        rol: 'cliente', // Cambiado a 'cliente' para que coincida con tu backend
        mascotaNombre,
        mascotaEspecie: mascotaEspecie || 'No especificada'
      });

      Alert.alert("Éxito", "Usuario y mascota registrados. Ya puedes iniciar sesión.");
      router.back();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "No se pudo registrar el usuario.";
      Alert.alert("Error", msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ThemedText style={styles.title}>Crear Cuenta</ThemedText>
        
        <ThemedText style={styles.subtitle}>Datos Personales</ThemedText>
        <TextInput style={styles.input} placeholder="Tu Nombre" onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Tu Email" onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña" onChangeText={setPassword} secureTextEntry />
        
        <View style={styles.divider} />
        
        <ThemedText style={styles.subtitle}>Datos de tu Mascota</ThemedText>
        <TextInput style={styles.input} placeholder="Nombre de la mascota (Ej: Rambo)" onChangeText={setMascotaNombre} />
        <TextInput style={styles.input} placeholder="Especie (Ej: Perro, Gato)" onChangeText={setMascotaEspecie} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <ThemedText style={styles.buttonText}>REGISTRARSE</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#4f46e5' },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#374151', marginTop: 10 },
  input: { backgroundColor: '#f5f6fa', height: 50, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#dcdde1' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 15 },
  button: { backgroundColor: '#4f46e5', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#4f46e5', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 5, elevation: 3 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});