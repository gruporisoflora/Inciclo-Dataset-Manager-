import Config from '../utils/Config'
import axios from 'axios'


const {API_URL} = Config;
const URI = "http://"+API_URL+"/posts";


export const  getAllPosts = async ()=>{
    let res = await axios.get(URI);
    console.log("passu")

    return res.data.data
};

export const insertPost = (post)=>{
     axios.post(URI)
};


