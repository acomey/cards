import { useState, useEffect} from 'react';
import TwoClubs from './cards/2C.svg'


export class Card {
  constructor(suit, val){
    this.suit = suit
    this.val = val
  }
}

export function CreateGame(){

  const [gameData, setGameData] = useState()
  useEffect(() => {
    alert("testing..")
    fetch("http://192.168.178.102:10000/games/new/test/andy")
    .then((res) => res.json())
    .then((json) => setGameData(json))

  }, [])
  return gameData != null ? 
  <Game gameData={gameData} /> : "loading"
}



export function Game(props) {
  const [currentTurn, setCurrentTurn] = useState(0)
  const [gameData, setGameData] = useState(props.gameData)
  

  useEffect(() => {
    const interval = setInterval(() => {
      
      if( !gameData.IsActive ) {
       
        fetch("http://localhost:10000/games/" + props.gameData.CurrentPlayer + "/data")
        .then((res) => res.json())
        .then((json) => setGameData(json))
      } 
    }, 4000);
    return () => clearInterval(interval);    
  }, [gameData.IsActive])

  useEffect(() => {
    setTimeout(() => {
    if(gameData.CurrentTurn != currentTurn) {
        setCurrentTurn(gameData.CurrentTurn)
      }
    },3000)

  }, [gameData])

  
  const playCard = (card) => {
    
    let newState = {...gameData}
    newState.IsActive = 0
    if(newState.Turns.length == 0) {
      let map = new Map()
      map[gameData.CurrentPlayer] = card
      newState.Turns[0] = {
        PlayedCards : map
      }
    }
    
    setGameData(gameData => ({...newState}))   
    
    var body = { 
      GameId: props.gameData.GameId,
      PlayerId: props.gameData.CurrentPlayer,
      CardId: card.Id
    }
      
    fetch("http://192.168.178.102:10000/games/play", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  })
    .then((res) => res.json())
    
  };

  const cardString = (c) => c.ValueName + " of " + c.Suit + "s" 
  
  return (
    <div>
      <br />
      <h3> Game</h3>
     

     <PlayedCardsSection Turns = {gameData.Turns} CurrentTurn={currentTurn}/>
      <br />

      <h3> Your Hand </h3>
      <p> (trump card: {cardString(props.gameData.TrumpCard)})</p>
      <br />
      <div>
        {gameData.RemainingCards.map((c) => <span style={{padding:"5%"}}><button onClick={(e) => playCard(c)}> {c.ValueName + " of " + c.Suit + "s" } </button></span>)}
      </div>

      <br />
      <p> {gameData.IsActive ? "your turn" : "waiting for other players"} </p>
      <br />
    
  
     
     <br />
     <p>(game: {gameData.GameId}, active: {gameData.IsActive ? "true" : "false"} turn# {currentTurn}</p>

     <img src={TwoClubs} width="8%" />
    
    </div>


  );
}



function PlayedCardsSection({Turns, CurrentTurn}) {
  if (Turns.length <= CurrentTurn) {
    return ""
  }  

  Object.keys(Turns[CurrentTurn].PlayedCards).map((k) => {
    console.log(k)
    
  })
  

  return (
    <div>
      
        {
      Object.keys(Turns[CurrentTurn].PlayedCards).map((k) => {
          let c = Turns[CurrentTurn].PlayedCards[k]
          return <span style={{padding:"5%"}}>{c.ValueName + " of " + c.Suit + "s" }</span>
        })
        
    }
   
    </div>
  )
}