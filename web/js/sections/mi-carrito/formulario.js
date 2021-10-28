$(window).on('load', function() {
    $('header, main, footer').show();
    $('#main-loading').fadeOut(function(){
        $(this).remove()
    });
});

$(document).ready(function() {
    let __token = null;
    let __can_chatEnLinea = false, __canRedirect = false;
    let __step_actual = 1;
    let __payment_method = null;
    let __card = null;
    let __productos = [];
    let __cuotas = 0;
    let kushki = null;
    let __tcInfo = '', __pasarela = '(ninguno)', __p2pPrev = '', __kBin = '';
    let __errorTcSent = false;
    ///////////////////////////
    ///       FUNCTIONS     ///
    ///////////////////////////
    function formatPrecio(precio) {
        return Number.parseFloat(precio).toFixed(2).replace('.', ',');
    }
    // function formatTipoFinanciamiento(tipo) {
    //     switch (riesgo) {
    //         case 'aaa-plus':
    //             return 'AAA +';
    //         case 'aaa':
    //             return 'AAA';
    //         case 'aaa-minus':
    //             return 'AAA -';
    //         case 'aa-plus':
    //             return 'AA +';
    //         case 'aa':
    //             return 'AA';
    //         case 'aa-minus':
    //             return 'AA -';
    //     }
    //     return 'N/A';
    // }
    function ____update_carrito(cuotas, callback_success = function () { }, callback_error = function () { }) {
        console.log('Actualizando carrito a ' + cuotas + ' cuotas.');
        console.log('Carrito: ' + __token);
        $.ajax({
            url: $('form.procesoCompraFormularioStep[data-step="3"]').attr('data-update'),
            type: 'POST',
            data: {
                token: __token,
                cuotas: cuotas
            },
            beforeSend: function () {
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                if (!data.error) {
                    ____process_carrito(data.content.cart);
                    callback_success();
                }
            },
            complete: function () {
                try {
                    loaded();
                } catch (e) { }
            },
            error: function (error) {
                callback_error();
            }
        });
    }
    function ____process_carrito(carrito) {
        if(carrito.productos.length) {
            __token = carrito.token;
            __productos = carrito.productos;
            __cuotas = carrito.financiamiento.cuotas;
            $('form.procesoCompraFormularioStep input[type="hidden"][name="token"]').val(carrito.token);
            $('.box-resumen span.subtotal').html(formatPrecio(carrito.subtotal));
            $('.box-resumen span.discount').html(formatPrecio(carrito.descuentos));
            $('.box-resumen span.taxes').html(formatPrecio(carrito.impuestos));
            $('.box-resumen span.total').html(formatPrecio(carrito.total));
            $('.box-resumen span.total-show').html(carrito.financiamiento.cuotas == 1 ? formatPrecio(carrito.total) : formatPrecio(carrito.financiamiento.cuotaMensual));
            $('.box-resumen span.tipo-fin').html(carrito.financiamiento.tipo === 'claro' ? 'Claro' : 'Tarjeta de crédito');
            $('.box-resumen span.cuotas').html(carrito.financiamiento.cuotas == 1 ? 'Pago corriente' : `${carrito.financiamiento.cuotas} cuotas`);
            $('.box-resumen span.entrada').html(formatPrecio(carrito.financiamiento.entrada));
            $('.resumenCompra h3.subtitulo span.total').html(carrito.financiamiento.tipo === 'claro' ? `\$ ${(carrito.financiamiento.cuotas == 1 ? formatPrecio(carrito.total) : formatPrecio(carrito.financiamiento.cuotaMensual) + ' mensuales')}` : `\$ ${formatPrecio(carrito.total)}`);
            if(carrito.financiamiento.entrada == 0) {
                $('.box-resumen span.entrada').closest('div.flex-xs').hide();
            } else {
                $('.box-resumen span.entrada').closest('div.flex-xs').show();
            } if(carrito.financiamiento.cuotas == 0) {
                $('.box-resumen span.cuotas').closest('div.flex-xs').hide();
            } else {
                $('.box-resumen span.cuotas').closest('div.flex-xs').show();
            }
            $('.box-resumen span.total-label').html(carrito.financiamiento.cuotas == 1 ? 'ÚNICO PAGO' : 'CUOTA MENSUAL');
            if (carrito.payment_available.jit === true) {
                $('button.btn-selector[data-target="jit"]').prop('disabled', false);
            } if (carrito.payment_available.tc === true) {
                $('button.btn-selector[data-target="tc"]').prop('disabled', false);
            } if(carrito.payment_method.tc === true && carrito.payment_available.tc === true) {
                $('button.btn-selector[data-target="tc"]').click();
            } // Aplica else-if si se ponen más métodos de pago
            else /*if (carrito.payment_method.jit === true && carrito.payment_available.jit === true) {
                $('button.btn-selector[data-target="jit"]').click();
            } else*/ {
                $('button.btn-selector[data-target="jit"]').click();
            }
            $('div.collapsable-products').empty();
            $(carrito.productos).each(function (i, producto) {
                let promoTag = producto.financiamiento.promocionTag || '';
                let promoTagUrl = promoTag.length ? `<img src="${rootImg}${promoTag}" alt="Oferta">` : '';
                let accesoriosHtml = '';
                $(producto.accesorios).each(function (j, accesorio) {
                    accesoriosHtml += `<div class="product">
                        <div class="img-product">
                            <img src="${rootImg}${accesorio.img}" alt="${accesorio.nombre}" class="tnd-img-resp">
                        </div>
                        <div class="detail-product">
                            <p>${accesorio.nombre}</p>
                            <p>Gratis <img src="https://catalogo.claro.com.ec/images/iconos/gift.svg" alt="Gratis"></p>
                            <p>Cantidad: ${accesorio.cantidad}</p>
                        </div>
                    </div>`;
                });
                $('div.collapsable-products').append(`<article class="product">
                    <div class="img-product">
                        <img src="${producto.img}" alt="${producto.nombreComercial}" class="tnd-img-resp">
                        <a href="#?" class="tnd-font-link remove-product" data-target="${producto.token}"><i class="tnd-icon remove-icon"></i>Eliminar</a>
                    </div>
                    <div class="detail-product">
                        <p>${producto.nombreComercial}</p>
                        <p>\$ ${formatPrecio(producto.financiamiento.subtotal)} ${promoTagUrl}</p>
                        <p>Cantidad: ${producto.financiamiento.cantidad}</p>
                        <div class="accessories-product">
                            ${accesoriosHtml}
                        </div>
                    </div>
                </article>`);
            });
        } else {
            Alert.oneOptionRedirect(`${rootImg}images/iconos/ico-error.svg`, '¡Tu carrito de compras está vacío!', 'Para proseguir con tu Proceso de Compra necesitas agregar productos al Carrito. Te recomendamos revisar las ofertas del mes para que aproveches las promociones que Claro tiene para ti.', 'Ver ofertas del mes', 'https://catalogo.claro.com.ec/ofertas/precios-de-locura?utm_source=catalogo&utm_medium=carrito&utm_campaign=redirect&utm_content=carrito-vacio');
        }
    }
    function ____prepare_step_2() {
        $('a.chatEnLinea').show();
        __can_chatEnLinea = true;
        $('button.btn-selector[data-input="tipo__envio"]').first().click();
        let select_provincias = $('.form-domicilio select#select__provincia');
        let select_ciudades = $('.form-domicilio select#select__ciudad');
        $.each(infoCiudades, function (id, provincia) {
            select_provincias.append(`<option value="${provincia.provincia}">${provincia.provincia}</option>`);
        });
        select_provincias.change(function (e) {
            $.each(infoCiudades, function (id, provincia) {
                if(provincia.provincia == e.currentTarget.value){
                    select_ciudades.html('');
                    select_ciudades.append('<option value="" selected>Elige tu ciudad</option>');
                    $.each(provincia.ciudad, function(id, ciudad) {
                        select_ciudades.append(`<option value="${ciudad.name}">${ciudad.name}</option>`);
                    });
                }
            });
        });
        let select_provincias_cac = $('.form-sucursal select#select__provincia_cac');
        let select_ciudades_cac = $('.form-sucursal select#select__ciudad_cac');
        let select_centros_cac = $('.form-sucursal select#select__centro_cac');
        $.each(infoCacs, function (id, provincia) {
            select_provincias_cac.append(`<option value="${provincia.provincia}">${provincia.provincia}</option>`);
        });
        select_provincias_cac.change(function (e) {
            select_centros_cac.html('');
            select_centros_cac.append('<option value="" selected>Elige un CAC</option>');
            $.each(infoCacs, function (id, provincia) {
                if(provincia.provincia == e.currentTarget.value){
                    select_ciudades_cac.html('');
                    select_ciudades_cac.append('<option value="" selected>Elige tu ciudad</option>');
                    $.each(provincia.ciudad, function(id, ciudad) {
                        select_ciudades_cac.append(`<option value="${ciudad.name}">${ciudad.name}</option>`);
                    });
                }
            });
        });
        select_ciudades_cac.change(function (e) {
            select_centros_cac.html('');
            select_centros_cac.append('<option value="" selected>Elige un CAC</option>');
            $.each(infoCacs, function (id, provincia) {
                $.each(provincia.ciudad, function(id, ciudad) {
                    if(ciudad.name == e.currentTarget.value){
                        select_centros_cac.html('');
                        select_centros_cac.append('<option value="" selected>Elige un CAC</option>');
                        $.each(ciudad.agencia, function(id, agencia) {
                            if(agencia.nombre == 'NO EXISTE CAC EN LA CIUDAD' || agencia.nombre == 'CAC NO DISPONIBLE') {
                                select_centros_cac.html('');
                                select_centros_cac.append('<option value="" selected>Elige un CAC</option>');
                                select_centros_cac.append(`<option value="">${agencia.nombre}</option>`);
                            } else{
                                select_centros_cac.append(`<option value="${agencia.nombre}">${agencia.nombre}</option>`);
                            }
                        });
                    }
                });
            });
        });
        if($('input[type="radio"][name="direccion__anterior"]').length) {
            $('#select__lugar_domicilio, #select__provincia, #select__ciudad, #text__direccion_principal, #text__direccion_secundaria, #text__direccion_referencia').prop('required', false);
        }
    }
    function ____prepare_step_3() {
        $('input[type="radio"][name="payment_method"]').first().click();
    }
    let ___p2p_done = [];
    function ____execute_p2p(redirectTo, returnUrl) {
        console.log(`redirectTo: ${redirectTo}`);
        console.log(`returnUrl: ${returnUrl}`);
        P.on('response', function (dataPlaceToPay) {
            console.log(dataPlaceToPay);
            //if(dataPlaceToPay.status.status == "APPROVED") {
            if (!___p2p_done.includes(returnUrl)) {
                $.ajax({
                    url: returnUrl,
                    data: dataPlaceToPay,
                    type: 'POST',
                    beforeSend: function () {
                        try {
                            load();
                        } catch (e) { }
                        $('form#payment-info input[type="submit"]').prop("disabled", true);
                    },
                    success: function (dataReturnUrl) {
                        console.log(dataReturnUrl);
                        if (!dataReturnUrl.error) {
                            if (dataReturnUrl.status === 'APPROVED') {
                                __fbTrigger('Purchase');
                                __gaTrigger('Carrito', 'Cobro: PLACETOPAY', 'Método de pago: PLACETOPAY');
                            } else if (dataReturnUrl.status === 'PENDING') {
                                console.log('Mostrar transacción pendiente.');
                                __gaTrigger('Carrito', 'Cobro pendiente: PLACETOPAY', 'Método de pago: PLACETOPAY');
                            } else {
                                console.log('Mostrar transacción rechazada.');
                                $('form#form-placetopay div[data-target="to-do"]').hide();
                                $('form#form-placetopay div[data-target="failed"], a.btn-back-form[data-target="3"]').show();
                                $('div[data-target="failed"] p.order-number span.placetopay-referencia').html(dataReturnUrl.reference);
                                $('div[data-target="failed"] a.placetopay-historial').attr('href', dataReturnUrl.paymentHistoryURL);
                                __errorJitTrigger('Transacción PlaceToPay rechazada');
                                __gaTrigger('Carrito', 'Cobro rechazado: PLACETOPAY', 'Método de pago: PLACETOPAY');
                            }
                            if (dataReturnUrl.redirectTo !== null) {
                                __canRedirect = true;
                                window.location.href = dataReturnUrl.redirectTo;
                            }
                        } else {
                            $('form#form-carrito button[type="submit"]').prop('disabled, false');
                            $('a.btn-back-form[data-target="3"]').click();
                            __gaTrigger('Carrito', 'Error TC: Placetopay', 'Método de pago: PLACETOPAY | Error reportado: No puede validarse el cobro.');
                            Alert.error('No pudo validarse que hayas realizado el pago. En caso de haberlo efectuado correctamente, recibirás un correo en tu buzón de entrada.');
                        }
                    },
                    complete: function () {
                        try {
                            loaded();
                        } catch (e) { }
                        ___p2p_done.push(returnUrl);
                        console.log('Ventana de cobro Placetopay: Fin');
                        __gaTrigger('Carrito', 'Ventana de cobro Placetopay: Fin', `Método de pago: ${__pasarela}`);
                    },
                    error: function (error) {
                        //console.log(error);
                        $('form#form-carrito button[type="submit"]').prop('disabled, false');
                        $('a.btn-back-form[data-target="3"]').click();
                        __gaTrigger('Carrito', 'Error TC: Placetopay', 'Método de pago: PLACETOPAY | Error reportado: Ocurrió un error al validar el cobro.');
                        Alert.error('Ocurrió un error al validar que hayas realizado el pago. En caso de haberlo efectuado correctamente, recibirás un correo en tu buzón de entrada.');
                    }
                });
            }
            //}
        });
        P.init(redirectTo);
    }
    function ____prepare_step_4(pasarela) {
        if(pasarela == 'kushki') {
            $('form#form-kushki').show();
            $('form#form-placetopay').hide();
            if(!kushki) {
                kushki = new Kushki({
                    merchantId: $('form#form-kushki').attr('data-target'),
                    inTestEnvironment: $('form#form-kushki').attr('data-env') == 'testing',
                    regional: false
                });
            }
            if(!__card) {
                __card = new Card({
                    form: document.getElementById('form-kushki'),
                    container: '.card-wrapper',
                    formSelectors: {
                        numberInput: 'input[name="kushki-number"]',
                        expiryInput: 'input[name="kushki-expiry"]',
                        cvcInput: 'input[name="kushki-cvc"]',
                        nameInput: 'input[name="kushki-name"]'
                    },
                    messages: {
                        validDate: 'Válido\nHasta', // optional - default 'valid\nthru'
                        monthYear: 'Mes / Año', // optional - default 'month/year'
                    },
                    placeholders: {
                        name: 'Titular de la tarjeta'
                    },
                    masks: {
                        cvcInput: '•' // optional - mask card number
                    },
                });
            }
        } else if (pasarela == 'placetopay') {
            $('form#form-placetopay div[data-target="to-do"]').show();
            $('form#form-kushki, form#form-placetopay div[data-target="failed"], a.btn-back-form[data-target="3"]').hide();
            let formP2p = $('form#form-placetopay');
            formP2p.show();
            // console.log(formP2p.attr('data-action'));
            $.ajax({
                url: formP2p.attr('data-action'),
                data: { token: __token },
                type: 'POST',
                beforeSend: function () {
                    try {
                        load();
                    } catch (e) { }
                },
                success: function (dataCatalogo) {
                    console.log(dataCatalogo);
                    if(!dataCatalogo.error) {
                        console.log('Ventana de cobro Placetopay: Inicio');
                        __gaTrigger('Carrito', 'Ventana de cobro Placetopay: Inicio',  `Método de pago: ${__pasarela}`);
                        ____execute_p2p(dataCatalogo.redirectTo, dataCatalogo.returnUrl);
                    } else {
                        $('form#form-carrito button[type="submit"]').prop('disabled, false');
                        $('a.btn-back-form[data-target="3"]').click();
                        __gaTrigger('Carrito', 'Error TC: Placetopay',  'Método de pago: PLACETOPAY | Error reportado: No puede iniciar cobro.');
                        Alert.error('No es posible iniciar el cobro. Te recomendamos revisar que no estés usando un proxy o que tengas conexión a internet.');
                    }
                },
                complete: function () {
                    try {
                        loaded();
                    } catch (e) { }
                },
                error: function (error) {
                    //console.log(error);
                    $('form#form-carrito button[type="submit"]').prop('disabled, false');
                    $('a.btn-back-form[data-target="3"]').click();
                    __errorJitTrigger('No puede iniciar ventana de cobro de PlaceToPay');
                    __gaTrigger('Carrito', 'Error TC',  'Método de pago: PLACETOPAY | Error reportado: No puede iniciar ventana de cobro.');
                    Alert.error('No es posible iniciar la ventana de cobro. Te recomendamos revisar que no estés usando un proxy o que tengas conexión a internet.');
                }
            });
        }

    }
    function __gaTrigger(gaCategory, gaEvent, extra = '', productos = []) {
        let prodNombres = '', planesNombres = '';
        let total = 0;
        productos = productos.length > 0 ? productos : __productos;
        for(let i = 0; i < productos.length; i++) {
            if (productos[i].tipo == 'producto') {
                prodNombres += (productos[i].nombreComercial + (i > 0 && i != productos.length - 1 ? ' ** ' : ''));
            } else {
                planesNombres += (productos[i].nombreComercial + (i > 0 && i != productos.length - 1 ? ' ** ' : ''));
            } total += productos[i].financiamiento.total;
        }
        try {
            gtag('event', gaEvent, {
                'event_category': gaCategory,
                'event_label': (`Producto: ${prodNombres.length ? prodNombres : '(ninguno)'} | Plan: ${planesNombres.length ? planesNombres : '(ninguno)'} ${(extra.length ? ' | ' + extra : '')}`).trim(),
                'value': total
            });
        } catch (e) { }
    }
    function __fbTrigger(action, productos = []) {
        window.dataLayer = window.dataLayer || [];
        let ids = [], content = [], items = [], prodNombres = '', categoria = '';
        let total = 0;
        productos = productos.length > 0 ? productos : __productos;
        for(let i = 0; i<productos.length; i++) {
            ids.push(productos[i].tipo == 'producto' ? productos[i].r : `plan-${productos[i].r}`);
            content.push({
                id: productos[i].tipo == 'producto' ? productos[i].r : `plan-${productos[i].r}`,
                item_price: productos[i].financiamiento.total,
                quantity: 1
            });
            items.push({
                id: productos[i].tipo == 'producto' ? productos[i].r : `plan-${productos[i].r}`,
                google_business_vertical: 'retail',
                item_id: productos[i].tipo == 'producto' ? productos[i].r : `plan-${productos[i].r}`,
                item_name: productos[i].nombreComercial,
                item_category: productos[i].categoria,
                item_brand: productos[i].marca || 'CLARO',
                price: productos[i].financiamiento.total,
                currency: 'USD',
                quantity: 1
            });
            categoria += (productos[i].categoria + (i>0 && i!=productos.length-1 ? ' | ' : ''));
            prodNombres += (productos[i].nombreComercial + (i>0 && i!=productos.length-1 ? ' + ' : ''));
            total += productos[i].financiamiento.total;
        }
        try {
            let fb_data = {
                event: action,
                content_ids: ids,
                content_name: prodNombres,
                content_category: categoria,
                content_type: "product",
                value: total,
                currency: "USD",
                contents: content,
                google_items: items,
                transaction_id: __token
            };
            if(action == 'CompleteRegistration')
                fb_data['status'] = 'complete';
            window.dataLayer.push(fb_data);
        } catch (e) {   }
    }
    function __errorJitTrigger(problemaTc)
    {
        if(!__errorTcSent && $('form.procesoCompraFormularioStep[data-step="3"]').attr('data-notify')) {
            $.ajax({
                url: $('form.procesoCompraFormularioStep[data-step="3"]').attr('data-notify-url'),
                data: {
                    token: __token,
                    problema: problemaTc
                },
                type: 'POST',
                success: function (data) {
                    if(!data.error) {
                        __errorTcSent = true;
                        $('main').append(`<div class="notification--error-jit">
                            <div class="body--error-jit">
                                <img class="img-sticky-jit" src="https://catalogo.claro.com.ec/images/icon/llamada_icono.svg" alt="">
                                <div class="jit-sticky-xs">
                                    <p class="jit-text1">Hemos visto que tienes inconvenientes con tu método de pago.</p>
                                    <p class="jit-text2">En breves minutos, recibirás una llamada del número 0939014447 (CLARO) y uno de nuestros representantes te asistirá con el proceso de compra.</p>
                                </div>
                            </div>
                        </div>`);
                        $("div.notification--error-jit").animate({ bottom: 0 });
                        setTimeout( function(){$("div.notification--error-jit").remove();}, 10000);
                        __gaTrigger('Carrito', 'Error TC',  `${__tcInfo} | Error reportado: ${problemaTc}`);
                    }
                }
            });
        }
    }


    /**
     * Do the magic
     */
    function __init() {
        $.ajax({
            url: $('div.resumenCompra').attr('data-action'),
            type: 'POST',
            beforeSend: function () {
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                //console.log(data);
                if (!data.error) {
                    ____process_carrito(data.content);
                }
            },
            complete: function () {
                try {
                    loaded();
                } catch (e) { }
                __gaTrigger('Carrito', 'Página Vista');
                __fbTrigger('ViewCart');
            },
            error: function (error) {
            }
        });
    }

    ///////////////////////////
    ///    EVENT HANDLERS   ///
    ///////////////////////////
    $('header .wrap a.chatEnLinea:not(.whatsApp)').click(function (e) {
        e.preventDefault();
        __gaTrigger('Carrito', 'Chat en línea');
        // console.log('Ayuda solicitada.');
    });
    $('header .wrap a.chatEnLinea.whatsApp').click(function (e) {
        __gaTrigger('Carrito', 'Chat en línea (WhatsApp)');
    });
    $('div.collapsible .header').click(function () {
        if($(this).closest('.collapsible').attr('data-toggle') === 'on') {
            $(this).closest('.collapsible').attr('data-toggle', 'off');
            $('div.procesoCompraFormulario').show();
        } else {
            $(this).closest('.collapsible').attr('data-toggle', 'on');
            $('div.procesoCompraFormulario').hide();
        }
    });
    $('body').on('click', '.product a.remove-product', function (e) {
        e.preventDefault();
        let target = $(this).attr('data-target');
        $(this).closest('article.product').addClass('deleted');
        $.ajax({
            url: $('div.resumenCompra').attr('data-remove'),
            data: {
                token: __token,
                product: target
            },
            type: 'POST',
            beforeSend: function () {
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                if(!data.error) {
                    let deleted = null;
                    $(__productos).each(function (i, x) {
                        if(this.token == target)
                            deleted = this;
                    });
                    if(deleted !== null)
                        __gaTrigger('Carrito', 'Eliminar producto', '', [deleted]);
                        __fbTrigger('RemoveProduct', [deleted]);
                    ____process_carrito(data.content.cart);
                } else {
                    Alert.error('No es posible eliminar el producto, inténtalo nuevamente en unos minutos.');
                }
            },
            complete: function () {
                try {
                    loaded();
                } catch (e) { }
            },
            error: function (error) {
                //console.log(error);
                $(this).closest('article.product').removeClass('deleted');
                Alert.error('No pudimos eliminar el producto, inténtalo nuevamente en unos minutos.');
            }
        });
    });
    $('a#btn-back-form').click(function (e) {
        e.preventDefault();
        __gaTrigger('Carrito', 'Retroceder a página anterior');
        window.history.back();
    });
    $('a.btn-back-form').click(function (e) {
        e.preventDefault();
        $(`form.procesoCompraFormularioStep[data-step="${__step_actual}"]`).hide();
        window.scrollTo(0,0);
        $(`form.procesoCompraFormularioStep[data-step="${$(this).attr('data-target')}"]`).show();
        $('.tnd-steps li').removeClass('active');
        let step_li_actual = $(`.tnd-steps li[data-step="${$(this).attr('data-target')}"]`).addClass('active').removeClass('checked');
        $('.tnd-steps .paso-actual-movil span.ico-current-step').removeClass($(`.tnd-steps li[data-step="${__step_actual}"]`).removeClass('checked').attr('data-ico')).addClass(step_li_actual.attr('data-ico'));
        $('.tnd-steps .paso-actual-movil p').html(step_li_actual.attr('data-label'));
        __step_actual = $(this).attr('data-target');
        __payment_method = null;
        __gaTrigger('Carrito', `Retroceder a paso: ${$(this).attr('data-target')}`);
        if(__step_actual < 4) {
            __pasarela = '(ninguno)';
            __tcInfo = '';
        }
    });
    $('form#form-kushki').submit(function (e) {
        e.preventDefault();
        let form = $(this);
        try {
            let d = new Date(), date = $('form#form-kushki input[type="text"][name="kushki-expiry"]').val().replace(/ /g, '').split('/'), month = parseInt(date[0]), year = parseInt(date[1])+2000;
            if(!((month > d.getMonth() + 1 && month <= 12 && year == d.getFullYear()) || (month >= 1 && month <= 12 && year > d.getFullYear()))) {
                Alert.error('La fecha de expiración ingresada es inválida'); return;
            }
        } catch (e) {
            Alert.error('La fecha de expiración ingresada es inválida'); return;
        }
        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: {
                token: __token,
                tokenKushki: $('#form-kushki-token input[name="tokenKushki"]').val(),
                date: $('#form-kushki-token input[name="token_date"]').val(),
            },
            beforeSend: function () {
                form.closest('input[type="submit"]').prop('disabled', true);
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                if(!data.error) {
                    let expiry = $('#form-kushki input[type="text"][name="kushki-expiry"]').val().split('/');
                    kushki.requestToken({
                        amount: data.content.carrito.total,
                        currency: 'USD',
                        card: {
                            name: $('#form-kushki input[type="text"][name="kushki-name"]').val(),
                            number: $('#form-kushki input[type="text"][name="kushki-number"]').val().replace(/ /g, ""),
                            cvc: $('#form-kushki input[type="password"][name="kushki-cvc"]').val(),
                            expiryMonth: expiry[0].trim(),
                            expiryYear: expiry[1].trim()
                        },
                    }, function(response) {
                        if(!response.code) {
                            let current_datetime = new Date();
                            let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
                            $.ajax({
                                url: form.attr('action'),
                                type: form.attr('method'),
                                data: {
                                    token: __token,
                                    tokenKushki: response.token,
                                    date: formatted_date
                                },
                                success: function (data) {
                                    if(!data.error) {
                                        try {
                                            loaded();
                                        } catch (e) { }
                                        let hasOTP = response.hasOwnProperty('secureId');
                                        __tcInfo = `${__tcInfo} | OTP: ${(hasOTP ? 'Sí' : 'No')}`;
                                        //console.log((hasOTP ? 'Sí ' : 'No ') + 'tiene OTP.');
                                        try {
                                            let current_datetime = new Date();
                                            let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
                                            $('#form-kushki-token input[name="tokenKushki"]').val(response.token);
                                            $('#form-kushki-token input[name="token_date"]').val(formatted_date);
                                            // console.log('Seteado token en formulario: '+response.token);
                                            if(hasOTP) {
                                                $('#form-kushki-otp div.form-kushki-otp-has').show();
                                                $('#form-kushki-otp div.form-kushki-otp-not-has').hide();
                                                $('#form-kushki-otp input[type="submit"]').val('Confirmar Código y Comprar');
                                                $('#form-kushki-otp input[type="text"][name="otp-1"], #form-kushki-otp input[type="text"][name="otp-2"], #form-kushki-otp input[type="text"][name="otp-3"]').prop('required', true);
                                                $('#tnd-modal-kushki span#titleModal').html('Verifica que eres el titular de la Tarjeta de Crédito');
                                                $('#form-kushki-otp input[type="hidden"][name="secure-id"]').val(response.secureId);
                                                $('#form-kushki-otp input[name="secure-service"]').val(response.secureService);
                                                $('#form-kushki-otp input[name="otp-1"], #form-kushki-otp input[name="otp-2"], #form-kushki-otp input[name="otp-3"]').val('');
                                            } else {
                                                $('#form-kushki-otp div.form-kushki-otp-has').hide();
                                                $('#form-kushki-otp div.form-kushki-otp-not-has').show();
                                                $('#form-kushki-otp input[type="submit"]').val('Comprar');
                                                $('#form-kushki-otp input[type="text"][name="otp-1"], #form-kushki-otp input[type="text"][name="otp-2"], #form-kushki-otp input[type="text"][name="otp-3"]').prop('required', false);
                                                $('#form-kushki-otp input[type="hidden"][name="secure-id"], #form-kushki-otp input[type="hidden"][name="secure-service"]').val('');
                                                $('#tnd-modal-kushki span#titleModal').html('Confirma la transacción');
                                            }
                                            $.fancybox.open({ src : $('form#form-kushki input[type="submit"]').attr('data-target'), type: 'inline', modal: true, });
                                            $('#form-kushki-otp #msj_error').hide();
                                            __gaTrigger('Carrito', 'Token Kushki', __tcInfo);
                                            //send_formCarrito($('#form-carrito'));
                                        } catch (e) {
                                            Alert.error('Se produjo un error mientras se intentaba realizar el cobro. Por favor, verifica que los datos estén correctos.', 'No es posible realizar la compra');
                                        }
                                    } else {
                                        Alert.error(data.message);
                                        //Alert.error('Ocurrió un error mientras se guardaba la información. Por favor, revisa los datos ingresados e inténtalo nuevamente.');
                                    }
                                },
                                error: function (error) {
                                    //console.log(error);
                                    Alert.error('Ha ocurrido un error, intente dentro de unos minutos.', 'No se puede verificar tu pedido');
                                }
                            });
                        } else {
                            //console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
                            __gaTrigger('Carrito', 'Token Kushki (Error)',  `${__tcInfo} | Error: ${response.code} | Detalle error: ${response.message}`);
                            if(response.code == 'K001') {
                                Alert.error('Se produjo un error mientras se intentaba realizar el cobro. Por favor, verifica que los datos estén correctos.', 'Revisa los datos');
                            } else {
                                Alert.error('Se produjo un error mientras se intentaba realizar el cobro. Por favor, verifica que los datos estén correctos o que poseas el cupo suficiente.', 'No se pudo realizar la compra');
                            }
                            $('#form-kushki button[type="submit"]').prop('disabled', false);
                        }
                    });
                } else {
                    Alert.error(data.message);
                    //Alert.error('Ocurrió un error mientras se guardaba la información. Por favor, revisa los datos ingresados e inténtalo nuevamente.');
                }
            },
            error: function (error) {
                //console.log(error);
                Alert.error('Ha ocurrido un error, intente dentro de unos minutos.', 'No se puede verificar tu pedido');
            }
        });
        console.log('Generando token de Kushki. . .');
    });
    $('form.procesoCompraFormularioStep:not(#form-kushki)').submit(function (e) {
        e.preventDefault();
        let form = $(this);
        let step = form.attr('data-step');
        switch (step) {
            case "1":
                if($('form.procesoCompraFormularioStep[data-step="1"] input[type="hidden"][name="tipo__compra"]').val() === 'jit') {
                    if ($("#g-recaptcha-response").val() == "") {
                        Alert.error('Parece que fallaste al demostrar que no eres un robot. Por favor, inténtalo nuevamente.', '¡Ups! Demuestra que no eres un robot')
                        grecaptcha.reset();
                        return false;
                    }
                } else if($('form.procesoCompraFormularioStep[data-step="1"] input[type="hidden"][name="tipo__compra"]').val() === 'tc') {

                } else {
                    Alert.error('Para procesar tu pedido, es necesario que definas cómo deseas realizar tu compra. Por favor, inténtalo nuevamente.', 'Escoge un método de compra')
                    return false;
                }
                break;
            case "4":
                break;
            default:
                break;
        }
        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: form.serialize(),
            beforeSend: function () {
                form.closest('input[type="submit"]').prop('disabled', true);
                try {
                    load();
                } catch (e) { }
            },
            success: function (data) {
                if(!data.error) {
                    form.hide();
                    window.scrollTo(0,0);
                    if(data.content.response.show_step) {
                        $(`form.procesoCompraFormularioStep[data-step="${data.content.response.step}"]`).show();
                        $('.tnd-steps li').removeClass('active');
                        let step_li_actual = $(`.tnd-steps li[data-step="${data.content.response.step}"]`).addClass('active');
                        $('.tnd-steps .paso-actual-movil span.ico-current-step').removeClass($(`.tnd-steps li[data-step="${step}"]`).addClass('checked').attr('data-ico')).addClass(step_li_actual.attr('data-ico'));
                        $('.tnd-steps .paso-actual-movil p').html(step_li_actual.attr('data-label'));
                        /// Acciones por cada formulario:
                        __step_actual = data.content.response.step;
                        if(__step_actual == "2") { // Formulario de envío
                            ____prepare_step_2();
                            __gaTrigger('Carrito', 'Datos personales');
                            __fbTrigger('InitiateCheckout');
                        } else if(__step_actual == "3") {
                            ____prepare_step_3();
                            __gaTrigger('Carrito', 'Forma de envío');
                            __fbTrigger('Shipping');
                        } else if(__step_actual == "4") {
                            let metodoChosen = $('input[type="radio"][name="payment_method"]:checked').val();
                            __pasarela = metodoChosen.toUpperCase();
                            __gaTrigger('Carrito', `Método de pago: ${__pasarela}`, `Pasarela: ${__pasarela}`);
                            ____prepare_step_4(metodoChosen);
                            __fbTrigger('AddPaymentInfo');
                        }
                    } else if(data.content.response.redirectTo !== null) {
                        $('header, main, footer').hide();
                        document.body.insertAdjacentHTML('beforeend', '<aside id="main-loading"></aside>');
                        if(__step_actual == "1") {
                            __fbTrigger('CompleteRegistration');
                        }
                        if(__step_actual == "4") {
                            for(let i = 0; i<__productos.length; i++) {
                                try {
                                    if(__productos[i].gaCategory.length)
                                        __gaTrigger(__productos[i].gaCategory, 'Envío de formulario', __tcInfo, [__productos[i]]);
                                } catch (e) { }
                            }
                            __fbTrigger('Purchase');
                            __gaTrigger('Carrito', `Cobro: ${__pasarela}`, __tcInfo);
                        }
                        __gaTrigger('Carrito', 'Envío de formulario', __tcInfo);
                        __canRedirect = true;
                        window.location.href = data.content.response.redirectTo;
                    } else {
                        Alert.error('Ocurrió un error con la respuesta del servidor. Por favor, revisa los datos ingresados e inténtalo nuevamente.');
                    }
                } else {
                    Alert.error(data.message);
                    //Alert.error('Ocurrió un error mientras se guardaba la información. Por favor, revisa los datos ingresados e inténtalo nuevamente.');
                }
            },
            complete: function () {
                try {
                    loaded();
                } catch (e) { }
                form.closest('input[type="submit"]').prop('disabled', false);
            },
            error: function (error) {
                //console.log(error);
                Alert.error('Lo sentimos, algo falló mientras se guardaba la información. Por favor, inténtalo nuevamente en unos minutos.');
            }
        });
        console.log(`Formulario ${form.attr('data-step')} enviado.`);
    });
    $('button.btn-selector').click(function (e) {
        e.preventDefault();
        $('button.btn-selector').removeClass('active');
        $(this).addClass('active');
        $(`input[name="${$(this).attr('data-input')}"][data-target="tipo"]`).val($(this).attr('data-target')).trigger('change');;
    });
    $('input[type="hidden"][name="tipo__compra"][data-target="tipo"]').change(function () {
        $('div.seccion--metodo-compra div.box-aviso').hide();
        $(`div.seccion--metodo-compra div.box-aviso[data-target="${$(this).val()}"]`).show();
        switch ($(this).val()) {
            case 'jit':
                $('form.procesoCompraFormularioStep[data-step="1"] input[type="submit"]').val('Finalizar pedido');
                $('.g-recaptcha-container').show();
                break;
            default:
                $('form.procesoCompraFormularioStep[data-step="1"] input[type="submit"]').val('Continuar');
                $('.g-recaptcha-container').hide();
                break;
        }
    });
    $('.seccion--envio textarea#text__direccion_referencia').keyup( function() {
        $(this).val($(this).val().replace( /\r?\n/gi, '. ' ));
    });
    $('input[type="hidden"][name="tipo__envio"][data-target="tipo"]').change(function () {
        switch ($(this).val()) {
            case 'domicilio':
                $(".form-domicilio").show();
                $(".form-sucursal").hide();
                $('#select__lugar_domicilio, #select__provincia, #select__ciudad, #text__direccion_principal, #text__direccion_secundaria, #text__direccion_referencia').prop('required', true).prop('disabled', false);
                $('#select__provincia_cac, #select__ciudad_cac, #select__centro_cac').prop('required', false).prop('disabled', true);
                $('input[name="contacto1"], input[name="contacto2"]').prop('required', true).prop('disabled', false);
                //$('input[type="hidden"][name="tipo_envio"]').val('domicilio');
                break;
            case 'sucursal':
                $("#btn-domicilio").removeClass('active');
                $(".form-sucursal").show();
                $(".form-domicilio").hide();
                $('#select__lugar_domicilio, #select__provincia, #select__ciudad, #text__direccion_principal, #text__direccion_secundaria, #text__direccion_referencia').prop('required', false).prop('disabled', true);
                $('#select__provincia_cac, #select__ciudad_cac, #select__centro_cac').prop('required', true).prop('disabled', false);
                $('input[name="contacto1"], input[name="contacto1"]').prop('required', true).prop('disabled', false);
                //$('input[type="hidden"][name="tipo_envio"]').val('cac');
                break;
            default:
                break;
        }
    });
    $('body').on('click', '.form--old-address div.link-btn.btn-plus', function (e) {
        e.preventDefault();
        $(this).removeClass('btn-plus').addClass('btn-minus tnd-mb-20-xs');
        $('.form--new-address').show();
        $('#select__lugar_domicilio, #select__provincia, #select__ciudad, #text__direccion_principal, #text__direccion_secundaria, #text__direccion_referencia').prop('required', true);
        $('input[type="radio"][name="direccion__anterior"]').prop('disabled', true).prop('checked', false).closest('.tnd-card.horizontal').removeClass('active').addClass('disabled');
    })
    $('body').on('click', '.form--old-address div.link-btn.btn-minus', function (e) {
        e.preventDefault();
        $(this).removeClass('btn-minus tnd-mb-20-xs').addClass('btn-plus');
        $('.form--new-address').hide();
        $('#select__lugar_domicilio, #select__provincia, #select__ciudad, #text__direccion_principal, #text__direccion_secundaria, #text__direccion_referencia').prop('required', false);
        $('input[type="radio"][name="direccion__anterior"]').prop('disabled', false).prop('checked', true).closest('.tnd-card.horizontal').addClass('active').removeClass('disabled');
    })
    $('input[type="radio"][name="payment_method"]').change(function () {
        $('div.seccion--metodo-pago input[type="radio"][name="payment_method"]').closest('.tnd-card.horizontal').removeClass('active');
        $(this).closest('.tnd-card.horizontal').addClass('active');
        $('div.seccion--metodo-pago div.form-placetopay').hide();
        switch ($(this).val()) {
            case "placetopay":
                $('div.seccion--metodo-pago div.form-placetopay').show();
                $('#select__financiamiento_p2p').prop('required', true).val(__cuotas == 1 ? 'corriente' : (__cuotas > 1 && __cuotas <= 12 ? 'diferido-12' : (__cuotas > 12 && __cuotas <= 18 ? 'diferido-18' : ''))).trigger("change");
                __payment_method = 'tc-placetopay';
                break;
            case "kushki":
                __payment_method = 'tc-kushki';
                $('#select__financiamiento_p2p').prop('required', false);
                break;
            default:
                __payment_method = null;
                $('#select__financiamiento_p2p').prop('required', false);
                break;
        }
        $('form.procesoCompraFormularioStep[data-step="3"] input[type="submit"]').prop('disabled', false);
    });
    ///////
    // P2P
    ///////
    $('#select__financiamiento_p2p').change(function () {
        let c = $(this).val();
        if(c.length) {
            try {
                ____update_carrito(c == 'corriente' ? 1 : (c == 'diferido-12' ? 12 : 18), function () {
                    __p2pPrev = c;
                }, function () {
                    $('#select__financiamiento_p2p').val(__p2pPrev);
                });
            } catch (e) {
                $(`#select__financiamiento_p2p option[value="${__p2pPrev}"]`).click();
            }
        }
    });
    ///////
    // Kushki
    ///////
    function select_financiamiento_opt() {
        let option = $('#form-kushki select[name="select-financiamiento"] option:selected');
        $.ajax({
            url: $('#form-kushki select[name="select-financiamiento"]').attr('data-path'),
            data: {
                token: __token,
                cuotas: option.attr('value').includes("+") ? option.attr('value').split("+")[0] : option.attr('value'),
                meses_gracia: option.attr('value').includes("+") ? option.attr('value').split("+")[1] : 0,
                tipo_credito: option.attr('data-tipo'),
                intereses: option.attr('data-intereses'),
            },
            type: 'POST',
            beforeSend: function () {
                //console.log('Cargando carrito con nuevo financiamiento.');
                $('.tnd-msg-input.tnd-success[data-target="select-financiamiento"], .tnd-msg-input.tnd-error[data-target="select-financiamiento"]').hide();
            },
            success: function (data) {
                if(!data.error) {
                    $('form#form-kushki-token input[type="hidden"][name="months"]').val(data.meses);
                    $('form#form-kushki-token input[type="hidden"][name="credit_type"]').val(option.attr('data-tipo'));
                    $('form#form-kushki-token input[type="hidden"][name="grace_months"]').val(option.attr('value').includes("+") ? option.attr('value').split("+")[1] : 0);
                    $('form#form-kushki input[type="submit"]').attr('disabled', false);
                    ____process_carrito(data.content.cart);
                    $('#form-carrito input[type="hidden"][name="credit_type"]').val(option.attr('data-tipo'));
                    $('#form-carrito input[type="hidden"][name="months"]').val(__cuotas);
                    $('#form-carrito input[type="hidden"][name="grace_months"]').val(option.attr('value').includes("+") ? option.attr('value').split("+")[1] : 0);
                    $('.tnd-msg-input.tnd-success[data-target="select-financiamiento"]').html('Financiamiento disponible').show();
                } else {
                    $('form#form-kushki input[type="submit"]').attr('disabled', true);
                    $('.tnd-msg-input.tnd-error[data-target="select-financiamiento"]').html('Financiamiento no disponible para el producto seleccionado').show();
                }
            },
            complete: function () {
                $('#form-kushki .kushki-loading').hide();
                $('#financiamientoWrapper').show();
            },
            error: function () {
                Alert.error('Ha ocurrido un error con la verificación del financiamiento. Por favor, intente más tarde.');
            }
        });
        $('#form-kushki .kushki-loading').hide();
        $('#financiamientoWrapper').show();
    }
    $('form#form-kushki input[name="kushki-number"]').change(function (e) {
        let input = $(this);
        let bin = (input.val().replace(/ /g, '')).substring(0, 6);
        if(bin.length == 6 && bin != __kBin) {
            console.log('Verificando BIN. . .');
            $('#financiamientoWrapper').hide();
            $('form#form-kushki .kushki-loading').show();
            $('form#form-kushki input[type="submit"]').prop('disabled', true);
            __kBin = bin; //Por si acaso?
            //console.log("Consultar deferred: " + bin);
            kushki.requestDeferred({ bin: bin }, function (response) {
                if(!response.code) {
                    try {
                        kushki.requestBinInfo({ bin: bin }, function (responseBinInfo) {
                            //console.log(responseBinInfo);
                            if(!responseBinInfo.code) {
                                input.closest('.tnd-content-input').removeClass('tnd-error-input').children('.tnd-error').remove();
                                try {
                                    __tcInfo = `Pasarela: KUSHKI | Tarjeta: ${responseBinInfo.brand.toUpperCase()} | Tipo: ${responseBinInfo.cardType.toUpperCase()} | Banco: ${responseBinInfo.bank.toUpperCase()} | País: ${responseBinInfo.country.toUpperCase()}`;
                                } catch (e) {
                                    __tcInfo = 'Pasarela: KUSHKI';
                                }
                                __gaTrigger('Carrito', 'Verificar Bin Kushki', __tcInfo);
                            } else {
                                input.closest('.tnd-content-input').addClass('tnd-error-input').append(`<div class="tnd-msg-input tnd-error tnd-font-error">Tarjeta de crédito/débito inválida</div>`);
                                $('form#form-kushki .kushki-loading').hide();
                            }
                        });
                    } catch (e) {
                        input.closest('.tnd-content-input').addClass('tnd-error-input');
                        $('form#form-kushki .kushki-loading').hide();
                    }
                    if(response.length == 0) { // Posiblemente solo tiene financiamiento en pago corriente, o la tarjeta es inválida
                        $('form#form-kushki-token input[type="hidden"][name="cuotas"]').val(1);
                        $('form#form-kushki-token input[type="hidden"][name="credit_type"]').val('');
                        $('select[name="select-financiamiento"] option[value="1"][data-tipo="00000"][data-intereses="sin_intereses"]').attr('disabled', false).attr("selected", true).show();
                        $('#tipoIntereses input[type="radio"][name="intereses"][value="sin_intereses"]').click();
                        $('#tipoIntereses input[type="radio"][name="intereses"][value="con_intereses"]').prop('checked', false).attr('disabled', true).hide();
                    } else {
                        let is_selected = false;
                        for(let opciones = 0; opciones < response.length; opciones++) {
                            //console.log(response[opciones]);
                            for(let i = 0; i < response[opciones]['months'].length; i++) {
                                $('select[name="select-financiamiento"] option[value="' + response[opciones]['months'][i] + '"][data-tipo="' + response[opciones]['type'] + '"]').attr('disabled', false).show();
                                if(response[opciones]['months'][i] == __cuotas && !is_selected && !response[opciones]['monthsOfGrace'].length) {
                                    $('select[name="select-financiamiento"] option[value="' + response[opciones]['months'][i] + '"][data-tipo="' + response[opciones]['type'] + '"]').attr("selected", true);
                                    is_selected = true;
                                }
                                for(let j = 0; j < response[opciones]['monthsOfGrace'].length; j++) {
                                    $('select[name="select-financiamiento"] option[value="' + response[opciones]['months'][i] + '+' + response[opciones]['monthsOfGrace'][j] + '"][data-tipo="' + response[opciones]['type'] + '"]').attr('disabled', false).show();
                                    if(response[opciones]['months'][i] == __cuotas && !is_selected) {
                                        $('select[name="select-financiamiento"] option[value="' + response[opciones]['months'][i] + '+' + response[opciones]['monthsOfGrace'][j] + '"][data-tipo="' + response[opciones]['type'] + '"]').attr("selected", true);
                                        is_selected = true;
                                    }
                                }
                            }
                        }
                        $('select[name="select-financiamiento"] option[value="1"][data-tipo="00000"]').attr('disabled', false).show();
                        if(!is_selected) {
                            if(__cuotas > 1)
                                $('select[name="select-financiamiento"] option[value!=""]:enabled').first().attr("selected", true);
                            else
                                $('select[name="select-financiamiento"] option[value="1"][data-tipo="00000"][data-intereses="sin_intereses"]').attr("selected", true);
                        }
                        let tipo_intereses = $('select[name="select-financiamiento"] option:selected').first().attr('data-intereses');
                        $('select[name="select-financiamiento"] option:enabled').filter(function () {
                            return $(this).attr('data-intereses') != tipo_intereses;
                        }).hide();
                        if(!$('select[name="select-financiamiento"] option[data-intereses="sin_intereses"]:enabled').length) {
                            $('#tipoIntereses input[type="radio"][name="intereses"][value="sin_intereses"]').prop('checked', false).attr('disabled', true).hide();
                        } if(!$('select[name="select-financiamiento"] option[data-intereses="con_intereses"]:enabled').length) {
                            $('#tipoIntereses input[type="radio"][name="intereses"][value="con_intereses"]').prop('checked', false).attr('disabled', true).hide();
                        }
                        $('#tipoIntereses input[type="radio"][name="intereses"][value="' + tipo_intereses + '"]').prop('checked', true);
                        $('#tipoIntereses input[type="radio"][name="intereses"][value!="' + tipo_intereses + '"]').prop('checked', false);
                    }
                    $('select[name="select-financiamiento"] option[value=""]').attr('disabled', true);
                    select_financiamiento_opt();
                } else {
                    //console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
                    Alert.error('Algo falló al intentar consultar las opciones de financiamiento de tu Tarjeta. Por favor, revisa que los datos ingresados sean correctos.', 'No se pudo verificar tu tarjeta de crédito/débito');
                }
            });
        } else if(bin.length < 6) {
            $('select[name="select-financiamiento"] option').attr("selected", false).attr('disabled', true).hide();
            $('select[name="select-financiamiento"] option[value=""]').attr("selected", true).attr('disabled', false).show();
            $('#tipoIntereses input[type="radio"][name="intereses"]').prop('checked', false).attr('disabled', false).show();
        }
        $('#form-kushki-otp input[type="text"][name="otp-1"]').val('');
        $('#form-kushki-otp input[type="text"][name="otp-2"]').val('');
        $('#form-kushki-otp input[type="text"][name="otp-3"]').val('');
        $('#form-kushki-otp input[type="text"][name="secure-id"]').val('');
        $('#form-kushki-otp input[type="text"][name="secure-service"]').val('');
    });
    $('form#form-kushki select[name="select-financiamiento"]').change(function () {
        $('form#form-kushki input[type="submit"]').attr('disabled', true);
        select_financiamiento_opt();
    });
    $('form#form-kushki input[type="radio"][name="intereses"]').change(function() {
        $('select[name="select-financiamiento"] option[data-intereses]').hide();
        let opt = $('select[name="select-financiamiento"] option[data-intereses="' + $(this).val() + '"]:enabled').show().first();
        $('select[name="select-financiamiento"]').val(opt.val()).trigger('change');
    });
    // $('form#form-kushki input[type="text"][name="kushki-expiry"]').change(function() {
    //     try {
    //         $(this).closest('.tnd-content-input').removeClass('tnd-error-input').children('.tnd-error').remove();
    //         let d = new Date(), date = $(this).val().replace(/ /g, '').split('/'), month = parseInt(date[0]), year = parseInt(date[1])+2000;
    //         if(!((month > d.getMonth() + 1 && month <= 12 && year == d.getFullYear()) || (month >= 1 && month <= 12 && year > d.getFullYear()))) {
    //             $(this).closest('.tnd-content-input').addClass('tnd-error-input').append(`<div class="tnd-msg-input tnd-error tnd-font-error">Fecha de expiración inválida</div>`);
    //         }
    //      } catch (e) {
    //          $(this).closest('.tnd-content-input').addClass('tnd-error-input').append(`<div class="tnd-msg-input tnd-error tnd-font-error">Fecha de expiración inválida</div>`);
    //      }
    // });
    $('#form-kushki-otp input[type="text"][name="otp-1"]').keyup(function () {
        $('#form-kushki-otp input[type="text"][name="otp-2"]').focus();
    });
    $('#form-kushki-otp input[type="text"][name="otp-2"]').keyup(function () {
        $('#form-kushki-otp input[type="text"][name="otp-3"]').focus();
    });
    $('#form-kushki-otp').submit(function (e) {
        e.preventDefault();
        $('#form-kushki-otp input[type="submit"]').attr('disabled', true).hide();
        $('#form-kushki-otp .kushki-loading').show();
        var secureService = $('#form-kushki-otp input[type="hidden"][name="secure-service"]').val();
        if(secureService.trim().length) {
            kushki.requestSecureServiceValidation({
                secureServiceId: $('#form-kushki-otp input[type="hidden"][name="secure-id"]').val(),
                otpValue: $('#form-kushki-otp input[type="text"][name="otp-1"]').val() + $('#form-kushki-otp input[type="text"][name="otp-2"]').val() + $('#form-kushki-otp input[type="text"][name="otp-3"]').val()
            }, function(response) {
                if (response.code === 'OTP000') {
                    //console.log(response);
                    __gaTrigger('Carrito', 'OTP Kushki', __tcInfo);
                    $('#tnd-modal-kushki .tnd-close-modal-icon').click();
                    $('#form-kushki-token input[name="token_do"]').val(1);
                    $('#form-kushki-token').submit();
                } else if (response.code === 'OTP100') {
                    //console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
                    $('#form-kushki-otp #msj_error').show();
                    $('#form-kushki-otp .kushki-loading').hide();
                    $('#form-kushki-otp input[type="submit"]').attr('disabled', false).show();
                    __gaTrigger('Carrito', 'OTP Kushki (Error)', `${__tcInfo} | Error: ${response.code} | Detalle error: OTP incorrecto`);
                } else {
                    //console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
                    $('#form-carrito input[name="token"]').val('');
                    $('#form-carrito input[name="token_date"]').val('');
                    $('#form-kushki-otp input[type="hidden"][name="secure-id"]').val('');
                    $('#form-kushki-otp input[name="secure-service"]').val('');
                    $('#tnd-modal-kushki .tnd-close-modal-icon').click();
                    $('#form-kushki-otp .kushki-loading').hide();
                    $('#form-kushki-otp input[type="submit"]').attr('disabled', false).show();
                    if (response.code === 'OTP200') {
                        __errorJitTrigger('Código de verificación incorrecto');
                        Alert.error('No pudimos validar tus datos. Ingresaste varias veces un código incorrecto o expirado. Recuerda que el código son los tres dígitos del valor debitado de tu Tarjeta de Crédito. Ejm: Si se cobró $1,10 deberás digitar:  110.', 'Código de verificación incorrecto');
                        __gaTrigger('Carrito', 'OTP Kushki (Error)', `${__tcInfo} | Error: ${response.code} | Detalle error: OTP invalidado por muchos intentos incorrectos`);
                    } else if (response.code === 'OTP300') {
                        __errorJitTrigger('Código de verificación expirado');
                        Alert.error('No pudimos verificar tu código. Pasó mucho tiempo desde que lo recibiste y lo ingresaste. Por favor inténtalo nuevamente.', 'Código expirado');
                        __gaTrigger('Carrito', 'OTP Kushki (Error)', `${__tcInfo} | Error: ${response.code} | Detalle error: OTP expirado`);
                    } else {
                        __errorJitTrigger(`${response.code}: No hemos podido verificar tu identidad`);
                        Alert.error('Algo no está bien. Revisa que los datos sean correctos. Si el problema persiste, por favor comunícate con el emisor de tu Tarjeta de Crédito.', 'No hemos podido verificar tu identidad');
                        __gaTrigger('Carrito', 'OTP Kushki (Error)', `${__tcInfo} | Error: ${response.code} | Detalle error: OTP incorrecto`);
                    }
                }
            });
        } else {
            // console.log('Confirmando cobro sin OTP.');
            __gaTrigger('Carrito', 'OTP Kushki (Sin OTP)', __tcInfo);
            $('#tnd-modal-kushki .tnd-close-modal-icon').click();
            $('#form-kushki-token input[name="token_do"]').val(1);
            $('#form-kushki-token').submit();
        }
    });

    ///////////////////////////
    ///      JUST DO IT     ///
    ///////////////////////////
    __init();

    const infoCiudades = [
        {
            "id": 1,
            "provincia": "AZUAY",
            "ciudad": [{"name": "CAMILO PONCE ENRIQUEZ", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CHORDELEG",  "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "CUENCA",
                    "agencia": [{"nombre": "CAC MALL DEL RIO"}]
                },
                {"name": "GIRON",  "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PAUTE",  "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SANTA ISABEL",  "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SIGSIG",  "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}]
        },
        {
            "id": 2,
            "provincia": "BOLIVAR",
            "ciudad": [
                {"name": "CALUMA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CHIMBO", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "ECHENDIA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name":"GUARANDA",
                    "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]
                },
                {"name": "SAN MIGUEL", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}]
        },
        {
            "id": 3,
            "provincia": "CAÑAR",
            "ciudad": [
                {
                    "name": "AZOGUES",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {"name": "BIBLIAN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CAÑAR","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "EL TAMBO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "LA TRONCAL","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}]
        },
        {
            "id": 4,
            "provincia": "CARCHI",
            "ciudad": [
                {"name": "BOLIVAR","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "ESPEJO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MIRA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MONTUFAR","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN PEDRO DE HUACA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "TULCAN",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                }]
        },
        {
            "id": 5,
            "provincia": "CHIMBORAZO",
            "ciudad": [
                {"name": "ALAUSI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CHAMBO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CHUNCHI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "COLTA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CUMANDA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "GUAMOTE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "GUANO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PENIPE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "RIOBAMBA",
                    "agencia": [{"nombre": "CAC PASEO RIOBAMBA"}]
                }]
        },
        {
            "id": 6,
            "provincia": "COTOPAXI",
            "ciudad": [
                {"name": "LA MANA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "LASSO", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "LATACUNGA",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {"name": "PANGUA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PUJILI", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN MIGUEL DE SALCEDO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAQUISILI", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}]
        },
        {
            "id": 7,
            "provincia": "EL ORO",
            "ciudad": [
                {"name": "ARENILLAS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "BALSAS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "EL GUABO", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "HUAQUILLAS",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {
                    "name": "MACHALA",
                    "agencia": [{"nombre": "CAC PASEO MACHALA"}]
                },
                {"name": "MARCABELÍ", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PACCHA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PASAJE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PIÑAS", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PORTOVELO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SANTA ROSA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "ZARUMA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 8,
            "provincia": "ESMERALDAS",
            "ciudad": [
                {"name": "ATACAMES","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "ELOY ALFARO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "ESMERALDAS",
                    "agencia": [{"nombre": "CAC MULTIPLAZA"}]
                },
                {"name": "MUISNE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "QUININDE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "RIO VERDE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN LORENZO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 9,
            "provincia": "GUAYAS",
            "ciudad": [
                {"name": "ALFREDO BAQUERIZO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "BALAO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "BALZAR","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "BUCAY","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "COLIMES","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CORONEL MARCELINO MARIDUEÑA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "DAULE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "DURAN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "EL EMPALME","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "EL TRIUNFO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "GUAYAQUIL",
                    "agencia": [
                        {"nombre": "CAC EL DORADO"},{"nombre": "CAC CITY MALL"},{"nombre": "CAC MALL DEL SUR"},
                        {"nombre": "CAC  RIOCENTRO CEIBOS"},{"nombre": "CAC SAN MARINO"}]
                },
                {"name": "JUJAN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "LOMAS DE SARGENTILLO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "MILAGRO",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {"name": "NARANJAL","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "NARANJITO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "NOBOL","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PALESTINA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PEDRO CARBO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "PLAYAS",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {"name": "SALITRE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAMBORONDON","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN JACINTO DE YAGUACHI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SIMON BOLIVAR","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 10,
            "provincia": "IMBABURA",
            "ciudad": [
                {"name": "ANTONIO ANTE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "COTACACHI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "IBARRA",
                    "agencia": [{"nombre": "CAC  LAGUNA MALL"}]
                },
                {"name": "OTAVALO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PIMAMPIRO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN MIGUEL DE URCUQUÍ","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 11,
            "provincia": "LOJA",
            "ciudad": [
                {"name": "CALVAS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CATAMAYO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CELICA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "LOJA",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "MACARÁ","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PALTAS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SARAGURO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 12,
            "provincia": "LOS RIOS",
            "ciudad": [
                {"name": "BABA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "BABAHOYO",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {"name": "BUENA FE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "EL EMPALME","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MOCACHE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MONTALVO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PICHINCHA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PUEBLO VIEJO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "QUEVEDO",
                    "agencia": [{"nombre": "CAC PASEO QUEVEDO"}]
                },
                {"name": "QUINSALOMA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN JUAN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "URDANETA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "VALENCIA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "VENTANAS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "VINCES","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 13,
            "provincia": "MANABI",
            "ciudad": [
                {
                    "name": "CHONE","agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                },
                {"name": "EL CARMEN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "FLAVIO ALFARO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "JARAMIJO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "JIPIJAPA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "JUNIN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "MANTA","agencia": [{"nombre": "CAC PASEO MANTA"}]
                },
                {"name": "MONTECRISTI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "OLMEDO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PAJAN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PEDERNALES","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "PORTOVIEJO","agencia": [{"nombre": "CAC PASEO PORTOVIEJO"}]
                },
                {"name": "PUERTO LOPEZ","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "ROCAFUERTE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN CLEMENTE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN JACINTO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN VICENTE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SANTA ANA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SUCRE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "TOSAGUA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}]
        },
        {
            "id": 14,
            "provincia": "MORONA SANTIAGO",
            "ciudad": [
                {"name": "LOGROÑO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MORONA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PALORA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SANTIAGO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SUCÚA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 15,
            "provincia": "NAPO",
            "ciudad": [
                {"name": "ARCHIDONA","agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "CARLOS JULIO AROSEMENA TOLA","agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "EL CHACO","agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "QUIJOS","agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "TENA","agencia": [{"nombre": "CAC NO DISPONIBLE"}]}
            ]
        },
        {
            "id": 16,
            "provincia": "ORELLANA",
            "ciudad": [
                {"name": "LA JOYA DE LOS SACHAS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "LORETO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "ORELLANA",
                    "agencia": [{"nombre": "CAC NO DISPONIBLE"}]
                }
            ]
        },
        {
            "id": 17,
            "provincia": "PASTAZA",
            "ciudad": [
                {"name": "MERA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PASTAZA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 18,
            "provincia": "PICHINCHA",
            "ciudad": [
                {"name": "CAYAMBE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MEJIA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PEDRO MONCAYO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PEDRO VICENTE MALDONADO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PUERTO QUITO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "QUITO",
                    "agencia": [
                        {"nombre": "CAC EL PORTAL"},{"nombre": "CAC EL RECREO"},{"nombre": "CAC QUICENTRO NORTE"},
                        {"nombre": "CAC SAN LUIS"},{"nombre": "CAC SCALA"}]
                },
                {"name": "RUMINAHUI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN MIGUEL DE LOS BANCOS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 19,
            "provincia": "SANTA ELENA",
            "ciudad": [
                {"name": "LA LIBERTAD", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SALINAS","agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "SANTA ELENA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 20,
            "provincia": "SANTO DOMINGO DE LOS TSACHILAS",
            "ciudad": [
                {"name": "EL CARMEN","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "LA CONCORDIA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {
                    "name": "SANTO DOMINGO",
                    "agencia": [{"nombre": "CAC PASEO SANTO DOMINGO"}]
                }
            ]
        },
        {
            "id": 21,
            "provincia": "SUCUMBIOS",
            "ciudad": [
                {"name": "CASCALES","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "GONZALO PIZARRO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "LAGO AGRIO","agencia": [{"nombre": "CAC NO DISPONIBLE"}]},
                {"name": "SHUSHUFINDI","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 22,
            "provincia": "TUNGURAHUA",
            "ciudad": [
                {
                    "name": "AMBATO",
                    "agencia": [{"nombre": "CAC MALL DE LOS ANDES"}]
                },
                {"name": "BAÑOS DE AGUA SANTA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "CEVALLOS","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "MOCHA","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "PATATE","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "QUERO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SAN PEDRO DE PELILEO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "SANTIAGO PILLARO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "TISALEO","agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        },
        {
            "id": 23,
            "provincia": "ZAMORA CHINCHIPE",
            "ciudad": [
                {"name": "CENTINELA DEL CONDOR", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "YANZATZA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]},
                {"name": "ZAMORA", "agencia": [{"nombre": "NO EXISTE CAC EN LA CIUDAD"}]}
            ]
        }
    ];
    const infoCacs = [
        {
            "id": 1,
            "provincia": "GUAYAS",
            "ciudad": [
                {
                    "name": "GUAYAQUIL",
                    "agencia": [
                        {"nombre": "CAC CITY MALL"}, {"nombre": "CAC MALL SOL"}, {"nombre": "CONTACT CENTER"} ]
                }
            ]
        }
    ];

    // // Prevenir back button del navegador
    // (function (global) {
    //     if (typeof (global) === "undefined") {
    //         throw new Error("window is undefined");
    //     }
    //     global.onbeforeunload = function (e) {
    //         if (__productos.length > 0 && !__canRedirect) // Solo se previene que salga si es que existen productos en el carrito
    //             return "Detener";
    //     };
    // })(window);
});
