function validarsoloNumeros(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if ((charCode >= 48 && charCode <= 57) || (charCode == 8) || (charCode == 9)) {
        return true;
    }
    return false;
}

function soloLetras(evt) {
    tecla = (evt.which) ? evt.which : event.keyCode;
    if (tecla == 8 || tecla == 9) {
        return true;
    }
    patron = /^[a-no-z A-NO-Z]$/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
}

function load() {
    var loader = document.getElementsByClassName('loader');
    loader[0].style.display = 'flex';
}

function loaded() {
    var loader = document.getElementsByClassName('loader');
    loader[0].style.display = 'none';
}