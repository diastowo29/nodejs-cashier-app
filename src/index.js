const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { itemTabel, customerTabel, supplierTabel, trxTabel }= require('./sequelize');

const escpos = require('escpos');
escpos.USB = require('escpos-usb');
// const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;
 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
var mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'cashier.html'));

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

/* CUSTOMER AREA */

ipcMain.on('get-all-customer', async function(event, data) {
  customerTabel.findAll().then(all_customer => {
    mainWindow.webContents.send('all-customer', all_customer);
  })
});

ipcMain.on('add-customer', async function(event, data) {
  customerTabel.create(data).then(created_customer => {
    mainWindow.webContents.send('add-customer', created_customer);
  })
});

ipcMain.on('delete-customer', async function(event, id) {
  customerTabel.destroy({
    where: {
      id: id
    }
  }).then(deleted_customer => {
    mainWindow.webContents.send('delete-customer', deleted_customer);
  })
});

ipcMain.on('update-customer', async function(event, data, id) {
  console.log(id)
  customerTabel.update(data,{
    where: {
      id: id
    }
  }).then(updated_customer => {
    mainWindow.webContents.send('update-customer', updated_customer);
  })
});

/* SUPPLIER AREA */
ipcMain.on('get-all-supplier', async function(event, data) {
  supplierTabel.findAll().then(all_supplier => {
    mainWindow.webContents.send('all-supplier', all_supplier);
  })
});


ipcMain.on('add-supplier', async function(event, data) {
  supplierTabel.create(data).then(created_supplier => {
    mainWindow.webContents.send('add-supplier', created_supplier);
  })
});

ipcMain.on('delete-supplier', async function(event, id) {
  supplierTabel.destroy({
    where: {
      id: id
    }
  }).then(deleted_supplier => {
    mainWindow.webContents.send('delete-supplier', deleted_supplier);
  })
});

ipcMain.on('update-supplier', async function(event, data, id) {
  console.log(id)
  supplierTabel.update(data,{
    where: {
      id: id
    }
  }).then(updated_supplier => {
    mainWindow.webContents.send('update-supplier', updated_supplier);
  })
});

/* PRODUCT AREA */
ipcMain.on('add-product', async function(event, data) {
  itemTabel.create(data).then(created_product => {
    mainWindow.webContents.send('add-product', created_product);
  })
});

ipcMain.on('get-all-product', async function(event, data) {
  itemTabel.findAll().then(all_product => {
    mainWindow.webContents.send('all-product', all_product);
  })
});

ipcMain.on('update-product', async function(event, data, id) {
  itemTabel.update(data,{
    where: {
      id: id
    }
  }).then(updated_product => {
    mainWindow.webContents.send('update-product', updated_product);
  })
});

ipcMain.on('delete-product', async function(event, id) {
  itemTabel.destroy({
    where: {
      id: id
    }
  }).then(deleted_product => {
    mainWindow.webContents.send('update-product', deleted_product);
  })
});

ipcMain.on('get-product', async function(event, data) {
  itemTabel.findOne({
    where: {
      barcode: data
    }
  }).then(product => {
    mainWindow.webContents.send('get-product', product);
  })
});

ipcMain.on('get-many-product', async function(event, data) {
  itemTabel.findAll({
    where: {
      barcode: data
    }
  }).then(product => {
    mainWindow.webContents.send('get-many-product', product);
  })
});

/* TRX AREA */
ipcMain.on('create-trx', async function(event, data) {
  data.forEach(trx => {
    trxTabel.create(trx).then(created_trx => {
      mainWindow.webContents.send('create-trx', created_trx);
    })
  });
});

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