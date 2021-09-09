import firebase from 'firebase';
import { CURRENT_CARD_SWIPE_LEFT, CURRENT_CARD_SWIPE_RIGHT, CURRENT_CARD_TAP_LEFT, CURRENT_CARD_TAP_RIGHT, USER_STATE_CHANGE } from '../constants';
import { IUserProfle } from '../reducers/user';

export const fetchUser = (callback?: () => void) => {
    return ((dispatch: any) => {
        dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser?.uid)
            .get()
            .then((snapshot => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data(), loading: false });
                } else {
                    console.error('does not exists');
                    dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
                }
                if (callback !== undefined) {
                    callback();
                }
            }));
    });
}

export const updateUser = (userProfile: IUserProfle, callback?: () => void) => {
    return ((dispatch: any) => {
        dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser?.uid)
            .update(userProfile)
            .then(() => fetchUser(callback)(dispatch));
    });
}

export const tapLeftOnCurrentCard = () => {
    return ((dispatch: any) => {
        dispatch({ type: CURRENT_CARD_TAP_LEFT });
    });
}

export const tapRightOnCurrentCard = () => {
    return ((dispatch: any) => {
        dispatch({ type: CURRENT_CARD_TAP_RIGHT });
    });
}

export const swipeLeftOnCurrentCard = () => {
    return ((dispatch: any) => {
        dispatch({ type: CURRENT_CARD_SWIPE_LEFT });
    });
}

export const swipeRightOnCurrentCard = () => {
    return ((dispatch: any) => {
        dispatch({ type: CURRENT_CARD_SWIPE_RIGHT });
    });
}
