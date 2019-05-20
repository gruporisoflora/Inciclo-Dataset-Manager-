import Config from '../utils/Config'
import axios from 'axios'


const {API_URL} = Config
const URI = "http://"+API_URL


export const getAllPosts = ()=>{
    return axios.get(URI+"/posts")
}

export const insertPost = (post)=>{
    return axios.post(URI +"/posts")
}


