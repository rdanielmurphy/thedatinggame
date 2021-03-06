import { USER_STATE_CHANGE } from '../constants';

interface IState {
    loading: boolean,
};

export interface IUserProfle {
    created: boolean,
    name: string;
    photos: string[];
    bio: string;
    gender: number;
    matchWith: number;
    uid: string;
};

export type UserState =
    IUserProfle
    & IState;

const initialState: UserState = {
    loading: false,
    created: false,
    name: '',
    photos: [],
    bio: '',
    gender: 0,
    matchWith: 1,
    uid: '',
}

export const user = (state: UserState = initialState, action: any) => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case USER_STATE_CHANGE:
            const user: IUserProfle = action.currentUser;
            return {
                ...state,
                created: user?.created,
                name: user?.name,
                photos: user?.photos,
                bio: user?.bio,
                gender: user?.gender,
                matchWith: user?.matchWith,
                loading: action.loading,
            }
        default:
            return state;
    }
}
