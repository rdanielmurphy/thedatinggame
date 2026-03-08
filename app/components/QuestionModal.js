import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function QuestionModal({ visible, question, onAnswer, onClose }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (selected !== null) {
      onAnswer(selected);
      setSelected(null);
    }
  };

  if (!question) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            style={styles.header}
          >
            <Text style={styles.headerEmoji}>🧠</Text>
            <Text style={styles.headerTitle}>Answer to Proceed!</Text>
          </LinearGradient>

          <View style={styles.body}>
            <Text style={styles.questionText}>{question.text}</Text>

            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.option, selected === index && styles.optionSelected]}
                onPress={() => setSelected(index)}
                activeOpacity={0.7}
              >
                <View style={[styles.radio, selected === index && styles.radioSelected]}>
                  {selected === index && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.optionText, selected === index && styles.optionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, selected === null && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={selected === null}
              >
                <LinearGradient
                  colors={selected !== null ? [COLORS.gradientStart, COLORS.gradientEnd] : ['#ccc', '#ccc']}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 40,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerEmoji: { fontSize: 40, marginBottom: 8 },
  headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  body: { padding: 20 },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 20,
    lineHeight: 26,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#EEE',
    marginBottom: 10,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0F7',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  optionText: { fontSize: 16, color: COLORS.darkGray, flex: 1 },
  optionTextSelected: { color: COLORS.primary, fontWeight: '600' },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#EEE',
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: COLORS.gray },
  submitBtn: { flex: 1 },
  submitDisabled: { opacity: 0.5 },
  submitGradient: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
