import React, { useEffect } from 'react'
import firebase from 'firebase';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
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
            <Button style={styles.button} mode="contained" onPress={() => navigation.navigation.navigate("ViewProfile")}>
                View Profile
            </Button>
            <Button style={styles.button} mode="contained" onPress={() => navigation.navigation.navigate("EditProfile")}>
                Edit Profile
            </Button>
            <Button style={styles.button} mode="contained" onPress={() => navigation.navigation.navigate("EditGames")}>
                Edit Games
            </Button>
            <Button style={styles.button} mode="contained" onPress={() => firebase.auth().signOut()}>
                Sign Out
            </Button>
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
