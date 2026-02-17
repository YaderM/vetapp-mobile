import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Solo dejamos Explore porque el Login ahora vive afuera en app/index.tsx */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Veterinaria',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="pawprint.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}