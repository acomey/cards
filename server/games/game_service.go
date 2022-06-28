package games

import (
	"fmt"

	"gorm.io/gorm"
)

type GameService struct {
	db *gorm.DB
}

func NewGameService(db *gorm.DB) *GameService {
	return &GameService{db: db}
}

func (g *GameService) GetPlayerUpdates(playerId int) PlayerState {
	var game Game
	var player GamePlayer

	g.db.Find(&player, playerId)
	g.db.First(&game, player.GameId)

	isActive := false
	if game.ActivePlayer == playerId {
		isActive = true
	}

	state := PlayerState{
		GameId:         game.Id,
		TrumpCard:      getCard(game.TrumpCard),
		CurrentPlayer:  playerId,
		CurrentTurn:    game.Turn,
		RemainingCards: []Card{},
		Turns:          []Turn{},
		IsActive:       isActive,
	}

	var cards []PlayerCard
	g.db.Find(&cards, "player_id = ?", player.Id)
	for _, card := range cards {
		state.RemainingCards = append(state.RemainingCards, getCard(card.CardId))
	}

	var turns []GameTurn
	g.db.Find(&turns, "game_id = ? ", game.Id)

	var players []GamePlayer
	orderBy := fmt.Sprintf("(id - %d + 4)%%4 asc", playerId)
	g.db.Order(orderBy).Find(&players, "game_id = ? ", game.Id)
	state.Players = players

	for _, turn := range turns {
		if len(state.Turns) > turn.TurnNumber {
			cards := state.Turns[turn.TurnNumber].PlayedCards
			cards[turn.PlayerId] = getCard(turn.CardId)
		} else {
			newTurn := Turn{
				Number:      turn.TurnNumber,
				PlayedCards: map[int]Card{turn.PlayerId: getCard(turn.CardId)},
			}
			state.Turns = append(state.Turns, newTurn)
		}
	}
	return state
}

func (g *GameService) Create(name, playerName string) int {

	newGame := Game{Name: name}
	g.db.Create(&newGame)
	fmt.Printf("Created new game (id: %d ) \n", newGame.Id)
	//gameDetails := &GameDetails{Game: newGame, Players: []GamePlayer{}, PlayerHands: map[int][]Card{}}

	playerId := g.initiliazeGame(&newGame, playerName)
	return playerId
}
func (g *GameService) initiliazeGame(newGame *Game, playerName string) int {
	hands, TrumpCard := DealHands()

	player := GamePlayer{GameId: newGame.Id, Name: playerName, IsBot: false, TurnOrder: 0}
	g.savePlayerAndCards(&player, hands[0])
	newGame.ActivePlayer = player.Id
	newGame.TrumpCard = TrumpCard
	g.db.Save(newGame)

	for i := 1; i < 4; i++ {
		bot := GamePlayer{GameId: newGame.Id, Name: "bot", IsBot: true, TurnOrder: i}
		g.savePlayerAndCards(&bot, hands[i])
	}
	return player.Id
}

func (g *GameService) savePlayerAndCards(player *GamePlayer, cardIds []int) {
	g.db.Create(&player)
	for _, card := range cardIds {
		playerHand := PlayerCard{PlayerId: player.Id, CardId: card}
		g.db.Create(&playerHand)
	}
}

func (g *GameService) JoinGame(id, playerName string) (int, error) {

	var game Game
	g.db.First(&game, id)

	if game.Id != 0 {
		var player GamePlayer
		g.db.First(&player, "is_bot = true AND game_id = ?", game.Id)
		player.Name = playerName
		player.IsBot = false
		g.db.Save(&player)
		return player.Id, nil
	} else {
		return 0, fmt.Errorf("no game found with id %s", id)
	}

}

func (g *GameService) DeleteGame(name string) {
	var game Game
	g.db.First(&game, "name = ?", name)
	g.db.Delete(&GamePlayer{}, "game_id = ?", game.Id)
	g.db.Delete(&GameTurn{}, "game_id = ?", game.Id)
	g.db.Delete(&Game{}, game.Id)
	g.db.Exec("DELETE FROM player_cards")
}

func (g *GameService) PlayTurn(turn GameTurn) {

	var game Game
	var player GamePlayer
	g.db.Find(&game, turn.GameId)
	g.db.Find(&player, turn.PlayerId)

	turn.RoundNumber = game.Round
	turn.TurnNumber = game.Turn
	g.saveTurnAndScores(&game, player, turn)

	g.playBotTurns(&game, player)

}

func (g *GameService) playBotTurns(game *Game, currentPlayer GamePlayer) {
	nextPlayer := g.getNextPlayer(game, currentPlayer)
	if !nextPlayer.IsBot {
		game.ActivePlayer = nextPlayer.Id
		g.db.Save(&game)
	} else {

		turn := GameTurn{
			GameId:      game.Id,
			PlayerId:    nextPlayer.Id,
			CardId:      g.GetCardToPlay(game.Id, nextPlayer.Id, game.Turn),
			TurnNumber:  game.Turn,
			RoundNumber: game.Round,
		}
		g.saveTurnAndScores(game, nextPlayer, turn)
		g.playBotTurns(game, nextPlayer)
	}

}

func (g *GameService) getNextPlayer(game *Game, currentPlayer GamePlayer) GamePlayer {
	var nextPlayer GamePlayer
	var nextTurn int
	if currentPlayer.TurnOrder == 3 {
		nextTurn = 0
	} else {
		nextTurn = currentPlayer.TurnOrder + 1
	}
	g.db.Find(&nextPlayer, "game_id = ? and turn_order = ?", game.Id, nextTurn)
	return nextPlayer
}

func (g *GameService) GetCardToPlay(gameId, playerId, turnNumber int) int {

	leader, suitToFollow := g.getLeaderAndSuit(gameId, turnNumber)

	var cards []PlayerCard
	g.db.Find(&cards, "player_id = ?", playerId) //order desc TODO

	if leader == playerId {
		return cards[0].CardId
	}
	for _, c := range cards {
		card := getCard(c.CardId)
		if card.Suit == suitToFollow {
			return c.CardId
		}

	}

	return cards[0].CardId
}

func (g *GameService) getLeaderAndSuit(gameId, turnNumber int) (int, string) {
	var leader GamePlayer
	g.db.First(&leader, "game_id = ? and turn_order = 0", gameId)

	//if leader
	var leaderTurn GameTurn
	g.db.First(&leaderTurn, "game_id = ? and turn_number = ?", gameId, turnNumber)
	return leader.Id, getCard(leaderTurn.CardId).Suit
}

func (g *GameService) saveTurnAndScores(game *Game, player GamePlayer, turn GameTurn) {
	g.db.Create(&turn)
	g.db.Delete(&PlayerCard{}, "player_id = ? AND card_id = ?", player.Id, turn.CardId)

	if player.TurnOrder == 3 {
		g.updateScores(game)
	}
}

func (g *GameService) updateScores(game *Game) {

	var winner GamePlayer
	g.db.Find(&winner, g.getWinnerId(*game))
	winner.Score += 5
	g.db.Save(&winner)

	//updating turn orders
	increment := 4 - winner.TurnOrder
	var players []GamePlayer
	g.db.Find(&players, "game_id=?", game.Id)

	for _, p := range players {
		p.TurnOrder = (p.TurnOrder + increment) % 4
		g.db.Save(&p)
	}

	if game.Turn < 4 {
		game.Turn++
		g.db.Save(&game)
	}
}

func (g *GameService) getWinnerId(game Game) int {
	var turns []GameTurn
	g.db.Order("card_id desc").Find(&turns, "game_id=? and turn_number=?", game.Id, game.Turn)

	trumpSuit := getCard(game.TrumpCard).Suit
	leader, suitToFollow := g.getLeaderAndSuit(game.Id, game.Turn)

	highestSuits := []string{trumpSuit, suitToFollow}

	for _, suit := range highestSuits {
		for _, turn := range turns {
			c := getCard(turn.CardId)
			if c.Suit == suit {
				return turn.PlayerId
			}
		}
	}
	return leader
}
