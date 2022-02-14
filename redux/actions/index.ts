import { CURRENT_CARD_SWIPE_LEFT, CURRENT_CARD_SWIPE_RIGHT, USER_STATE_CHANGE } from '../constants';
import { IUserProfle } from '../reducers/user';

export const fetchUser = (callback?: () => void) => {
    return ((dispatch: any) => {
        dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
    });
}

export const updateUser = (userProfile: IUserProfle, callback?: () => void) => {
    return ((dispatch: any) => {
        dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
    });
}

export const swipeLeftOnCurrentCard = (cardUid: string) => {
    return ((dispatch: any) => {
        dispatch({ uid: cardUid, type: CURRENT_CARD_SWIPE_LEFT });
    });
}

export const swipeRightOnCurrentCard = (cardUid: string) => {
    return ((dispatch: any) => {
        dispatch({ uid: cardUid, type: CURRENT_CARD_SWIPE_RIGHT });
    });
}
