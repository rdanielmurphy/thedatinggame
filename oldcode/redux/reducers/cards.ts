import { CURRENT_CARD_SWIPE_LEFT, CURRENT_CARD_SWIPE_RIGHT } from '../constants';

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
    updateCounter: number;
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
        uid: '3',
    },
    {
        name: 'Sam',
        bio: 'hello im sam meow',
        images: ['https://cataas.com/cat/says/6', 'https://cataas.com/cat/says/7', 'https://cataas.com/cat/says/8,', 'https://cataas.com/cat/says/9', 'https://cataas.com/cat/says/10'],
        result: null,
        uid: '4',
    },
    {
        name: 'Champ',
        bio: 'moew im hungry',
        images: ['https://cataas.com/cat/says/meow'],
        result: null,
        uid: '5',
    }],
    updateCounter: 1,
}

export const cards = (state: any, action: any) => {
    if (state === undefined) {
        return initialState;
    }

    const uid = action.uid;
    switch (action.type) {
        case CURRENT_CARD_SWIPE_LEFT:
            if (state.cards && state.cards[state.currentCard] !== undefined) {
                // TODO: do BE call 
                return {
                    ...state,
                }
            }
            return state;
        case CURRENT_CARD_SWIPE_RIGHT:
            if (state.cards && state.cards[state.currentCard] !== undefined) {
                // TODO: do BE call 
                return {
                    ...state,
                }
            }
            return state;
        default:
            return state;
    }
}
