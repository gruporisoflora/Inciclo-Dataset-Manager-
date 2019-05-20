import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import MAPS_API_KEY from '../utils/constants'
import {getAllPosts, insertPost} from '../remote/PostAPI'
import './MapView.css'




class MapView extends Component {
    constructor(props){
        super(props)
        this.state = {
            center: {
              lat: -8.056940,
              lng:  -34.891776
            },
            zoom: 15,
            regions:{},
        };

    }

    async componentWillMount(){
        const res = await getAllPosts()
        
        this.setState({regions: res.data.data})

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
