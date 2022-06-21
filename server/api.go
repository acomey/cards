package main

import (
	"encoding/json"
	"net/http"
	"server/games"
	"strconv"

	"github.com/gorilla/mux"
)

type ApiController struct {
	GameService games.GameService
}

func (a *ApiController) GetGameData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	playerId, _ := strconv.Atoi(mux.Vars(r)["player"])

	//TODO: CHECK ERR
	updates := a.GameService.GetPlayerUpdates(playerId)
	json.NewEncoder(w).Encode(updates)

}

func (a *ApiController) PlayTurn(w http.ResponseWriter, r *http.Request) {

	var turn games.GameTurn
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&turn); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("bad")
	} else {
		a.GameService.PlayTurn(turn)
	}

}

func (a *ApiController) Join(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	playerId, err := a.GameService.JoinGame(mux.Vars(r)["game"], mux.Vars(r)["player"])

	if err != nil {
		json.NewEncoder(w).Encode(err.Error())
	} else {
		initialData := a.GameService.GetPlayerUpdates(playerId)
		json.NewEncoder(w).Encode(initialData)
	}

}

func (a *ApiController) Create(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	playerId := a.GameService.Create(mux.Vars(r)["name"], mux.Vars(r)["player"])

	initialData := a.GameService.GetPlayerUpdates(playerId)
	json.NewEncoder(w).Encode(initialData)
}
