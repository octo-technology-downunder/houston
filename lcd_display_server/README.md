# Description

This Server runs on a raspberry pi. The raspberry pi is connected to a LCD display via the GPIO connectors.
The server is developed with node.js and express.js. The connection to the LCD display is developped using the Adafruit_CharLCD library. 

# Setup

## install dependencies

```
npm install
```

## Run server

```
nohup nodejs bin/www &
```

# API

```
curl -d '{"text":"Text to display","move_message":"true"}' http://localhost:3000/messages/ -v  -H "Content-Type: application/json"
```

The text can be up to 2 lines (with the \n separator), and un to 16 ASCII characters per line.

The move_message option allows to have the message move from left to right and back.