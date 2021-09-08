import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, Button, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GenderPicker } from './partials/GenderPicker';
import firebase from 'firebase';
import { DraggableGrid } from 'react-native-draggable-grid';
import * as ImagePicker from 'expo-image-picker';
import { UserState } from '../../redux/reducers/user';
import { updateUser } from '../../redux/actions';

const makeid = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

interface IPhoto {
    key: string,
    name: string,
}

export const EditProfileScreen = (navigation: any) => {
    const loading: boolean = useSelector((state: any) => state.userState.loading);
    const user: UserState = useSelector((state: any) => state.userState);
    const [name, setName] = useState<string>(user.name);
    const [bio, setBio] = useState<string>(user.bio ? user.bio : '');
    const [matchWith, setMatchWith] = useState<number>(user.matchWith);
    const blankprofileURL = 'https://firebasestorage.googleapis.com/v0/b/thedatinggame-7c569.appspot.com/o/blank-profile-picture.png?alt=media&token=27e87d24-7be7-4a06-9e05-b3b76b1f5a7c';
    const [photos, setPhotos] = useState<IPhoto[]>([]);
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalKey, setModalKey] = useState<string>('');

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    useEffect(() => {
        let newPhotos: IPhoto[] = [];
        if (user && user.photos) {
            user.photos.forEach((p, i) => newPhotos.push({
                key: i.toString(),
                name: p,
            }));
        }
        for (let i = newPhotos.length; i < 6; i++) {
            newPhotos.push({
                key: i.toString(),
                name: blankprofileURL
            });
        }
        setPhotos(newPhotos);
    }, [loading])

    const renderItem = (item: { name: string, key: string }) => {
        return (
            <View key={item.key} style={styles.item}>
                <Image
                    style={styles.logo}
                    source={{ uri: item.name }}
                />
            </View>
        );
    }

    const deleteImage = (key: string) => {
        const index = photos.findIndex((p) => p.key === key);
        const newPhotos = photos.slice();
        newPhotos[index] = { key, name: blankprofileURL };
        setPhotos(newPhotos);
    };

    const pickImage = async (key: string) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 5],
            quality: 1,
        });

        if (!result.cancelled) {
            const response = await fetch(result.uri);
            const blob = await response.blob();
            const ref = firebase
                .storage()
                .ref(`profilepic-${makeid(8)}`);
            ref.put(blob)
                .then(async () => {
                    const downloadURL = await ref.getDownloadURL();
                    const index = photos.findIndex((p) => p.key === key);
                    const newPhotos = photos.slice();
                    newPhotos[index] = { key, name: downloadURL };
                    setPhotos(newPhotos);
                })
                .catch((e: any) => console.log('uploading image error => ', e));
        }
    };

    // TODO loading if fetching profile
    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const submitForm = () => {
        const firebaseUser = firebase.auth().currentUser;
        if (firebaseUser && firebaseUser.uid) {
            const newPhotos = photos.filter((p: IPhoto) => {
                if (p.name !== blankprofileURL) {
                    return p;
                }
            }).map((p: IPhoto) => p.name);
            const data = {
                created: true,
                name: name,
                photos: newPhotos,
                bio: bio,
                gender: user.gender,
                matchWith: matchWith,
                uid: firebaseUser.uid,
            }
            updateUser(data, () => navigation.navigation.navigate("Main"))(dispatch);
        } else {
            console.error('could not update');
        }
    };

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>Name:</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setName(text)}
                    value={name}
                />
                <Text>Bio:</Text>
                <TextInput
                    value={bio}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setBio(text)}
                    maxLength={300} />
                <Text>Interested in:</Text>
                <GenderPicker allOption={true} defaultValue={matchWith} onChange={(g: number) => setMatchWith(g)} />
                <DraggableGrid
                    numColumns={3}
                    renderItem={renderItem}
                    data={photos}
                    onDragRelease={(data) => {
                        setPhotos(data);// need reset the props data sort after drag release
                    }}
                    onItemPress={(item) => {
                        const index = photos.findIndex((p) => p.key === item.key);
                        if (photos[index].name === blankprofileURL) {
                            pickImage(item.key);
                        } else {
                            setModalKey(item.key);
                            setModalVisible(true);
                        }
                    }}
                />
                <Button
                    disabled={name.length < 1 || matchWith === null || matchWith === undefined}
                    onPress={() => submitForm()}
                    title="Submit"
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Edit Image</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    pickImage(modalKey);
                                }}>
                                <Text style={styles.textStyle}>Replace Image</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    deleteImage(modalKey);
                                }}>
                                <Text style={styles.textStyle}>Delete Image</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "blue",
        width: 25,
        height: 25,
        zIndex: 9999
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
    wrapper: {
        paddingTop: 100,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    item: {
        width: 125,
        height: 125,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 125,
        height: 125,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 100,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 10,
    }
});
