import React, { useState, useEffect, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Auction from "./components/Auction";
import FuckoList from "./components/FuckoList";


const App = props => {
  const [drizzleReadinessState, setDrizzleReadinessState] = useState({drizzleState: null, loading: true});
  const {drizzle} = props;
  console.log("App drizzle: ", drizzle);

  useEffect( 
    () => {
      const unsubscribe = drizzle.store.subscribe( () => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState()
        // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {
          setDrizzleReadinessState({drizzleState: drizzleState, loading: false})
        }
      })
      return () => {
        unsubscribe()
      }
    }, [drizzle.store, drizzleReadinessState]
  )

  console.log("drizzleReadinessState: ", drizzleReadinessState);

  return (
    drizzleReadinessState.loading ? 
      "Loading Drizzle..." 
      :
    <div className="App">
      <header className="App-header">
      <Auction drizzle={drizzle} drizzleState={drizzleReadinessState.drizzleState} />
      <FuckoList drizzle={drizzle} drizzleState={drizzleReadinessState.drizzleState} />
      </header>
    </div>
  );
}

export default App;
