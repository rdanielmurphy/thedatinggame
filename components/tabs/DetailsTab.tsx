import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Section } from '../shared/Section';

export const DetailsTab = () => {
    const { colors } = useTheme();
    const layout = useWindowDimensions();

    const FirstRoute = () => (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: colors.background }} >
            <Section title={'Hey yo! 1'} />
            <Section title={'Hey yo! 2'} />
            <Section title={'Hey yo! 3'} />
            <Section title={'Hey yo! 4'} />
        </View>
    );
    
    const SecondRoute = () => (
        <View style={{ flex: 1, backgroundColor: colors.background }} />
    );

    const renderScene = SceneMap({
        general: FirstRoute,
        propertyDetails: SecondRoute,
        relatedContacts: SecondRoute,
    });

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'general', title: 'General' },
        { key: 'propertyDetails', title: 'Property Details' },
        { key: 'relatedContacts', title: 'Related Contacts' },
    ]);

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </View>
    )
}