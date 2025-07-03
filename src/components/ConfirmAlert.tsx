import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmAlertProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  visible,
  onCancel,
  onConfirm,
  message = "¿Seguro que deseas eliminar este auto?",
  title = "Eliminar"
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.alertBox}>
        <Ionicons name="trash-outline" size={38} color="#ff5252" style={{ alignSelf: 'center' }}/>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{message}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex:1, backgroundColor: '#232946AA', justifyContent: 'center', alignItems: 'center' },
  alertBox: { backgroundColor: '#fff', padding: 28, borderRadius: 18, width: 310, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 19, color: '#232946', marginTop: 13, marginBottom: 8 },
  text: { color: '#555', textAlign: 'center', marginBottom: 22, fontSize: 15 },
  row: { flexDirection: 'row', gap: 18 },
  cancelBtn: { paddingHorizontal: 22, paddingVertical: 10, backgroundColor: '#EDF0F2', borderRadius: 10 },
  confirmBtn: { paddingHorizontal: 22, paddingVertical: 10, backgroundColor: '#ff5252', borderRadius: 10 },
  cancelText: { color: '#232946', fontWeight: 'bold', fontSize: 16 },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ConfirmAlert;
