import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useServicios } from '../hooks/useServicios';
import { Servicio } from '../interfaces/types';
import { RootStackParamList } from '../navigator/AppNavigator';

const HomeScreen = () => {
  const { servicios, fetchServicios, deleteServicio } = useServicios();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      fetchServicios();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert('¿Eliminar servicio?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteServicio(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Servicio }) => (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageRow}
      >
        {item.imagenes.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>

      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.details}>📦 Tipo: {item.tipo}</Text>
      <Text style={styles.details}>💰 Costo: ${item.costo}</Text>

      <View style={styles.badgeContainer}>
        <Text
          style={[
            styles.badge,
            item.disponibilidad ? styles.badgeDisponible : styles.badgeNoDisponible,
          ]}
        >
          {item.disponibilidad ? 'Disponible' : 'No disponible'}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Formulario', { servicio: item })}
        >
          <Text style={styles.buttonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id!)}
        >
          <Text style={styles.buttonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('Formulario', {})}
      >
        <Text style={styles.newButtonText}>＋ Nuevo Servicio</Text>
      </TouchableOpacity>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item._id!}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  newButton: {
    backgroundColor: '#00C27F',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  imageRow: {
    gap: 10,
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 6,
  },
  details: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  badgeContainer: {
    marginTop: 6,
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgeDisponible: {
    backgroundColor: '#22C55E', // verde
  },
  badgeNoDisponible: {
    backgroundColor: '#EF4444', // rojo
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
