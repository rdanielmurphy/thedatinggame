import React from 'react'
import { Button, View } from 'react-native';

export const LandingScreen = (navigation: any) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
                title="Register"
                onPress={() => navigation.navigation.navigate("Register")}
            />
            <Button
                title="Login"
                onPress={() => navigation.navigation.navigate("Login")}
            />
        </View>
    )
}
