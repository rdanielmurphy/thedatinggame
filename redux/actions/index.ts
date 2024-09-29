import firebase from 'firebase';
import { CURRENT_CARD_SWIPE_LEFT, CURRENT_CARD_SWIPE_RIGHT, USER_STATE_CHANGE } from '../constants';
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
