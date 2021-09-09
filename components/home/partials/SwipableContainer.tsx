import React, { useRef, useState } from "react";
import { Animated, Image, View, StyleSheet, PanResponder, Text, Dimensions } from "react-native";
import { Colors, FAB } from 'react-native-paper';
import ProfileCard from "./ProfileCard";
import { useDispatch } from 'react-redux';
import { swipeLeftOnCurrentCard, swipeRightOnCurrentCard, tapLeftOnCurrentCard, tapRightOnCurrentCard } from '../../../redux/actions';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const SwipeableContainer = () => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [position, setPosition] = useState<Animated.ValueXY>(new Animated.ValueXY());
    const [nopeOpacity, setNopeOpacity] = useState<any>(0);
    const [likeOpacity, setLikeOpacity] = useState<any>(0);
    const dispatch = useDispatch();

    let touchTime = 0;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_evt, gestureState) => {
                if (touchTime === 0) {
                    touchTime = new Date().getTime();
                }

                return true;
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value,
                });
            },
            onPanResponderMove: (_evt, gestureState) => {
                const newPos = new Animated.ValueXY({ x: gestureState.dx, y: gestureState.dy });
                setPosition(newPos);

                setLikeOpacity(newPos.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [0, 0, 1],
                    extrapolate: 'clamp'
                }));
                setNopeOpacity(newPos.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [1, 0, 0],
                    extrapolate: 'clamp'
                }));

                Animated.event(
                    [
                        null,
                        { dx: pan.x, dy: pan.y }
                    ],
                    { useNativeDriver: false }
                )(_evt, gestureState);
            },
            onPanResponderRelease: (_evt, gestureState) => {
                if (gestureState.dx > 120) {
                    Animated.spring(position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                        useNativeDriver: false,
                    }).start(() => {
                        swipeRightOnCurrentCard()(dispatch);
                        const newPos = new Animated.ValueXY({ x: 0, y: 0 });
                        setPosition(newPos);
                        setLikeOpacity(0);
                        setNopeOpacity(0);
                    })
                } else if (gestureState.dx < -120) {
                    Animated.spring(position, {
                        toValue: { x: -SCREEN_WIDTH - 1000, y: gestureState.dy },
                        useNativeDriver: false,
                    }).start(() => {
                        swipeLeftOnCurrentCard()(dispatch);
                        const newPos = new Animated.ValueXY({ x: 0, y: 0 });
                        setPosition(newPos);
                        setLikeOpacity(0);
                        setNopeOpacity(0);
                    })
                } else {
                    console.log('neither');
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: false,
                    }).start(() => {
                        const newPos = new Animated.ValueXY({ x: 0, y: 0 });
                        setPosition(newPos);
                        setLikeOpacity(0);
                        setNopeOpacity(0);
                    })
                }

                const time = new Date().getTime();
                if (time - touchTime < 225 && Math.abs(gestureState.dx) < 1 && Math.abs(gestureState.dy) < 1) {
                    if (gestureState.x0 > SCREEN_WIDTH / 2) {
                        tapRightOnCurrentCard()(dispatch);
                    } else {
                        tapLeftOnCurrentCard()(dispatch);
                    }
                }
                touchTime = 0;

                pan.flattenOffset();
            }
        })
    ).current;

    return (
        <View style={styles.container}>
            <Animated.View
                {...panResponder.panHandlers}
                key="asd"
                style={
                    [{ transform: position.getTranslateTransform() },
                    {
                        height: SCREEN_HEIGHT - 120,
                        width: SCREEN_WIDTH,
                        padding: 10,
                        position: 'absolute'
                    }]
                }>
                <Animated.View
                    style={{
                        opacity: likeOpacity,
                        transform: [{ rotate: "-30deg" }],
                        position: "absolute",
                        top: 50,
                        left: 40,
                        zIndex: 1000
                    }}>
                    <Text
                        style={{
                            borderWidth: 3,
                            borderColor: Colors.green500,
                            color: Colors.green500,
                            fontSize: 32,
                            fontWeight: "900",
                            padding: 10
                        }}>
                        LIKE
                    </Text>
                </Animated.View>
                <Animated.View
                    style={{
                        opacity: nopeOpacity,
                        transform: [{ rotate: "30deg" }],
                        position: "absolute",
                        top: 50,
                        right: 40,
                        zIndex: 1000
                    }}>
                    <Text
                        style={{
                            borderWidth: 3,
                            borderColor: Colors.red500,
                            color: Colors.red500,
                            fontSize: 32,
                            fontWeight: "900",
                            padding: 10
                        }}>
                        NOPE
                    </Text>
                </Animated.View>
                <ProfileCard />
            </Animated.View>
            <View
                style={[
                    styles.bottomNav,
                    {
                        flexDirection: "row",
                        alignContent: "space-around",
                    },
                ]}>
                <FAB style={styles.nopeFAB} onPress={() => swipeLeftOnCurrentCard()(dispatch)} icon="close" color={Colors.white} />
                <FAB style={styles.likeFAB} onPress={() => swipeRightOnCurrentCard()(dispatch)} icon="check" color={Colors.white} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 8,
    },
    box: {
        flex: 1,
        borderRadius: 5
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    likeFAB: {
        backgroundColor: Colors.green500,
        marginLeft: 20
    },
    nopeFAB: {
        backgroundColor: Colors.red500,
        marginRight: 20
    },
});

export default SwipeableContainer;