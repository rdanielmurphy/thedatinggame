import React, { useState } from 'react'
import { StyleSheet, Text, Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import { GenderPicker } from './partials/GenderPicker';
import firebase from 'firebase';
import { Button, TextInput } from 'react-native-paper';

export const CreateProfileScreen = (props: any) => {
    const [date, setDate] = useState<Date>(new Date(946706400000));
    const [gender, setGender] = useState<string>('0');
    const [matchWith, setMatchWith] = useState<string>('1');
    const [name, setName] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (_event: any, selectedDate: any) => {
        if (selectedDate !== null && selectedDate !== undefined) {
            const currentDate = selectedDate;
            setDate(currentDate);
        }
        setShowDatePicker(Platform.OS === 'ios');
    };
    const submitForm = () => {
        const uid = firebase.auth().currentUser?.uid;
        if (uid) {
            firebase.firestore().collection("users").doc(uid).update({
                name,
                gender: parseInt(gender),
                matchWith: parseInt(matchWith),
                created: true,
            }).then(() => {
                props.submitted();
            }).catch((e) => {
                console.error(e);
            });
        } else {
            console.error('could not create');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.container}>
                <Text>Welcome to the dating game!  Let's create you a profile!</Text>
                <TextInput
                    label="Name"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setName(text)}
                    value={name}
                />
            </View>
            <View style={styles.container}>
                <Text>Enter your date of birth: {date && date.toLocaleDateString("en-US")}</Text>
                <Button icon="calendar" mode="contained" onPress={() => setShowDatePicker(true)}>Open Date Picker</Button>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>
            <View style={styles.container}>
                <Text>Gender:</Text>
                <GenderPicker defaultValue={gender} onChange={(g: string) => setGender(g)} />
            </View>
            <View style={styles.container}>
                <Text>Interested in:</Text>
                <GenderPicker allOption={true} defaultValue={matchWith} onChange={(g: string) => setMatchWith(g)} />
            </View>
            <Button
                style={styles.container}
                mode="contained"
                disabled={name.length < 1 || date === null || date === undefined || gender === null || gender === undefined || matchWith === null || matchWith === undefined}
                onPress={() => submitForm()}
            >Submit</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});