import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

export const SettingsScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Coming Soon!</Text>
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
