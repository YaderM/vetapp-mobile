import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const role = (global as any).userRole;

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir de VetApp?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Salir", 
        onPress: () => {
          (global as any).userToken = null;
          (global as any).userRole = null;
          router.replace('/'); 
        } 
      }
    ]);
  };

  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#4f46e5',
      tabBarStyle: { height: 75, paddingBottom: 15, paddingTop: 10 }
    }}>
      <Tabs.Screen
        name="citas"
        options={{
          title: 'Mis Citas',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="calendar.badge.plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Panel Control',
          href: role === 'cliente' ? null : '/explore', 
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}