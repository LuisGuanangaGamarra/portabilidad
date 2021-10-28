$(document).ready(function() {


    var customForm = $('[tnd-validate-form]');

    if ( customForm.length > 0 ){

        var $inputs = $('[tnd-validate-form] input[type=text],[tnd-validate-form] input[type=email],[tnd-validate-form] textarea,[tnd-validate-form] select,[tnd-validate-form] input[type=checkbox][required]',);

        $inputs.on('invalid', function(ev) {
            ev.preventDefault();
            var input = ev.currentTarget;
            var $input = $(input);
            deleteSuccesInput(input);
            $($input.parent()).addClass('tnd-error-input');
            $input.closest('.tnd-content-input').find('.tnd-error').remove();
            $input.after(string([
                '<div class="tnd-msg-input tnd-error tnd-font-error">',
                input.validationMessage,
                '</div>',
            ]));
        })

        $('[data-name]').on('blur', function(ev) {
            var input = ev.currentTarget;
            if (!input.value) {
                input.setCustomValidity("Ingrese un nombre correcto");
                input.checkValidity();
            }
        });

        $('[data-provincia]').on('blur', function(ev) {
            var input = ev.currentTarget;
            if (!input.value && input!=="Escoger Provincia") {
                input.setCustomValidity("Seleccione una Provincia");
                input.checkValidity();
                deleteSuccesInput(input);
            }
        });

        $('[data-ciudad]').on('blur', function(ev) {
            var input = ev.currentTarget;
            if (!input.value && input!=="Escoger Ciudad") {
                input.setCustomValidity("Seleccione una Ciudad");
                input.checkValidity();
                deleteSuccesInput(input);
            }
        });


        $inputs.on('blur', function(ev) {
            if(ev.currentTarget.checkValidity()){
                ev.preventDefault();
                var input = ev.currentTarget;
                var $input = $(input);
                $($input.parent()).addClass('tnd-success-input');
                $input.next('.tnd-success').remove();
                $input.after(string([
                    '<div class="tnd-msg-input tnd-success tnd-font-success">Válido</div>',
                ]));
            }
        });

        var deleteSuccesInput = function (input){
            $($(input).parent()).removeClass('tnd-success-input');
            $(input).next('.tnd-success').remove();
        }

        $inputs.on('focus', function(ev) {
            var input = ev.currentTarget;
            input.setCustomValidity("");
            $($(input).parent()).removeClass('tnd-error-input');
            $(input).next('.tnd-error').remove();
            deleteSuccesInput(input);
        });

        $(document).on("mouseenter", ".tnd-custom-select.tnd-error-input", function(e) {
            $(e.currentTarget).removeClass('tnd-error-input');
            $($(e.currentTarget).parent()).find('.tnd-msg-input').remove();
        });

        // Identification number validation

        $('[data-identification-number]').on('blur', function(ev) {
            var input = ev.currentTarget;
            if (!validateIdentificationNumber(input.value)) {
                input.setCustomValidity("Cédula inválida");
                input.checkValidity();
            }
        });



        $('[data-cellphone-validation]').on('blur', function(ev) {
            var input = ev.currentTarget;
            var patternText = new RegExp(/^0[8-9]\d\d\d\d\d\d\d\d$/);
            if (!patternText.test($(this).val())) {
                input.setCustomValidity("Número celular inválido");
                input.checkValidity();
            }
        });

        $('[data-only-numbers]').keypress(function(ev) {
            var charCode = ev.which || event.keyCode;
            return (charCode >= 48 && charCode <= 57) || charCode == 8 || charCode == 9;
        });

        $('[data-only-letters]').keypress(function(ev) {
            var tecla = ev.which || event.keyCode;

            if (tecla == 8 || tecla == 9 || tecla == 241 || tecla == 209) {
                return true;
            }

            var pattern = /^[a-no-z A-NO-Z]$/;
            var te = String.fromCharCode(tecla);
            return pattern.test(te);
        });

    }








    //FUNCION PARA  VALIDAR  QUE LA CEDULA INGRESADA SERA REAL Y EXISTA

    var validateIdentificationNumber = function(number) {
        var digit3 = number[2];
        var modulus11 = [7, 6, 5, 4, 3, 2];

        /* Natural */
        if (digit3 >= 0 && digit3 <= 5) {
            var digits = number.substring(0, 9).split("");
            var sum = digits.reduce(function(xs, x, i) {
                var n = x * (i % 2 == 0 ? 2 : 1);
                return xs + (n < 10 ? n : n - 9);
            }, 0);
            var mod = sum % 10;
            var verifier = mod == 0 ? 0 : 10 - mod;
            return verifier == number[9];
        }

        /* Public */
        if (digit3 == 6) {
            var digits = number.substring(0, 8).split("");
            var sum = digits.reduce(function(xs, x, i) {
                var n = x * modulus11[(i + 4) % 6];
                return xs + n;
            }, 0);
            var mod = sum % 11;
            var verifier = mod == 0 ? 0 : 11 - mod;
            return mod != 1 && verifier == number[8];
        }

        /* Private */
        if (digit3 == 9) {
            var digits = number.substring(0, 9).split("");
            var sum = digits.reduce(function(xs, x, i) {
                var n = x * modulus11[(i + 5) % 6];
                return xs + n;
            }, 0);
            var mod = sum % 11;
            var verifier = mod == 0 ? 0 : 11 - mod;
            return mod != 1 && verifier == number[9];
        }

        return false;
    };


    //FIN
    //SCRIPT PARA VALIDACION DE FORMULARIOS//



});
