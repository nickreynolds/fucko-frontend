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
import CreateGenerativeCode from './components/CreateGenerativeCode';
import styled from "styled-components";
// import background from "./images/fucko-background-2.png"

const Header = styled.header`
background-color: #282c34;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-size: calc(10px + 2vmin);
color: white;
`;

const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const NavItem = styled(Link)`
padding: 40px;
text-decoration: none;
color: white;
visited: white;
`;

const AppBody = styled.div`
  background-image: url(/fucko-background-2.png);
  min-height: 100%;
`;

const Canvas = styled.canvas`
  width: 200%;
  height: 200%;
  color: white;
`;


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
      <Router>
        <Header>
          <NavBar>
            <NavItem to="/">HOME</NavItem>
            <NavItem to="/create">P5JS SANDBOX</NavItem>
            <NavItem to="/about">ABOUT</NavItem>
          </NavBar>
        </Header>
        <AppBody>
          <Switch>
            <Route path="/create">
              <CreateGenerativeCode />
            </Route>
            <Route path="/">
              <Auction drizzle={drizzle} drizzleState={drizzleReadinessState.drizzleState} />
              <FuckoList drizzle={drizzle} drizzleState={drizzleReadinessState.drizzleState} />
            </Route>
          </Switch>
        </AppBody>
      </Router>
    </div>
  );
}

export default App;
