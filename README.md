# esp8266-magic-wand

A node server and NodeMCU programs for driving an ESP8266 persistence of vision toy

## Scope and assumptions

The code in this project is written around an ESP8266 connected to a 16 pixel chain of WS2812s. You can easily alter the code on the frontend and on the ESP to use a longer or shorter chain.

The project is optimized around using a small memory footprint on the ESP. If you have suggestions for ways to improve my existing code for better memory management, pull requests are most welcome. Hit me up on [Twitter](https://twitter.com/hypothete)!

## Getting started

Flash your NodeMCU-compatible ESP chip with firmware from [nodemcu-build.com](https://nodemcu-build.com/). The modules you need are file, node, timer, websocket, wifi, and (most importantly) WS2812.

Using a tool like [ESPlorer](https://esp8266.ru/esplorer/), upload the files in the lua directory to your ESP. Configure wificonnect.lua to use your wifi network credentials, and make sue the IP address for your server is correct in websocket.lua.

run `npm install` inside the node folder to pull down dependencies, then start the server with `node app`. It will run on port 8080.

Finally, open a browser tab to localhost:8080, and reset your ESP so that it starts listening for websocket messages.

## How it works

When you select an image in the browser tab, it will be drawn to a canvas element on the page that is 16px in height and proportional in width. A timer runs, stepping over each column of pixels and reading them off of the canvas. The pixel data is a [Uint8ClampedArray](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) with values from 0-255 like 'R, G. B, A...'. The frontend code reduces each byte to a [nibble](https://en.wikipedia.org/wiki/Nibble) for the sake of brevity, and does some rough gamma correcting. Then, the code rejoins the pixel data as a string in the form 'GRB'. Finally, the list of pixels is joined and prepended with a '#' as a delineator, and sent over the websocket connection. This happens once every 200ms, though you can adjust the rate if you want. I've found that under 200ms can overwhelm the ESP's memory.

The node server running the websocket connection is just a passthrough for messages and a host for the web interface. It sends the string along to the ESP, which intercepts it using the code in websockets.lua. the values are converted back to integers from hexadecimal and stored in a table, which is then concatted into a string for consumption by the ws2812 module. There's a line towards the end of the file that reads `num = num`. You can change the line to `num = num * 16` to multiply back your nibble values to the full 0-255 range, or use some other multiplier to adjust brightness. I've found that the color is truer on the strip at lower brightnesses.

## Remaining improvements

If the websocket connection goes down for the ESP, there's currently no good way to reconnect without restarting the device. I'm still trying to figure out if there's a better way for it to recover.

Obviously the constant wifi connection is a limitation as well. If I were to build this from scratch again, I would opt for an ESP with more RAM and attach an SD card reader for storing images. That said, this has been an interesting exercise in "working small."
