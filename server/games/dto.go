package games

type PlayerState struct {
	GameId         int
	TrumpCard      Card
	CurrentPlayer  int
	CurrentTurn    int
	RemainingCards []Card
	Turns          []Turn
	IsActive       bool
}

type Turn struct {
	Number      int
	PlayedCards map[int]Card
	Winner      int
}
