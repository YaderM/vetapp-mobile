// app/register.tsx
import { ThemedText } from '@/components/themed-text';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Ajusta la URL a tu endpoint de registro en Vercel
      await axios.post('https://vetapp-web-completo.vercel.app/api/auth/register', {
        nombre, email, password, role: 'user' 
      });
      Alert.alert("Éxito", "Usuario registrado. Ya puedes iniciar sesión.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Crear Cuenta</ThemedText>
      <TextInput style={styles.input} placeholder="Nombre" onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <ThemedText style={styles.buttonText}>REGISTRARSE</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#f5f6fa', height: 50, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#dcdde1' },
  button: { backgroundColor: '#4f46e5', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});