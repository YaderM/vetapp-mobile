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
      
      const response = await axios.post('https://vetapp-web-completo.vercel.app/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data && response.data.token) {
        // 1. Guardamos el Token
        (global as any).userToken = response.data.token; 
        
        // 2. CAPTURA PROFUNDA: Buscamos el rol en todos los niveles posibles
        const userRole = response.data.rol || 
                         response.data.role || 
                         (response.data.usuario && response.data.usuario.rol) ||
                         (response.data.user && response.data.user.role) ||
                         (response.data.data && response.data.data.rol);

        (global as any).userRole = userRole; 

        // LOG CRUCIAL: Esto te dirá exactamente qué está llegando
        console.log("--- DATOS RECIBIDOS ---");
        console.log(JSON.stringify(response.data)); 
        console.log("ROL ASIGNADO:", userRole);

        // 3. REDIRECCIÓN BASADA EN VALOR REAL
        if (userRole && String(userRole).toLowerCase() === 'cliente') {
          console.log("✅ Acceso CLIENTE detectado.");
          router.replace('/(tabs)/citas'); 
        } 
        else if (userRole && (String(userRole).toLowerCase() === 'administrador' || String(userRole).toLowerCase() === 'veterinario')) {
          console.log("✅ Acceso STAFF detectado.");
          router.replace('/(tabs)/explore'); 
        }
        else {
          console.log("⚠️ No se pudo determinar el rol:", userRole);
          Alert.alert(
            "Error de Perfil", 
            `El servidor no envió un rol válido. Valor recibido: ${userRole}`
          );
        }
      }
    } catch (error: any) {
      console.log("❌ Fallo en login:", error.response?.status, error.message);
      Alert.alert("Acceso denegado", "Usuario o clave incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>VetApp 🐾</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico"
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

        <TouchableOpacity 
          style={styles.registerContainer} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
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
  registerContainer: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 14, color: '#6b7280' },
  registerLink: { color: '#4f46e5', fontWeight: 'bold' },
});