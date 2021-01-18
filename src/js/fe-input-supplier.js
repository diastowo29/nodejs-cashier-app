const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;

var $ = jQuery = require("jquery")

getAllSupplier()

function newSupplier () {
    $('#new-panel').show()
    $('#update-panel').hide()
}

function updateSupplier (id) {
    var nama_supplier = $('#nama-supplier-update').val();
    var item_supplier = $('#item-supplier-update').val();
    var telp_supplier = $('#telp-supplier-update').val();
    var supplier_data = {
        nama_supplier: nama_supplier,
        item_supplier: item_supplier,
        telp_supplier: telp_supplier
    }
    ipcRenderer.send('update-supplier', supplier_data, id);
}

ipcRenderer.on('update-supplier', function (event, supplier) {
    getAllSupplier();
});

function addSupplier () {
    var nama_supplier = $('#nama-supplier').val();
    var item_supplier = $('#item-supplier').val();
    var telp_supplier = $('#telp-supplier').val();
    var supplier_data = {
        nama_supplier: nama_supplier,
        item_supplier: item_supplier,
        telp_supplier: telp_supplier
    }
    ipcRenderer.send('add-supplier', supplier_data);
}

ipcRenderer.on('add-supplier', function (event, supplier) {
    var newRow = generateRow(supplier);
    $('#nama-supplier').val('');
    $('#telp-supplier').val('');
    $('#item-supplier').val('');
    $('#table-supplier-tbody tr:last').after(newRow);
});

function deleteThisSupplier (id) {
    ipcRenderer.send('delete-supplier', id);
}

ipcRenderer.on('delete-supplier', function (event, supplier) {
    getAllSupplier();
});

function updateThisSupplier (id) {
    $('#new-panel').hide()
    $('#update-panel').show()

    var nama = $('#table-supplier #row_nama_' + id).text();
    var item = $('#table-supplier #row_item_' + id).text();
    var telp = $('#table-supplier #row_telp_' + id).text();
    
    $('#nama-supplier-update').val(nama);
    $('#telp-supplier-update').val(telp);
    $('#item-supplier-update').val(item);
    $('#add-supplier-button-update').attr('onclick','updateSupplier(' + id + ')');
}

function getAllSupplier () {
    $("#table-supplier-tbody").empty();
    $('#new-panel').show()
    $('#update-panel').hide()
    ipcRenderer.send('get-all-supplier', true);
}

ipcRenderer.on('all-supplier', function (event, supplier_data) {
    console.log(supplier_data)
    supplier_data.forEach(supplier => {
        console.log(supplier)
        var newRow = generateRow(supplier);
        $('#table-supplier').find('tbody').append(newRow);
    });
});

function generateRow (data) {
    var newRow = `<tr>
    <td id="row_nama_` + data.dataValues.id + `">` + data.dataValues.nama_supplier + `</td>
    <td id="row_item_` + data.dataValues.id + `">` + data.dataValues.item_supplier + `</td>
    <td id="row_telp_` + data.dataValues.id + `">` + data.dataValues.telp_supplier + `</td>
    <td>
        <button onclick="deleteThisSupplier(` + data.dataValues.id + `)" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>
        <button onclick="updateThisSupplier(` + data.dataValues.id + `)" class="btn btn-info"><i class="fa fa-edit"></i></button>
    </td>
    <tr>`
    return newRow;
}