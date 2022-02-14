import React, { useState } from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    DetailsTab,
    DiningRoomTab,
    ElectricCoolingSystemTab,
    ExteriorTab,
    GroundsTab,
    HeatingSystemTab,
    InteriorTab,
    InvoiceTab,
    KitchenTab,
    LaundryRoomTab,
    LivingRoomTab,
    OverviewTab,
    PhotosTab,
    PlumbingTab,
    RoofTab,
    SummaryTab,
} from '../tabs';

interface IListItem {
    label: string,
    component: any,
    componentRoute: string,
}

export const InspectionReportEditorScreen = (navigation: any) => {
    const [date, setDate] = useState<Date>(new Date(946706400000));
    const [name, setName] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const Stack = createStackNavigator();

    const items: IListItem[] = [
        { label: "Details", componentRoute: "Details", component: DetailsTab },
        { label: "Invoice", componentRoute: "Invoice", component: InvoiceTab },
        { label: "Photos", componentRoute: "Photos", component: PhotosTab },
        { label: "Summary", componentRoute: "Summary", component: SummaryTab },
        { label: "Overview", componentRoute: "Overview", component: OverviewTab },
        { label: "Grounds", componentRoute: "Grounds", component: GroundsTab },
        { label: "Roof", componentRoute: "Roof", component: RoofTab },
        { label: "Exterior", componentRoute: "Exterior", component: ExteriorTab },
        { label: "Kitchen", componentRoute: "Kitchen", component: KitchenTab },
        { label: "Laundry Room", componentRoute: "LaundryRoom", component: LaundryRoomTab },
        { label: "Interior", componentRoute: "Interior", component: InteriorTab },
        { label: "Plumbing", componentRoute: "Plumbing", component: PlumbingTab },
        { label: "Heating System", componentRoute: "Heating System", component: HeatingSystemTab },
        { label: "Electric/Cooling System", componentRoute: "ElectricCoolingSystem", component: ElectricCoolingSystemTab },
        { label: "Living Room", componentRoute: "LivingRoom", component: LivingRoomTab },
        { label: "Dining Room", componentRoute: "DiningRoom", component: DiningRoomTab },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.left}>
                <FlatList
                    data={items}
                    renderItem={({ item }) => (
                        <TouchableOpacity key={item.label} onPress={() => navigation.navigation.navigate(item.componentRoute)}>
                            <View key={item.label} style={styles.item}>
                                <Text style={styles.title}>{item.label}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.label}
                />
            </View>
            <Stack.Navigator initialRouteName="Details">
                {items.map((item) =>
                    <Stack.Screen key={item.label} name={item.componentRoute} component={item.component} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    left: {
        minWidth: '500px',
        maxWidth: '700px',
    },
    title: {
        fontSize: 32,
    },
});
