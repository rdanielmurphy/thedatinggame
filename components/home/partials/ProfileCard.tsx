import React, { useEffect, useRef, useState } from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { ICard } from "../../../redux/reducers/cards";
import { Colors, Headline, List, Text } from 'react-native-paper';
import ImageTabs from "./ImageTabs";

const ProfileCard = () => {
    const cards: ICard[] = useSelector((state: any) => state.cardsState.cards);
    const currentCard: number = useSelector((state: any) => state.cardsState.currentCard);
    const currentImage: number = useSelector((state: any) => state.cardsState.currentImage);

    const currentCardObj = cards[currentCard];

    if (currentCardObj === undefined) {
        return <View style={styles.box}></View>;
    }

    return (
        <View style={styles.box}>
            <Image
                style={{
                    flex: 1,
                    resizeMode: "cover",
                    borderRadius: 20
                }}
                source={{
                    uri: currentCardObj.images[currentImage]
                }}
            />
            <View
                style={[
                    styles.list,
                    {
                        flexDirection: "row",
                    },
                ]}>
                <ImageTabs />
            </View>
            <View style={styles.bioContainer}>
            </View>
            <View style={styles.bioSubContainer}>
                <Headline style={styles.bio}>{currentCardObj.name}</Headline>
                <Text style={styles.bio}>{currentCardObj.bio}</Text>
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