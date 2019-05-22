import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {MAPS_API_KEY,InteractionTypes} from '../utils/constants'
import {getAllPosts, insertPost} from '../remote/PostAPI'
import './MapView.css'



//REDUX
import {createStore,combineReducers} from 'redux'
import {Posts,IteractionMode,PostsObject} from '../Reducers'
import {AddPost, SetPost, SwitchMode,InitializePostsCreation} from "../ActionCreators";


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
            zoom: 15
        };

        this.store = createStore(combineReducers({Posts,IteractionMode,PostsObject}))
        this.unsubscribe = this.store.subscribe(()=>{
            this.forceUpdate();
            console.log("State:",this.store.getState())
        })
    }



    async componentDidMount() {

        let res = [];

        try{
            res = await getAllPosts()
        }catch (e) {
            console.log(e)
        }

        console.log(res)
        this.store.dispatch(SetPost(res))
        
        
        //FAKE DATA FOR TESTING

        this.store.dispatch(AddPost({lat:-8.056940,lng:-34.891776}))
    }


    componentWillUnmount() {
        this.unsubscribe()
    }


    createMapConfiguration(maps){
        return 
    }


    handleMapClick(evt){
        console.log("Clicou no mapa.")
        console.log(evt)
        
        //open popup
        this.store.dispatch(InitializePostsCreation(evt))
        
        
    }

    handleMapChildClick(evt){
        console.log("Clicou em poste.")
        console.log(evt)
        
        
    }

    handleSettingsButtonClick(evt){
        this.store.dispatch(SwitchMode())
    }

    handleInputChange = inputName => evt =>{

    }
    render() {

        const {Posts,IteractionMode,PostsObject} = this.store.getState()

        const mapConfiguration ={
            panControl: true,
            draggableCursor: this.store.getState().IteractionMode ==InteractionTypes.VIEW_MODE?"default":"pointer",
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
                    onClose={this.handleClose}
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
                        onChange={e=>this.handleInputChange('identificator')}
                        fullWidth
                        />

                    
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                        Subscribe
                        </Button>
                    </DialogActions>
                    </Dialog>

                {
                    Posts ? (
                        <GoogleMapReact
                            options={()=>mapConfiguration}

                            onClick={data=>
                                IteractionMode == InteractionTypes.EDIT_MODE
                                && this.handleMapClick(data)}

                            onChildClick={data=>this.handleMapChildClick(data)}
                            bootstrapURLKeys={{key:MAPS_API_KEY}}
                            defaultCenter={this.state.center}
                            defaultZoom={this.state.zoom}
                        >

                            {
                                Posts.map(item=><PostItem lat={item.lat} lng={item.lng}/>)
                            }
                        </GoogleMapReact>): <h1>Carregando...</h1>

                }


            </div>
        );
    }
}

function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
}

const PostItem = (props) =>{

    const {lat,lng} = props

    const style ={
        item:{
            borderRadius:'50%',
            backgroundColor:'#00AC8F',
            borderWidth:'2px',
            borderColor:"#008b72",
            borderStyle:'solid',
            width:'20px',
            height:'20px'
        }
    }
    return(
        <div lat={lat} lng={lng} style={style.item}>

        </div>
    )
}


export default MapView;
