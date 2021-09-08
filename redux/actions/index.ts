import firebase from 'firebase';
import { USER_STATE_CHANGE } from '../constants';
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
    console.log('callback1', callback);
    return ((dispatch: any) => {
        dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser?.uid)
            .update(userProfile)
            .then(() => fetchUser(callback)(dispatch));
    });
}
