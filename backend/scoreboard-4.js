//This is the scoreboard script. It fetches the player stats from the DH server and stores them in a sqlite database.
//This should be run in parallel with the main DH  script.

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5501;
app.use(cors());

const db = new sqlite3.Database('gameScores.db');

// Tables
db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    map TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);


  db.run(`CREATE TABLE IF NOT EXISTS player_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER,
    player_name TEXT,
    score INTEGER,
    team TEXT,
    FOREIGN KEY(game_id) REFERENCES games(id)
  )`);
});

// Current game state
let currentGame = {
  map: null,
  players: new Map(),
  lastUpdate: null
};

let emptyScanCount = 0;


async function fetchGameData() {
  try {
    const response = await axios.get('http://localhost:5500/api/dh-info');
    const players = response.data;

    // If no players, increment emptyScanCount, it resets after 3 empty scans, but saves if a player has > 250 score
    if (!players.length) {
      emptyScanCount++;
      if (emptyScanCount >= 3) {
        if (Array.from(currentGame.players.values()).some(player => player.score > 250)) {
          await saveGame();
        }
        currentGame.players.clear();
        emptyScanCount = 0;
      }
      return;
    } else {
      emptyScanCount = 0;
    }

    const currentMap = players[0].map;

    // If map changed, save current game and start new one
    if (currentGame.map && currentGame.map !== currentMap && currentGame.players.size > 1 ) {
      await saveGame();
      currentGame.players.clear();
    }

    currentGame.map = currentMap;
    currentGame.lastUpdate = new Date();

    // Update player scores
    players.forEach(player => {
      currentGame.players.set(player.jugador, {
        name: player.jugador,
        score: player.score,
        team: player.equipo
      });
    });

  } catch (error) {
    console.error('Error fetching game data:', error);
  }
}
function calculateTotalScore(gameId) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT SUM(score) AS total_score FROM player_scores WHERE game_id = ?`, [gameId], (err, rows) => {
      if (err) reject(err);
      resolve(rows.length > 0 ? rows[0].total_score : 0);
    });
  });
}


// Delete games with total score less than 500
async function deleteLowScoreGames() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM games', [], async (err, rows) => {
      if (err) return reject(err);
      const gameIds = rows.map(row => row.id);
      for (const gameId of gameIds) {
        const totalScore = await calculateTotalScore(gameId);
        if (totalScore < 500) {
          db.run('DELETE FROM games WHERE id = ?', [gameId], function(err) {
            if (err) return reject(err);
            db.run('DELETE FROM player_scores WHERE game_id = ?', [gameId], function(err) {
              if (err) return reject(err);
            });
          });
        }
      }
      resolve();
    });
  });
}

// Save game to database
async function saveGame() {
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION');
    
    db.run('INSERT INTO games (map) VALUES (?)', [currentGame.map], async function(err) {
      if (err) {
        db.run('ROLLBACK');
        return reject(err);
      }
      
      const gameId = this.lastID;
      const stmt = db.prepare('INSERT INTO player_scores (game_id, player_name, score, team) VALUES (?, ?, ?, ?)');
      
      for (const player of currentGame.players.values()) {
        if (!player.name.includes("(Spectator)")) { //Filter out spectator names
          stmt.run(gameId, player.name, player.score, player.team);
        }
      }
      
      stmt.finalize();
      
      db.run('COMMIT', async (err) => {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }
        await deleteLowScoreGames();
        resolve();
      });
    });
  });
}
// Recent games endpoint
app.get('/score/recent-games', (req, res) => {
  const query = `
    SELECT 
      g.id, g.map, g.date,
      json_group_array(
        json_object(
          'player_name', ps.player_name,
          'score', ps.score,
          'team', ps.team
        )
      ) as players
    FROM games g
    LEFT JOIN player_scores ps ON g.id = ps.game_id
    GROUP BY g.id
    ORDER BY g.date DESC
    LIMIT 100
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const games = rows.map(row => ({
      ...row,
      players: JSON.parse(row.players)
    }));
    
    res.json(games);
  });
});
//meti 50 como tope de top-players
app.get('/score/top-players', (req, res) => {
  const query = `
    SELECT 
      player_name,
      SUM(score) as total_score,
      COUNT(DISTINCT game_id) as games_played
    FROM player_scores
    JOIN games ON player_scores.game_id = games.id
    WHERE games.date >= date('now', '-1 month')
    GROUP BY player_name
    ORDER BY total_score DESC
    LIMIT 50
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/score/current-game', (req, res) => {
  const players = Array.from(currentGame.players.values())
    .sort((a, b) => {
      // Sort by team first, then by score
      if (a.team !== b.team) return a.team.localeCompare(b.team);
      return b.score - a.score;
    });
    
  res.json({
    map: currentGame.map,
    lastUpdate: currentGame.lastUpdate,
    players: players
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);

 
  
  // Poll the game API every minute
  setInterval(fetchGameData, 60000);
  // Initial fetch
  fetchGameData();
});
