import { Picker } from '@react-native-picker/picker';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';

export interface IPickerItem {
    label: string,
    value: string,
}

interface IProps {
    items: IPickerItem[],
    label: string,
    value?: IPickerItem,
    onValueChange: (item: IPickerItem) => void,
}

export const StandardPicker = (props: IProps) => {
    const { colors } = useTheme();
    const [selectedItem, setSelectedItem] = React.useState(props.value);

    const onValueChange = (itemValue: IPickerItem, itemIndex: number) => {
        setSelectedItem(itemValue);
        props.onValueChange(itemValue);
    }

    return (
        <View style={styles.textContainerStyle}>
                <Text style={{ height: 50, width: 100, lineHeight: 50, }}>{props.label}</Text>
                <Picker
                    selectedValue={selectedItem}
                    style={{ height: 50, width: 400 }}
                    onValueChange={onValueChange}>
                        {props.items.map((item: IPickerItem) => <Picker.Item key={item.label} label={item.label} value={item.value} />)}
                </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    textContainerStyle: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
    }
});
