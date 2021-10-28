$(document).ready(function () {
    let transac = null;

    if(window.location.hash.length > 2 && valores.length){
        $('input[type="radio"][name="transaccion"][value="' + valores + '"]').prop('checked',true);
        $('input[type="radio"][name="transaccion"]').closest('div.tnd-card.horizontal').removeClass('active');
        $('input[type="radio"][name="transaccion"][value="' + valores + '"]').closest('div.tnd-card.horizontal').addClass('active');
        transac = $('input[type="radio"][name="transaccion"]:checked').val();
        if(transac == 'portabilidad'){
            $('.portabilidadDetail').show();
            $('.planesDetail').hide();
            $('form.planInfo button[data-action="solicitar"]').removeClass('disabled');
            $('.validatePlan').hide();
        }else if(transac == 'renovacion'){
            $('.portabilidadDetail').hide();
            $('.planesDetail').show();
            $('.validatePlan').show();
            $('form.planInfo button[data-action="solicitar"]').addClass('disabled');

            ///Validar Plan
            validarPlan();

        }else{
            $('.portabilidadDetail').hide();
            $('.planesDetail').show();
            $('.validatePlan').hide();
            $('form.planInfo button[data-action="solicitar"]').removeClass('disabled');
        }
    }else{
        $('input[type="radio"][name="transaccion"]').first().click();
        $('input[type="radio"][name="transaccion"]').closest('div.tnd-card.horizontal').removeClass('active');
        $('input[type="radio"][name="transaccion"]').first().closest('div.tnd-card.horizontal').addClass('active');
    }

    $('input[type="radio"][name="transaccion"]').click(function() {
        transaccionGlobal = $('input[type="radio"][name="transaccion"]:checked').val();
        $('input[type="radio"][name="transaccion"]').closest('div.tnd-card.horizontal').removeClass('active');
        $('input[type="radio"][name="transaccion"][value="' + transaccionGlobal + '"]').prop('checked', true);
        $('input[type="radio"][name="transaccion"][value="' + transaccionGlobal + '"]').closest('div.tnd-card.horizontal').addClass('active');

        if(transaccionGlobal == 'portabilidad'){
            $('.portabilidadDetail').show();
            $('.planesDetail').hide();
            $('form.planInfo button[data-action="solicitar"]').removeClass('disabled');
            $('.validatePlan').hide();
        }else if(transaccionGlobal == 'renovacion'){
            $('.portabilidadDetail').hide();
            $('.planesDetail').show();
            $('.validatePlan').show();
            $('form.planInfo button[data-action="solicitar"]').addClass('disabled');

            ///Validar Plan
            validarPlan();

        }else{
            $('.portabilidadDetail').hide();
            $('.planesDetail').show();
            $('.validatePlan').hide();
            $('form.planInfo button[data-action="solicitar"]').removeClass('disabled');
        }

    });

    function validarPlan(){
        function validateNumber(number) {
            var patternText = new RegExp(/^09\d\d\d\d\d\d\d\d$/);
            if (!patternText.test(number)) {
                return false;
            }
            return true;
        }

        $('[data-only-numbers]').on('keypress',function(ev) {
            $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').show();
            var charCode = ev.which || event.keyCode;
            return (charCode >= 48 && charCode <= 57) || charCode == 8 || charCode == 9;
        });

        $('div.productoValidacionCedula button').click(function (e) {
            e.preventDefault();
            if($(this).hasClass('turquoise')) {
                let numero = $('div.productoValidacionCedula input[name="celular"]').val();
                if(numero == '' ){
                    Alert.error(' ', 'Ingresa tu número de celular.');
                }else{
                    if(validateNumber(numero)){
                        console.log(validateNumber(numero));
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: { numero: numero },
                            beforeSend: function () {
                                $('div.productoValidacionCedula .tnd-msg-input').removeClass('tnd-error tnd-font-error tnd-success tnd-font-success').empty().hide();
                                $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').hide();
                                $('div.productoValidacionCedula input[name="celular"]').prop('readonly', true).parent().removeClass('tnd-error-input tnd-success-input');
                                $('div.productoValidacionCedula button').prop('disabled', true).removeClass('turquoise').css('color', '#222222');
                            },
                            success: function (data) {
                                console.log(data)
                                var Dummy = function () {
                                    this.tipoPlan = tipoPlan;
                                    function tipoPlan() {
                                        let tipoPlan;
                                        if(data.tipoPlan == 'prepago'){
                                            tipoPlan = data.tipoPlan;
                                            return tipoPlan;
                                        }else if(data.tipoPlan == 'postpago'){
                                            tipoPlan = data.tipoPlan;
                                            return tipoPlan;
                                        }else{
                                            tipoPlan = data.message;
                                            return tipoPlan;
                                        }
                                    }

                                }
                                var dummy = new Dummy();
                                //console.log(dummy.tipoPlan());

                                if(dummy.tipoPlan() == 'prepago' ){
/*                                    $('form.planInfo button[data-action="solicitar"]').removeClass('disabled');
                                    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').hide();
                                    $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html(dummy.tipoPlan()).hide();
                                    $('.planPost').hide();
                                    $('.planPA').show();
                                    scrollToElement('.portabilidad-plan-box');
                                    $('input[name="celular"]').addClass('tnd-content-input tnd-success-input');*/
                                    $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html('Lamentamos no poder procesar tu requerimiento, para procesarlo debes tener activado un plan.').show();
                                    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').show();
                                    $('form.planInfo button[data-action="solicitar"]').addClass('disabled');
                                    $('input[name="celular"]').removeClass('tnd-success');
                                }else if (dummy.tipoPlan() == 'postpago'){
                                    $('form.planInfo button[data-action="solicitar"]').removeClass('disabled');
                                    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').hide();
                                    $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html(dummy.tipoPlan()).hide();
                                    $('.planPA').hide();
                                    $('.planPost').show();
                                    scrollToElement('.portabilidad-plan-box');
                                    $('input[name="celular"]').addClass('tnd-content-input tnd-success-input');
                                    $('input[name="celular"]').addClass('tnd-success');
                                    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').show();

                                }else {
                                    $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html(dummy.tipoPlan()).show();
                                    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').show();
                                    $('form.planInfo button[data-action="solicitar"]').addClass('disabled');
                                    $('input[name="celular"]').removeClass('tnd-success');
                                }
                            },
                            complete: function () {
                            },
                            error: function (error) {
                                $('div.productoValidacionCedula button').prop('disabled', false).addClass('turquoise').css('color', '');
                                $('div.productoValidacionCedula input[name="celular"]').prop('readonly', false).parent().removeClass('tnd-error-input tnd-success-input');
                            }
                        });
                    }else{
                        $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').show();
                        Alert.error('Revisa los datos que has ingresado e intenta nuevamente.', 'El número ingresado es incorrecto.');
                    }
                }
            } else {
                $(this).prop('disabled', false).addClass('turquoise').css('color', '');
            }
        });

        $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').click(function (e) {
            e.preventDefault();
            $(this).hide();
            $('input[name="celular"]').removeClass('tnd-success');
            $('form.planInfo button[data-action="solicitar"]').addClass('disabled');
            $('div.productoValidacionCedula button').prop('disabled', false).addClass('turquoise').css('color', '');
            $('div.productoValidacionCedula .tnd-msg-input').removeClass('tnd-error tnd-font-error tnd-success tnd-font-success').empty().hide();
            $('div.productoValidacionCedula input[name="celular"]').prop('readonly', false).val('').parent().removeClass('tnd-error-input tnd-success-input');
        });
    }

    //console.log('transaccionGlobal '+transaccionGlobal);
    $("form.planInfo .enviarCarrito").click(function(e){
        if(transaccionGlobal == 'portabilidad') {
            //alert('portabilidad')
            location.href = locationPortabilidad;
        } else if(transaccionGlobal == 'renovacion') {
           //alert('renovacion')
            location.href=locationRenovacion;
        } else {
            //alert('carrito')
             //modalCarrito.addCotizador( carritoObject ,true)
            __gaTrigger('Carrito', carritoObject.name, carritoObject.type, carritoObject.price);
            __fbTrigger('AddToCart');
            Cart.add(carritoObject);
        }
    });

    function scrollToElement(element,time) {
        $('html, body').animate({
            scrollTop: $(element).offset().top - 86
        }, time || 1000);
    }

    function __gaTrigger(action, plan, tipo, price) {
        try {
            gtag('event', action, {
                'event_category': 'Planes_Moviles',
                'event_label': `Plan: ${plan} | Tipo: ${tipo} | Detalle: (ninguno)`,
                'value': price
            });
        } catch (e) {   }
    }

    __gaTrigger('Plan Visto', carritoObject.name, carritoObject.type, carritoObject.price);
});