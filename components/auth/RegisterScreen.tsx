import React, { useState } from 'react'
import { View } from 'react-native';
import firebase from 'firebase';
import { Button, TextInput } from 'react-native-paper';

export const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const onSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
            const uid = result.user?.uid;
            if (uid) {
                firebase.firestore().collection("users").doc(uid).set({
                    name,
                    email,
                    created: false,
                });
            }
        }).catch((e) => {
            console.error(e);
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <TextInput
                placeholder="name"
                onChangeText={(name) => setName(name)}
            />
            <TextInput
                placeholder="email"
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <Button onPress={() => onSignUp()}>
                Sign Up
            </Button>
        </View>
    )
}
