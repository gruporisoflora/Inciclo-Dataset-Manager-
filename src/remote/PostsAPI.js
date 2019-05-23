import Config from '../utils/Config'
import axios from 'axios'
import JSON from 'circular-json'


const {API_URL} = Config;
const URI = "http://"+API_URL+"/posts";


export const  getAllPosts = async ()=>{
    let res = await axios.get(URI);


    return res.data.data
};

export const insertPosts = async (posts)=>{
    console.log("se comunicando com o server...")
    const res = await  axios(
        {
            url:URI,
            method:'put',
            data:posts
        }

    )
    return res.data
};




export const insertPost = async (post)=>{
    const res = await  axios(
        {
            url:URI,
            method:'post',
            data:post
        }

    )
    return res.data
}


