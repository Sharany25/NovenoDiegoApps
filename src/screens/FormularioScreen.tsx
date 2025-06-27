import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useServicios } from '../hooks/useServicios';
import { Servicio } from '../interfaces/types';
import { useNavigation, useRoute } from '@react-navigation/native';

const FormularioScreen = () => {
  const { createServicio, updateServicio } = useServicios();
  const navigation = useNavigation();
  const route = useRoute<any>();

  const servicioEditando: Servicio | undefined = route.params?.servicio;

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Omit<Servicio, '_id'>>({
    tipo: '',
    titulo: '',
    detalles: '',
    costo: 0,
    disponibilidad: true,
    imagenes: [],
  });

  useEffect(() => {
    if (servicioEditando) {
      setForm({
        tipo: servicioEditando.tipo,
        titulo: servicioEditando.titulo,
        detalles: servicioEditando.detalles ?? '',
        costo: servicioEditando.costo,
        disponibilidad: servicioEditando.disponibilidad,
        imagenes: servicioEditando.imagenes,
      });
    }
  }, []);

  const pickImageAtIndex = async (index?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });

    if (!result.canceled && result.assets[0].base64) {
      const base64img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      let nuevasImagenes = [...form.imagenes];

      if (typeof index === 'number') {
        nuevasImagenes[index] = base64img;
      } else if (nuevasImagenes.length < 3) {
        nuevasImagenes.push(base64img);
      }

      setForm({ ...form, imagenes: nuevasImagenes });
    }
  };

  const removeImage = (index: number) => {
    const nuevasImagenes = form.imagenes.filter((_, i) => i !== index);
    setForm({ ...form, imagenes: nuevasImagenes });
  };

  const handleSubmit = async () => {
    const { tipo, titulo, detalles, costo, disponibilidad, imagenes } = form;

    if (!tipo || !titulo || !detalles || !costo || imagenes.length === 0) {
      Alert.alert('Completa todos los campos visibles');
      return;
    }

    if (!servicioEditando && imagenes.length !== 3) {
      Alert.alert('Debes subir exactamente 3 imágenes');
      return;
    }

    setSubmitting(true);

    try {
      if (servicioEditando) {
        const actualizado = await updateServicio(servicioEditando._id!, {
          tipo,
          titulo,
          detalles,
          costo,
          disponibilidad,
          imagenes,
        });

        if (actualizado) {
          navigation.navigate('Home' as never);
        } else {
          Alert.alert('No se pudo actualizar el servicio');
        }
      } else {
        const creado = await createServicio(form);

        if (creado) {
          navigation.navigate('Home' as never);
        } else {
          Alert.alert('No se pudo crear el servicio');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error al guardar el servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDisponibilidad = () => {
    setForm({ ...form, disponibilidad: !form.disponibilidad });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio'}
      </Text>

      <Text style={styles.label}>Tipo:</Text>
      <TextInput
        style={styles.input}
        value={form.tipo}
        onChangeText={(text) => setForm({ ...form, tipo: text })}
        placeholder="Ej. Consulta, Clase"
      />

      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={form.titulo}
        onChangeText={(text) => setForm({ ...form, titulo: text })}
        placeholder="Ej. Terapia Express"
      />

      <Text style={styles.label}>Detalles:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={form.detalles}
        onChangeText={(text) => setForm({ ...form, detalles: text })}
        placeholder="Describe el servicio"
      />

      <Text style={styles.label}>Costo ($):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.costo.toString()}
        onChangeText={(text) => setForm({ ...form, costo: Number(text) })}
        placeholder="Ej. 500"
      />

      <Text style={styles.label}>Disponibilidad:</Text>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          form.disponibilidad ? styles.toggleSelected : styles.toggleUnselected,
        ]}
        onPress={toggleDisponibilidad}
      >
        <Text style={styles.toggleText}>
          {form.disponibilidad ? 'Sí' : 'No'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Imágenes ({form.imagenes.length}/3):</Text>
      <View style={styles.imageGrid}>
        {form.imagenes.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => pickImageAtIndex(index)}>
              <Image source={{ uri: img }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBadge}
              onPress={() => removeImage(index)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {form.imagenes.length < 3 && (
          <TouchableOpacity
            style={styles.addImageBox}
            onPress={() => pickImageAtIndex()}
          >
            <Text style={{ fontSize: 24, color: '#888' }}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <Button
        title={servicioEditando ? 'Actualizar Servicio' : 'Crear Servicio'}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </ScrollView>
  );
};

export default FormularioScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#232946',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
    color: '#232946',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  toggleSelected: {
    backgroundColor: '#00C27F',
  },
  toggleUnselected: {
    backgroundColor: '#F87171',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    padding: 4,
  },
  addImageBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
