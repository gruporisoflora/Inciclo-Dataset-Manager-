import React from 'react';

import './App.css';
import MapView from './components/MapView';




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
