import { useState, useEffect} from 'react';
import { Card } from './Card';






function PlayedCard(props) {
return (<div>
  { props.playerInfo.Card == "" ? <div style={{height:"100px"}}></div> 
  
  : 
  <Card card ={props.playerInfo.Card} width="190" height = "190px"/>}
  <h4> {props.playerInfo.Name } ( {props.playerInfo.Score} )</h4>

</div>)
}

export function Game(props) {
  const [currentTurn, setCurrentTurn] = useState(0)
  const [playedCards, setPlayedCards] = useState(new Map())
  const [gameData, setGameData] = useState(props.gameData)
  const [active, setActive] = useState(props.gameData.IsActive)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    const interval = setInterval(() => {
      
      if( !active ) {
        fetch("http://localhost:10000/games/" + props.gameData.CurrentPlayer + "/data")
        .then((res) => res.json())
        .then((json) => updateGameData(json))
      } 
    }, 1500);
    return () => clearInterval(interval);    
  }, [active])


  useEffect(() => {
    if(gameData.Turns.length > currentTurn){
      setPlayedCards({...gameData.Turns[currentTurn].PlayedCards})
    } else {
      setPlayedCards(new Map())
    }
  }, [currentTurn])
  

  const updateGameData = async(data)  => {   
    setGameData(data)
    if (data.IsActive) setActive(true)
    //setPlayedCards(data.Turns[currentTurn].PlayedCards)
    
    let keys = Object.keys(data.Turns[currentTurn].PlayedCards)
    let m = {...playedCards}
    await keys.reduce( async(x,i) => {
      async function ssleep(time) { return new Promise((resolve) => setTimeout(resolve, time))}
        await x
        if (!(i in {...playedCards})){
          setMessage(i) 
          await ssleep(500)
          m[i] = data.Turns[currentTurn].PlayedCards[i];
          setMessage(i) 
          setPlayedCards(m); 
          await ssleep(500)       
        }
    }, undefined )
  
    if(data.CurrentTurn != currentTurn) {     
      setMessage("setting turn")
      setTimeout(() => setCurrentTurn(data.CurrentTurn), 1500)
    }
  }

  const validateAndPlay = (card) => {
    var leader = gameData.Players.filter((x) => x.TurnOrder == 0)[0].Id
    if(leader == gameData.CurrentPlayer){
      playCard(card)
    } else {
      var suitToFollow = playedCards[leader].Suit
      var hasAny = gameData.RemainingCards.filter((c) => c.Suit == suitToFollow).length > 0
      if( card.Suit != suitToFollow && hasAny) { 
        alert("Must follow suit!")
      } else {
        playCard(card)
      }
    } 
  }

  const playCard = (card) => {
    let g = {...gameData}
    g.RemainingCards = g.RemainingCards.filter((c) => c.Id != card.Id)
    setGameData(g)

    let x = {...playedCards}
    x[gameData.CurrentPlayer] = card
    setPlayedCards(x)
    setActive(false)

    var body = { 
      GameId: props.gameData.GameId,
      PlayerId: props.gameData.CurrentPlayer,
      CardId: card.Id
    }
      
    fetch("http://localhost:10000/games/play", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((res) => res.json())
    
  };

  const cardString = (c) => c.ValueName + " of " + c.Suit + "s" 
  
  const getPlayerInfo = (i) => {
    var player = gameData.Players[i]
    return { 
      Name: player.Name, 
      Score: player.Score,
      Card: player.Id in playedCards ?  playedCards[player.Id] : ""
    }
  }

  return (
    <div>
      <br />
      <br />
      <div style={{margin: 'auto', width:'33%', padding: '10px',  textAlign:'center'}}>
      <PlayedCard playerInfo={getPlayerInfo(2)} />
      </div>

      <div style={{display:'flex'}}>
        <div style={{margin: 'auto', width:'33%', backgroundColor:'', padding: '10px',  textAlign:'center'}}> 
        <PlayedCard playerInfo={getPlayerInfo(3)} />
        </div>
        <div style={{margin: 'auto', width:'33%', padding: '10px', textAlign:'center'}}>   
      <p> (trump card: {cardString(props.gameData.TrumpCard)})</p>  </div>
        <div style={{margin: 'auto', width:'33%', padding: '10px',  textAlign:'center'}}> 
        <PlayedCard playerInfo={getPlayerInfo(1)} />
        </div>
      </div>

      <div style={{margin: 'auto', width:'33%', padding: '10px',  textAlign:'center'}}>
        <PlayedCard playerInfo={getPlayerInfo(0)} />
      </div>
     
      <br /> 
      <br />
      <div style={{margin:'auto', width: "70%", display:"flex", justifyContent:"center"}}>
        {gameData.RemainingCards == null ?"": gameData.RemainingCards.map((c) => <div  onClick={() => validateAndPlay(c)}> <Card card={c} height="190px"/> </div>)}
      </div>

      <br />
      <br />
    </div>
  );
}


