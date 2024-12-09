const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const cors = require('cors');
const dgram = require('dgram');
const client = dgram.createSocket('udp4'); //NOT NEEDED. but i'll keep it here for a later UDP server query function
require('dotenv').config();


const app = express();
const PORT = 5500;

app.use(cors());

const greetedPlayers = new Map();
const playerNameToGreet = "[19.RH]Ramitos";
//Fetches info from the RO webAdmin interface using an admin account.
//Set the .env file as documented in the README
async function fetchPlayerStats() {
    try {
        const response = await axios.get(process.env.PLAYERS_URL, {
            auth: {
                username: process.env.NAME,
                password: process.env.PASSWORD
            }
        });

        const htmlData = response.data;
        const $ = cheerio.load(htmlData);
        const playerStats = [];
        const currentPlayers = new Set();
        const playersToGreet = [];
        const processedPlayers = new Set();

        let map = null;

        
        $('td.ttext').each((i, el) => {
            const cellText = $(el).text().trim();
            const match = cellText.match(/DarkestHourGame in (.*?)\s*$/);
            if (match) {
                map = match[1].trim();
            }
        });


        
        $('tr').each((i, row) => {
            const cells = $(row).find('td');
            
            if (cells.length >= 5) {
                let playerName = null;
                let team = null;
                let ping = null;
                let score = null;
                let numericValuesFound = 0;
                //This section is to find the player name, team, ping and score... a messy way to do it but it works
                cells.each((cellIndex, cell) => {
                    const cellText = $(cell).text().trim();
                    // Look for cells with specific alignment attributes that match our data
                    if ($(cell).attr('align') === 'left' && $(cell).attr('nowrap') !== undefined) {
                        playerName = cellText;
                    }
                    // Look for the team cell which contains a span with background-color
                    else if ($(cell).find('span[style*="background-color"]').length > 0) {
                        team = cellText;
                    }
                    // Look for numeric values, the first is the ping, the second is the score
                    else if ($(cell).attr('align') === 'center') {
                        const isNumeric = /^-?\d+$/.test(cellText);
                        if (isNumeric) {
                            numericValuesFound++;
                            if (numericValuesFound === 1) {
                                ping = parseInt(cellText);
                            } else if (numericValuesFound === 2) {
                                score = parseInt(cellText);
                            }
                        }
                    }
                });
                // Ignore players with "(spectator)" in their name
                if (playerName && playerName.includes("(Spectator)")) {
                    return;
                }

                // Only add if we found all required fields and haven't processed this player yet
                if (playerName && team && ping !== null && score !== null && !processedPlayers.has(playerName)) {
                    processedPlayers.add(playerName);
                    currentPlayers.add(playerName);

                    playerStats.push({
                        jugador: playerName,
                        ping: ping,
                        score: score,
                        equipo: team,
                        map: map
                    });

                    if ((playerName === playerNameToGreet || playerName.includes("[19.RH]")) &&
                        !greetedPlayers.has(playerName)) {
                        playersToGreet.push(playerName);
                    }
                }
            }
        });

        // Remove players who are no longer in the server
        const now = Date.now();
        for (const [greetedPlayer, timestamp] of greetedPlayers) {
            if (!currentPlayers.has(greetedPlayer) || now - timestamp > 3 * 60 * 60 * 1000) {
                greetedPlayers.delete(greetedPlayer);
            }
        }

        // Meti cambio aca wacho
        for (const playerName of playersToGreet) {
            if (playerName.includes("Ramitos")) {
                await sendMessageToConsole(`Llego Ramitos... corran por sus vidas`);
            } else {
                await sendMessageToConsole(`Bienvenido de vuelta camarada ${playerName}!`);
            }
            greetedPlayers.set(playerName, Date.now());
        }

        return playerStats;
    } catch (error) {
        console.error("Error fetching player stats:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
        }
        return [];
    }
}

async function sendMessageToConsole(message) {
    try {
        const response = await axios.post(process.env.CONSOLE_URL, null, {
            auth: {
                username: process.env.NAME,
                password: process.env.PASSWORD
            },
            params: {
                SendText: `say ${message}`,
                Send: "Send"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al enviar el mensaje:", error.message);
        return null;
    }
}

app.get("/api/dh-info", async (req, res) => {
    const playerStats = await fetchPlayerStats();
    res.json(playerStats);
});

app.post("/api/mensaje", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    const result = await sendMessageToConsole(message);
    res.json({ success: true, result });
});

cron.schedule("*/20 * * * *", async () => {
    await sendMessageToConsole("Espero que estes disfrutando del juego!");
});
cron.schedule("*/16 * * * *", async () => {
    await sendMessageToConsole("Encontrate en la scoreboard: 19rh.mooo.com");
});

cron.schedule("1 * * * *", async () => {
    await sendMessageToConsole("Tenemos grupo de Discord! mas info en 19rh.mooo.com");
});

cron.schedule("* * * * *", async () => {
    await fetchPlayerStats();
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
