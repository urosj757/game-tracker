# API Test commands

## List all games
curl http://localhost:3000/api/games

## Add a game
curl -X POST http://localhost:3000/api/games -H "Content-Type: application/json" -d '{"title":"Hades","platform":"PC","status":"completed","rating":9,"hours_played":30}'

## Edit a game 
curl -X PUT http://localhost:3000/api/games/1 -H "Content-Type: application/json" -d '{"status":"completed","hours_played":120}'

## Delete a game
curl -X DELETE http://localhost:3000/api/games/1