import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export const AdministrationScreen = (navigation: any) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Coming Soon!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
    },
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
