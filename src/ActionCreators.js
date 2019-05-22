import {Actions as C} from './utils/constants'

export const AddPost= (_payload = {}) =>{
    return {
        type: C.ADD_POST,
        payload: _payload
    }
}



export const InitializePostsCreation = (_payload)=>{


    return {
        type: C.INITIALIZE_POSTS_CREATION,
        payload:_payload
    }

}

export const InsertDataToPost = (_payload)=>{
    return {
        type: C.INSERT_DATA_TO_POST,
        payload:_payload
    }
}
export const SwitchMode = ()=>{
    return{
        type: C.SWITCH_ITERACTION_MODE
    }
}

export const SetPost= (_payload = []) =>{
    return {
        type: C.SET_POSTS,
        payload: _payload
    }
}