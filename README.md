
# 19 Regimiento Hispano

Source code for the front and back end of the **Darkest Hour: Europe 44'-45'** clan's website.

The webv3 folder is the current version of the site, using mostly plain html and js.

The Backend folder has a player fetching script that also greets clan members joining the game, and a scoreboard script that parses the player data and creates a database with the last played games and high-scores.

The fun thing about dh.js is that it uses the worst possible way to fetch player data: scrapping the webAdmin page and parsing it, but it works lol.

**DISCLAIMER**: I used a lot of chatgpt for styling and misc. So this ~~probably~~ is a hot mess of code. Also this site was built like a Frankestein, with no real structure or planification, so it's a pain to improve its mobile compatibility. I will eventually rebuild it properly later...

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NAME`= your RO webAdmin account's name  

`PASSWORD`= your RO webAdmin account's password

`PLAYERS_URL`= the player fetching url. ex:
*http://YOUR_SERVER_IP_AND_PORT/DHServerAdmin/current_players*

`CONSOLE_URL`= the webAdmin console url for sending commands. ex:
*http://YOUR_SERVER_IP_AND_PORT/DHServerAdmin/current_console*

## Useful links

[Darkest Hour github](https://github.com/DarklightGames/DarkestHour)
