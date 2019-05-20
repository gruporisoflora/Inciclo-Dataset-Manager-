import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {MAPS_API_KEY} from '../utils/constants'
import {getAllPosts, insertPost} from '../remote/PostAPI'
import './MapView.css'

import {createStore,combineReducers} from 'redux'

import {Posts} from '../Reducers'
import {SetPost} from "../ActionCreators";

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

    }

    componentWillMount(){


        this.store = createStore(combineReducers({Posts}))


        this.unsubscribe = this.store.subscribe(()=>{
            this.forceUpdate();
            console.log("State:",this.store.getState())
        })

    }

    async componentDidMount() {
        const res = await getAllPosts()

        this.store.dispatch(SetPost(res))
    }


    onMapClick(funct){
        this.setState({
            createPostDialogOpen:true,
            createdPost:{
                lat:funct.lat,
                lgn:funct.lgn
            }})
    }

    createMapConfiguration(maps){
        return {
            panControl: true,
            draggableCursor: "default",
            draggingCursor: "pointer",
            mapTypeControl: true,
            scrollwheel: true
        }
    }

    /* submitPost(){

        console.log(funct)
        const res = await insertPost()
        if(res.data.status == "OK"){
            this.setState({regions: [...this.state.regions,]})    
        }
    } */
    
    handleDialogClose(){
        this.setState({createPostDialogOpen:false})
    }

    render() {
        
        return (
            <div id="map_container">
                <Button


                    style={{position:'absolute',top:0,right:0,zIndex:'9999',margin:'10px'}} variant="contained" >
                    Editar
                </Button>
                <GoogleMapReact
                    options={this.createMapConfiguration}

                    onClick={data=>this.onMapClick(data)}
                    bootstrapURLKeys={{key:MAPS_API_KEY}}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                >

                </GoogleMapReact>
            </div>
        );
    }
}



export default MapView;
