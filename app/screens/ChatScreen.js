import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import * as api from '../services/api';
import { getSocket } from '../services/socket';

export default function ChatScreen({ route, navigation }) {
  const { conversationId, userName, userPhoto, userId } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();
  const typingTimeout = useRef();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => userId && navigation.navigate('UserProfile', { userId })}
          activeOpacity={0.7}
        >
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }} />
          ) : null}
          <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '700' }}>{userName}</Text>
        </TouchableOpacity>
      ),
    });
  }, [userName, userPhoto, userId]);

  useEffect(() => {
    loadMessages();
    const socket = getSocket();
    if (socket) {
      socket.emit('join_conversation', conversationId);
      socket.on('new_message', handleNewMessage);
      socket.on('user_typing', () => setIsTyping(true));
      socket.on('user_stop_typing', () => setIsTyping(false));
    }
    return () => {
      if (socket) {
        socket.emit('leave_conversation', conversationId);
        socket.off('new_message', handleNewMessage);
        socket.off('user_typing');
        socket.off('user_stop_typing');
      }
    };
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const { data } = await api.getMessages(conversationId);
      setMessages(data.messages || []);
    } catch (err) {
      console.log('Messages error:', err.message);
    }
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit('send_message', { conversationId, text: text.trim() });
      socket.emit('stop_typing', { conversationId });
    }
    setText('');
  };

  const handleTyping = (value) => {
    setText(value);
    const socket = getSocket();
    if (socket) {
      socket.emit('typing', { conversationId });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('stop_typing', { conversationId });
      }, 2000);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender?._id === user?._id || item.sender === user?._id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe && { color: COLORS.white }]}>{item.text}</Text>
        <Text style={[styles.messageTime, isMe && { color: 'rgba(255,255,255,0.7)' }]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>{userName} is typing...</Text>
        </View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.gray}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && { opacity: 0.4 }]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageBubble: {
    maxWidth: '78%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 16, color: COLORS.black, lineHeight: 22 },
  messageTime: { fontSize: 11, color: COLORS.gray, marginTop: 4, alignSelf: 'flex-end' },
  typingIndicator: { paddingHorizontal: 20, paddingBottom: 4 },
  typingText: { fontSize: 13, color: COLORS.gray, fontStyle: 'italic' },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: COLORS.white,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: COLORS.black,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
});
