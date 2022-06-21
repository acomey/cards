package games

type Game struct {
	Id           int
	Name         string
	Turn         int
	Round        int
	ActivePlayer int
	TrumpCard    int
}
type GamePlayer struct {
	Id        int
	GameId    int
	Name      string
	IsBot     bool
	TurnOrder int
	Score     int
}

type PlayerCard struct {
	PlayerId int
	CardId   int
}

/*type PlayerData struct {
	Id          int
	Name        string
	Hand        []Card
	PlayedCards []Card
	Score       int
}*/

type GameTurn struct {
	GameId      int `json:"GameId"`
	PlayerId    int `json:"PlayerId"`
	CardId      int `json:"CardId"`
	TurnNumber  int `json:"Turn"`
	RoundNumber int `json:"Round"`
}

type GameRound struct {
	TurnWinners []int
}
