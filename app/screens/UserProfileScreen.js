import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import * as api from '../services/api';
import PhotoCarousel from '../components/PhotoCarousel';

const { width, height } = Dimensions.get('window');

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.getPublicProfile(userId);
        setProfile(data.user);
      } catch (err) {
        console.log('Profile error:', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18, color: COLORS.gray }}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.carouselWrapper}>
          <PhotoCarousel photos={profile.photos} style={styles.carousel} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.carouselOverlay}
          >
            <Text style={styles.name}>
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </Text>
            {profile.location?.city ? (
              <Text style={styles.location}>📍 {profile.location.city}</Text>
            ) : null}
          </LinearGradient>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {profile.bio ? (
            <View style={[styles.card, SHADOWS.card]}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{profile.bio}</Text>
            </View>
          ) : null}

          {profile.question?.text ? (
            <View style={[styles.card, SHADOWS.card]}>
              <Text style={styles.sectionTitle}>Dating Question</Text>
              <Text style={styles.questionText}>{profile.question.text}</Text>
              <View style={styles.options}>
                {profile.question.options?.map((opt, i) => (
                  <View key={i} style={styles.optionPill}>
                    <Text style={styles.optionText}>{opt}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray },
  carouselWrapper: { position: 'relative' },
  carousel: { width, height: height * 0.5 },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
  name: { fontSize: 28, fontWeight: '800', color: COLORS.white },
  location: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  content: { padding: 16, paddingTop: 20 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 8 },
  bio: { fontSize: 16, color: COLORS.darkGray, lineHeight: 24 },
  questionText: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginBottom: 12 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionPill: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  optionText: { fontSize: 14, color: COLORS.darkGray },
});
