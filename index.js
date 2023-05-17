require('update-electron-app')();
const { app, BrowserWindow, nativeImage, autoUpdater, dialog } = require('electron');

const server = 'https://app.deployments.api.playeasy.games/'
let url = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url })

if (app.isPackaged) {
setInterval(() => {
 autoUpdater.checkForUpdates()
}, 60000)
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.setMenu(null);

  win.webContents.on('did-finish-load', () => {
    win.setTitle('GiveAways Desktop Client');
    win.setIcon(nativeImage.createFromPath('assets/logo.png'));
  });

   win.loadURL('https://playeasy.games');
}

app.on('ready', async function () {
  createWindow();
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
 const dialogOpts = {
   type: 'info',
   buttons: ['Restart', 'Later'],
   title: 'Application Update',
   message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version of the PlayEasyGames Desktop Client has been downloaded. Restart the PlayEasyGames Desktop Client to apply the updates.',
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application')
  console.error(message)
})
