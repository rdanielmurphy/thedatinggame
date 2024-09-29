import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export const ChatsScreen = () => {
    const loading: boolean = useSelector((state: any) => state.userState.loading);

    // TODO: Fetch messages

    // TODO loading if fetching messages
    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>This is the chats screen!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});
