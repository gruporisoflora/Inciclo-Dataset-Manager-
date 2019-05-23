import {Actions as C,InteractionTypes} from './utils/constants'
import {containsObject} from './utils/ArrayHelper'

export const Posts = (state = [], action)=>{

    const {type , payload} = action;

    switch (type) {

        case C.CONCAT_POSTS:


            return [...state,...payload]
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
                    longitude: lng,
                    conectedPosts:[]
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
            return  {...state, currentAdded:{}};

        case C.CREATE_RELATIONSHIP:
            const {item1Index,item2Index} = payload

            console.log(item1Index)
            console.log(item2Index)

            let item1 = state.addedPosts[item1Index]
            let item2 = state.addedPosts[item2Index]

            if(containsObject(item2, item1.conectedPosts))return state


            item1.conectedPosts.push(item2)
            item2.conectedPosts.push({...item1,conectedPosts:[] })

            state.addedPosts[item1Index] = item1
            state.addedPosts[item2Index] = item2
            return state



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