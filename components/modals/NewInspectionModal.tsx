import { Picker } from '@react-native-picker/picker';
import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Headline, Modal, Portal, Subheading, TextInput, useTheme } from 'react-native-paper';
import { useDefaultData } from '../../hooks/useDefaultData';
import { IPickerItem, StandardPicker } from '../shared/StandardPicker';

interface IProps {
    onClose: () => void
    onSubmit: () => void
}

export const NewInspectionModal = (props: IProps) => {
    const { colors } = useTheme();
    const defaultData = useDefaultData()
    const [templateList, setTemplateList] = React.useState([]);
    const [basementList, setBasementList] = React.useState([]);
    const [bathroomList, setBathroomList] = React.useState([]);
    const [bedroomList, setBedroomList] = React.useState([]);
    const [crawlSpaceList, setCrawlSpaceList] = React.useState([]);
    const [garageTypeList, setGarageTypeList] = React.useState([]);
    const [name, setName] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [template, setTemplate] = React.useState<IPickerItem>();
    const [bathroom, setBathroom] = React.useState<IPickerItem>();
    const [addlRoom, setAddlRoom] = React.useState<IPickerItem>();
    const [basement, setBasement] = React.useState<IPickerItem>();
    const [crawlSpace, setCrawlSpace] = React.useState<IPickerItem>();
    const [garageType, setGarageType] = React.useState<IPickerItem>();
    const [loading, setLoading] = React.useState<boolean>(true);

    const onClose = () => props.onClose();
    const onSubmit = () => props.onSubmit();

    const getValues = (catType: string, fieldType: string) => {
        // @ts-ignore
        return defaultData[catType]["items"].filter((i) => i["fieldType"] === fieldType).map((li) => ({
            "label": li.fieldLabel,
            "value": li.fieldValue,
        }))
    }

    useEffect(() => {
        if (defaultData) {
            // @ts-ignore
            setTemplateList([
                // @ts-ignore
                { label: "Master Checklist", value: "0" },
                // @ts-ignore
                { label: "Master Narrative", value: "1" },
                // @ts-ignore
                { label: "Master Texas", value: "2" }
            ]);
            setBasementList(getValues("defaultUserFields", "PropertyBasement"));
            setBathroomList(getValues("defaultUserFields", "PropertyBathrooms"));
            setBedroomList(getValues("defaultUserFields", "PropertyBedrooms"));
            setCrawlSpaceList(getValues("defaultUserFields", "PropertyCrawl"));
            setGarageTypeList(getValues("defaultUserFields", "PropertyGarageType"));
            setLoading(false)
        }
    }, [defaultData]);

    return (
        <Portal>
            <Modal visible={true} onDismiss={onClose} contentContainerStyle={styles.containerStyle}>
                <Headline>New Inspection</Headline>

                {!loading &&
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.formComponent}>
                            <TextInput
                                label="Name"
                                value={name}
                                onChangeText={text => setName(text)}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <TextInput
                                label="Number"
                                value={number}
                                onChangeText={text => setNumber(text)}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <TextInput
                                label="Address"
                                value={address}
                                onChangeText={text => setAddress(text)}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <StandardPicker
                                items={templateList}
                                onValueChange={(t) => setTemplate(t)}
                                label={"Template"}
                                value={template}
                            />
                        </View>

                        <Subheading>Property Information</Subheading>
                        <View style={styles.formComponent}>
                            <StandardPicker
                                items={bathroomList}
                                onValueChange={(t) => setBathroom(t)}
                                label={"Bathroom(s)"}
                                value={bathroom}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <StandardPicker
                                items={bedroomList}
                                onValueChange={(t) => setAddlRoom(t)}
                                label={"All'l Room(s)"}
                                value={addlRoom}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <StandardPicker
                                items={basementList}
                                onValueChange={(t) => setBasement(t)}
                                label={"Basement"}
                                value={basement}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <StandardPicker
                                items={crawlSpaceList}
                                onValueChange={(t) => setCrawlSpace(t)}
                                label={"Crawl Space"}
                                value={crawlSpace}
                            />
                        </View>

                        <View style={styles.formComponent}>
                            <StandardPicker
                                items={garageTypeList}
                                onValueChange={(t) => setGarageType(t)}
                                label={"Garage Type"}
                                value={garageType}
                            />
                        </View>

                        <View style={styles.buttons}>
                            <Button mode="text" onPress={onClose}>Cancel</Button>
                            <Button mode="text" onPress={onSubmit}>Done</Button>
                        </View>
                    </ScrollView>
                }
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    button: {
        margin: 10,
        width: 400,
    },
    buttons: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
    },
    formComponent: {
        padding: 10
    }
});
