import { CURRENT_CARD_SWIPE_LEFT, CURRENT_CARD_SWIPE_RIGHT, CURRENT_CARD_TAP_LEFT, CURRENT_CARD_TAP_RIGHT } from '../constants';

interface IState {
    loading: boolean;
};

export interface ICard {
    name: string;
    bio: string;
    images: string[];
    result: boolean | null;
    uid: string;
};

export interface ICards {
    cards: ICard[];
    currentCard: number;
    currentImage: number;
};

export type CardState =
    ICards
    & IState;

const initialState: CardState = {
    loading: false,
    cards: [{
        name: 'Toni',
        bio: 'hello im toni i like to play',
        images: ['https://cataas.com/cat/says/1', 'https://cataas.com/cat/says/2', 'https://cataas.com/cat/says/3'],
        result: null,
        uid: '2',
    },
    {
        name: 'Steve',
        bio: 'hello im steve i like catnip',
        images: ['https://cataas.com/cat/says/4', 'https://cataas.com/cat/says/5'],
        result: null,
        uid: '2',
    },
    {
        name: 'Sam',
        bio: 'hello im sam meow',
        images: ['https://cataas.com/cat/says/6', 'https://cataas.com/cat/says/7', 'https://cataas.com/cat/says/8,', 'https://cataas.com/cat/says/9', 'https://cataas.com/cat/says/10'],
        result: null,
        uid: '3',
    },
    {
        name: 'Champ',
        bio: 'moew im hungry',
        images: ['https://cataas.com/cat/says/meow'],
        result: null,
        uid: '4',
    }],
    currentCard: 0,
    currentImage: 0,
}

export const cards = (state: any, action: any) => {
    if (state === undefined) {
        return initialState;
    }
    switch (action.type) {
        case CURRENT_CARD_TAP_RIGHT:
            if (state.cards && state.cards[state.currentCard] !== undefined) {
                const currentCard = state.cards[state.currentCard];
                if (currentCard.images.length > state.currentImage + 1) {
                    return {
                        ...state,
                        currentImage: state.currentImage + 1
                    }
                }
            }
            return state;
        case CURRENT_CARD_TAP_LEFT:
            if (state.cards && state.cards[state.currentCard] !== undefined) {
                if (state.currentImage - 1 >= 0) {
                    return {
                        ...state,
                        currentImage: state.currentImage - 1
                    }
                }
            }
            return state;
        case CURRENT_CARD_SWIPE_LEFT:
            if (state.cards && state.cards[state.currentCard] !== undefined) {
                return {
                    ...state,
                    currentCard: state.currentCard + 1,
                    currentImage: 0
                }
            }
            return state;
        case CURRENT_CARD_SWIPE_RIGHT:
            if (state.cards && state.cards[state.currentCard] !== undefined) {
                return {
                    ...state,
                    currentCard: state.currentCard + 1,
                    currentImage: 0
                }
            }
            return state;
        default:
            return state;
    }
}
