import {Actions as C} from './utils/constants'

export const AddPost= (_payload = {}) =>{
    return {
        type: C.ADD_POST,
        payload: _payload
    }
}


export const SwitchMode = (_payload="")=>{
    return{
        type: C.SWITCH_MODE,
        payload: _payload
    }
}

export const SetPost= (_payload = []) =>{
    return {
        type: C.SET_POSTS,
        payload: _payload
    }
}