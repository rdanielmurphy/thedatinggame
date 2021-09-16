import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from 'react-native-paper';

interface IImageTabProps {
    count: number;
    currentImage: number;
};

const ImageTabs = (props: IImageTabProps) => {
    return (
        <>
            {[...Array(props.count)].map((_x, i) =>
                <View
                    style={[
                        styles.box,
                        {
                            flexBasis: 50,
                            flexGrow: 1,
                            flexShrink: 1,
                            backgroundColor: i === props.currentImage ? Colors.grey300 : Colors.grey500,
                        },
                    ]}
                    key={i} />)}
        </>
    );
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