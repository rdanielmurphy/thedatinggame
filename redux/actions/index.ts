import firebase from 'firebase';
import { USER_STATE_CHANGE } from '../constants';

export const fetchUser = () => {
    return ((dispatch: any) => {
        dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser?.uid)
            .get()
            .then((snapshot => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data(), loading: false })
                } else {
                    console.error('does not exists');
                    dispatch({ type: USER_STATE_CHANGE, currentUser: {}, loading: true });
                }
            }));
    });
}
