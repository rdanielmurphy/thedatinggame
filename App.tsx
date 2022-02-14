import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainScreen } from './components/MainScreen';
import { AdministrationScreen, InspectionReportEditorScreen, ExistingReportsScreen, SettingsScreen } from './components/pages';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { LogBox } from 'react-native';

import Constants from 'expo-constants';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

const Stack = createStackNavigator();
const AppRouter = () => {
  // If logged in and existing user
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CreateNewInspectionReport" component={InspectionReportEditorScreen} options={{ title: 'Create New Inspection Report' }} />
          <Stack.Screen name="ExistingReports" component={ExistingReportsScreen} options={{ title: 'Existing Reports' }} />
          <Stack.Screen name="Administration" component={AdministrationScreen} options={{ title: 'Administration' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3d3d3d',
    accent: '#4f4f4f',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppRouter />
    </PaperProvider>
  );
}
