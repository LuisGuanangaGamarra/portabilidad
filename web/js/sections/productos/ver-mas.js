$(document).ready(function() {
    let gallery = null;
    let financiamientoGlobal = '',
        transaccionGlobal = '',
        cuotasGlobal = 18,
        riesgoGlobal = '',
        entradaGlobal = -1,
        tokenGlobal = '';
    let urlCheckRiesgo = '',
        urlDeleteRiesgo = '',
        cedulaRiesgo = '',
        riesgoHasBeenChecked = false;
    let eventsHasBeenTrigered = false;
    let showTarifario = false;
    let planTarifa = -1;

    ///////////////////////////
    ///       FUNCTIONS     ///
    ///////////////////////////
    function formatPrecio(precio) {
        return parseFloat(precio).toFixed(2).replace('.', ',');
    }

    function formatRiesgo(riesgo) {
        switch (riesgo) {
            case 'aaa-plus':
                return 'AAA+';
            case 'aaa':
                return 'AAA';
            case 'aaa-minus':
                return 'AAA-';
            case 'aa-plus':
                return 'AA+';
            case 'aa':
                return 'AA';
            case 'aa-minus':
                return 'AA-';
            case 'a':
                return 'A';
        }
        return '';
    }

    function createGallery(el, target, thumbs) {
        if (thumbs > 1) {
            gallery = target;
            el.find('.productoGaleriaShow').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.productoGaleriaNav[data-target="' + gallery + '"]'
            });
            el.find('.productoGaleriaNav').slick({
                slidesToShow: (thumbs < 4 ? thumbs : 4),
                slidesToScroll: 1,
                asNavFor: '.productoGaleriaShow[data-target="' + gallery + '"]',
                arrows: true,
                dots: false,
                focusOnSelect: true,
            });
        } else {
            gallery = null;
            el.find('.productoGaleriaShow').css({ "text-align": "center" });
            el.find('.productoGaleriaNav').find('.galNav').addClass('slick-current').css({ "margin": "0 auto" });
        }
    }

    function ___extraBuilder(icon, title, subtitle) {
        return `<div class="productosExtrasElement">
            <div class="iconImg">
                <img class="lazyload" data-src="${rootImg + icon}" width="50" height="50" alt="">
            </div>
            <div class="texto">
                <p>${title}</p>
                <p style="font-size: 0.7em">${subtitle}</p>
            </div>
        </div>`;
    }

    function ___planInputBuilder(priceJson, tipo) {
        return `<input type="radio" name="plan" value="${priceJson.token || ''}"
                    data-tipo="${tipo || ''}"
                    data-plan="${priceJson.plan || ''}"
                    data-plan-codigo=""
                    data-transaccion="${priceJson.transaccion || ''}"
                    data-total-price="${priceJson.totalConImp || ''}"
                    data-subtotal-price="${priceJson.subtotalConImp || ''}"
                    data-product-price="${priceJson.cuotaPrConImp || ''}"
                    data-plan-price="${priceJson.cuotaPlConImp || ''}"
                    data-pago="${priceJson.tipoPagoSlug || ''}"
                    data-cuotas="${priceJson.cuotas || ''}"
                    data-descuento-porcentaje="${priceJson.descuentoPorcentaje || 0}"
                    data-descuento="${priceJson.descuentoSubtotal || 0}"
                    data-entrada-porcentaje="${priceJson.entradaPorcentaje || 0}"
                    data-entrada="${priceJson.entradaSubtotal || 0}"
                    data-plan-recomendado="${priceJson.isRecomendado || ''}"
                    data-promocion="${priceJson.promocion || ''}"
                    data-promocion-sticker="${priceJson.promocionIcon || ''}"
                    data-promocion-tag="${priceJson.promocionTag || ''}"
                    data-riesgo="${priceJson.riesgo || ''}"
                    data-tarifa-min="${priceJson.tarifaMin || 0}"
                    data-tarifa-max="${priceJson.tarifaMax || 1000}"
                    >`;
    }

    function _planSelectorBuilder(priceJson, tipo) {
        if (priceJson.plan == null && priceJson.tipoPagoSlug != 'claro') {
            return `<div class="tnd-m-10-xs tnd-card horizontal" style="display: none">
                        <label class="radio-container">
                            <span>
                                ${priceJson.promocion != null ? `<img src="${priceJson.promocionTag ? rootImg + priceJson.promocionTag : rootImg + priceJson.promocionIcon}" class="promoIcon" alt="${priceJson.promocion}">`: ''}
                                Cuotas: ${priceJson.cuotas} - ${tipo}
                                <br>
                                <strong>$ ${priceJson.cuotaPrConImp}</strong>
                            </span>
                            ${___planInputBuilder(priceJson, tipo)}
                            <span class="customCheck"></span>
                        </label>
                    </div>`;
        }
        else if(priceJson.plan == null && priceJson.tipoPagoSlug == 'claro') {
            return `<div class="tnd-m-10-xs tnd-card horizontal" data-subtotal-price="${priceJson.subtotalConImp}" data-tarifa-min="${priceJson.tarifaMin || 0}"  data-tarifa-max="${priceJson.tarifaMax || 1000}" style="display: none">
                        <div class="accordeon-header">
                            <label class="radio-container">
                                <div class="flex-xs">
                                    <div>
                                        ${priceJson.promocion != null ? `<img src="${priceJson.promocionTag ? rootImg + priceJson.promocionTag : rootImg + priceJson.promocionIcon}" class="promoIcon" alt="${priceJson.promocion}">` : ''}  
                                        <p><strong>Cuotas de ${priceJson.cuotas} meses </strong></p>
                                        <p><span>Oferta aplica con cuota inicial: \$${parseFloat(priceJson.entradaSubtotal).toFixed(2).replace('.', ',')}</span></p>
                                    </div>
                                    <div class="rightPrice">\$${parseFloat(priceJson.cuotaPrConImp).toFixed(2).replace('.', ',')}</div>
                                </div>
                                ${___planInputBuilder(priceJson, tipo)}
                                <span class="customCheck"></span>
                            </label>
                        </div>
                    </div>`;
        }
        return `<div class="tnd-m-10-xs tnd-card horizontal" style="display: none">
                    <div class="accordeon-header">
                        <label class="radio-container">
                            <span>
                                ${priceJson.promocion != null ? `<img src="${priceJson.promocionTag ? rootImg + priceJson.promocionTag : rootImg + priceJson.promocionIcon}" class="promoIcon" alt="${priceJson.promocion}">` : ''}  
                                ${priceJson.plan}
                                <br>
                                <strong>\$${parseFloat(priceJson.cuotaPlConImp).toFixed(2).replace('.', ',')} al mes</strong>
                            </span>
                            ${___planInputBuilder(priceJson, tipo)}
                            <span class="customCheck"></span>
                        </label>
                        <div class="accordeon-trigger" style="display: none"></div>
                    </div>
                    <div class="accordeon-body" style="display: none">
                        <ul>
                            <!--
                            {% for detalle in financiamiento.idPlan.planDetalles %}
                                <li>{{ detalle.idDetalle.descripcion|capitalize  }}</li>
                            {% endfor %}
                             -->
                        </ul>
                    </div>
                </div>`;
    }
    function loadPrices(url, financiamientoSlug, transaccionSlug, cuotasSlug, riesgoSlug, entradaSlug) {
        $.ajax({
            url: url,
            type: 'POST',
            beforeSend: function () {
            },
            success: function (data) {
                if (!data.error) {
                    let precios = data.content;
                    // 1. Cargar precios según su tipo
                    data.content.preciosNormales.forEach(function (priceJson, i) {
                        $(`div.productoFinanciamiento[data-target="${priceJson.tipoPagoSlug}"] div.selector-plan`).append(_planSelectorBuilder(priceJson, 'normal'));
                    });
                    data.content.preciosPromocionales.forEach(function (priceJson, i) {
                        $(`div.productoFinanciamiento[data-target="${priceJson.tipoPagoSlug}"] div.selector-plan`).append(_planSelectorBuilder(priceJson, 'oferta'));
                    });
                    data.content.preciosExclusivos.forEach(function (priceJson, i) {
                        $(`div.productoFinanciamiento[data-target="${priceJson.tipoPagoSlug}"] div.selector-plan`).append(_planSelectorBuilder(priceJson, 'exclusivo'));
                    });
                    // 2. Ordenar precios de Financiamiento Claro
                    let claroOrdenado = $('div.productoFinanciamiento[data-target="claro"] div.selector-plan div.tnd-card.horizontal').sort(function(a, b){
                        return parseFloat($(b).attr('data-subtotal-price')) - parseFloat($(a).attr('data-subtotal-price'));
                    });
                    $('div.productoFinanciamiento[data-target="claro"] div.selector-plan').html(claroOrdenado);
                    // 3. Mostrar transacciones
                    $('input[type="radio"][name="transaccion"]').each(function (i, transaccion) {
                        if(!$(`input[type="radio"][name="plan"][data-transaccion=${$(transaccion).attr('value')}]`).length) {
                            $(transaccion).closest('div.tnd-card.horizontal').remove();
                        }
                    });
                    // 4. Mostrar tipos de pago
                    $('input[type="radio"][name="financiamiento"]').each(function (i, financiamiento) {
                        if(!$(`input[type="radio"][name="plan"][data-pago=${$(financiamiento).attr('value')}]`).length) {
                            $(financiamiento).closest('div.tnd-card.horizontal').remove();
                        }
                    });
                    // 5. Cargar cuotas en el selector de cuotas por tarjeta de crédito
                    $('select#opcionesDiferir option').each(function (i, option) {
                        if(!$(`input[type="radio"][name="plan"][data-pago='tarjeta_credito'][data-cuotas="${$(option).val()}"]`).length) {
                            $(option).remove();
                        }
                    });
                    // 6. Seleccionar respectiva tipo de pago, transaccion y precio
                    riesgoGlobal = riesgoSlug;
                    cuotasGlobal = cuotasSlug > 0 ? cuotasSlug : 18;
                    if($(`input[type="radio"][name="transaccion"][value="${transaccionSlug}"]`).length) {
                        transaccionGlobal = transaccionSlug;
                    } else if(window.location.hash.length > 2 && $(`input[type="radio"][name="transaccion"][value="${window.location.hash.substring(1)}"]`).length) {
                        transaccionGlobal = window.location.hash.substring(1);
                    } else {
                        transaccionGlobal = $('input[type="radio"][name="transaccion"]').first().val();
                    }
                    financiamientoGlobal = $(`input[type="radio"][name="financiamiento"][value="${financiamientoSlug}"]`).length ? financiamientoSlug : financiamientoGlobal = $('input[type="radio"][name="financiamiento"]').first().val();
                    //selectTipoPago(financiamientoGlobal);
                    $(`input[type="radio"][name="financiamiento"][value="${financiamientoGlobal}"]`).click();
                    // 7. Ocultar previews y mostrar todo
                    $('div.productoTipoPago .tnd-animated-background').remove();
                    $('div.productoTipoPago div.tnd-card.horizontal').show();
                    $('div.productoTransaccion .tnd-animated-background').remove();
                    $('div.productoTransaccion div.tnd-card.horizontal').show();
                }
            },
            complete: function () {
            },
            error: function (error) {
                Alert.error('Nos encontramos temporalmente en mantenimiento. Por favor, intente nuevamente dentro de unos minutos.', 'No pueden mostrarse los precios de este producto.');
            }
        });
    }
    function loadFeatures() {
        // TODO: Hacer la función

    }
    function loadExtras(url) {
        $.ajax({
            url: url,
            type: 'POST',
            beforeSend: function () {
            },
            success: function (data) {
                if (!data.error) {
                    data.content.forEach(function (extra) {
                        $('div.productoExtras:not(#etiquetasDetail)').append(___extraBuilder(extra.icon, extra.title, extra.subtitle));
                    });
                }
            },
            complete: function () {
            },
            error: function (error) {
            }
        });
    }
    function loadTarifas(url) {
        if (showTarifario) {
            $.ajax({
                url: url,
                type: 'POST',
                beforeSend: function () {
                },
                success: function (data) {
                    if (!data.error) {
                        Object.values(data.content.rangos).forEach(function (tarifa) {
                            $('div.productoTarifas select').append(` <option value="${tarifa.value}" data-tarifaMin="${tarifa.minValue}" data-tarifaMax="${tarifa.maxValue}" >${tarifa.text}</option>`);
                        });
                        style_tarifario();
                    }
                },
                complete: function () {
                },
                error: function (error) {
                }
            });
        }
    }
    function checkFinanciamientoClaro(url) {
        let identificacion = $('div.productoValidacionCedula input[name="cedula"]').val();
        let idproducto = $('input[type="hidden"][name="__random"]').val();
        let fi_el = $('.selector-plan input[type="radio"][name="plan"]:checked');
        planTarifa = -1;
        if((!identificacion.length && !riesgoHasBeenChecked) || identificacion != cedulaRiesgo) {
            $.ajax({
                url: url,
                type: 'POST',
                data: { identificacion: identificacion, idproducto: idproducto },
                beforeSend: function () {
                    $('div.productoValidacionCedula .tnd-msg-input').removeClass('tnd-error tnd-font-error tnd-success tnd-font-success').empty().hide();
                    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').hide();
                    $('div.productoValidacionCedula input[name="cedula"]').prop('readonly', true).parent().removeClass('tnd-error-input tnd-success-input');
                    $('div.productoValidacionCedula button').prop('disabled', true).removeClass('turquoise').css('color', '#222222');
                    let fi_el = $('.selector-plan input[type="radio"][name="plan"]:checked');
                },
                success: function (data) {
                    //console.log(data);
                    if(data.content.identificacion) {
                        cedulaRiesgo = data.content.identificacion;
                        $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').show();
                        if (!data.error) {
                            if(showTarifario) {
                                $('div.productoTarifas').show();
                                $('div.productoFinanciamiento[data-target="claro"]').hide();
                            } else
                                $('div.productoFinanciamiento[data-target="claro"]').show();
                            riesgoGlobal = data.content.riesgo;
                            $('div.productoValidacionCedula input[name="cedula"]').val(cedulaRiesgo).parent().addClass('tnd-success-input');
                            selectTransaccion(transaccionGlobal);
                            let fi_el = $('.selector-plan input[type="radio"][name="plan"]:checked');
                            __gaTrigger_aplicaFinanciamientoClaro('Aplica Financiamiento Claro', fi_el.attr('data-subtotal-price'), formatRiesgo(riesgoGlobal));
                            if($(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`).length) {
                                $('div.productoValidacionCedula input[name="cedula"]').parent().removeClass('tnd-error-input');
                                $('div.productoValidacionCedula input[name="cedula"]').parent().addClass('tnd-success-input');
                                $('div.productoValidacionCedula .tnd-msg-input').removeClass('tnd-error tnd-font-error');
                                $('div.productoValidacionCedula .tnd-msg-input').hide();
                            } else {
                                $('div.productoValidacionCedula input[name="cedula"]').parent().removeClass('tnd-success-input');
                                $('div.productoValidacionCedula input[name="cedula"]').val(data.content.identificacion).parent().addClass('tnd-error-input');
                                $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html('Tus opciones disponibles son: tarjeta de crédito o contado.').show();
                            }
                        } else {
                            $('div.productoValidacionCedula input[name="cedula"]').val(data.content.identificacion).parent().addClass('tnd-error-input');
                            $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html('Tus opciones disponibles son: tarjeta de crédito o contado.').show();
                            let fi_el = $('.selector-plan input[type="radio"][name="plan"]:checked');
                            __gaTrigger_aplicaFinanciamientoClaro('No aplica Financiamiento Claro', fi_el.attr('data-subtotal-price'), "(ninguno)");
                        }
                    }
                },
                complete: function () {
                    riesgoHasBeenChecked = true;
                },
                error: function (error) {
                    $('div.productoValidacionCedula button').prop('disabled', false).addClass('turquoise').css('color', '');
                    $('div.productoValidacionCedula input[name="cedula"]').prop('readonly', false).parent().removeClass('tnd-error-input tnd-success-input');
                }
            });
        }
        $('div.productoValidacionCedula').show();
    }
    function selectTipoPago(financiamientoSlug) {
        // console.log('Seleccionado Tipo pago: ' + financiamientoSlug);
        financiamientoGlobal = financiamientoSlug;
        $('div.productoValidacionCedula').hide();
        $('div.productoFinanciamiento[data-target="claro"]').hide();
        $('div.productoTarifas').hide();
        $('input[type="radio"][name="financiamiento"]').closest('div.tnd-card.horizontal').removeClass('active');
        $(`input[type="radio"][name="financiamiento"][value="${financiamientoSlug}"]`).closest('div.tnd-card.horizontal').addClass('active');
        switch (financiamientoGlobal) {
            case 'tarjeta_credito':
                //$('.leyendaTodoPor').html('Cuota mensual final por equipo:');
                $('.leyendaTotalConImp').html('Cuota final mensual');
                $('div.productoPlazo').show();
                $('select#opcionesDiferir').val($('select#opcionesDiferir option').first().val()).trigger('change');
                break;
            case 'claro':
                $('.leyendaTodoPor').html('Cuota mensual final por equipo:');
                $('div.productoPlazo').hide();
                $('.leyendaTotalConImp').html('Cuota final mensual');
                //$('input[type="radio"][name="plan"]').closest('div.tnd-card.horizontal').hide();
                if(!riesgoGlobal.length) {
                    // Show Validar Credito form
                    $('div.resumenPrecio div.precios').hide();
                    $('div.resumenPrecio div.previews').show();
                    $('form.productoInfo div.cta button[type="submit"]').prop('disabled', true);
                    // Mostrar precios según la cédula guardada en base
                    checkFinanciamientoClaro(urlCheckRiesgo);
                } else {
                    if(showTarifario) {
                        $('div.resumenPrecio div.precios').hide();
                        $('div.resumenPrecio div.previews').show();
                        $('div.productoTarifas').show();
                        if(planTarifa != -1) {
                            $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`).filter(function () {
                                return planTarifa >= parseFloat($(this).attr('data-tarifa-min')) && planTarifa <= parseFloat($(this).attr('data-tarifa-max'));
                            }).closest('div.tnd-card.horizontal').show();
                            $('div.productoFinanciamiento[data-target="claro"]').show();
                            selectPrice();
                        }
                    } else {
                        $('div.productoFinanciamiento[data-target="claro"]').show();
                        selectPrice();
                    }
                }
                if(cedulaRiesgo.length) {
                    $('div.productoValidacionCedula').show();
                }
                break;
            default:
                cuotasGlobal = 1;
                $('.leyendaTodoPor').html('Precio final por equipo:');
                $('.leyendaTotalConImp').html('Precio final');
                $('div.productoPlazo').hide();
                break;
        }
        if(financiamientoGlobal !== 'claro' || (financiamientoGlobal === 'claro' && riesgoGlobal.length)) {
            selectTransaccion(transaccionGlobal);
            /*$('input[type="radio"][name="transaccion"]').prop('checked', false).val('').closest('div.tnd-card.horizontal').removeClass('active');
            $(`input[type="radio"][name="transaccion"][value="${transaccionGlobal}"]`).click();*/
        }

    }
    function selectTransaccion(transaccionSlug) {
        if(transaccionSlug.length) {
            $('#etiquetasDetail, #promocionesDetail, #promocionesDetail p span.etiqueta, #accesoriosDetail, #accesoriosDetail div.accesorio').hide();
            if($(`#accesoriosDetail div.accesorio[data-target="${transaccionSlug}"]`).length) {
                $(`#etiquetasDetail, #accesoriosDetail, #accesoriosDetail div.accesorio[data-target="${transaccionSlug}"]`).show();
            }
            if($(`#promocionesDetail p span.etiqueta[data-target="${transaccionSlug}"]`).length) {
                $(`#etiquetasDetail, #promocionesDetail, #promocionesDetail p span.etiqueta[data-target="${transaccionSlug}"]`).show();
            }
            transaccionGlobal = transaccionSlug;
            $('input[type="radio"][name="plan"]').closest('div.tnd-card.horizontal').hide();
            $('input[type="radio"][name="transaccion"]').closest('div.tnd-card.horizontal').removeClass('active');
            $(`input[type="radio"][name="transaccion"][value="${transaccionSlug}"]`).click().prop('checked', true).closest('div.tnd-card.horizontal').addClass('active');
            if(financiamientoGlobal === 'claro' && riesgoGlobal.length ) {
                if(!showTarifario) {
                    $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`).closest('div.tnd-card.horizontal').show();
                    $('span#precio-descuento').html(formatPrecio(parseFloat(0)));
                    $('p.precioDescuento').hide();
                    selectPrice();
                } else if(planTarifa != -1) {
                    $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`).filter(function () {
                        return planTarifa >= parseFloat($(this).attr('data-tarifa-min')) && planTarifa <= parseFloat($(this).attr('data-tarifa-max'));
                    }).closest('div.tnd-card.horizontal').show();
                }
            } else {
                selectPrice();
            }

        }
    }
    function selectFinanciamiento(tokenPrecio) {
        try {
            if(tokenPrecio.length) {
                $('div.productoFinanciamiento[data-target="claro"] div.tnd-animated-background').hide();
                tokenGlobal = tokenPrecio;
                $('div.resumenPrecio div.precios, p.precioAnterior, p.precioTotalConImp,p.precioDescuento, p.precioPlanSimImp,  p.precioCuotaInicial, img.oferta-tag').hide();
                $('form.productoInfo div.cta button[type="submit"]').prop('disabled', true);
                let financiamientoInput = $(`input[type="radio"][name="plan"][value="${tokenPrecio}"]`);
                cuotasGlobal = financiamientoInput.attr('data-cuotas');
                $('input[type="radio"][name="plan"]').closest('div.tnd-card.horizontal').removeClass('active');
                financiamientoInput.click().prop('checked', true).closest('div.tnd-card.horizontal').addClass('active');
                if(financiamientoGlobal === 'tarjeta_credito') {
                    $('select#opcionesDiferir').val(cuotasGlobal);
                    //$('p.precioDescuento').show();
                    let cuotadefinida = cuotasGlobal;
                    if(cuotasGlobal == 1){
                        let precioNormal = $(`input[type="radio"][name="plan"][data-pago="${financiamientoInput.attr('data-pago')}"][data-transaccion="${financiamientoInput.attr('data-transaccion')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"][data-cuotas="${financiamientoInput.attr('data-cuotas')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"]`);
                        let teregalamos = precioNormal.attr('data-product-price') - financiamientoInput.attr('data-product-price');
                        if(teregalamos!==0){
                            $('p.precioDescuento').show();
                        }
                    }else{
                        $('p.precioDescuento').hide();
                    }
                }
                if(financiamientoGlobal === 'contado') {
                    let precioNormal = $(`input[type="radio"][name="plan"][data-pago="${financiamientoInput.attr('data-pago')}"][data-transaccion="${financiamientoInput.attr('data-transaccion')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"][data-cuotas="${financiamientoInput.attr('data-cuotas')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"]`);
                    let teregalamos = precioNormal.attr('data-product-price') - financiamientoInput.attr('data-product-price');
                    if(teregalamos!==0){
                        $('p.precioDescuento').show();
                    }
                    $('#leyendaPrecioAnterior').html('Precio normal final:');
                    //$('p.precioDescuento').hide();
                }
                $('span#precio-equipo').html(formatPrecio(financiamientoInput.attr('data-product-price')));
                $('span#precio-total').html(formatPrecio(financiamientoInput.attr('data-total-price')));
                if(financiamientoInput.attr('data-tipo') != 'normal') {
                    $('img.oferta-tag').attr('src', rootImg + financiamientoInput.attr('data-promocion-tag')).show();
                    let precioNormal = $(`input[type="radio"][name="plan"][data-pago="${financiamientoInput.attr('data-pago')}"][data-transaccion="${financiamientoInput.attr('data-transaccion')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"][data-cuotas="${financiamientoInput.attr('data-cuotas')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"]`);
                    if(precioNormal.length) {
                        $('span#precio-anterior').html(formatPrecio(precioNormal.attr('data-product-price')));
                        $('span#precio-descuento').html(formatPrecio(parseFloat(precioNormal.attr('data-product-price')) - parseFloat(financiamientoInput.attr('data-product-price'))));
                        $('p.precioAnterior/*, p.precioTotalConImp/*').show();
                        if(financiamientoGlobal === 'contado') {
                            let precioNormal = $(`input[type="radio"][name="plan"][data-pago="${financiamientoInput.attr('data-pago')}"][data-transaccion="${financiamientoInput.attr('data-transaccion')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"][data-cuotas="${financiamientoInput.attr('data-cuotas')}"][data-riesgo="${financiamientoInput.attr('data-riesgo')}"]`);
                            let teregalamos = precioNormal.attr('data-product-price') - financiamientoInput.attr('data-product-price');
                            if(teregalamos!==0){
                                $('p.precioDescuento').show();
                            }
                            //$('p.precioDescuento').hide();
                        }
                    }
                }
                if(financiamientoGlobal == 'claro' && parseFloat(financiamientoInput.attr('data-entrada')) > 0) {
                    $('#precio-entrada').html(formatPrecio(financiamientoInput.attr('data-entrada')));
                    $('p.precioCuotaInicial').show();
                    $('span#precio-descuento').html(formatPrecio(parseFloat(0)));
                    $('p.precioDescuento').hide();
                }
                $('div.resumenPrecio div.previews').hide();
                $('div.resumenPrecio div.precios').show();
                $('form.productoInfo div.cta button[type="submit"]').prop('disabled', false);
                if(!eventsHasBeenTrigered) {
                    eventsHasBeenTrigered = true;
                    // Disparar eventos de GA y FB
                    let isAvisame = $('form.productoInfo').hasClass('avisame');
                    __gaTrigger(`Producto Visto${isAvisame ? ' (Reservar)' : ''}`, financiamientoInput.attr('data-subtotal-price'));
                    __fbTrigger('ViewContent', financiamientoInput.attr('data-subtotal-price'));
                }
            }
        } catch (e) { }
    }
    function findFinanciamientosClaro() {
        if($(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`).length) {
            // console.log(0, `input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`, $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`).length);
            return $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`);
        } if($(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]`).length) {
            // console.log(1, `input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]`, $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]`).length);
            return $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotasGlobal}"]`);
        }
        let cuotasPosibles = [24, 18, 15, 12];
        $(cuotasPosibles).each(function (i, cuotaPosible) {
            if($(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`).length) {
                cuotasGlobal = cuotaPosible;
                // console.log(2, `input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`, $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`));
                return $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`);
            } if($(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]`).length) {
                cuotasGlobal = cuotaPosible;
                // console.log(3, `input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]`, $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]`).length);
                return $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"][data-cuotas="${cuotaPosible}"]`);
            }
        });
        if($(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`).length) {
            // console.log(4, `input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`, $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`));
            return $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]${entradaGlobal >= 0 ? `[data-entrada-porcentaje="${entradaGlobal}"]` : ``}`);
        }
        // console.log(5, `input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`, $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`));
        return $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`);
    }
    function selectPrice() {
        let tipos = ['exclusivo', 'oferta', 'normal'];
        let has = false;
        let contador = 0;
        tipos.forEach(function (tipo, i) {
            if(financiamientoGlobal == 'claro') {
                let financiamientos = findFinanciamientosClaro();
                if(financiamientos.length) {
                    $('div.productoValidacionCedula input[name="cedula"]').parent().addClass('tnd-success-input');
                    $('div.productoValidacionCedula input[name="cedula"]').parent().removeClass('tnd-error-input');
                    $('div.productoValidacionCedula .tnd-msg-input').removeClass('tnd-error tnd-font-error');
                    $('div.productoValidacionCedula .tnd-msg-input').hide();
                    if(showTarifario && planTarifa != -1) {
                        financiamientos = financiamientos.filter(function () {
                            return planTarifa >= parseFloat($(this).attr('data-tarifa-min')) && planTarifa <= parseFloat($(this).attr('data-tarifa-max'));
                        });
                    }
                    selectFinanciamiento(financiamientos.first().val());
                    has = true;
                } else {
                    $('div.productoValidacionCedula input[name="cedula"]').parent().removeClass('tnd-success-input');
                    $('div.productoValidacionCedula input[name="cedula"]').parent().addClass('tnd-error-input');
                    $('div.productoValidacionCedula .tnd-msg-input').addClass('tnd-error tnd-font-error').html('Tus opciones disponibles son: tarjeta de crédito o contado.').show();
                }
            } else if(financiamientoGlobal != 'tarjeta_credito') {//contado
                if(!has && $(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-tipo="${tipo}"]`).length) {
                    selectFinanciamiento($(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-tipo="${tipo}"]`).first().val());
                    has = true;
                    //console.log($(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-tipo="${tipo}"]`).first().val());
                }
            } else {//tc
                if(!has && $(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-tipo="${tipo}"][data-cuotas="${cuotasGlobal}"]`).length) {
                    selectFinanciamiento($(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-tipo="${tipo}"][data-cuotas="${cuotasGlobal}"]`).first().val());
                    has = true;
                    //console.log($(`input[type="radio"][name="plan"][data-pago="${financiamientoGlobal}"][data-transaccion="${transaccionGlobal}"][data-tipo="${tipo}"][data-cuotas="${cuotasGlobal}"]`).first().val());
                }
            }
        });
    }

    function style_tarifario(){
        $('div.productoFinanciamiento[data-target="claro"]').hide();
        $('.option-tarifas').each(function() {
            let template =  '<div class="' + $(this).attr('class') + '">';
            template += '<span class="option-tarifas-trigger">' + $(this).attr("placeholder") + '</span>';
            template += '<div class="custom-options-tarifas">';
            $(this).find("option").each(function() {
                let textSelector = $(this).html().split('|');
                template += '<span class="custom-option-tarifas ' + '" value="' + $(this).attr("value") + '" data-tarifa-min="' + $(this).attr("data-tarifaMin") + '" data-tarifa-max="' + $(this).attr("data-tarifaMax")  + '">' + textSelector[0] + '<strong>' + textSelector[1] + '</strong> </span>';
            });
            template += '</div></div>';
            $(this).wrap('<div class="option-tarifas-wrapper"></div>');
            $(this).hide();
            $(this).after(template);
        });
        $('.custom-option-tarifas:first-of-type').hover(function() {
            $(this).parents('.custom-options-tarifas').addClass('option-hover');
        }, function() {
            $(this).parents('.custom-options-tarifas').removeClass('option-hover');
        });
        $('.option-tarifas-trigger').on('click', function() {
            $('html').one('click',function() {
                $('.option-tarifas').removeClass('opened');
            });
            $(this).parents('.option-tarifas').toggleClass('opened');
            $('.custom-options-tarifas').find('.custom-option-tarifas').removeClass('selection');
            event.stopPropagation();
        });
        $('.custom-option-tarifas').on('click', function() {
            $(this).parents('.option-tarifas-wrapper').find('select').val($(this).data('value'));
            $(this).parents('.custom-options-tarifas').find('.custom-option-tarifas').removeClass('selection');
            $(this).addClass('selection');
            $(this).parents('.option-tarifas').removeClass('opened');
            $(this).parents('.option-tarifas').find('.option-tarifas-trigger').html($(this).html());
        });
    }

    function __gaTrigger(action, price) {
        try {
            gtag('event', action, {
                'event_category': $('input[type="hidden"][name="_ga__category"]').val(),
                'event_label': `Marca: ${$('input[type="hidden"][name="_equipo__marca"]').val()} | Referencia: ${$('input[type="hidden"][name="_equipo__nombre"]').val()} | Detalle: (ninguno)`,
                'value': price
            });
        } catch (e) {   }
    }

    function __gaTrigger_aplicaFinanciamientoClaro(action, price, riesgos) {
        try {
            gtag('event', action, {
                'event_category': $('input[type="hidden"][name="_ga__category"]').val(),
                'event_label': `Marca: ${$('input[type="hidden"][name="_equipo__marca"]').val()} | Referencia: ${$('input[type="hidden"][name="_equipo__nombre"]').val()} | Detalle: (ninguno) | Riesgos: ${riesgos}`,
                'value': price
            });
        } catch (e) {   }
    }

    function __fbTrigger(action, price) {
        window.dataLayer = window.dataLayer || [];
        try {
            window.dataLayer.push({
                event: action,
                content_ids: [$('input[type="hidden"][name="__random"]').val()],
                content_name: $('input[type="hidden"][name="_equipo__nombre_comercial"]').val(),
                content_category: $('input[type="hidden"][name="_equipo__tipo"]').val(),
                content_type: "product",
                value: price,
                currency: "USD",
                contents: [{
                    id: $('input[type="hidden"][name="__random"]').val(),
                    item_price: price,
                    quantity: 1
                }],
                google_items: [{
                    id: $('input[type="hidden"][name="__random"]').val(),
                    google_business_vertical: 'retail',
                    item_id: $('input[type="hidden"][name="__random"]').val(),
                    item_name: $('input[type="hidden"][name="_equipo__nombre_comercial"]').val(),
                    item_category: $('input[type="hidden"][name="_equipo__tipo"]').val(),
                    item_brand: $('input[type="hidden"][name="_equipo__marca"]').val(),
                    price: price,
                    currency: 'USD',
                    quantity: 1
                }]
            });
        } catch (e) {   }
    }

    /**
     * Do the magic
     */
    function __init() {
        // 1. Crear la galería de imágenes
        let productoGaleria = $('.productoGaleria').first();
        createGallery(productoGaleria, productoGaleria.attr('data-target'), parseInt(productoGaleria.attr('data-imgs')));
        let formPrincipal = $('form.productoInfo');
        urlCheckRiesgo = formPrincipal.attr('data-url-riesgo-check');
        urlDeleteRiesgo = formPrincipal.attr('data-url-riesgo-delete');
        cuotasGlobal = formPrincipal.attr('data-cuotas') || 18;
        entradaGlobal = formPrincipal.attr('data-entrada') || -1;
        // 2. Cargar Tarifario
        const section = $('input[type="hidden"][name="_equipo__tipo"]').val();
        showTarifario = section == 'TABLET' || section == 'SMARTPHONE';
        loadTarifas(formPrincipal.attr('data-url-tarifario'));
        // 3. Cargar precios
        loadPrices(formPrincipal.attr('data-url-prices'), formPrincipal.attr('data-financiamiento'), formPrincipal.attr('data-transaccion'), formPrincipal.attr('data-cuotas'), formPrincipal.attr('data-riesgo'), entradaGlobal);
        // 4. Cargar caracteristicas
        loadFeatures();
        // 5. Cargar caracteristicas
        loadExtras(formPrincipal.attr('data-url-extras'));
    }


    ///////////////////////////
    ///    EVENT HANDLERS   ///
    ///////////////////////////

    $('.accordeon-trigger').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).parent().parent().find('.accordeon-body').slideToggle();
    });
    $('.colors input[type="radio"]').change(function(){
        $('.productoGaleria').hide();
        if(gallery) {
            $('.productoGaleriaShow[data-target="' + gallery + '"]').first().slick('unslick');
            $('.productoGaleriaNav[data-target="' + gallery + '"]').first().slick('unslick');
        }
        let el = $('.productoGaleria[data-target="' + $(this).attr('value') + '"]');
        el.show();
        createGallery(el, el.attr('data-target'), parseInt(el.attr('data-imgs')))
    });
    $('input[type="radio"][name="transaccion"]').change(function () {
        selectTransaccion($(this).val());
    });
    $('input[type="radio"][name="financiamiento"]').change(function () {
        selectTipoPago($(this).val())
    });
    $('div.selector-plan').on('change', 'input[type="radio"][name="plan"]', function () {
        selectFinanciamiento($(this).val());
        if(financiamientoGlobal === 'claro' && planTarifa != -1) {
            setTimeout(function() {
                $("html, body").animate({scrollTop: 0}, 600);
            }, 1000);
        }
    });
    $('select#opcionesDiferir').change(function () {
        cuotasGlobal = $(this).val();
        selectPrice();
        if (cuotasGlobal != 1) {
            $('.leyendaTodoPor').html('Cuota mensual final por equipo:');
            $('#leyendaPrecioAnterior').html('Cuota normal final:');
        } else {
            $('.leyendaTodoPor').html('Precio final por equipo:');
            $('#leyendaPrecioAnterior').html('Precio normal final:');
        }
    });
    $('body').on('click', '.custom-option-tarifas',function () {
        planTarifa = parseFloat($(this).attr('value'));
        $('div.productoFinanciamiento[data-target="claro"], div.productoFinanciamiento[data-target="claro"] div.tnd-animated-background').show();
        $('input[type="radio"][name="plan"][data-pago="claro"]').closest('div.tnd-card.horizontal').hide();
        $(`input[type="radio"][name="plan"][data-pago="claro"][data-transaccion="${transaccionGlobal}"][data-riesgo="${riesgoGlobal}"]`).filter(function () {
            return planTarifa >= parseFloat($(this).attr('data-tarifa-min')) && planTarifa <= parseFloat($(this).attr('data-tarifa-max'));
        }).closest('div.tnd-card.horizontal').show();
        selectPrice();
    });
    $('div.productoValidacionCedula button').click(function (e) {
        e.preventDefault();
        if($(this).hasClass('turquoise')) {
            let identificacion = $('div.productoValidacionCedula input[name="cedula"]').val();
            if(validateIdentificationNumber(identificacion)) {
                // Validate cedula and show claro prices
                let fi_el = $('.selector-plan input[type="radio"][name="plan"]:checked');
                __gaTrigger('Valida Financiamiento Claro', fi_el.attr('data-subtotal-price'));
                checkFinanciamientoClaro(urlCheckRiesgo);
            } else {
                Alert.error('Revisa los datos que has ingresado e intenta nuevamente.', 'La cédula ingresada es incorrecta.');
            }
        } else {
            $(this).prop('disabled', false).addClass('turquoise').css('color', '');
        }
    });
    $('div.productoValidacionCedula div.tnd-content-input a[data-action="remove"]').click(function (e) {
        e.preventDefault();
        $.post(urlDeleteRiesgo, function(data) { });
        riesgoGlobal = '';
        cedulaRiesgo = '';
        $(this).hide();
        $('div.resumenPrecio div.precios').hide();
        $('div.resumenPrecio div.previews').show();
        $('div.productoFinanciamiento[data-target="claro"]').hide();
        $('div.productoTarifas').hide();
        $('form.productoInfo div.cta button[type="submit"]').prop('disabled', true);
        $('div.productoValidacionCedula button').prop('disabled', false).addClass('turquoise').css('color', '');
        $('div.productoValidacionCedula .tnd-msg-input').removeClass('tnd-error tnd-font-error tnd-success tnd-font-success').empty().hide();
        $('div.productoValidacionCedula input[name="cedula"]').prop('readonly', false).val('').parent().removeClass('tnd-error-input tnd-success-input');
    });

    $('body').on('blur', '[data-cellphone-validation]', function (ev) {
        let input = ev.currentTarget;
        let patternText = new RegExp(/^09\d\d\d\d\d\d\d\d$/);
        if (!patternText.test($(this).val())) {
            input.setCustomValidity("Número celular inválido");
            input.checkValidity();
        }
    });

    $('body').on('keydown', '[data-cellphone-validation]', function (ev) {
        let input = ev.currentTarget;
        input.setCustomValidity('');
        input.checkValidity()

    });

    $('body').on('keypress', '[data-only-numbers]', function (ev) {
        let charCode = ev.which || event.keyCode;
        return (charCode >= 48 && charCode <= 57) || charCode == 8 || charCode == 9;
    });

    $('body').on('keypress', '[data-only-letters]', function (ev) {
        let tecla = ev.which || event.keyCode;
        if (tecla == 8 || tecla == 9 || tecla == 241 || tecla == 209) {
            return true;
        }
        let pattern = /^[a-no-z A-NO-Z]$/;
        let te = String.fromCharCode(tecla);
        return pattern.test(te);
    });

    /**
     * Carrito champion
     */
    $('form.productoInfo:not(.avisame)').submit(function(e) {
        e.preventDefault();
        let pr_el = $('.productoColor ul.colors input[type="radio"][name="color"]:checked');
        let fi_el = $('.productoFinanciamiento .selector-plan input[type="radio"][name="plan"]:checked');
        let tr_el = $('.productoTransaccion input[type="radio"][name="transaccion"]:checked');
        let btn = $(this).find('button.tnd-btn.red[type="submit"][data-action="carrito"]');
        __gaTrigger(btn.attr('data-ga-action'), fi_el.attr('data-subtotal-price'));
        __fbTrigger(btn.attr('data-fb-action'), fi_el.attr('data-subtotal-price'));
        Cart.add(new CartProduct($('input[type="hidden"][name="_seccion"]').val(), $('input[type="hidden"][name="_equipo__nombre_comercial"]').val(), pr_el.val(), tokenGlobal, $('.productoGaleriaNav[data-target="' + pr_el.val() + '"] .galNav img').first().attr('src')));
    });

    /**
     * Avísame champion
     */
    $('form.productoInfo.avisame').submit(function(e) {
        e.preventDefault();
        let form = `<form class="formAvisame" action="#" method="POST" autocomplete="off" tnd-validate-form>
                <div class="flex-xs flex-wrap-xs flex-cont-1-xs flex-center">
                        <div class="tnd-input-container tnd-mb-15-xs">
                            <label class="tnd-content-input-label" for="text__nombres">Nombre completo *</label>
                            <div class="tnd-content-input">
                                <input type="text" name="text__nombres" id="text__nombres" required data-only-letters class="tnd-input-text" placeholder="Nombres y apellidos" autocomplete="given-name">
                            </div>
                        </div>
                         <div class="tnd-input-container tnd-mb-15-xs">
                            <label class="tnd-content-input-label" for="text__celular">Celular *</label>
                            <div class="tnd-content-input">
                                <input type="text" name="text__celular" id="text__celular" required data-only-numbers data-cellphone-validation class="tnd-input-text" minlength="10" maxlength="10" placeholder="Celular" autocomplete="tel" >
                            </div>
                        </div>
                        <div class="tnd-input-container">
                            <label class="tnd-content-input-label" for="text__email">Correo electrónico *</label>
                            <div class="tnd-content-input">
                                <input type="email" name="text__email" id="text__email" required class="tnd-input-text" placeholder="Correo electrónico" autocomplete="email" >
                            </div>
                        </div>
                    </div>
                    <div class="tnd-m-10-xs tnd-ml-0-xs tnd-mb-22-xs tnd-text-right-xs" style="font-size: 0.625rem">
                        * Campos obligatorios
                    </div>
                    
                <input type="hidden" name="id_producto" value="${$('input[type="hidden"][name="__random"]').val()}">
                <input type="hidden" name="nombre_producto" value="${$('input[type="hidden"][name="_equipo__nombre_comercial"]').val()}">
                <input type="hidden" name="id_sku" value="${$('input:radio[name=color]:checked').val()}">
                <input type="hidden" name="nombre_sku" value="${$('input:radio[name=color]:checked').attr('data-name')}">
                <input type="hidden" name="_seccion" value="${$('input[type="hidden"][name="_seccion"]').val()}">
    
                  
                <div class="cta">
                    <button type="submit" class="tnd-btn red tnd-mx-auto-xs max" >Enviar</button>
                </div>
               </form>`;
        Alert.form('¡Completa tu información!', 'Llena a continuación tus datos y nos contactaremos contigo cuando el producto esté disponible.', 'images/iconos/ico-datos-cliente.svg', form);
    });
    $('body').on('submit', 'form.formAvisame', function (e) {
        e.preventDefault();
        let form = $(this);
        $.ajax
        ({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            dataType: "json",
            beforeSend: function () {
            },
            success: function (data) {
                if (!data.error) {
                    let btn = $('button.tnd-btn.red[type="submit"][data-action="carrito"]');
                    let fi_el = $('.productoFinanciamiento .selector-plan input[type="radio"][name="plan"]:checked');
                    __gaTrigger(btn.attr('data-ga-action'), fi_el.attr('data-subtotal-price'));
                    __fbTrigger(btn.attr('data-fb-action'), fi_el.attr('data-subtotal-price'));
                    Alert.close($(this).data('.modalTienda'));
                    $('.ProductoCompleto').hide();
                    $('#typAvisame').show({top: 300});
                }
            },
            error: function () {
                Alert.error('Por favor inténtalo nuevamente.', 'No se ha podido enviar tu solicitud.');
            }
        });
    });

    ///////////////////////////
    ///      JUST DO IT     ///
    ///////////////////////////
    __init();

});