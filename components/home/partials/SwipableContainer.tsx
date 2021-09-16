import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, View, StyleSheet, PanResponder, Text, Dimensions } from "react-native";
import { Colors, FAB } from 'react-native-paper';
import ProfileCard from "./ProfileCard";
import { useDispatch, useSelector } from 'react-redux';
import { swipeLeftOnCurrentCard, swipeRightOnCurrentCard } from '../../../redux/actions';
import { ICard, ICards } from "../../../redux/reducers/cards";

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const SwipeableContainer = () => {
    const pan = useRef(new Animated.ValueXY()).current;
    const position = useRef(new Animated.ValueXY());
    const [nopeOpacity, setNopeOpacity] = useState<any>(0);
    const [likeOpacity, setLikeOpacity] = useState<any>(0);
    const [currentCard, setCurrentCard] = useState<ICard | null>(null);
    const [currentImage, setCurrentImage] = useState<number>(0);
    const cards: ICards = useSelector((state: any) => state.cardsState);
    const dispatch = useDispatch();
    const [cardQueue, setCardQueue] = useState<ICard[]>([]);

    // const ccc = 1;
    useEffect(() => {
        const cardsArray = cards.cards.reverse().slice(0);
        setCardQueue(cardsArray);
        setCurrentCard(cardsArray[0]);
        console.log('queueset');
    }, [cards.updateCounter]);

    const swipeRight = (y: number) => {
        Animated.spring(position.current, {
            toValue: { x: SCREEN_WIDTH + 100, y: y },
            useNativeDriver: false,
        }).start(() => {
            swipeRightOnCurrentCard(currentCard ? currentCard.uid : '')(dispatch);
            setLikeOpacity(new Animated.Value(0));
            setNopeOpacity(new Animated.Value(0));
            setCurrentImage(0);

            const newCardsArray = cardQueue.slice(1);
            setCardQueue(newCardsArray);
            setCurrentCard(newCardsArray[0]);
            console.log('newCardsArray[0]', newCardsArray[0]);
            Animated.spring(position.current, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
            }).start();
        });
    };

    const swipeLeft = (y: number) => {
        Animated.spring(position.current, {
            toValue: { x: -SCREEN_WIDTH - 1000, y: y },
            useNativeDriver: false,
        }).start(() => {
            console.log('swipeLeft currentCard', currentCard);
            swipeLeftOnCurrentCard(currentCard ? currentCard.uid : '')(dispatch);
            setLikeOpacity(new Animated.Value(0));
            setNopeOpacity(new Animated.Value(0));
            setCurrentImage(0);

            const newCardsArray = cardQueue.slice(1);
            setCardQueue(newCardsArray);
            setCurrentCard(newCardsArray[0]);
            console.log('newCardsArray[0]', newCardsArray[0]);
            Animated.spring(position.current, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
            }).start();
        });
    };

    const tapRightOnCurrentCard = useCallback(() => {
        console.log('tapRightOnCurrentCard');
        console.log('currentCard', currentCard);
        console.log('currentCard', currentImage);
        console.log('currentCard', currentCard?.images[currentImage + 1]);
        if (currentCard !== null && currentCard.images[currentImage + 1] !== undefined) {
            console.log('setCurrentImage');
            setCurrentImage(currentImage + 1);
        }
    }, [currentImage]);

    const tapLeftOnCurrentCard = () => {
        console.log('tapLeftOnCurrentCard');
        if (currentImage !== 0) {
            console.log('tapLeftOnCurrentCard');
            setCurrentImage(currentImage - 1);
        }
    };

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
                position.current = new Animated.ValueXY({ x: gestureState.dx, y: gestureState.dy });

                setLikeOpacity(position.current.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [0, 0, 1],
                    extrapolate: 'clamp'
                }));
                setNopeOpacity(position.current.x.interpolate({
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
                    swipeRight(gestureState.dy);
                } else if (gestureState.dx < -120) {
                    swipeLeft(gestureState.dy);
                } else {
                    Animated.spring(position.current, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: false,
                    }).start(() => {
                        position.current = new Animated.ValueXY({ x: 0, y: 0 });
                        setLikeOpacity(0);
                        setNopeOpacity(0);
                    })
                }
                console.log('onPanResponderRelease', currentCard);

                const time = new Date().getTime();
                if (time - touchTime < 225 && Math.abs(gestureState.dx) < 1 && Math.abs(gestureState.dy) < 1) {
                    if (gestureState.x0 > SCREEN_WIDTH / 2) {
                        tapRightOnCurrentCard();
                    } else {
                        tapLeftOnCurrentCard();
                    }
                }
                touchTime = 0;

                pan.flattenOffset();
            }
        })
    ).current;

    console.log('currentCard', currentCard);
    return (
        <View style={styles.container}>
            {cardQueue.map((c: ICard, i: number) => {
                if (currentCard !== null && c.uid === currentCard.uid) {
                    return (
                        <Animated.View
                            {...panResponder.panHandlers}
                            key={`card${c.uid}`}
                            style={
                                [{ transform: position.current.getTranslateTransform() },
                                {
                                    height: SCREEN_HEIGHT - 120,
                                    width: SCREEN_WIDTH,
                                    padding: 10,
                                    position: 'absolute',
                                    zIndex: 9999,
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
                            <ProfileCard card={c} currentImage={currentImage} />
                        </Animated.View>
                    );
                }
                return (
                    <Animated.View
                        key={`card${c.uid}`}
                        style={
                            [{
                                height: SCREEN_HEIGHT - 120,
                                width: SCREEN_WIDTH,
                                padding: 10,
                                position: 'absolute',
                                zIndex: i,
                            }]
                        }>
                        <ProfileCard card={c} currentImage={0} />
                    </Animated.View>
                )
            })}
            <View
                style={[
                    styles.bottomNav,
                    {
                        flexDirection: "row",
                        alignContent: "space-around",
                    },
                ]}>
                <FAB style={styles.nopeFAB} onPress={() => swipeLeft(0)} icon="close" color={Colors.white} />
                <FAB style={styles.likeFAB} onPress={() => swipeRight(0)} icon="check" color={Colors.white} />
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