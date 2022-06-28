package main

import (
	"fmt"
	"log"

	"net/http"

	"server/games"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}

func handleRequests(apiController *ApiController) {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/games/new/{name}/{player}", apiController.Create)
	myRouter.HandleFunc("/games/join/{game}/{player}", apiController.Join)
	myRouter.HandleFunc("/games/play", apiController.PlayTurn).Methods("POST")
	myRouter.HandleFunc("/games/{player}/data", apiController.GetGameData)

	// Where ORIGIN_ALLOWED is like `scheme://dns[:port]`, or `*` (insecure)
	credentials := handlers.AllowCredentials()
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	fmt.Println("Starting server")
	log.Fatal(http.ListenAndServe("0.0.0.0:10000", handlers.CORS(originsOk, headersOk, methodsOk, credentials)(myRouter)))
}

func main() {
	dsn := "host=192.168.122.44 dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	gamesService := games.NewGameService(db)
	apiController := &ApiController{GameService: *gamesService}

	handleRequests(apiController)

}
