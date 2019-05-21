import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {MAPS_API_KEY} from '../utils/constants'
import {getAllPosts, insertPost} from '../remote/PostAPI'
import './MapView.css'



//REDUX
import {createStore,combineReducers} from 'redux'
import {Posts,Mode} from '../Reducers'
import {AddPost, SetPost, SwitchMode} from "../ActionCreators";


//UTILS
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

        this.store = createStore(combineReducers({Posts,Mode}))
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
        this.store.dispatch(SwitchMode("VIEW_MODE"))


        //FAKE DATA FOR TESTING

        this.store.dispatch(AddPost({lat:-8.056940,lng:-34.891776}))
    }


    componentWillUnmount() {
        this.unsubscribe()
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


    handleMapClick(evt){
        console.log("Clicou no mapa.")
        console.log(evt)
    }

    handleMapChildClick(evt){
        console.log("Clicou em poste.")
        console.log(evt)
    }

    render() {

        const {Posts} = this.store.getState()



        return (
            <div id="map_container">
                <Button
                    style={{position:'absolute',top:0,right:0,zIndex:'9999',margin:'10px'}} variant="contained" >
                    Editar
                </Button>



                {
                    Posts ? (
                        <GoogleMapReact
                            options={this.createMapConfiguration}

                            onClick={data=>this.handleMapClick(data)}
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
