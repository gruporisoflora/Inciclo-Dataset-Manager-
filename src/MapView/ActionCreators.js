import {Actions as C} from './constants'

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

export const ClearPostCreation = (_payload)=>{
    return {
        type: C.CLEAR_POST_CREATION,
        payload:_payload
    }
}

export const ConcatPosts = (_payload = [])=>{
    return {
        type: C.CONCAT_POSTS,
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

export const CreateRelation = (_payload={})=>{
    return{
        type:C.CREATE_RELATIONSHIP,
        payload:_payload
    }
}

export const AppendPosts= (_payload = {}) =>{
    return {
        type: C.APPEND_POSTS,
        payload: _payload
    }
}

export const UpdatePost= (_payload = {}) =>{
    return {
        type: C.UPDATE_POST,
        payload: _payload
    }
}