import axios from 'axios';
import { useRouter } from 'expo-router'; // <--- 1. Importamos esto
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // <--- 2. Inicializamos el router

  // Tu backend en el puerto 3001
  const API_URL = 'http://10.0.2.2:3001/api/auth/login'; 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }

    setLoading(true);

    try {
      console.log('Conectando a:', API_URL);
      
      const response = await axios.post(API_URL, {
        email: email,
        password: password
      });

      console.log('Login OK:', response.data);
      
      // <--- 3. AQUÍ ESTÁ LA MAGIA:
      // En vez de solo una alerta, nos movemos a la pantalla 'explore'
      router.replace('/explore'); 
      
    } catch (error) {
      console.log('Error:', error);
      if (error.response) {
        Alert.alert('Error de Acceso', 'Credenciales incorrectas');
      } else {
        Alert.alert('Error de Red', 'No se pudo conectar al servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VetApp</Text>
      <Text style={styles.subtitle}>Móvil</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="admin@vetapp.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5,
  },
  subtitle: {
    fontSize: 18, color: '#7f8c8d', marginBottom: 40,
  },
  inputContainer: {
    width: '100%', marginBottom: 15,
  },
  label: {
    fontSize: 14, color: '#34495e', marginBottom: 5, fontWeight: '600',
  },
  input: {
    width: '100%', height: 50, borderColor: '#bdc3c7', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%', height: 50, backgroundColor: '#2980b9', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff', fontSize: 18, fontWeight: 'bold',
  },
});