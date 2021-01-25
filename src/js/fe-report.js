const remote = require('electron').remote
var ipcRenderer = require('electron').ipcRenderer;

var $ = jQuery = require("jquery")

var FILTER_STATE = 'DAILY';

getAllTrx()

function getAllTrx () {
    $("#filter-bulanan-panel").hide();
    $("#filter-tahunan-panel").hide();
    $("#filter-advance-panel").hide();
    $("#table-trx-tbody").empty();
    ipcRenderer.send('get-all-trx', true);
}

function filterBulanan () {
    FILTER_STATE = 'MONTHLY';
    $("#filter-bulanan-panel").show();
    $("#filter-harian-panel").hide();
    $("#filter-tahunan-panel").hide();
    $("#filter-advance-panel").hide();
}

function filterHarian () {
    FILTER_STATE = 'DAILY';
    $("#filter-harian-panel").show();
    $("#filter-bulanan-panel").hide();
    $("#filter-tahunan-panel").hide();
    $("#filter-advance-panel").hide();
}

function filterTahunan () {
    FILTER_STATE = 'ANNUALY';
    $("#filter-tahunan-panel").show();
    $("#filter-bulanan-panel").hide();
    $("#filter-harian-panel").hide();
    $("#filter-advance-panel").hide();
}

function filterAdvance () {
    FILTER_STATE = 'ADVANCE';
    $("#filter-tahunan-panel").hide();
    $("#filter-bulanan-panel").hide();
    $("#filter-harian-panel").hide();
    $("#filter-advance-panel").show();
}

function doFilter () {
    $("#table-trx-tbody").empty();
    var filterParam = '';
    switch (FILTER_STATE) {
        case 'DAILY':
            // console.log('daily')
            var dateInput = $('#tanggal-daily-filter').val().toString().split('-')
            filterParam = dateInput[2] + '/' + dateInput[1] + '/' + dateInput[0]
            ipcRenderer.send('search-trx-daily', filterParam);
            break;
        case 'MONTHLY':
            var month = '';
            if ($('#bulan-monthly-filter').val().length == 1) {
                month = '0' + $('#bulan-monthly-filter').val()
            } else {
                month = $('#bulan-monthly-filter').val()
            }
            filterParam = '%/' + month + '/' + $('#tahun-monthly-filter').val() 
            ipcRenderer.send('search-trx-wild', filterParam);
            break;
        case 'ANNUALY':
            filterParam = '%/' + $('#tahun-annualy-filter').val() 
            ipcRenderer.send('search-trx-wild', filterParam);
            break;
        default:
            var startDate = $('#range1-filter').val()
            var endDate = $('#range2-filter').val()
            ipcRenderer.send('search-trx-adv', startDate, endDate);
            break;
    }
}

ipcRenderer.on('search-trx', function (event, trx_data) {
    var trxSummarys = [];
    if (trx_data.length == 0) {
        var newRow = generateEmptyRow();
        $('#table-trx').find('tbody').append(newRow);
        return;
    }
    trx_data.forEach(trx => {
        if (trxSummarys.length == 0) {
            trxSummarys.push(trx.dataValues)
        } else {
            let trxFound = trxSummarys.find(trxSummary => 
                trxSummary.barcode === trx.dataValues.barcode);
            if (trxFound) {
                trxFound.qty = trxFound.qty + trx.dataValues.qty
            } else {
                trxSummarys.push(trx.dataValues)
            }
        }
    });
    console.log(trxSummarys)
    trxSummarys.forEach(trx => {
        var newRow = generateRow(trx);
        $('#table-trx').find('tbody').append(newRow);
    });
    var totalRow = generateTotalRow(trxSummarys);
    $('#table-trx').find('tbody').append(totalRow);
})

ipcRenderer.on('get-all-trx', function (event, trx_data) {
    var trxSummarys = [];
    trx_data.forEach(trx => {
        if (trxSummarys.length == 0) {
            trxSummarys.push(trx.dataValues)
        } else {
            let trxFound = trxSummarys.find(trxSummary => 
                trxSummary.barcode === trx.dataValues.barcode);
            if (trxFound) {
                trxFound.qty = trxFound.qty + trx.dataValues.qty
            } else {
                trxSummarys.push(trx.dataValues)
            }
        }
    });
    trxSummarys.forEach(trx => {
        var newRow = generateRow(trx);
        $('#table-trx').find('tbody').append(newRow);
    });
    var totalRow = generateTotalRow(trxSummarys);
    $('#table-trx').find('tbody').append(totalRow);
});

function generateRow (data) {
    var margin = (data.harga * (data.margin/100))*data.qty
    var newRow = `<tr>
    <td id="row_barcode_` + data.id + `">` + data.barcode + `</td>
    <td id="row_nama_` + data.id + `">` + data.nama + `</td>
    <td id="row_harga_` + data.id + `">` + data.harga + `</td>
    <td id="row_margin_` + data.id + `">` + data.qty + `</td>
    <td id="row_harga_jual_` + data.id + `">` + data.margin + `</td>
    <td id="row_diskon_` + data.id + `">` + margin + `</td>
    <tr>`
    return newRow;
}

function generateTotalRow (summary) {
    var qty = 0;
    var marginFinal = 0;
    summary.forEach(sum => {
        qty = qty + sum.qty
        var margin = (sum.harga * (sum.margin/100))*sum.qty
        marginFinal = marginFinal + margin
    });
    var newRow = `<tr>
    <td colspan=3>Total</td>
    <td>` + qty + `</td>
    <td></td>
    <td>` + marginFinal + `</td>
    <tr>`
    return newRow;
}

function generateEmptyRow () {
    var newRow = `<tr>
    <td colspan=6>Belum ada transaksi</td>
    <tr>`
    return newRow;
}