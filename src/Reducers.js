import {Actions as C} from './utils/constants'


export const Posts = (state = [], action)=>{

    const {type , payload} = action;

    switch (type) {
        case C.ADD_POST:
            return [...state, Post({}, action)];
        case C.SET_POSTS:
            return payload;
        default:
            return state
    }
}

const Post = (state={}, action )=>{

    const {type,payload} = action;

    switch (type) {
        case C.ADD_POST:
            return payload;
        default:
            return state;
    }

}