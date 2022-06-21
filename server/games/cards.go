package games

import (
	"math/rand"
	"time"
)

type Suit string
type CardValue int

const (
	Spade   Suit = "Spade"
	Club    Suit = "Club"
	Heart   Suit = "Heart"
	Diamond Suit = "Diamond"
)

const (
	Two   CardValue = 2
	Three CardValue = 3
	Four  CardValue = 4
	Five  CardValue = 5
	Six   CardValue = 6
	Seven CardValue = 7
	Eight CardValue = 8
	Nine  CardValue = 9
	Ten   CardValue = 10
	Jack  CardValue = 11
	Queen CardValue = 12
	King  CardValue = 13
	Ace   CardValue = 14
)

type Card struct {
	Suit      string
	Value     int
	ValueName string
	Id        int
}

//var CardValues = []CardValue{Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace}

var CardValues = map[int]string{
	2:  "2",
	3:  "3",
	4:  "4",
	5:  "5",
	6:  "6",
	7:  "7",
	8:  "8",
	9:  "9",
	10: "10",
	11: "Jack",
	12: "Quen",
	13: "King",
	14: "Ace",
}

var Suits = []string{"Spade", "Club", "Diamond", "Heart"}

/*
func createDeck() map[int]Card {
	deck := map[int]Card{}
	for i, s := range Suits {
		for j, v := range CardValues {
			deck[i*13+j] = Card{Suit: s, Value: v, Id: i*13 + j}
		}

	}
	return deck
}*/

//var Deck = createDeck()

func DealHands() ([][]int, int) {
	var hands [][]int

	var remainingCards []int
	for i := 1; i < 52; i++ {
		remainingCards = append(remainingCards, i)
	}

	seed := rand.NewSource(time.Now().Unix())
	gen := rand.New(seed)

	trumpIdnex := gen.Intn(len(remainingCards))
	trump := remainingCards[trumpIdnex]
	remainingCards = append(remainingCards[:trumpIdnex], remainingCards[trumpIdnex+1:]...)

	for player := 0; player < 4; player++ {
		var hand []int
		for i := 0; i < 5; i++ {
			randomIndex := gen.Intn(len(remainingCards))
			hand = append(hand, remainingCards[randomIndex])
			remainingCards = append(remainingCards[:randomIndex], remainingCards[randomIndex+1:]...)

		}
		hands = append(hands, hand)

	}
	return hands, trump
}

func getCard(cardId int) Card {
	return Card{
		Id:        cardId,
		Suit:      Suits[cardId/13],
		Value:     cardId%13 + 2,
		ValueName: CardValues[cardId%13+2],
	}
}
