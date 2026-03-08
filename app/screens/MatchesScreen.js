import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import { API_URL } from '../constants/config';
import * as api from '../services/api';

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [])
  );

  const loadMatches = async () => {
    try {
      const { data } = await api.getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      console.log('Matches error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUri = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${API_URL}${photo}`;
  };

  const renderMatch = ({ item }) => {
    const user = item.user;
    const photo = user?.photos?.[0];
    return (
      <TouchableOpacity
        style={[styles.matchCard, SHADOWS.card]}
        onPress={() => navigation.navigate('Chat', {
          conversationId: item.conversationId,
          userName: user?.name,
          userPhoto: photo ? getPhotoUri(photo) : null,
          userId: user?._id,
        })}
        activeOpacity={0.8}
      >
        <TouchableOpacity
          onPress={() => user?._id && navigation.navigate('UserProfile', { userId: user._id })}
          activeOpacity={0.7}
        >
          {photo ? (
            <Image source={{ uri: getPhotoUri(photo) }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.noAvatar]}>
              <Text style={{ fontSize: 28 }}>👤</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{user?.name || 'Unknown'}</Text>
          <Text style={styles.matchBio} numberOfLines={1}>{user?.bio || 'New match!'}</Text>
        </View>
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Matches</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : matches.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💝</Text>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>Keep swiping and answering questions!</Text>
          </View>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => item._id}
            renderItem={renderMatch}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  content: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  noAvatar: {
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchInfo: { flex: 1, marginLeft: 14 },
  matchName: { fontSize: 18, fontWeight: '700', color: COLORS.black },
  matchBio: { fontSize: 14, color: COLORS.gray, marginTop: 3 },
  chatIcon: { fontSize: 24 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.darkGray },
  emptySubtitle: { fontSize: 15, color: COLORS.gray, marginTop: 8 },
});
