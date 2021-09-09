import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { ICard } from "../../../redux/reducers/cards";
import { Colors, List } from 'react-native-paper';

const ImageTabs = () => {
    const cards: ICard[] = useSelector((state: any) => state.cardsState.cards);
    const currentCard: number = useSelector((state: any) => state.cardsState.currentCard);
    const currentImage: number = useSelector((state: any) => state.cardsState.currentImage);
    const currentCardObj = cards[currentCard];

    if (currentCardObj.images.length > 1) {
        return (
            <>
                {currentCardObj.images.map((_v, i) =>
                    <View
                        style={[
                            styles.box,
                            {
                                flexBasis: 50,
                                flexGrow: 1,
                                flexShrink: 1,
                                backgroundColor: i === currentImage ? Colors.grey300 : Colors.grey500,
                            },
                        ]}
                        key={i} />)}
            </>
        );
    }

    return <View />
};

const styles = StyleSheet.create({
    dotItem: {
        margin: 0,
        padding: 0,
    },
    box: {
        flex: 1,
        height: 5,
        margin: 5,
    },
});

export default ImageTabs;