import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import SwipeableContainer from './partials/SwipableContainer';

export const HomeScreen = () => {
    const loading: boolean = useSelector((state: any) => state.userState.loading);

    // TODO: Fetch users to swipe on

    // TODO loading if fetching users
    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <SwipeableContainer />
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
