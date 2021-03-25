const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { itemTabel, customerTabel, supplierTabel, trxTabel, userTabel }= require('./sequelize');
const log = require('electron-log');

const escpos = require('escpos');
escpos.USB = require('escpos-usb');
// const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;

log.transports.console.level = false;
 

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
  // mainWindow.setFullScreen(true);
  // mainWindow.webContents.openDevTools()

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
  // console.log('is closing')
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
  // console.log(id)
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
  // console.log(id)
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

ipcMain.on('get-all-product-update', async function(event, data) {
  itemTabel.findAll().then(all_product => {
    mainWindow.webContents.send('all-product-update', all_product);
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

ipcMain.on('get-many-product', async function(event, data, pay_method, productArray, totalHarga, bayar, kembalian) {
  itemTabel.findAll({
    where: {
      barcode: data
    }
  }).then(product => {
    mainWindow.webContents.send('get-many-product', product, pay_method, productArray, totalHarga, bayar, kembalian);
  })
});

/* TRX AREA */
ipcMain.on('create-trx', async function(event, data, pay_method, productArray, totalHarga, bayar, kembalian) {
  var counter = 0;
  var trxDate = data[0].id_trx.split('/')[0]
  trxTabel.findAll({
    attributes: ['id_trx'],
    group: 'id_trx', 
    where: {
      id_trx: {
        [Op.like]: trxDate + '%'
      }
    }
  }).then(countTrx => {
    counter = countTrx.length + 1
    data.forEach(trx => {
      trx.id_trx = trx.id_trx + counter
    });
    trxTabel.bulkCreate(data).then(created_trx => {
      mainWindow.webContents.send('create-trx', created_trx, pay_method, productArray, totalHarga, bayar, kembalian);
    })
  })
});

ipcMain.on('create-trx-done', async function(event, data) {
  mainWindow.reload();
});

ipcMain.on('get-all-trx', async function(event, data) {
  trxTabel.findAll().then(trxs => {
    mappingItem(trxs);
  })
});

ipcMain.on('get-all-trx-cash', async function(event, data) {
  trxTabel.findAll({
    attributes: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    group: ['id_trx', 'metode_pembayaran', 'pembayaran']
  }).then(trxs => {
    // mappingItem(trxs);
    mainWindow.webContents.send('get-all-trx-cash', trxs);
  })
});

ipcMain.on('search-trx-daily', async function(event, data) {
  trxTabel.findAll({
    where: {
      trx_date: data
    }
  }).then(trxs => {
    mappingItem(trxs);
  })
});

ipcMain.on('search-trx-daily-cash', async function(event, data) {
  trxTabel.findAll({
    attributes: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    group: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    where: {
      trx_date: data
    }
  }).then(trxs => {
    mainWindow.webContents.send('get-all-trx-cash', trxs);
  })
});

ipcMain.on('search-trx-wild', async function(event, data) {
  trxTabel.findAll({
    where: {
      trx_date: {
        [Op.like]: data
      } 
    }
  }).then(trxs => {
    mappingItem(trxs);
  })
});

ipcMain.on('search-trx-wild-cash', async function(event, data) {
  trxTabel.findAll({
    attributes: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    group: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    where: {
      trx_date: {
        [Op.like]: data
      } 
    }
  }).then(trxs => {
    mainWindow.webContents.send('get-all-trx-cash', trxs);
  })
});

ipcMain.on('search-trx-adv', async function(event, start, end) {
  trxTabel.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end]
      } 
    }
  }).then(trxs => {
    mappingItem(trxs);
  })
});

ipcMain.on('search-trx-adv-cash', async function(event, start, end) {
  trxTabel.findAll({
    attributes: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    group: ['id_trx', 'metode_pembayaran', 'pembayaran'],
    where: {
      createdAt: {
        [Op.between]: [start, end]
      } 
    }
  }).then(trxs => {
    mainWindow.webContents.send('get-all-trx-cash', trxs);
  })
});

ipcMain.on('delete-all-trx', async function(event, data) {
  trxTabel.destroy({
    truncate: true
  })
});

/* LOGIN AREA */
ipcMain.on('login', async function(event, username, password, state) {
  userTabel.findOne({
    where: {
      [Op.and]: [
        { username: username },
        { password: password }
      ]
    }
  }).then(users => {
    if (users == null) {
      mainWindow.webContents.send('user-login-failed', true);
    } else {
      userLogin(users, state)
    }
  })
});

ipcMain.on('logout', async function(event, state) {
  userTabel.update({
    state: state
  }, {
    where: {
      state: 'ACTIVE'
    }
  }).then(userLogout => {
    mainWindow.loadFile(path.join(__dirname, 'cashier.html'));
  });
});

ipcMain.on('goback', async function(event, state) {
  mainWindow.loadFile(path.join(__dirname, 'cashier.html'));
});

function userLogin (users, state) {
  userTabel.update({
    state: state
  },{
    where: {
      id: users.dataValues.id
    }
  }).then(userLogin => {
    mainWindow.webContents.send('user-login', userLogin);
    if (state == 'ACTIVE') {
      mainWindow.loadFile(path.join(__dirname, 'input-product.html'));
    } else {
      mainWindow.loadFile(path.join(__dirname, 'cashier.html'));
    }
  });
}

function mappingItem (trxs) {
  var barcodeList = [];
  trxs.forEach(barcodeTrx => {
    var isExist = barcodeList.indexOf(barcodeTrx.barcode)
    if (isExist == -1) {
      barcodeList.push(barcodeTrx.barcode)
    }
  });
  itemTabel.findAll({
    where: {
      barcode: {
        [Op.in]: barcodeList
      }
    }
  }).then(items => {
    items.forEach(item => {
      trxs.forEach(trx => {
        if (trx.barcode == item.barcode) {
          trx.dataValues['nama'] = item.nama_barang
        }
      });
    });
    mainWindow.webContents.send('search-trx', trxs);
  })
}


ipcMain.on('do_print', async function(event, data, total, bayar, kembalian, paymentMethod, id_trx) {
  try {
    const device  = new escpos.USB();
    const options = { encoding: "GB18030" /* default */ }
    const printer = new escpos.Printer(device, options);
  
    // console.log(data)
  
    var myLine = '-------------------------------';
    var totalDiskon = 0;
    device.open(function(error){
      printer
      .font('a')
      .align('ct')
      .style('B')
      .size(1, 0.01)
      .text('PRISMART')
      printer
      .style('NORMAL')
      .size(0.0000001, 0.01)
      .text('Puri Sriwedari Cibubur')
      .text('Jl. Alternatif Cibubur')
      .text('Cimanggis - Depok. 16454')
      .text(myLine)
      printer
      .text('nota: ' + id_trx)
      printer
      .align('ct')
      .text(myLine)
      printer.tableCustom([
          {
              text: 'Produk', 
              align: 'LEFT',
              width: 0.2
          },
          {
            text: 'Qty x Harga', 
            align: 'RIGHT',
            width: 0.3
          },
          {
            text: 'Total', 
            align: 'RIGHT',
            width: 0.2
          }],
          {
              encoding: 'cp857',
              size: [1, 1] 
          }
      );
      printer
      .align('ct')
      .text(myLine)
  
      data.forEach(product => {
        itemTabel.findOne({
          where: {
            barcode: product.barcode
          }
        }).then(productDb => {
          itemTabel.update({
            stock: productDb.stock - parseInt(product.qty)
          },{
            where: {
              id: productDb.id
            }
          })
        })
        totalDiskon = totalDiskon + parseInt(product.diskon)
          printer.tableCustom([
              {
                  text: product.produk, 
                  align: 'LEFT',
                  width: 0.7
              }],
              {
                  encoding: 'cp857',
                  size: [1, 1] 
              }
          );
          printer.tableCustom([
            {
                text: product.qty + ' x  ' + product.harga + ' =', 
                align: 'RIGHT',
                width: 0.4
            },
            {
              text: product.total, 
              align: 'RIGHT',
              width: 0.2
            }],
            {
                encoding: 'cp857',
                size: [1, 1] 
            });
  
          if (product.diskon != '0') {
            printer.tableCustom([
              {
                  text: 'Diskon: ' + product.diskon, 
                  align: 'RIGHT',
                  width: 0.4
              }],
              {
                  encoding: 'cp857',
                  size: [1, 1] 
              });
          }
      });
      printer
      .align('ct')
      .text(myLine)
      // printer
      // .align('lt')
      // .text('Total: ' + newReformatPrice(total.replace('Rp. ', '')))
      // .text('Anda Hemat: ' + newReformatPrice(totalDiskon))
      // .text('Bayar: ' + newReformatPrice(bayar))
      // .text('Kembalian: ' + newReformatPrice(kembalian.replace('Rp. ', '')))
      // .text('\n')
      // .align('ct')
      // .text('Terima Kasih Atas Kunjungan Anda')
      
      printer.tableCustom([
          {
              text: 'Anda Hemat: ', 
              align: 'LEFT',
              width: 0.3
          },
          {
            text: newReformatPrice(totalDiskon), 
            align: 'RIGHT',
            width: 0.4
          }],
          {
              encoding: 'cp857',
              size: [1, 1] 
          }
      )
      printer.tableCustom([
          {
              text: 'Total: ', 
              align: 'LEFT',
              width: 0.3
          },
          {
            text: newReformatPrice(total.replace('Rp. ', '')), 
            align: 'RIGHT',
            width: 0.4
          }],
          {
              encoding: 'cp857',
              size: [1, 1] 
          }
      )
      printer.tableCustom([
          {
              text: 'Bayar: ', 
              align: 'LEFT',
              width: 0.3
          },
          {
            text: newReformatPrice(bayar), 
            align: 'RIGHT',
            width: 0.4
          }],
          {
              encoding: 'cp857',
              size: [1, 1] 
          }
      )
      // printer.tableCustom([
      //     {
      //         text: 'Metode Pembayaran: ', 
      //         align: 'LEFT',
      //         width: 0.5
      //     },
      //     {
      //       text: paymentMethod, 
      //       align: 'RIGHT',
      //       width: 0.2
      //     }],
      //     {
      //         encoding: 'cp857',
      //         size: [1, 1] 
      //     }
      // )
      printer.tableCustom([
          {
              text: 'Kembalian: ', 
              align: 'LEFT',
              width: 0.3
          },
          {
            text: newReformatPrice(kembalian.replace('Rp. ', '')), 
            align: 'RIGHT',
            width: 0.4
          }],
          {
              encoding: 'cp857',
              size: [1, 1] 
          }
      )
      printer
      .align('ct')
      .newLine()
      .text('Terima Kasih')
      .text('Atas Kunjungan Berbelanja Anda')
      .text('Have A Pleasant Day')
  
      .cut()
      .close()
      });
  
  } catch (err) {
    log.warn(err);
  }
});

function newReformatPrice (price) {
  var newPrice = parseFloat(price)
  return 'Rp. ' + (newPrice).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}