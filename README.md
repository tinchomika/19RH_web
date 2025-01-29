
# 19 Regimiento Hispano's site

Source code for the front and back end of the **Darkest Hour: Europe 44'-45'** clan's website.

The webv2 and webv3 folders are the current versions of the site, using mostly plain html and js.

The Backend folder has a player fetching script that also greets clan members joining the game, and a scoreboard script that parses the player data and creates a database with the last played games and high-scores.

**DISCLAIMER**: I used a lot of chatgpt for styling and misc. So this ~~probably~~ is a hot mess of code. 


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



