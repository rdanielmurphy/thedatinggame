import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useDefaultData } from '../hooks/useDefaultData';
import { NewInspectionModal } from './modals/NewInspectionModal'

export const MainScreen = (navigation: any) => {
    const { colors } = useTheme();
    const [showModal, setShowMoal] = React.useState(false);
    const defaultData = useDefaultData()

    const onModalSubmit = () => {
        setShowMoal(false);
        navigation.navigation.navigate("CreateNewInspectionReport");
    }

    return (
        <>
            {defaultData === null &&
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            }
            {defaultData !== null &&
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Button style={styles.button} color={colors.accent} icon="plus" mode="contained" onPress={() => setShowMoal(true)}>
                        Create New Inspection Report
                    </Button>
                    <Button style={styles.button} icon="pencil" mode="contained" onPress={() => navigation.navigation.navigate("ExistingReports")}>
                        Existing Reports
                    </Button>
                    <Button style={styles.button} icon="information-outline" mode="contained" onPress={() => navigation.navigation.navigate("Administration")}>
                        Administration
                    </Button>
                    <Button style={styles.button} icon="tune" mode="contained" onPress={() => navigation.navigation.navigate("Settings")}>
                        Settings
                    </Button>
                    {showModal && <NewInspectionModal onClose={() => setShowMoal(false)} onSubmit={onModalSubmit} />}
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
        width: 400,
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

