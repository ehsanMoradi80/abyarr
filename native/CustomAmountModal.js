import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { formatNumber } from './strings';

export function CustomAmountModal({ visible, onClose, onAddCustom }) {
  const [amountMl, setAmountMl] = useState('250');

  const handleConfirm = () => {
    const ml = parseInt(amountMl, 10);
    if (!isNaN(ml) && ml > 0) {
      const glasses = Math.round((ml / 250) * 10) / 10;
      onAddCustom(glasses, ml);
      onClose();
    }
  };

  const presetValues = [150, 250, 350, 500, 750];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>ثبت مقدار دلخواه آب</Text>
          <Text style={styles.modalSubtitle}>
            میزان آبی که نوشیده‌ای را به میلی‌لیتر وارد کن:
          </Text>

          {/* Input field */}
          <View style={styles.inputRow}>
            <Text style={styles.inputUnit}>میلی‌لیتر</Text>
            <TextInput
              style={styles.textInput}
              value={amountMl}
              onChangeText={setAmountMl}
              keyboardType="numeric"
              maxLength={4}
              textAlign="center"
            />
          </View>

          {/* Quick presets */}
          <View style={styles.presetsRow}>
            {presetValues.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.presetChip,
                  amountMl === String(val) && styles.presetChipActive,
                ]}
                onPress={() => setAmountMl(String(val))}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    amountMl === String(val) && styles.presetChipTextActive,
                  ]}
                >
                  {formatNumber(val)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>انصراف</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>ثبت نوشیدن 💧</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    writingDirection: 'rtl',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    writingDirection: 'rtl',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2D9CFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    minWidth: 80,
    padding: 0,
  },
  inputUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 8,
  },
  presetsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 20,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  presetChipActive: {
    backgroundColor: '#E6F4FF',
    borderWidth: 1,
    borderColor: '#2D9CFF',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#0066CC',
    fontWeight: '800',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#2D9CFF',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
