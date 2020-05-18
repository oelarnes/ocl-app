# A High-Level description of the front-end flow of dr4ft

entry point: ```init.js```

pass the export singleton of ```app.js``` to the export of ```router.js```

## app.js

```app.js``` is a singleton object extending ```EventEmitter``` containing a state property with default values, and functions to set state, trigger, and respond to game events.

```init()``` method is passed the router export. First calls ```restore``` and ```connect``` then calls router, which calls ```join``` with the location id.

```restore()``` uses cached local state to reinitialize app state. 
```connect()``` attaches a web socket through engine.io() using the id and name from restore. Note that id is possibly from a previous session, not necessarily the location bar.


```router.js ``` imports the primary application components ```Game``` and ```Lobby```, sets up a function to handle route changes, including causing App to join games based on route. Finally, calls a function which binds App to this function state and monitors location bar changes.

Next, for a game, we call ```App.send("join", id)```, which talks to the ws we initialized in ```connect()```

## websocket

in the package-level app.js, we initialize a socket listenin