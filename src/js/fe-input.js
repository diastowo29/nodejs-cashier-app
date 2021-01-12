console.log('hai')
const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;

var $ = jQuery = require("jquery")

function submitData () {
    // ipcRenderer.send('do_print', true);
    var barcode = $('#barcode-input').val();
    var item_name = $('#barcode-name').val();
    var stock = $('#barcode-stock').val();
    var price = $('#barcode-price').val();
    var sell_price = $('#barcode-sell-price').val();
    
    console.log(barcode)
    /* INSERT TO DATABASE THEN */
    $('#myModal').modal('show');
}

function marginKeyInput () {
    var basePrice = $('#barcode-price').val()
    var margin = $('#margin').val()
    var sellPrice = parseInt(basePrice) + (basePrice * (margin/100))
    $('#barcode-sell-price').val(sellPrice)
}