import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';

export const GenderPicker = (props: any) => {
    const [selectedGender, setSelectedGender] = useState<number>(props.defaultValue);

    return (
        <Picker
            selectedValue={selectedGender}
            onValueChange={(itemValue) => {
                props.onChange(itemValue);
                setSelectedGender(itemValue);
            }}>
            <Picker.Item label="Male" value={0} />
            <Picker.Item label="Female" value={1} />
            <Picker.Item label="Other" value={2} />
            {props.allOption && (
                <Picker.Item label="All" value={3} />
            )}
        </Picker >
    )
}
