const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { itemTabel }= require('./sequelize');

const escpos = require('escpos');
escpos.USB = require('escpos-usb');
// const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;
 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('do_print', async function(event, data) {
  console.log('helo')
  const device  = new escpos.USB();
  const options = { encoding: "GB18030" /* default */ }
  const printer = new escpos.Printer(device, options);
  device.open(function(error){
    printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(0.01, 0.01)
    .text('The quick brown fox jumps over the lazy dog')
    // .text('敏捷的棕色狐狸跳过懒狗')
    // .barcode('1234567', 'EAN8')
    .table(["One", "Two", "Three"])
    // .tableCustom(
    //     [
    //     { text:"Left", align:"LEFT", width:0.33, style: 'B' },
    //     { text:"Center", align:"CENTER", width:0.33},
    //     { text:"Right", align:"RIGHT", width:0.33 }
    //     ],
    //     { encoding: 'cp857', size: [1, 1] } // Optional
    // )
    // .qrimage('https://github.com/song940/node-escpos', function(err){
    //     this.cut();
    //     this.close();
    // });
    .cut()
    .close()
    });
});