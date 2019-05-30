import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {MAPS_API_KEY,InteractionTypes, MAX_BUFFERED_POSTS} from '../utils/constants'
import {getAllPosts, insertPosts,insertPost ,getPostByBound} from '../remote/PostsAPI'
import './MapView.css'

import {isEmpty} from '../utils/ArrayHelper'

import {createStore,combineReducers} from 'redux'

import {Posts,IteractionMode,PostsObject} from '../Reducers'
import SockJsClient from 'react-stomp';

import Config from '../utils/Config'

import {
    AddPost,
    SetPost,
    SwitchMode,
    InitializePostsCreation,
    InsertDataToPost,
    ClearPostCreation,
    CreateRelation,
    AppendPosts, ConcatPosts, UpdatePost
} from "../ActionCreators";


//UTILS
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';




class MapView extends Component {
    constructor(props){
        super(props)
        this.state = {
            center: {
              lat: -8.056940,
              lng:  -34.891776
            },
            zoom: 25,
        
        };

        this.classes = props.classes

        this.store = createStore(combineReducers({Posts,PostsObject}))

        this.unsubscribe = this.store.subscribe(()=>{
            this.forceUpdate();
            console.log("State:",this.store.getState())
        })


        
    }



    async componentDidMount() {

        let res = await getAllPosts()



        console.log("Response :", res)
        this.store.dispatch(ConcatPosts(res))


       

        
    }


    componentWillUnmount() {
        this.unsubscribe()
    }


    async handleOnMapChange(evt){
        console.log(evt)

        let res =  await getPostByBound(evt.bounds) 

        this.store.dispatch(UpdatePost(res))
        console.log(res)
        
    }
    
    render() {
        const {Posts} = this.store.getState()

        

        const mapConfiguration ={
            panControl: true,
            draggableCursor: "default",
            draggingCursor: "pointer",
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl:false,
            scrollwheel: true,
        }



        return (
            <div id="map_container" style={{width: window.innerWidth,height: window.innerHeight}}>
                {/* <Button
                    variant="contained"
                    onClick={ev=> this.handleSettingsButtonClick(ev)}
                    style={{position:'absolute',top:0,right:0,zIndex:'9999',margin:'10px'}}
                    classes={{root:this.classes.rootBtn}}>
                    {IteractionMode == InteractionTypes.EDIT_MODE?"Confirmar":"Editar rede"}
                </Button> */}
                
                

                {
                    Posts ? (
                        <GoogleMapReact
                            options={()=>mapConfiguration}
                            onChange ={(e)=>this.handleOnMapChange(e)}
                            onGoogleApiLoaded={({map,maps}) => {
                                this.mapRef = map
                                this.mapsRef = maps
                            }}
                            bootstrapURLKeys={{key:MAPS_API_KEY}}
                            defaultCenter={this.state.center}
                            defaultZoom={this.state.zoom}
                        >
                            {
                                Posts.map((item,key)=><PostItem lat={item.latitude} lng={item.longitude}/>)
                            }
                        </GoogleMapReact>): <h1>Carregando...</h1>

                }


            </div>
        );
    }
}

const styles = {
    rootBtn: {
        background: 'linear-gradient(45deg, #91e842 30%, #91e842 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
        textTransform: 'capitalize',
    },
};

const PostItem = (props) =>{

    const {lat,lng} = props


    const style ={
        item:{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            borderRadius:'50%',
            backgroundColor:'#00AC8F',
            borderWidth:'1px',
            padding:0,
            borderColor:"#008b72",
            borderStyle:'solid',
            width:'10px',
            height:'10px'
        }
    }
    return(
        <div  lat={lat} lng={lng} style={style.item}>

        </div>
    )
}



export default withStyles(styles)(MapView);
