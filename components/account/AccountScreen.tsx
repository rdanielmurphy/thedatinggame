import React from 'react'
import firebase from 'firebase';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export const AccountScreen = () => {
    const userName: any = useSelector((state: any) => state.userState.userName);
    const loading: boolean = useSelector((state: any) => state.userState.loading);

    // TODO: Fetch settings

    // TODO loading if fetching settings
    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Welcome {userName}!</Text>
            <Button
                onPress={() => firebase.auth().signOut()}
                title="Sign Out"
            />
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
