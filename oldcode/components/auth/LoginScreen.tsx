import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native';
import firebase from 'firebase';
import { Button, TextInput } from 'react-native-paper';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogIn = () => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
            console.log(result);
        }).catch((e) => {
            console.error(e);
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="email"
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                style={styles.input}
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <Button mode={"contained"} style={styles.button} onPress={() => onLogIn()}>
                Log In
            </Button>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    input: {
        margin: 10,
    },
    button: {
        margin: 10,
    },
});