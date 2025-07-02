import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useAutos } from '../hooks/useAutos';
import { Auto } from '../interfaces/auto';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigator/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

export const AutosHomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { autos, loading, fetchAutos, deleteAuto } = useAutos();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      fetchAutos();
    }, [])
  );

  const handleDelete = (id?: string) => {
    if (!id) return;
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar este auto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: () => deleteAuto(id), style: 'destructive' },
    ]);
  };

  const cardWidth = windowWidth > 400 ? 370 : windowWidth - 24;

  const renderImages = (imagenes: string[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {imagenes.map((img, idx) =>
        img ? (
          <Image
            key={idx}
            source={{ uri: img }}
            style={[styles.imageThumb, { width: cardWidth * 0.26, height: cardWidth * 0.19 }]}
            resizeMode="cover"
          />
        ) : (
          <View
            key={idx}
            style={[
              styles.imageThumbPlaceholder,
              { width: cardWidth * 0.26, height: cardWidth * 0.19 },
            ]}
          >
            <Ionicons name="image-outline" size={28} color="#bbb" />
          </View>
        )
      )}
    </ScrollView>
  );

  const renderItem = ({ item }: { item: Auto }) => (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={[styles.imageGallery, { width: cardWidth * 0.27, height: cardWidth * 0.20 }]}>
        {renderImages(item.imagenes)}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>
          <Ionicons name="car-sport-outline" size={18} color="#00C27F" />{' '}
          <Text style={styles.boldMain}>{item.modelo}</Text>
          <Text style={{ color: '#8a8a8a', fontWeight: 'normal' }}> - {item.marca} ({item.anio})</Text>
        </Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Ionicons name="speedometer-outline" size={14} color="#00C27F" />
            <Text style={styles.tagText}>{item.kilometraje} km</Text>
          </View>
          <View style={styles.tag}>
            <Ionicons
              name={item.tipoCombustible === 'diesel' ? 'water' : 'flame'}
              size={14}
              color="#00C27F"
            />
            <Text style={styles.tagText}>
              {item.tipoCombustible.charAt(0).toUpperCase() + item.tipoCombustible.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.text}>
          <Text style={styles.labelSerie}>Serie:</Text>
          <Text style={styles.boldText}> {item.numeroSerie}</Text>
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AutoForm', { auto: item })}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={17} color="#00C27F" />
            <Text style={styles.edit}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item._id)}
            activeOpacity={0.85}
          >
            <Ionicons name="trash-outline" size={17} color="#ff5252" />
            <Text style={styles.delete}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity
        style={[
          styles.addButton,
          { width: cardWidth, alignSelf: 'center', marginBottom: 14, marginTop: 8 },
        ]}
        onPress={() => navigation.navigate('AutoForm')}
        activeOpacity={0.90}
      >
        <Ionicons name="car-outline" size={21} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.addButtonText}>Nuevo Auto</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#00C27F" style={{ marginTop: 38 }} />
      ) : (
        <FlatList
          data={autos}
          renderItem={renderItem}
          keyExtractor={item => item._id || Math.random().toString()}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 45 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay autos registrados.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FA',
    padding: 12,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#00C27F',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C27F60',
    shadowOpacity: 0.14,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginVertical: 12,
    padding: 13,
    flexDirection: 'row',
    shadowColor: '#00C27F33',
    shadowOpacity: 0.18,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    alignItems: 'flex-start',
    minHeight: 115,
    maxWidth: 400,
    width: '100%',
  },
  imageGallery: {
    borderRadius: 13,
    backgroundColor: '#F6F7FB',
    marginRight: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  imageThumb: {
    borderRadius: 13,
    marginRight: 7,
  },
  imageThumbPlaceholder: {
    borderRadius: 13,
    marginRight: 7,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingVertical: 3,
    justifyContent: 'center',
    minWidth: 160,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#232946',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  boldMain: {
    fontWeight: 'bold',
    color: '#00C27F',
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 0,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafcf6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    marginRight: 9,
    marginTop: 2,
    marginBottom: 1,
  },
  tagText: {
    color: '#00C27F',
    fontWeight: 'bold',
    fontSize: 13.5,
    marginLeft: 4,
  },
  text: {
    color: '#555',
    fontSize: 15,
    marginBottom: 2,
    marginTop: 1,
    flexWrap: 'wrap',
  },
  labelSerie: {
    color: '#a0a0a0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  boldText: {
    color: '#232946',
    fontWeight: '500',
    fontSize: 14.6,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginRight: 10,
    shadowColor: '#00C27F15',
    shadowOpacity: 0.10,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  edit: {
    color: '#00C27F',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 15.2,
  },
  delete: {
    color: '#ff5252',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 15.2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 17.5,
    marginTop: 40,
    letterSpacing: 0.2,
  },
});

export default AutosHomeScreen;
