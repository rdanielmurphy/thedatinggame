import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/actions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './home/HomeScreen';
import { ChatsScreen } from './chats/ChatsScreen';
import { AccountScreen } from './account/AccountScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CreateProfileScreen } from '../components/account';

const Tab = createBottomTabNavigator();

export const MainScreen = () => {
    const newUser: boolean = useSelector((state: any) => !state.userState.created);
    const loading: boolean = useSelector((state: any) => state.userState.loading);
    const dispatch = useDispatch();

    useEffect(() => fetchUser()(dispatch), []);

    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (newUser) {
        return (<CreateProfileScreen submitted={() => fetchUser()(dispatch)} />);
    }

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                )
            }} />
            <Tab.Screen name="Chats" component={ChatsScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="forum" color={color} size={26} />
                )
            }} />
            <Tab.Screen name="Account" component={AccountScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={26} />
                )
            }} />
        </Tab.Navigator>
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
