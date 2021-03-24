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
    ipcRenderer.send('get-all-trx-cash', true);
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
            filterParam = dateInput[2] + '-' + dateInput[1] + '-' + dateInput[0]
            ipcRenderer.send('search-trx-daily-cash', filterParam);
            break;
        case 'MONTHLY':
            var month = '';
            if ($('#bulan-monthly-filter').val().length == 1) {
                month = '0' + $('#bulan-monthly-filter').val()
            } else {
                month = $('#bulan-monthly-filter').val()
            }
            filterParam = '%-' + month + '-' + $('#tahun-monthly-filter').val() 
            ipcRenderer.send('search-trx-wild-cash', filterParam);
            break;
        case 'ANNUALY':
            filterParam = '%-' + $('#tahun-annualy-filter').val() 
            ipcRenderer.send('search-trx-wild-cash', filterParam);
            break;
        default:
            var startDate = $('#range1-filter').val()
            var endDate = $('#range2-filter').val()
            ipcRenderer.send('search-trx-adv-cash', startDate, endDate);
            break;
    }
}

function doFilterCash () {
    $("#table-trx-tbody").empty();
    var filterParam = '';
    switch (FILTER_STATE) {
        case 'DAILY':
            // console.log('daily')
            var dateInput = $('#tanggal-daily-filter').val().toString().split('-')
            filterParam = dateInput[2] + '-' + dateInput[1] + '-' + dateInput[0]
            ipcRenderer.send('search-trx-daily-cash', filterParam);
            break;
        case 'MONTHLY':
            var month = '';
            if ($('#bulan-monthly-filter').val().length == 1) {
                month = '0' + $('#bulan-monthly-filter').val()
            } else {
                month = $('#bulan-monthly-filter').val()
            }
            filterParam = '%-' + month + '-' + $('#tahun-monthly-filter').val() 
            ipcRenderer.send('search-trx-wild-cash', filterParam);
            break;
        case 'ANNUALY':
            filterParam = '%-' + $('#tahun-annualy-filter').val() 
            ipcRenderer.send('search-trx-wild-cash', filterParam);
            break;
        default:
            var startDate = $('#range1-filter').val()
            var endDate = $('#range2-filter').val()
            ipcRenderer.send('search-trx-adv-cash', startDate, endDate);
            break;
    }
}


ipcRenderer.on('get-all-trx-cash', function (event, trx_data) {
    var trxSummarys = [];
    console.log(trx_data)
    trx_data.forEach(trx => {
        trxSummarys.push(trx.dataValues)
    });
    trxSummarys.forEach(trx => {
        var newRow = generateRow(trx);
        $('#table-trx').find('tbody').append(newRow);
    });
    var totalRow = generateTotalRow(trxSummarys);
    $('#table-trx').find('tbody').append(totalRow);
});

// ipcRenderer.on('search-trx', function (event, trx_data) {
//     var trxSummarys = [];
//     if (trx_data.length == 0) {
//         var newRow = generateEmptyRow();
//         $('#table-trx').find('tbody').append(newRow);
//         return;
//     }
//     trx_data.forEach(trx => {
//         if (trxSummarys.length == 0) {
//             trxSummarys.push(trx.dataValues)
//         } else {
//             let trxFound = trxSummarys.find(trxSummary => 
//                 trxSummary.barcode === trx.dataValues.barcode);
//             if (trxFound) {
//                 trxFound.qty = trxFound.qty + trx.dataValues.qty
//             } else {
//                 trxSummarys.push(trx.dataValues)
//             }
//         }
//     });
//     // console.log(trxSummarys)
//     trxSummarys.forEach(trx => {
//         var newRow = generateRow(trx);
//         $('#table-trx').find('tbody').append(newRow);
//     });
//     var totalRow = generateTotalRow(trxSummarys);
//     $('#table-trx').find('tbody').append(totalRow);
// })

function generateRow (data) {
    var newRow = `<tr>
    <td>` + data.id_trx + `</td>
    <td>` + data.metode_pembayaran + `</td>
    <td>` + data.pembayaran + `</td>
    </tr>`
    return newRow;
}

function generateTotalRow (summary) {
    var nominal = 0;
    summary.forEach(sum => {
        console.log(sum)
        nominal = nominal + sum.pembayaran
    });
    var newRow = `<tr>
    <td colspan=2>Total</td>
    <td>` + parseFloat(nominal).toFixed(2) + `</td>
    </tr>`
    return newRow;
}

function generateEmptyRow () {
    var newRow = `<tr>
    <td colspan=6>Belum ada transaksi</td>
    </tr>`
    return newRow;
}

function doClearData () {
    var clearAlert = confirm("Semua data transaksi akan dihapus, anda yakin?");
    if (clearAlert) {
        $("#table-trx-tbody").empty();
        ipcRenderer.send('delete-all-trx', true);
        var newRow = generateEmptyRow();
        $('#table-trx').find('tbody').append(newRow);
    }
}

function downloadTest () {
    TableToExcel.convert(document.getElementById("table-trx"), {
        name: "payment-report.xlsx",
        sheet: {
          name: "Sheet 1"
        }
      });
}