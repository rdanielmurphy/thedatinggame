import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Image, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../constants/theme';
import { API_URL } from '../constants/config';
import * as api from '../services/api';
import GradientButton from '../components/GradientButton';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, refreshUser, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [city, setCity] = useState(user?.location?.city || '');
  const [latitude, setLatitude] = useState(
    user?.location?.coordinates?.[1]?.toString() || ''
  );
  const [longitude, setLongitude] = useState(
    user?.location?.coordinates?.[0]?.toString() || ''
  );
  const [questionText, setQuestionText] = useState(user?.question?.text || '');
  const [options, setOptions] = useState(
    user?.question?.options?.length === 4 ? [...user.question.options] : ['', '', '', '']
  );
  const [correctIndex, setCorrectIndex] = useState(user?.question?.correctIndex || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Name is required');
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        bio: bio.trim(),
        age: age ? parseInt(age) : undefined,
        question: {
          text: questionText.trim(),
          options: options.map((o) => o.trim()),
          correctIndex,
        },
        location: {
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
          city: city.trim(),
        },
      };
      await api.updateProfile(payload);
      await refreshUser();
      Alert.alert('Saved!', 'Your profile has been updated');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        const asset = result.assets[0];
        const base64 = `data:image/jpeg;base64,${asset.base64}`;
        await api.uploadPhotoBase64(base64);
        await refreshUser();
      } catch (err) {
        Alert.alert('Error', 'Failed to upload photo');
      }
    }
  };

  const removePhoto = async (photoUrl) => {
    try {
      await api.deletePhoto(photoUrl);
      await refreshUser();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const getPhotoUri = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${API_URL}${photo}`;
  };

  const updateOption = (index, value) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <Text style={styles.title}>👤 My Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photos */}
        <Text style={styles.sectionTitle}>📸 Photos</Text>
        <View style={styles.photosRow}>
          {(user?.photos || []).map((photo, i) => (
            <TouchableOpacity key={i} onLongPress={() => removePhoto(photo)} style={styles.photoWrapper}>
              <Image source={{ uri: getPhotoUri(photo) }} style={styles.photo} />
              <View style={styles.photoDelete}>
                <Text style={{ color: COLORS.white, fontSize: 12 }}>✕</Text>
              </View>
            </TouchableOpacity>
          ))}
          {(user?.photos?.length || 0) < 6 && (
            <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
              <Text style={styles.addPhotoPlus}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Info */}
        <Text style={styles.sectionTitle}>✏️ About You</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" />
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>📍 Location</Text>
        <View style={styles.card}>
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. San Francisco" placeholderTextColor={COLORS.gray} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" placeholder="37.7749" placeholderTextColor={COLORS.gray} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" placeholder="-122.4194" placeholderTextColor={COLORS.gray} />
            </View>
          </View>
        </View>

        {/* Question */}
        <Text style={styles.sectionTitle}>🧠 Your Dating Question</Text>
        <View style={styles.card}>
          <Text style={styles.hint}>
            Create a question others must answer correctly to match with you!
          </Text>
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={questionText}
            onChangeText={setQuestionText}
            multiline
            placeholder="e.g. What's the best first date?"
            placeholderTextColor={COLORS.gray}
          />
          {options.map((opt, i) => (
            <View key={i}>
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={[styles.radio, correctIndex === i && styles.radioSelected]}
                  onPress={() => setCorrectIndex(i)}
                >
                  {correctIndex === i && <View style={styles.radioDot} />}
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={opt}
                  onChangeText={(v) => updateOption(i, v)}
                  placeholder={`Option ${i + 1}`}
                  placeholderTextColor={COLORS.gray}
                />
              </View>
              {i < 3 && <View style={{ height: 10 }} />}
            </View>
          ))}
          <Text style={styles.hint}>Tap the circle to mark the correct answer</Text>
        </View>

        <GradientButton title="Save Profile" onPress={handleSave} loading={saving} style={{ marginTop: 10 }} />

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    ...SHADOWS.card,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  hint: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 10,
    fontStyle: 'italic',
  },
  photosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoWrapper: { position: 'relative' },
  photo: {
    width: (width - 72) / 3,
    height: (width - 72) / 3 * 1.3,
    borderRadius: 14,
  },
  photoDelete: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {
    width: (width - 72) / 3,
    height: (width - 72) / 3 * 1.3,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoPlus: { fontSize: 36, color: COLORS.gray },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  logoutBtn: {
    marginTop: 16,
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
