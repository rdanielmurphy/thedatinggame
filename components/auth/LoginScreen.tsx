import React, { useState } from 'react'
import { View } from 'react-native';
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
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <TextInput
                placeholder="email"
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <Button onPress={() => onLogIn()}>
                Log In
            </Button>
        </View>
    )
}
