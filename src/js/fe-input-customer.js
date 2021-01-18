const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;

var $ = jQuery = require("jquery")

getAllCustomer()

function newCustomer () {
    $('#new-panel').show()
    $('#update-panel').hide()
}

function updateCustomer (id) {
    var nama_customer = $('#nama-customer-update').val();
    var telp_customer = $('#telp-customer-update').val();
    var alamat_customer = $('#alamat-customer-update').val();
    var customer_data = {
        nama_customer: nama_customer,
        telp_customer: telp_customer,
        alamat_customer: alamat_customer
    }
    ipcRenderer.send('update-customer', customer_data, id);
}

ipcRenderer.on('update-customer', function (event, customer) {
    getAllCustomer();
});

function addCustomer () {
    var nama_customer = $('#nama-customer').val();
    var telp_customer = $('#telp-customer').val();
    var alamat_customer = $('#alamat-customer').val();
    var customer_data = {
        nama_customer: nama_customer,
        telp_customer: telp_customer,
        alamat_customer: alamat_customer
    }
    ipcRenderer.send('add-customer', customer_data);
}

ipcRenderer.on('add-customer', function (event, customer) {
    var newRow = generateRow(customer);
    $('#nama-customer').val('');
    $('#telp-customer').val('');
    $('#alamat-customer').val('');
    $('#table-customer-tbody tr:last').after(newRow);
});

function deleteThisCustomer (id) {
    ipcRenderer.send('delete-customer', id);
}

ipcRenderer.on('delete-customer', function (event, customer) {
    getAllCustomer();
});

function updateThisCustomer (id) {
    $('#new-panel').hide()
    $('#update-panel').show()
    var nama = $('#table-customer #row_nama_' + id).text();
    var alamat = $('#table-customer #row_alamat_' + id).text();
    var telp = $('#table-customer #row_telp_' + id).text();
    $('#nama-customer-update').val(nama);
    $('#telp-customer-update').val(telp);
    $('#alamat-customer-update').val(alamat);
    $('#add-customer-button-update').attr('onclick','updateCustomer(' + id + ')');
}

function getAllCustomer () {
    $("#table-customer-tbody").empty();
    $('#new-panel').show()
    $('#update-panel').hide()
    ipcRenderer.send('get-all-customer', true);
}

ipcRenderer.on('all-customer', function (event, customer_data) {
    customer_data.forEach(customer => {
        var newRow = generateRow(customer);
        $('#table-customer').find('tbody').append(newRow);
    });
});

function generateRow (data) {
    var newRow = `<tr>
    <td id="row_nama_` + data.dataValues.id + `">` + data.dataValues.nama_customer + `</td>
    <td id="row_telp_` + data.dataValues.id + `">` + data.dataValues.telp_customer + `</td>
    <td id="row_alamat_` + data.dataValues.id + `">` + data.dataValues.alamat_customer + `</td>
    <td>
        <button onclick="deleteThisCustomer(` + data.dataValues.id + `)" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>
        <button onclick="updateThisCustomer(` + data.dataValues.id + `)" class="btn btn-info"><i class="fa fa-edit"></i></button>
    </td>
    <tr>`
    return newRow;
}