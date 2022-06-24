CREATE TABLE postgres.game_players (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	game_id int8 NOT NULL,
	name varchar NULL,
	is_bot bool NOT NULL DEFAULT true,
	turn_order int8 NOT NULL,
	score int8 NOT NULL
);


CREATE TABLE postgres.game_turns (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	game_id int8 NOT NULL,
	player_id int8 NOT NULL,
	card_id int8 NOT NULL,
	turn_number int8 NOT NULL,
	round_number int8 NOT NULL
);

CREATE TABLE postgres.games (
	"name" varchar NULL,
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	turn int8 NOT NULL,
	round int8 NOT NULL,
	active_player int8 NOT NULL,
	trump_card int4 NULL
);

CREATE TABLE postgres.player_cards (
	player_id int8 NOT NULL,
	card_id int8 NOT NULL
);