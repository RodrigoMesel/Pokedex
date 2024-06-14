import { app, BrowserWindow, ipcMain } from'electron';
import path from'path';
import serve from'electron-serve';
import Store from 'electron-store';
import { fileURLToPath } from 'url';


const loadURL = serve({ directory: 'build' });
const store = new Store()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function isDev() {
    return !app.isPackaged;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, //1200
        height: 585, // 600
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.ts'),
            contextIsolation: true,
        },
        icon: isDev() ? path.join(process.cwd(), 'public/logo512.png') : path.join(__dirname, 'build/logo512.png'),
        show: false
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:3000/');
    } else {
        loadURL(mainWindow);
    }
    
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()

        let lastUser = store.get('lastUser', {
            name: "Rodrigo Oliveira",
            id: "02f55375-b904-430e-a67e-23a69f755ddb"});
        mainWindow.webContents.send('initial-user', lastUser);
    });
}

function handleSetPokedex (event, pokedex, user) {
    const pokedexPath = user.id + ".pokedex";
    store.set(pokedexPath, pokedex);
}

function handleGetUserPokedex (event, user) {
    store.set('lastUser', user);
    const pokedexPath = user.id + ".pokedex"
    let pokedex = store.get(pokedexPath, []);
    return pokedex;
}

function handleTradePokemon(event, pokemon, userOwner, userDestiny) {
    const ownerPokedexPath = userOwner.id + ".pokedex";
    let ownerPokedex = store.get(ownerPokedexPath, []);
    const destinyPokedexPath = userDestiny.id + ".pokedex";
    let destinyPokedex = store.get(destinyPokedexPath, []);

    ownerPokedex = ownerPokedex.filter(c => c.id !== pokemon.id);
    destinyPokedex = [...destinyPokedex, pokemon];

    store.set(ownerPokedexPath, ownerPokedex);
    store.set(destinyPokedexPath, destinyPokedex);

    return ownerPokedex;
}


app.whenReady().then(() => {
    ipcMain.on('set-pokedex', handleSetPokedex);
    ipcMain.handle('trade-pokemon', handleTradePokemon);
    ipcMain.handle('get-user-pokedex', handleGetUserPokedex);
    createWindow()
  })


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});
