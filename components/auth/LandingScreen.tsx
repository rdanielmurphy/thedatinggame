import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export const LandingScreen = (navigation: any) => {
    return (
        <View style={styles.container}>
            <Button style={styles.button} mode={"contained"} onPress={() => navigation.navigation.navigate("Register")}>
                Register
            </Button>
            <Button style={styles.button} mode={"contained"} onPress={() => navigation.navigation.navigate("Login")}>
                Login
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        margin: 10,
    },
});