const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;

var $ = jQuery = require("jquery")

getAllProduct();

function submitData () {
    // ipcRenderer.send('do_print', true);
    var barcode = $('#barcode-input').val();
    var item_name = $('#barcode-name').val();
    var stock = $('#barcode-stock').val();
    var price = $('#barcode-price').val();
    var sell_price = $('#barcode-sell-price').val();
    
    console.log(barcode)
    /* INSERT TO DATABASE THEN */
    // $('#myModal').modal('show');
}

function newProduct () {
    $('#update-panel').hide();
    $('#new-panel').show();
}

function addProduct () {
    var barcode = $('#barcode-product').val();
    var nama_barang = $('#nama-product').val();
    var harga = $('#harga-product').val();
    var margin = $('#margin-product').val();
    var harga_jual = $('#harga-jual-product').val();
    var diskon = $('#diskon-product').val();
    var stock = $('#stock-product').val();
    
    var product_data = {
        barcode: barcode,
        nama_barang: nama_barang,
        harga: harga,
        margin: margin,
        harga_jual: harga_jual,
        diskon: diskon,
        stock: stock
    }
    ipcRenderer.send('add-product', product_data);
}

ipcRenderer.on('add-product', function (event, product) {
    var newRow = generateRow(product);
    $('#barcode-product').val('');
    $('#nama-product').val('');
    $('#harga-product').val('');
    $('#margin-product').val('');
    $('#harga-jual-product').val('');
    $('#diskon-product').val('');
    $('#stock-product').val('');
    $('#table-product-tbody tr:last').after(newRow);
});

function updateProduct (id) {
    var barcode = $('#barcode-product-update').val();
    var nama_barang = $('#nama-product-update').val();
    var harga = $('#harga-product-update').val();
    var margin = $('#margin-product-update').val();
    var harga_jual = $('#harga-jual-product-update').val();
    var diskon = $('#diskon-product-update').val();
    var stock = $('#stock-product-update').val();

    var product_data = {
        barcode: barcode,
        nama_barang: nama_barang,
        harga: harga,
        margin: margin,
        harga_jual: harga_jual,
        diskon: diskon,
        stock: stock
    }
    ipcRenderer.send('update-product', product_data, id);
}

ipcRenderer.on('update-product', function (event, product) {
    getAllProduct();
});

function deleteThisProduct (id) {
    ipcRenderer.send('delete-product', id);
}


function updateThisProduct (id) {
    
    $('#update-panel').show();
    $('#new-panel').hide();

    var barcode = $('#table-product #row_barcode_' + id).text();
    var nama_barang = $('#table-product #row_nama_' + id).text();
    var harga = $('#table-product #row_harga_' + id).text();
    var margin = $('#table-product #row_margin_' + id).text();
    var harga_jual = $('#table-product #row_harga_jual_' + id).text();
    var diskon = $('#table-product #row_diskon_' + id).text();
    var stock = $('#table-product #row_stock_' + id).text();
    
    $('#barcode-product-update').val(barcode);
    $('#nama-product-update').val(nama_barang);
    $('#harga-product-update').val(harga);
    $('#margin-product-update').val(margin);
    $('#harga-jual-product-update').val(harga_jual);
    $('#diskon-product-update').val(diskon);
    $('#stock-product-update').val(stock);

    $('#add-product-button-update').attr('onclick','updateProduct(' + id + ')');
}

function marginKeyInput () {
    var basePrice = $('#harga-product').val()
    var margin = $('#margin-product').val()
    var sellPrice = parseInt(basePrice) + (basePrice * (margin/100))
    $('#harga-jual-product').val(sellPrice)
}

function sellKeyInput () {
    var basePrice = $('#harga-product').val()
    var sellPrice = $('#harga-jual-product').val()
    var margin = ((parseInt(sellPrice)/parseInt(basePrice))-1)*100
    $('#margin-product').val(parseFloat(margin).toFixed(2))
}

function marginUpdateKeyInput () {
    var basePrice = $('#harga-product-update').val()
    var margin = $('#margin-product-update').val()
    var sellPrice = parseInt(basePrice) + (basePrice * (margin/100))
    $('#harga-jual-product-update').val(sellPrice)
}

function sellKeyUpdateInput () {
    var basePrice = $('#harga-product-update').val()
    var sellPrice = $('#harga-jual-product-update').val()
    var margin = ((parseInt(sellPrice)/parseInt(basePrice))-1)*100
    $('#margin-product-update').val(parseFloat(margin).toFixed(2))
}

function priceUpdateKeyInput () {
    var basePrice = $('#harga-product-update').val()
    var margin = $('#margin-product-update').val()
    var sellPrice = parseInt(basePrice) + (basePrice * (margin/100))
    $('#harga-jual-product-update').val(sellPrice)
}

function generateRow (data) {
    var newRow = `<tr>
    <td id="row_barcode_` + data.dataValues.id + `">` + data.dataValues.barcode + `</td>
    <td id="row_nama_` + data.dataValues.id + `">` + data.dataValues.nama_barang + `</td>
    <td id="row_harga_` + data.dataValues.id + `">` + data.dataValues.harga + `</td>
    <td id="row_margin_` + data.dataValues.id + `">` + data.dataValues.margin + `</td>
    <td id="row_harga_jual_` + data.dataValues.id + `">` + data.dataValues.harga_jual + `</td>
    <td id="row_diskon_` + data.dataValues.id + `">` + data.dataValues.diskon + `</td>
    <td id="row_stock_` + data.dataValues.id + `">` + data.dataValues.stock + `</td>
    <td>
        <button onclick="deleteThisProduct(` + data.dataValues.id + `)" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>
        <button onclick="updateThisProduct(` + data.dataValues.id + `)" class="btn btn-warning"><i class="fa fa-edit"></i></button>
    </td>
    <tr>`
    return newRow;
}

function getAllProduct () {
    $('#update-panel').hide();
    $("#table-product-tbody").empty();
    ipcRenderer.send('get-all-product', true);
}

ipcRenderer.on('all-product', function (event, product_data) {
    console.log(product_data)
    product_data.forEach(product => {
        var newRow = generateRow(product);
        $('#table-product').find('tbody').append(newRow);
    });
});