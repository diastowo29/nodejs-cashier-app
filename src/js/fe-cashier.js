const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;
const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;

var $ = jQuery = require("jquery")

var proceedPrint = false;
$('#trx-done-btn').attr('disabled', true);
// var rupiah = document.getElementById('rupiah');

// rupiah.addEventListener('keyup', function(e){
    //     rupiah.value = formatRupiah(this.value);    
    // });
    

function formatRupiah (angka) {
    // var number_string = angka.replace(/[^,\d]/g, '').toString(),
    // split   		= number_string.split(','),
    // sisa     		= split[0].length % 3,
    // rupiah     		= split[0].substr(0, sisa),
    // ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

    // // tambahkan titik jika yang di input sudah menjadi angka ribuan
    // if(ribuan){
    //     separator = sisa ? '.' : '';
    //     rupiah += separator + ribuan.join('.');
    // }

    // rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    // return rupiah;
}

function payMethodChange () {
    var paymentMethod = $('#payment-method').val()
    if (paymentMethod == 'debit') {
        $('#payment-input').val($('#totalCell').text().replace('Rp. ', ''));
        $('#payment-input').attr('disabled', true);
    } else {
        $('#payment-input').attr('disabled', false);
    }
}

function doPrint () {
    var barcodes = [];
    var productArray = [];
    var totalHarga = '';
    var bayar = '';
    var kembalian = '';
    $("#table-trx-tbody td").each(function() {
        var tdId = $(this).attr("id");
        if (tdId.includes('row_barcode_')) {
            var barcodeId = $(this).text()
            var dataId = tdId.split('_')[2];
            productArray.push({
                barcode: $('#row_barcode_' + dataId).text(),
                produk: $('#row_nama_' + dataId).text(),
                qty: $('#row_input_qty_' + dataId).val(),
                harga: $('#row_harga_' + dataId).text(),
                diskon: $('#row_diskon_' + dataId).text(),
                total: $('#row_total_' + dataId).text()
            })
            $('#row_input_qty_' + dataId).prop( "disabled", true );
            barcodes.push(barcodeId)
        } 
    });
    totalHarga = $('#totalCell').text()
    bayar = $('#payment-input').val()
    kembalian = $('#changeRupiah').text()
    console.log('printing...')
    console.log(productArray)
    ipcRenderer.send('get-many-product', barcodes);
    ipcRenderer.send('do_print', productArray, totalHarga, bayar, kembalian);
}

function deleteThisProduct (id) {
    $('#row_trx_' + id).remove();
    checkTable();
}

ipcRenderer.on('get-many-product', function (event, many_product) {
    var trx = []
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    many_product.forEach(product => {
        trx.push({
            barcode: product.dataValues.barcode,
            harga: product.dataValues.harga,
            diskon: product.dataValues.diskon,
            qty: $('#row_input_qty_' + product.dataValues.id).val(),
            margin: product.dataValues.margin,
            total: $('#totalCell').text().replace('Rp. ', ''),
            pembayaran: $('#payment-input').val(),
            trx_date: today
        })
    });
    ipcRenderer.send('create-trx', trx);
});

ipcRenderer.on('create-trx', function (event, trx) {
    ipcRenderer.send('create-trx-done', true);
});

function barcodeChange () {
    var barcodeInput = $('#barcode-input').val();
    $('#table-trx-tbody tr#no_trx_row').remove();
    ipcRenderer.send('get-product', barcodeInput);
}

ipcRenderer.on('get-product', function (event, product) {
    var newRow = generateRow(product);
    $('#barcode-input').val('');
    if ($('#row_barcode_' + product.dataValues.id).length) {
        $('#row_input_qty_' + product.dataValues.id).val(parseInt($('#row_input_qty_' + product.dataValues.id).val()) + 1);
        qtyChange(product.dataValues.id)
    } else {
        $('#table-trx').find('tbody').append(newRow);
    }
    countTotal();
});

function rupiahInput () {
    var rupiah = $('#payment-input').val();
    var total = $('#totalCell').text().replace('Rp. ', '');
    var kembalian = parseInt(rupiah) - parseInt(total)
    if (kembalian < 0) {
        $('#trx-done-btn').attr('disabled', true);
    } else {
        $('#trx-done-btn').attr('disabled', false);
    }
    $('#changeRupiah').html('Rp. ' + kembalian)
}

function countTotal () {
    var subTotal = 0;
    $("#table-trx-tbody td").each(function() {
        var tdId = $(this).attr("id");
        if (tdId.includes('row_total_')) {
            subTotal = subTotal + parseInt($(this).text());
        }
    });
    $('#totalCell').html('Rp. ' + subTotal)
}

function qtyChange (id) {
    var hargaBasic = parseInt($('#row_harga_' + id).text());
    var qty = parseInt($('#row_input_qty_' + id).val());
    var diskon = parseInt($('#row_diskon_' + id).text());
    var newHargaTotal = hargaBasic * qty - diskon

    $('#row_total_' + id).html(newHargaTotal)
    countTotal();
}

function checkTable () {
    var rowCount = $('#table-trx-tbody tr').length;
    console.log(rowCount)
    if (rowCount == 0) {
        var newRow = ` <tr id="no_trx_row">
            <td colspan="7">Belum ada transaksi</td>
        </tr>`
        $('#table-trx').find('tbody').append(newRow);
    }
}

function generateRow (data) {
    var hargaJualTotal = parseInt(data.dataValues.harga_jual) * 1 - data.dataValues.diskon
    var newRow = `<tr id="row_trx_` + data.dataValues.id + `">
    <td id="row_barcode_` + data.dataValues.id + `">` + data.dataValues.barcode + `</td>
    <td id="row_nama_` + data.dataValues.id + `">` + data.dataValues.nama_barang + `</td>
    <td id="row_harga_` + data.dataValues.id + `">` + data.dataValues.harga_jual + `</td>
    <td id="row_qty_` + data.dataValues.id + `"><input onchange="qtyChange(` + data.dataValues.id + `)" id="row_input_qty_` + data.dataValues.id + `" type="number" class="form-control qty-input" value="` + 1 + `" ></td>
    <td id="row_diskon_` + data.dataValues.id + `">` + data.dataValues.diskon + `</td>
    <td id="row_total_` + data.dataValues.id + `">` + hargaJualTotal + `</td>
    <td id="row_button">
        <button onclick="deleteThisProduct(` + data.dataValues.id + `)" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>`
    return newRow;
}

function doReset () {
    ipcRenderer.send('create-trx-done', true);
}
