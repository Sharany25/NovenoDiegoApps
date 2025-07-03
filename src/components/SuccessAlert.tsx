import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessAlertProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  title?: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  visible,
  onClose,
  message = "Operación exitosa",
  title = "¡Éxito!"
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.alertBox}>
        <Ionicons name="checkmark-circle-outline" size={44} color="#00C27F" style={{ alignSelf: 'center' }}/>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{message}</Text>
        <TouchableOpacity style={styles.okBtn} onPress={onClose}>
          <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex:1, backgroundColor: '#23294699', justifyContent: 'center', alignItems: 'center' },
  alertBox: { backgroundColor: '#fff', padding: 28, borderRadius: 18, width: 310, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 19, color: '#232946', marginTop: 13, marginBottom: 8 },
  text: { color: '#555', textAlign: 'center', marginBottom: 22, fontSize: 15 },
  okBtn: { backgroundColor: '#00C27F', borderRadius: 10, paddingHorizontal: 36, paddingVertical: 11 },
  okText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default SuccessAlert;
