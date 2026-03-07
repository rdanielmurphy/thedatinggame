import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import { COLORS } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert('Error', 'Please fill in all fields');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Join the Game</Text>
          <Text style={styles.subtitle}>Create your profile and start matching</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={COLORS.gray}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (6+ characters)"
            placeholderTextColor={COLORS.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <GradientButton title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: 10 }} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 30 },
  header: { alignItems: 'center', marginBottom: 50 },
  emoji: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 34, fontWeight: '900', color: COLORS.white },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
    color: COLORS.black,
  },
  link: { alignItems: 'center', marginTop: 20 },
  linkText: { color: COLORS.gray, fontSize: 15 },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});
