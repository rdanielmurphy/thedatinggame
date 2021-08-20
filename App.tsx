import React, { useState } from 'react';
import { Text, View } from 'react-native';

import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LandingScreen } from './components/auth/LandingScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { MainScreen } from './components/MainScreen';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// load firebase config.  not in source control for obvious reasons!  see README.
import config from './app.config';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

const Stack = createStackNavigator();
const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
  }
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      setLoggedIn(false);
      setLoaded(true);
    } else {
      setLoggedIn(true);
      setLoaded(true);
    }
  })

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Loading</Text>
      </View>);
  }

  if (!loggedIn) {
    return (<>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>);
  }

  // If logged in
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default function App() {
  return (
    <AppRouter />
  );
}
