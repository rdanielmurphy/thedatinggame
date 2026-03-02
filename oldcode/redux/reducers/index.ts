import { combineReducers } from 'redux';
import { cards } from './cards';
import { user } from './user';

const Reducers = combineReducers({
    userState: user,
    cardsState: cards,
});

export default Reducers;