import React from 'react'
import { View } from 'react-native';
import { Button } from 'react-native-paper';

export const LandingScreen = (navigation: any) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <Button onPress={() => navigation.navigation.navigate("Register")}>
                Register
            </Button>
            <Button onPress={() => navigation.navigation.navigate("Login")}>
                Login
            </Button>
        </View>
    )
}
