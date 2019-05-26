import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {MAPS_API_KEY,InteractionTypes} from '../utils/constants'
import {getAllPosts, insertPosts,insertPost} from '../remote/PostsAPI'
import './MapView.css'

import {isEmpty} from '../utils/ArrayHelper'

import {createStore,combineReducers} from 'redux'

import {Posts,IteractionMode,PostsObject} from '../Reducers'

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




class MapView extends Component {
    constructor(props){
        super(props)
        this.state = {
            center: {
              lat: -8.056940,
              lng:  -34.891776
            },
            zoom: 15,
            clickedItemBuffer:[],
            currentSelected:undefined
        };


        this.store = createStore(combineReducers({Posts,IteractionMode,PostsObject}))

        this.unsubscribe = this.store.subscribe(()=>{
            this.forceUpdate();
            console.log("State:",this.store.getState())
        })


        this.handleCancelPostCreation = this.handleCancelPostCreation.bind(this)
        this.handleSubmitPostClick = this.handleSubmitPostClick.bind(this)
    }



    async componentDidMount() {

        let res = await getAllPosts()



        console.log("Response :", res)
        this.store.dispatch(ConcatPosts(res))


        //draw relationship lines

        this.store.getState().Posts.map(post =>{

            post.conectedPosts.map(conPost=>{
                this.drawLine(
                    {lat:post.latitude,lng:post.longitude},
                    {lat:conPost.latitude,lng:conPost.longitude}
                )
            })
        })
    }


    componentWillUnmount() {
        this.unsubscribe()
    }



    handleMapClick(evt){
        console.log("Clicou no mapa.")
        console.log(evt)
        
        //open popup
        this.store.dispatch(InitializePostsCreation(evt))




        
    }

    drawLine(item1,item2){
        let geodesicPolyline = new this.mapsRef.Polyline({
            path: [item1,
                item2
            ]
            // ...
        })

        geodesicPolyline.setMap(this.mapRef)
    }

    async handleMapChildClick(key,evt){

        console.log(this.state)
        if(this.store.getState().IteractionMode == InteractionTypes.VIEW_MODE) return

        const{clickedItemBuffer} = this.state

        const {Posts} = this.store.getState()
        this.setState({currentSelected: key})



        if(clickedItemBuffer.length >0){



            let firstClickedItem = clickedItemBuffer[0]

            if(firstClickedItem.key === key) return

            let item1 = Posts[firstClickedItem.key]
            let item2 = Posts[key]



            item1.conectedPosts.push({...item2,conectedPosts:[] })


            this.drawLine(evt, firstClickedItem.coordinates)

            let res = await insertPost(item1)

            if(res.status === "OK"){
                this.store.dispatch(UpdatePost({key:firstClickedItem.key,data:res.data}))
            }


            console.log(this.state.clickedItemBuffer)

            this.setState({clickedItemBuffer: []})
        }else{
            this.setState({
                clickedItemBuffer:[
                    ...clickedItemBuffer,
                    {key:key, coordinates:evt}
                ]

            })
        }




        console.log("Clicou em poste.")
        console.log(evt)
        
        
    }

    async handleSettingsButtonClick(evt){


        this.store.dispatch(SwitchMode())
    }


    handleInputChange = inputName => evt =>{
        console.log("Escreveu")
        this.store.dispatch(InsertDataToPost({attribute: inputName,data:evt.target.value}))
    };


    handleCancelPostCreation(evt){
        this.store.dispatch(ClearPostCreation())
    }

    async handleSubmitPostClick(evt){
        console.log("Submetendo poste ")

        let res = await insertPost(this.store.getState().PostsObject.currentAdded)
        console.log(res)
        this.store.dispatch(ConcatPosts([res.data]))
        this.store.dispatch(ClearPostCreation())

    }



    render() {


        const {Posts,IteractionMode,PostsObject} = this.store.getState()

        const {currentSelected} =  this.state

        const mapConfiguration ={
            panControl: true,
            draggableCursor: this.store.getState().IteractionMode ==InteractionTypes.VIEW_MODE?"default":"cell",
            draggingCursor: "pointer",
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl:false,
            scrollwheel: true,
        }

        return (
            <div id="map_container" style={{width: window.innerWidth,height: window.innerHeight}}>
                <Fab
                    
                    onClick={ev=> this.handleSettingsButtonClick(ev)}
                    style={{position:'absolute',top:0,right:0,zIndex:'9999',margin:'10px'}} variant="extended" >
                    {IteractionMode == InteractionTypes.EDIT_MODE?"Confirmar":"Editar rede"}
                </Fab>

                <Dialog
                    open={!isEmpty(PostsObject.currentAdded)}
                    onClose={this.handleCancelPostCreation}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title">Adicionar poste</DialogTitle>
                    <DialogContent>
                        
                        <TextField
                        autoFocus
                        margin="dense"
                        id="id"
                        label="Identificador"
                        type="number"
                        onChange={this.handleInputChange('identificator')}
                        fullWidth
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="TreeQtd"
                            label="Quantidade de arvores"
                            type="number"
                            onChange={this.handleInputChange('treeQtd')}
                            fullWidth
                        />



                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancelPostCreation} color="primary">
                        Cancelar
                        </Button>
                        <Button onClick={this.handleSubmitPostClick} color="primary">
                        Adicionar
                        </Button>
                    </DialogActions>
                    </Dialog>

                {
                    Posts ? (
                        <GoogleMapReact
                            options={()=>mapConfiguration}

                            onClick={data=> IteractionMode === InteractionTypes.EDIT_MODE && this.handleMapClick(data)}
                            onGoogleApiLoaded={({map,maps}) => {
                                this.mapRef = map
                                this.mapsRef = maps
                            }}
                            onChildClick={(key,obj)=>this.handleMapChildClick(key,obj)}
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



const PostItem = (props) =>{

    const {lat,lng} = props


    const style ={
        item:{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            borderRadius:'50%',
            backgroundColor:'#00AC8F',
            borderWidth:'2px',
            padding:0,
            borderColor:"#008b72",
            borderStyle:'solid',
            width:'20px',
            height:'20px'
        }
    }
    return(
        <div  lat={lat} lng={lng} style={style.item}>

        </div>
    )
}



export default MapView;
