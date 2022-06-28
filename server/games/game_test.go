package games

import (
	"fmt"
	"testing"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Test_PlayTurn(t *testing.T) {

	dsn := "host=localhost dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	gamesService := NewGameService(db)

	playerId := gamesService.Create("test-game", "test-player")

	var game Game
	db.First(&game, "name = ?", "test-game")

	turn := GameTurn{
		GameId:   game.Id,
		CardId:   1,
		PlayerId: playerId,
	}
	gamesService.PlayTurn(turn)
	//gamesService.PlayTurn(turn)

	//amesService.DeleteGame("test-game")

}

func Test_GetData(t *testing.T) {

	dsn := "host=localhost dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	gamesService := NewGameService(db)

	playerId := gamesService.Create("test-game", "test-player")

	var game Game
	db.First(&game, "name = ?", "test-game")

	turn := GameTurn{
		GameId:   game.Id,
		CardId:   1,
		PlayerId: playerId,
	}
	gamesService.PlayTurn(turn)

	a := gamesService.GetPlayerUpdates(playerId)

	fmt.Print(a.CurrentTurn)

	//amesService.DeleteGame("test-game")

}

func Test_Delete_All(t *testing.T) {
	dsn := "host=localhost dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	db.Exec("DELETE FROM games")
	db.Exec("DELETE FROM game_turns")
	db.Exec("DELETE FROM game_players")
	db.Exec("DELETE FROM player_cards")
}
