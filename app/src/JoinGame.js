import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Game } from './Game';

export function JoinGame(){

    const [gameData, setGameData] = useState()

    let {id, name} = useParams()

    useEffect(() => {
      alert("testing..")
      fetch("http://192.168.178.102:10000/games/join/"+ id + "/" + name)
      .then((res) => res.json())
      .then((json) => setGameData(json))
  
    }, [])

    return gameData != null ? 
  <Game gameData={gameData} /> : "loading"

}