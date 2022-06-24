import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Game } from './Game';

export function JoinGame(){

    const [gameData, setGameData] = useState()

    let {id, name} = useParams()

    useEffect(() => {
      fetch("http://localhost:10000/games/join/"+ id + "/" + name)
      .then((res) => res.json())
      .then((json) => setGameData(json))
  
    }, [])

    return gameData != null ? 
  <Game gameData={gameData} /> : "loading"

}

export function CreateGame(){

  const [gameData, setGameData] = useState()
  useEffect(() => {
    fetch("http://localhost:10000/games/new/test/andy")
    .then((res) => res.json())
    .then((json) => setGameData(json))

  }, [])
  return gameData != null ? 
  <Game gameData={gameData} /> : "loading"
}