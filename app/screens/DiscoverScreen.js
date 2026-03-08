import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Image, Animated, PanResponder,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import { API_URL } from '../constants/config';
import * as api from '../services/api';
import QuestionModal from '../components/QuestionModal';
import PhotoCarousel from '../components/PhotoCarousel';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export default function DiscoverScreen() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionModal, setQuestionModal] = useState({ visible: false, question: null, targetId: null });
  const [resultOverlay, setResultOverlay] = useState(null);
  const position = useRef(new Animated.ValueXY()).current;

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getFeed();
      setCards(data.users || []);
    } catch (err) {
      console.log('Feed error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  const currentCard = cards[0];

  const handleSwipeComplete = async (direction) => {
    const target = cards[0];
    if (!target) return;

    if (direction === 'left') {
      try { await api.swipe(target._id, 'left'); } catch {}
      setCards((prev) => prev.slice(1));
      position.setValue({ x: 0, y: 0 });
    } else {
      // Right swipe — get question
      try {
        const { data } = await api.swipe(target._id, 'right');
        if (data.result === 'question') {
          setQuestionModal({ visible: true, question: data.question, targetId: target._id });
        }
      } catch (err) {
        Alert.alert('Error', err.response?.data?.error || 'Swipe failed');
      }
      position.setValue({ x: 0, y: 0 });
    }
  };

  const handleAnswer = async (answerIndex) => {
    setQuestionModal((prev) => ({ ...prev, visible: false }));
    try {
      const { data } = await api.answerQuestion(questionModal.targetId, answerIndex);
      if (data.result === 'match') {
        setResultOverlay({ type: 'match', message: "It's a Match! 🎉" });
      } else if (data.result === 'correct') {
        setResultOverlay({ type: 'correct', message: 'Correct! ✅\nWaiting for them...' });
      } else {
        setResultOverlay({ type: 'wrong', message: 'Wrong answer! ❌' });
      }
      setTimeout(() => setResultOverlay(null), 2000);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to submit answer');
    }
    setCards((prev) => prev.slice(1));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: width + 100, y: gesture.dy }, useNativeDriver: false }).start(() => {
            handleSwipeComplete('right');
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: -width - 100, y: gesture.dy }, useNativeDriver: false }).start(() => {
            handleSwipeComplete('left');
          });
        } else {
          Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const getPhotoUri = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${API_URL}${photo}`;
  };

  const renderCard = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    if (!currentCard) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No more people nearby</Text>
          <Text style={styles.emptySubtitle}>Check back later or expand your distance</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadFeed}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }, SHADOWS.card]}
      >
        <PhotoCarousel photos={currentCard.photos} style={styles.cardImage} />

        <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
          <Text style={styles.stampText}>LIKE ❤️</Text>
        </Animated.View>
        <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
          <Text style={styles.stampText}>NOPE 👎</Text>
        </Animated.View>

        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardOverlay}>
          <Text style={styles.cardName}>
            {currentCard.name}{currentCard.age ? `, ${currentCard.age}` : ''}
          </Text>
          {currentCard.location?.city ? (
            <Text style={styles.cardLocation}>📍 {currentCard.location.city}</Text>
          ) : null}
          <Text style={styles.cardBio} numberOfLines={2}>{currentCard.bio}</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.logo}>💘 Dating Game</Text>
      </View>

      <View style={styles.cardContainer}>{renderCard()}</View>

      {currentCard && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.nopeBtn]}
            onPress={() => {
              Animated.spring(position, { toValue: { x: -width - 100, y: 0 }, useNativeDriver: false }).start(() => handleSwipeComplete('left'));
            }}
          >
            <Text style={styles.actionEmoji}>👎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => {
              Animated.spring(position, { toValue: { x: width + 100, y: 0 }, useNativeDriver: false }).start(() => handleSwipeComplete('right'));
            }}
          >
            <Text style={styles.actionEmoji}>❤️</Text>
          </TouchableOpacity>
        </View>
      )}

      {resultOverlay && (
        <View style={styles.resultOverlay}>
          <View style={[styles.resultBox, resultOverlay.type === 'match' && styles.matchBox]}>
            <Text style={styles.resultText}>{resultOverlay.message}</Text>
          </View>
        </View>
      )}

      <QuestionModal
        visible={questionModal.visible}
        question={questionModal.question}
        onAnswer={handleAnswer}
        onClose={() => {
          setQuestionModal({ visible: false, question: null, targetId: null });
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  card: {
    width: width - 30,
    height: height * 0.6,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    position: 'absolute',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noPhoto: {
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
  },
  cardName: { fontSize: 28, fontWeight: '800', color: COLORS.white },
  cardLocation: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  cardBio: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
  stamp: {
    position: 'absolute',
    top: 40,
    padding: 12,
    borderWidth: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  likeStamp: { right: 20, borderColor: COLORS.success, transform: [{ rotate: '-15deg' }] },
  nopeStamp: { left: 20, borderColor: COLORS.danger, transform: [{ rotate: '15deg' }] },
  stampText: { fontSize: 28, fontWeight: '900', color: COLORS.white },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
    gap: 30,
  },
  actionBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nopeBtn: { backgroundColor: COLORS.white },
  likeBtn: { backgroundColor: COLORS.white },
  actionEmoji: { fontSize: 32 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.white, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center' },
  refreshBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  refreshText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 100,
  },
  resultBox: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
  },
  matchBox: {
    backgroundColor: COLORS.primary,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.black,
  },
});
