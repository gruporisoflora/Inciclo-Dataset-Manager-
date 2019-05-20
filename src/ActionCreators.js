import {Actions as C} from './utils/constants'

export const AddPost= (_payload = {}) =>{
    return {
        type: C.ADD_POST,
        payload: _payload
    }
}

export const SetPost= (_payload = []) =>{
    return {
        type: C.ADD_POST,
        payload: _payload
    }
}