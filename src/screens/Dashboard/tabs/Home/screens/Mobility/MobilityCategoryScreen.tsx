import React from 'react';
import { Text, View } from 'react-native';
export function MobilityCategoryScreen({ route }: { route: { params: { category: string } } }) {
  return <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 22, fontWeight: '600' }}>{route.params.category}</Text>
    <Text>Exercises for this category will be added later.</Text>
  </View>;
}
