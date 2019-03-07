# grab-latest-image-from-discord

Grab the latest image from an user in a channel.

## Build Prerequisities

- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/) (with NPM)

>This script uses OBS plugin "obs-websocket"
- [OBS-WEBSOCKET](https://github.com/Palakis/obs-websocket/)

## Installation

- `git clone <repository-url>`
- Change into the new directory.
- `npm install

## Config

Edit `config.json` to your own settings.

- Goto https://discordapp.com/developers/applications/ to make a new application.
- Goto the bot section and add a bot.
- Grab the bot token and add it in the config.
- Make the bot join the server https://discordapp.com/api/oauth2/authorize?client_id=YOURBOTCLIENTID&scope=bot.
- Turn on discord developer mode to get the channel id and user id and add them in the config.

## How to run

Run the app by running: `npm start`.
