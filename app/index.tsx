import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Esto ignora los avisos amarillos en el celular, pero los deja en la terminal
LogBox.ignoreAllLogs();


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
        // --- CAMBIO CLAVE AQUÍ ---
        // Guardamos el objeto completo (id, nombre, email, rol, etc.)
        (global as any).userData = response.data; 
        (global as any).userToken = response.data.token; 
        
        // Captura del rol
        const userRole = response.data.rol || 
                         response.data.role || 
                         (response.data.usuario && response.data.usuario.rol);

        (global as any).userRole = userRole; 

        console.log("--- LOGIN EXITOSO ---");
        console.log("Usuario ID:", response.data.id);
        console.log("Rol:", userRole);

        // Redirección
        if (userRole && String(userRole).toLowerCase() === 'cliente') {
          router.replace('/(tabs)/citas'); 
        } 
        else if (userRole && (String(userRole).toLowerCase() === 'administrador' || String(userRole).toLowerCase() === 'veterinario')) {
          router.replace('/(tabs)/explore'); 
        }
        else {
          Alert.alert("Error de Perfil", "No se recibió un rol válido.");
        }
      }
    } catch (error: any) {
      console.log("❌ Fallo en login:", error.response?.status);
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