import {Actions as C,InteractionTypes} from './utils/constants'
import {containsObject} from './utils/ArrayHelper'

export const Posts = (state = [], action)=>{

    const {type , payload} = action;

    switch (type) {

        case C.CONCAT_POSTS:


            return [...state,...payload]
        case C.UPDATE_POST:
            state[payload.key] = payload.data
            return state
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


export const PostsObject = (state = {} ,action) =>{
    const {type,payload} = action
    

    switch(type){
        case C.INITIALIZE_POSTS_CREATION:
            const {lat , lng} = payload
            return {
                ...state,
                currentAdded:{
                    latitude: lat,
                    longitude: lng,
                    conectedPosts:[]

                }
            }
        case C.INSERT_DATA_TO_POST:
            const {attribute, data} = payload

            state.currentAdded[attribute] = data
            return state

        case C.CLEAR_POST_CREATION:
            return  {...state, currentAdded:{}};





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