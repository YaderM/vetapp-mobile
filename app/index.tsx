import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      console.log("Conectando con el backend real...");
      
      // 🚀 PETICIÓN AL BACKEND DE VERCEL
      // Prueba con /api/login o /api/auth/login según tu servidor
      const response = await axios.post('https://vetapp-web-completo.vercel.app/api/auth/login', {
        email: email,
        password: password
      });

      // El token real suele venir en response.data.token
      if (response.data && response.data.token) {
        (global as any).userToken = response.data.token; 
        console.log("Login exitoso, token real guardado");
        router.replace('/(tabs)/explore'); 
      }
    } catch (error: any) {
      console.log("Fallo en login:", error.response?.status);
      Alert.alert("Acceso denegado", "Usuario o clave incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>VetApp 🐾</Text>
        <TextInput 
          style={styles.input} 
          placeholder="admin@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4f46e5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 30, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4f46e5', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#4f46e5', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});