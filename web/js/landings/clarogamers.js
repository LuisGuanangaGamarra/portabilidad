function validarEmail(email) {
    var patternEmail = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return patternEmail.test(email.trim());
}

function validarCelular(celular) {
    var patternCell = new RegExp(/^09\d\d\d\d\d\d\d\d$/g);
    return patternCell.test(celular.trim());
}

function modulo10_Cedula_RucNatural(cedruc) {
    var suma = 0;
    var residuo = 0;
    var coeficientes_arr = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    for (i = 0; i < coeficientes_arr.length; i++) {
        var v = parseInt(cedruc.charAt(i)) * coeficientes_arr[i];
        if (v > 9) {
            v = v - 9;
        }
        suma = suma + v;
    }
    residuo = suma % 10;
    if (residuo == 0) {
        return 0;
    }
    return (10 - residuo);
}

function validarCedula(cedula) {
    var tipo = parseInt(cedula.substring(2, 3));
    if (tipo > 5) {
        return false;
    }
    if (cedula.length != 10 || !($.isNumeric(cedula))) {
        return false;
    }
    var prov = parseInt(cedula.substring(0, 2));
    if (prov < 1 || prov > 24) {
        return false;
    }
    var digito_verificador = modulo10_Cedula_RucNatural(cedula);
    if (digito_verificador != parseInt(cedula.slice(-1))) {
        return false;
    }
    return true;
}

function validarFormulario(requeridos) {
    var flag = true;
    $(requeridos).each(function (index, element) {
        if (element.value == '') {
            flag = false;
            $("#tool-" + element.name).fadeIn();
            $("#" + element.name).addClass('requerido');
        } else {
            $("#tool-" + element.name).fadeOut();
            $("#" + element.name).removeClass('requerido');
        }
    });
    if (flag) {
        $(requeridos).each(function (index, element) {
            var subflag = element.name == 'cedula' ? validarCedula(element.value) : (element.name == 'telefono' ? validarCelular(element.value) : (element.name == 'correo' ? validarEmail(element.value) : true));
            if (!subflag) {
                $("#tool-" + element.name).fadeIn();
                $("#" + element.name).addClass('requerido');
            }
            flag = flag && subflag;
        });
    }
    return flag;
}
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


$(document).ready(function() {
    /* GA */
    gtag('event', 'Página Vista', {
        'event_category': gaEventCategory
    });

    /* Vitrina action */
    $('#vitrina').on('click', function(e) {
        $('html,body').animate({
            scrollTop: $("#formulario").offset().top
        }, 'slow');
        e.preventDefault();
    });

    /* Prevent submit by enter */
    $(window).keydown(function(event) {
        if(event.keyCode == 13 || event.keyCode == 169) {
            event.preventDefault();
            return false;
        }
    });

    /*Form*/
    $('form[name="formularioDatos"]').submit(function (e) {
        e.preventDefault();
        var url = $(this).attr('action');
        var btn = $('input[type="submit"]');
        btn.addClass('disabled').attr('disabled', true);
        $('.tooltipcontent').fadeOut();
        if(validarFormulario( $(this).serializeArray())) {
            // var response = grecaptcha.getResponse();
            // if(!response.length){
            //     $("#mensajevalidacion").html("Resuelva el captcha correctamente");
            //     $("#popUpFaltadatos").modal('show');
            //     return false;
            // }
            $.ajax({
                url: url,
                type: "POST",
                data: $(this).serialize(),
                beforeSend: function () {
                    load();
                },
                success: function (result) {
                    try {
                        if (result.success) {
                            $('section:not(#typ)').remove();
                            $('section#typ').show();
                            $('html,body').animate({
                                scrollTop: $("#typ").offset().top
                            }, 'slow');
                            try {
                                gtag('event', 'Envío de formulario', {
                                    'event_category': gaEventCategory
                                });
                            } catch (e) { }
                            return false;
                        } else {
                            $("#mensajevalidacion").html(result.message);
                            $("#popUpFaltadatos").modal('show');
                        }
                    } catch (error) {
                        //console.error(error);
                        $("#mensajevalidacion").html("Se presentó un error inesperado. Por favor, intente luego de unos minutos.");
                        $("#popUpFaltadatos").modal('show');
                    }
                },
                error: function (errors) {
                    //console.error(errors);
                    $("#mensajevalidacion").html("No se pudo enviar su solicitud. Por favor, intente luego de unos minutos.");
                    $("#popUpFaltadatos").modal('show');
                },
                complete: function (data) {
                    loaded();
                }
            });
        }
        btn.removeAttr('disabled').removeClass('disabled');
    });
});
