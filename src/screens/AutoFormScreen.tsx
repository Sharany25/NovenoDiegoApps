import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAutos } from '../hooks/useAutos';
import { Auto } from '../interfaces/auto';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigator/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

const emptyAuto: Auto = {
  kilometraje: 0,
  modelo: '',
  tipoCombustible: '',
  numeroSerie: '',
  imagenes: ['', '', '', '', ''],
  marca: '',
  anio: new Date().getFullYear(),
};

type AutoFormRouteProp = RouteProp<RootStackParamList, 'AutoForm'>;

const TIPO_COMBUSTIBLE = [
  { label: 'Gasolina', value: 'gasolina', icon: 'flame' },
  { label: 'Diésel', value: 'diesel', icon: 'water' },
];

export const AutoFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AutoFormRouteProp>();
  const { addAuto, updateAuto } = useAutos();
  const [form, setForm] = useState<Auto>(route.params?.auto ?? emptyAuto);

  useEffect(() => {
    if (route.params?.auto) setForm(route.params.auto);
  }, [route.params?.auto]);

  const pickImage = async (idx: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a tus fotos para seleccionar una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (result.assets && result.assets.length > 0) {
      const newImages = [...form.imagenes];
      newImages[idx] = result.assets[0].uri;
      setForm({ ...form, imagenes: newImages });
    }
  };

  const handleChange = (key: keyof Auto, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleCombustible = (value: string) => {
    setForm({ ...form, tipoCombustible: value });
  };

  const handleSubmit = async () => {
    if (
      !form.modelo ||
      !form.tipoCombustible ||
      !form.numeroSerie ||
      form.imagenes.some(img => !img) ||
      !form.marca ||
      !form.anio ||
      !form.kilometraje
    ) {
      Alert.alert('Error', 'Completa todos los campos y selecciona 5 imágenes.');
      return;
    }
    try {
      if (form._id) {
        await updateAuto(form._id, form);
        Alert.alert('¡Auto actualizado!', 'El auto se actualizó correctamente.');
      } else {
        await addAuto(form);
        Alert.alert('¡Auto agregado!', 'Tu auto se guardó correctamente.');
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Ocurrió un error al guardar.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ECF2F6' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.title}>{form._id ? 'Editar Auto' : 'Registrar Auto'}</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Kilometraje</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.kilometraje.toString()}
            onChangeText={text => handleChange('kilometraje', Number(text))}
            placeholder="Ej. 55000"
            returnKeyType="next"
          />
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={styles.input}
            value={form.modelo}
            onChangeText={text => handleChange('modelo', text)}
            placeholder="Ej. Corolla"
            returnKeyType="next"
          />
          <Text style={styles.label}>Tipo de Combustible</Text>
          <View style={styles.combustibleRow}>
            {TIPO_COMBUSTIBLE.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.combustibleBtn,
                  form.tipoCombustible === t.value && styles.combustibleBtnActive,
                ]}
                onPress={() => handleCombustible(t.value)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={t.icon as any}
                  size={24}
                  color={form.tipoCombustible === t.value ? '#fff' : '#00C27F'}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.combustibleText,
                    form.tipoCombustible === t.value && styles.combustibleTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Número de Serie</Text>
          <TextInput
            style={styles.input}
            value={form.numeroSerie}
            onChangeText={text => handleChange('numeroSerie', text)}
            placeholder="Ej. 4Y1SL65848Z411439"
            returnKeyType="next"
          />
          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            value={form.marca}
            onChangeText={text => handleChange('marca', text)}
            placeholder="Ej. Toyota"
            returnKeyType="next"
          />
          <Text style={styles.label}>Año</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.anio.toString()}
            onChangeText={text => handleChange('anio', Number(text))}
            placeholder="Ej. 2018"
            returnKeyType="done"
          />
          <Text style={styles.label}>Imágenes del auto</Text>
          <View style={styles.imageRow}>
            {form.imagenes.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.imagePicker}
                onPress={() => pickImage(idx)}
                activeOpacity={0.85}
              >
                {img ? (
                  <Image source={{ uri: img }} style={styles.imageThumb} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={31} color="#b0b0b0" />
                    <Text style={styles.imageText}>Foto {idx + 1}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{form._id ? 'Actualizar' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF2F6',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 22,
    color: '#19232D',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 26,
    marginVertical: 12,
    shadowColor: '#00C27F40',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  label: {
    fontSize: 16.5,
    color: '#19232D',
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 11,
    padding: 13,
    fontSize: 16.2,
    borderWidth: 1.2,
    borderColor: '#aee4d8',
    marginBottom: 8,
    color: '#232946',
  },
  combustibleRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 9,
    marginTop: 2,
  },
  combustibleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafcf6',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#00C27F60',
    marginRight: 18,
    shadowColor: '#00C27F30',
    shadowOpacity: 0.11,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
  },
  combustibleBtnActive: {
    backgroundColor: '#00C27F',
    borderColor: '#00C27F',
    shadowColor: '#00C27F60',
    shadowOpacity: 0.15,
  },
  combustibleText: {
    fontWeight: 'bold',
    color: '#00C27F',
    fontSize: 16.2,
    letterSpacing: 0.5,
  },
  combustibleTextActive: {
    color: '#fff',
    textShadowColor: '#00995f20',
    textShadowRadius: 5,
    textShadowOffset: { width: 0, height: 2 },
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  imagePicker: {
    width: 58,
    height: 58,
    borderRadius: 11,
    backgroundColor: '#F6F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#a6e4c7',
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  imageThumb: {
    width: 58,
    height: 58,
    borderRadius: 11,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  imageText: {
    fontSize: 11,
    color: '#b1b1b1',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#00C27F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#00C27F33',
    shadowOpacity: 0.13,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.7,
  },
});

export default AutoFormScreen;
