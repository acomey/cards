import logo from './logo.svg';
import TwoClubs from './cards/2C.svg'
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import { Game, CreateGame } from './Game';
import { useEffect, useState } from 'react';
import { JoinGame } from './JoinGame';

function App() {
  return (
    <Router>
      <Routes>
          
          <Route path="/game" element={<Game />}/>  
          <Route path="/game/new" element={<CreateGame />}/>    
          <Route path="/game/join/:id/:name" element={<JoinGame />}/>        
          <Route path="/" element={<Home />}/>
        </Routes>
    </Router>
  )
 
}


function Home() {

  const [playerName, setPlayerName] = useState("")
  const [gameId, setGameId] = useState("")

  return (
    <div>
      
      <br />
      <br />
      <div style={{padding:"5%"}}>
      <label >  <b> Name </b>  </label>
      <input type={"text"} value={playerName} onChange={(e)=> setPlayerName(e.target.value) }/>

      <br />
      <br />
      
      <input type={"text"} value={gameId} onChange={(e)=> setGameId(e.target.value) }/>
      <label > <Link to={"/game/join/" + gameId + "/" + playerName}> Join </Link></label>

        <div style={{padding:"2%"}}>
        <label > <Link to="/game/new"> New Game </Link></label>
        </div>
      </div>

      <br />
     
    </div>
    
  )
}





export default App;
