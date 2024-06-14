const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setPokedex: (pokedex, user) => ipcRenderer.send('set-pokedex', pokedex, user),
  receiveInitialUser: (callback) => ipcRenderer.on('initial-user', (event, user) => callback(user)),
  getUserPokedex: (user) => ipcRenderer.invoke('get-user-pokedex', user),
  tradePokemons: (pokemon, userOwner, userDestiny) => ipcRenderer.invoke('trade-pokemon', pokemon, userOwner, userDestiny)
})