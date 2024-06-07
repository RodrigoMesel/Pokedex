const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setPokedex: (pokedex, user) => ipcRenderer.send('set-pokedex', pokedex, user),
  receiveInitialUser: (callback) => ipcRenderer.on('initial-user', (event, userName) => callback(userName)),
  getUserPokedex: (user) => ipcRenderer.invoke('get-user-pokedex', user)
})