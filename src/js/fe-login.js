var ipcRenderer = require('electron').ipcRenderer;

var $ = jQuery = require("jquery")

function doLogin () {
    var username = $('#username').val();
    var password = $('#password').val();
    ipcRenderer.send('login', username, password, 'ACTIVE');
}

ipcRenderer.on('user-login', function (event, user) {
    console.log(user)
});

ipcRenderer.on('user-login-failed', function (event, error) {
    console.log(error)
});

function doLogout () {
    ipcRenderer.send('logout', 'INACTIVE');
}

function goback () {
    ipcRenderer.send('goback', true);
}