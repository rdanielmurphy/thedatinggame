import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native';
import firebase from 'firebase';

export const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const onSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
            const uid = firebase.auth().currentUser?.uid;
            if (uid) {
                firebase.firestore().collection("users").doc(uid).set({
                    name,
                    email
                });
            }
            console.log(result);
        }).catch((e) => {
            console.error(e);
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
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
            <Button
                onPress={() => onSignUp()}
                title="Sign Up"
            />
        </View>
    )
}
