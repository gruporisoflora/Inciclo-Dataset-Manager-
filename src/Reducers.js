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

export const Mode =(state= "" , action) =>{

    const{type,payload} = action

    switch (type) {
        case C.SWITCH_MODE:
            console.log("Trocou")
            return payload

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