import {Actions as C,InteractionTypes} from './utils/constants'


export const Posts = (state = [], action)=>{

    const {type , payload} = action;

    switch (type) {
        case C.SET_POSTS:
            return payload;

            return [...state,payload]
        default:
            return state
    }
}


export const IteractionMode =(state= InteractionTypes.VIEW_MODE , action) =>{


    const{type,payload} = action

    switch (type) {
        case C.SWITCH_ITERACTION_MODE:
            return state === InteractionTypes.VIEW_MODE? 
            InteractionTypes.EDIT_MODE: InteractionTypes.VIEW_MODE

        default:
            return state
    }
}


export const PostsObject = (state = {addedPosts:[]} ,action) =>{
    const {type,payload} = action
    

    switch(type){
        case C.INITIALIZE_POSTS_CREATION:
            const {lat , lng} = payload
            return {
                ...state,
                currentAdded:{
                    latitude: lat,
                        longitude: lng
                }
            }
        case C.INSERT_DATA_TO_POST:
            const {attribute, data} = payload

            state.currentAdded[attribute] = data
            return state
        case C.APPEND_POSTS:
            return {
                ...state,
                addedPosts:[...state.addedPosts,payload]
            }
        case C.CLEAR_POST_CREATION:
            return  {...state, currentAdded:{}}
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