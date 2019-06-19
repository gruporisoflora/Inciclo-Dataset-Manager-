import React from 'react';

import './App.css';
import MapView from './MapView/MapView';




class App extends React.Component{
  
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div className="App">
        <MapView/>
      </div>
    );
  }
}

export default App;
