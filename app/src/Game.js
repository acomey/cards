import { useState, useEffect} from 'react';
import TwoClubs from './cards/2C.svg'
import { Card } from './Card';







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
    }, 2000);
    return () => clearInterval(interval);    
  }, [gameData.IsActive])

  useEffect(() => {
    setTimeout(() => {
    if(gameData.CurrentTurn != currentTurn) {
        setCurrentTurn(gameData.CurrentTurn)
      }
    },1500)

  }, [gameData])

  
  const playCard = (card) => {
    
    let newState = {...gameData}
    newState.IsActive = 0
    if(newState.Turns.length <=  currentTurn) {
      let map = new Map()
      map[gameData.CurrentPlayer] = card
      newState.Turns[currentTurn] = {
        PlayedCards : map
      }
    } else {
      newState.Turns[currentTurn].PlayedCards[gameData.CurrentPlayer] = card
    }
    
    setGameData(gameData => ({...newState}))   
    
    var body = { 
      GameId: props.gameData.GameId,
      PlayerId: props.gameData.CurrentPlayer,
      CardId: card.Id
    }
      
    fetch("http://localhost:10000/games/play", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  })
    .then((res) => res.json())
    
  };

  const cardString = (c) => c.ValueName + " of " + c.Suit + "s" 
  
  const getPlayerInfo = (i) => {
    var playedCard = ""
    var player = gameData.Players[i].Id
    if (gameData.Turns.length > gameData.CurrentTurn) {
      var playedCards = gameData.Turns[currentTurn].PlayedCards  
      if (player in playedCards){
        playedCard = playedCards[player]
      }

    }
    return { Card: playedCard, Name: gameData.Players[i].Name}

  }

  return (
    <div>
      <br />
      <h3> Game</h3>

      <div style={{margin: 'auto', width:'33%', padding: '10px',  textAlign:'center'}}>
      <PlayedCard playerInfo={getPlayerInfo(2)} />
      </div>

      <div style={{display:'flex'}}>
        <div style={{margin: 'auto', width:'33%', backgroundColor:'', padding: '10px',  textAlign:'center'}}> 
        <PlayedCard playerInfo={getPlayerInfo(3)} />
        </div>
        <div style={{margin: 'auto', width:'33%', padding: '10px', textAlign:'center'}}> </div>
        <div style={{margin: 'auto', width:'33%', padding: '10px',  textAlign:'center'}}> 
        <PlayedCard playerInfo={getPlayerInfo(1)} />
        </div>
      </div>

      <div style={{margin: 'auto', width:'33%', padding: '10px',  textAlign:'center'}}>
        <PlayedCard playerInfo={getPlayerInfo(0)} />
      </div>
     
    
     

    
      <br />

      <h3> Your Hand </h3>
      <p> (trump card: {cardString(props.gameData.TrumpCard)})</p>
      <br />
      <div>
        {gameData.RemainingCards.map((c) => <span style={{padding:"5%"}} onClick={() => playCard(c)}> <Card card={c} width="6.5%"/> </span>)}
      </div>

      <br />
      <p> {gameData.IsActive ? "your turn" : "waiting for other players"} </p>
      <br />
    
  
     
     <br />
     <p>(game: {gameData.GameId}, active: {gameData.IsActive ? "true" : "false"} turn# {currentTurn}</p>

   
    
    </div>


  );
}



function PlayedCard(props) {


return (<div>
  { props.playerInfo.Card == "" ? "" : <Card card ={props.playerInfo.Card} width = "15%"/>}
  <h4> {props.playerInfo.Name }</h4>

</div>)
}