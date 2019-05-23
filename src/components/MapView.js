import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {MAPS_API_KEY,InteractionTypes} from '../utils/constants'
import {getAllPosts, insertPosts} from '../remote/PostsAPI'
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
    AppendPosts, ConcatPosts
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

        let res = [];

        try{
            res = await getAllPosts()
        }catch (e) {
            console.log(e)
        }

        console.log(res)
        this.store.dispatch(ConcatPosts(res))
        
        
        //FAKE DATA FOR TESTING




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

    handleMapChildClick(key,evt){
        const{clickedItemBuffer} = this.state


        this.setState({currentSelected: key})



        if(clickedItemBuffer.length >0){
            let firstItem = clickedItemBuffer[0]


            this.store.dispatch(
                CreateRelation({
                    item1Index:key,
                    item2Index:firstItem.id
                }
            ))

            let geodesicPolyline = new this.mapsRef.Polyline({
                path: [firstItem.coordinates,
                        evt
                ]
                // ...
            })

            geodesicPolyline.setMap(this.mapRef)

            console.log(this.state.clickedItemBuffer)

            this.setState({clickedItemBuffer: clickedItemBuffer.shift()})
        }

        this.setState({
                clickedItemBuffer:[
                    ...clickedItemBuffer,
                    {id:key, coordinates:evt}
                    ]

        })


        console.log("Clicou em poste.")
        console.log(evt)
        
        
    }

    async handleSettingsButtonClick(evt){

        const {IteractionMode,PostsObject }= this.store.getState()

        if(IteractionMode == InteractionTypes.EDIT_MODE){

            const res = await insertPosts(PostsObject.addedPosts)

            if(res.status == "OK"){
                this.store.dispatch(ConcatPosts(PostsObject.addedPosts))
            }

        }
        this.store.dispatch(SwitchMode())
    }


    handleInputChange = inputName => evt =>{
        console.log("Escreveu")
        this.store.dispatch(InsertDataToPost({attribute: inputName,data:evt.target.value}))
    };


    handleCancelPostCreation(evt){
        this.store.dispatch(ClearPostCreation())
    }

    handleSubmitPostClick(evt){
        console.log("Submetendo poste ")
        this.store.dispatch(AppendPosts(this.store.getState().PostsObject.currentAdded))
        this.store.dispatch(ClearPostCreation())
    }



    render() {


        const {Posts,IteractionMode,PostsObject} = this.store.getState()

        const {currentSelected} =  this.state

        const mapConfiguration ={
            panControl: true,
            draggableCursor: this.store.getState().IteractionMode ==InteractionTypes.VIEW_MODE?"default":"cell",
            draggingCursor: "pointer",
            mapTypeControl: true,
            scrollwheel: true
        }

        return (
            <div id="map_container">
                <Fab
                    
                    onClick={ev=> this.handleSettingsButtonClick(ev)}
                    style={{position:'absolute',top:0,right:0,zIndex:'9999',margin:'10px'}} variant="extended" >
                    {IteractionMode == InteractionTypes.EDIT_MODE?"Confirmar":"Adicionar postes"}
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
                        Cancel
                        </Button>
                        <Button onClick={this.handleSubmitPostClick} color="primary">
                        Subscribe
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
                                PostsObject.addedPosts&&(

                                    PostsObject.addedPosts.map(item=><PostItem lat={item.latitude} lng={item.longitude}/>)

                                )
                            }


                            {
                                Posts.map((item,key)=><PostItem onClick={this.handleMapChildClick}  lat={item.latitude} lng={item.longitude}/>)
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
            margin:'-11px',
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
