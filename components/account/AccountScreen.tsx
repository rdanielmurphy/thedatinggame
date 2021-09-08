import React, { useEffect } from 'react'
import firebase from 'firebase';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/actions';

export const AccountScreen = (navigation: any) => {
    const userName: any = useSelector((state: any) => state.userState.userName);
    // const loading: boolean = useSelector((state: any) => state.userState.loading);
    // const dispatch = useDispatch();

    // // TODO: Fetch user and fetch settings
    // useEffect(() => fetchUser()(dispatch), []);

    // TODO loading if fetching settings
    // if (loading) {
    //     return (
    //         <View style={[styles.container, styles.horizontal]}>
    //             <ActivityIndicator size="large" />
    //         </View>
    //     )
    // }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Welcome {userName}!</Text>
            <Button
                onPress={() => navigation.navigation.navigate("ViewProfile")}
                title="View Profile"
            />
            <Button
                onPress={() => navigation.navigation.navigate("EditProfile")}
                title="Edit Profile"
            />
            <Button
                onPress={() => navigation.navigation.navigate("EditGames")}
                title="Edit Games"
            />
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
