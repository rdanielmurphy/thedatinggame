import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { ICard } from "../../../redux/reducers/cards";
import { Colors, Headline, Text } from 'react-native-paper';
import ImageTabs from "./ImageTabs";

interface IProfileCardProps {
    card: ICard;
    currentImage: number;
};

const ProfileCard = (props: IProfileCardProps) => {
    if (props.card === undefined) {
        return <View style={styles.box}>Ran out of macthes!</View>;
    }

    console.log('props.currentImage', props.currentImage);
    return (
        <View style={styles.box}>
            <Image
                style={{
                    flex: 1,
                    resizeMode: "cover",
                    borderRadius: 20
                }}
                source={{
                    uri: props.card.images[props.currentImage]
                }}
            />
            <View
                style={[
                    styles.list,
                    {
                        flexDirection: "row",
                    },
                ]}>
                {props.card.images.length > 1 && <ImageTabs count={props.card.images.length} currentImage={props.currentImage} />}
            </View>
            <View style={styles.bioContainer}>
            </View>
            <View style={styles.bioSubContainer}>
                <Headline style={styles.bio}>{props.card.name}</Headline>
                <Text style={styles.bio}>{props.card.bio}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bio: {
        color: Colors.white,
    },
    bioContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: Colors.black,
        opacity: .25,
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
    },
    bioSubContainer: {
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    box: {
        flex: 1,
        borderRadius: 5
    },
    list: {
        position: "absolute",
    },
});

export default ProfileCard;