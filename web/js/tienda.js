var string = function(array) { return array.join('\n'); };



/* Loadero */

var load, loaded;
var modalAlert;

$(function() {

    /*MENU*/

    var menu = document.querySelector('#menu');
    var nav = document.querySelector('#bottom nav');
    var top = document.querySelector('#top');
    var menuItems = Array.from(document.querySelectorAll('#bottom .has-children'));
    var bottomMenu = document.querySelector('#bottom .menu');
    var bottomNav = document.querySelector('#bottom');
    var header = document.querySelector('#header');

    // Change + for x, slide down the nav

    try {
        menu.onclick = function(ev) {
            menu.classList.toggle('open');
            nav.classList.toggle('open');
        };
    } catch (e) {

    }

    // When one clicked, toggle it and close the others

    try {
        menuItems.forEach(function(el) {
            el.onclick = function() {
                menuItems.forEach(function(el_) {
                    if (el == el_) {
                        el_.classList.toggle('open');
                    } else {
                        el_.classList.remove('open');
                    }
                });
            };
        });
    } catch (e) {

    }

    // Hide top header and move nav up if scrolled


        addEventListener('scroll', function() {
            if (scrollY <= 36) {
                try {
                    top.style.display = 'flex';
                    nav.classList.remove('down');
                } catch (e) { }
            } else {
                try {
                    top.style.display = 'none';
                    nav.classList.add('down');
                } catch (e) { }
            }
        });


    // Close desktop menu at mouse leave

    try {
        if (innerWidth > 960) {
            bottomMenu.onmouseleave = function() {
                menuItems.forEach(function(el) {
                    el.classList.remove('open');
                });
            };
        }
    } catch (e) {

    }



    /* LOAD */

    var loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = string([
        '<div class="content">',
        '<img src="'+ rootImg +'images/body/etiquetas/loading.gif">',
        '<p>Procesando, espera unos segundos por favor.</p>',
        '</div>'
    ]);

    document.body.appendChild(loader);

    load = function() {
        loader.style.display = 'flex';
    };

    loaded = function() {
        loader.style.display = 'none';
    };

    /* ACCORDEON */

    if ( $('.accordeon-container').length > 0 ){
        $('.container-accordeon-element').each(function (index,target) {
            $(target).find('.accordeon-element-header:first').on('click',function (ev) {
                var $selected = $(ev.currentTarget).parent();
                activateElement($selected,false);
            });
        });
    }

    $('.tnd-tabs li a').on('click',function(e) {
        e.preventDefault();
        if(!$(this).parent().hasClass('active')) {
            var tab = e.currentTarget;
            $('.tnd-tabs li').removeClass('active');
            activateElement($(tab).parent(),true);
            var idTarget = $(tab).attr('href');
            $('.tnd-tab-pane').removeClass('show').hide();
            $(idTarget).addClass('show').show();
        }
    });

    $('.accordeon-container:not(.menu) .accordeon-header').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).parent().find('.accordeon-body').slideToggle();
        e.stopPropagation();
    });

    /*REGALO SELECTOR*/
    $('input[type="checkbox" ][name="regalo"]').change(function() {
        if(this.checked) {
            $('div#regalo-options').show();
            $('.collapsable-products .product .detail-product').append('<div class="product-regalo"><img src="' + rootImg + '/images/landingmigration/regalo.svg" alt="">Envuelto como regalo</div>');
        }
        else {
            $('div#regalo-options').hide();
            $('.collapsable-products .product .detail-product .product-regalo').remove();
        }
    });


    /*MODALS*/

    document.body.insertAdjacentHTML('beforeend', string([
        '<div id="tnd-modal-message" style="display: none;" class="tnd-message-modal fancybox-content font-regular tnd-modal-content">',
        '<span class="tnd-close-modal-icon tnd-close-modal active fa-times-circle"></span>',
        '<div class="tnd-modal-header">',
        '<div class="tnd-modal-title">',
        '<img src="'+ rootImg +'/images/body/icons/ico-title-medium.png">',
        '<span class="tnd-ml-15-xs" id="titleModal"></span>',
        '</div>',
        '</div>',
        '<div class="tnd-modal-body"></div>',
        '<div class="tnd-modal-footer">',
        '<button class="tnd-close-modal tnd-btn red tnd-ml-auto-xs min">OK</button>',
        '</div>',
        '</div>'
    ]));

    var closeModalClickOut = function () {
        $('.fancybox-stage').on("click",function(e) {
            var container = $(".tnd-modal-content");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                return $.fancybox.close();
            }
        });
    }

    var closeModal = function () {
        $('.fancybox-stage').off('click');
    }

    $('.tnd-modal').fancybox({
        type: 'inline',
        modal: true,
        afterShow: closeModalClickOut,
        afterClose: closeModal
    });
    var body = document.querySelector('#tnd-modal-message .tnd-modal-body');
    var title = document.querySelector('#tnd-modal-message .tnd-modal-header #titleModal');

    modalAlert = function(html,titleModal = '') {
        body.innerHTML = html;
        title.innerHTML= titleModal;
        $.fancybox.open(
            {
                src : document.getElementById('tnd-modal-message'),
                type: 'inline',
                modal: true,
                afterShow: closeModalClickOut,
                afterClose: closeModal
            }
        );
    };

    $('.tnd-close-modal').on('click', function() {
        return $.fancybox.close();
    });


    /*FORMS*/

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

        // Radio validation

        /*var $radios = $('[data-validate] input[type="radio"]');
        $radios.off();

        $radios.on('invalid', function(ev) {
            ev.preventDefault();
            var input = ev.currentTarget;
            var $label = $(input).parent();
            $label.siblings('.tnd-error').remove();
            $label.parent().append(string([
                '<div class="error">',
                input.validationMessage,
                '</div>',
            ]));
        });

        $radios.on('focus', function(ev) {
            $(ev.currentTarget).parent().siblings('.tnd-error').remove();
        });*/

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

    $('#btn-floating-callback,.btn-floating-callback').click(function(){
        $('.boton-volver-cb').hide();
        $(".contenido-cb").show();
    });

    $('#btn-callback, #btn-callbackresp').on('click',function() {

        var form_cb =  $("#formCallback");
        var form_data = form_cb.serialize();
        var path = $("#path").val();

        $.ajax({
            url: path,
            data: form_data,
            type: 'post',
            cache: false,
            beforeSend: function(){
                load();
            },
            success: function(data){
                if (data.error){
                    $("#mensajevalidacion").html("Por favor ingrese todos los datos correctamente");
                    $("#popUpFaltadatos2").modal('show');
                    loaded();
                    $('#modal-callbackresp').modal('hide');
                    return false;
                }else{
                    $('.contenido-cb').hide();
                    $('.boton-volver-cb').show();
                    $("#mensajevalidacion").html(data.msg);
                    $("#popUpFaltadatos2").modal('show');
                    $("#Name").val("");
                    $("#Number").val("");
                    loaded();
                    return false
                }
            },
            error : function (){
                loaded();
                $("#mensajevalidacion").html("Ocurrio un error inesperado, vuelva a intentarlo mas tarde");
                $("#popUpFaltadatos2").modal('show');
                return false;
            }
        });

    });

    $('#btn-callbackresp').on('click',function() {

        var form_cb =  $("#formCallbackresp");
        var form_data = 'Name=' + $("#NameResp").val() + '&Number=' + $("#NumberResp").val();//form_cb.serialize();
        var path = $("#path").val();
        console.log(form_data);
        $.ajax({
            url: path,
            data: form_data,
            type: 'post',
            cache: false,
            beforeSend: function(){
                load();
            },
            success: function(data){
                if (data.error){
                    $("#mensajevalidacion").html("Por favor ingrese todos los datos correctamente");
                    $("#popUpFaltadatos2").modal('show');
                    loaded();
                    return false;
                }else{
                    $('.contenidoresponsive-cb').hide();
                    $('.boton-volver-cb').show();
                    $("#mensajevalidacion").html(data.msg);
                    $("#popUpFaltadatos2").modal('show');
                    $("#NameResp").val("");
                    $("#NumberResp").val("");
                    loaded();
                    return false
                }
            },
            error : function (){
                loaded();
                $("#mensajevalidacion").html("Ocurrio un error inesperado, vuelva a intentarlo mas tarde");
                $("#popUpFaltadatos2").modal('show');
                return false;
            }
        });

    });

});

function gochat() {
    if(navigator.userAgent.toLowerCase().indexOf('opera') != -1 && window.event.preventDefault) window.event.preventDefault(); this.chat = window.open('https://claroecuador.s1gateway.com/webchat/chat_embed.php?cpgid=10001&nw=1&s1_origin=O.TIENDA', 'S1Gateway', 'toolbar=0,scrollbars=0,location=0,status=0,menubar=0,width=380,height=500,resizable=0'); this.chat.focus(); var windowwidth = 380; var windowheight = 500; var screenwidth = screen.availWidth; var screenheight = screen.availHeight; this.chat.moveTo(screenwidth - windowwidth,screenheight - windowheight);this.chat.opener=window;
}

function gochatVentas() {
    if ($(window).width() <= 767){
        infoframe = "<iframe class='height-frame' style='width: 100%;' src='https://webchat.miclaro.com.ec/Chat_MiClaroTienda/?usuario_miclaro=TiendaClaro&descripcionChat='></iframe>";
        modalAlert(infoframe,'Chat de ventas');
        $(".modal-footer").addClass("hidden");
        $(".jc-modal .modal-content").css("margin-top","0%");
        $(".height-frame").css("height","400px");
    }
    else{
        if(navigator.userAgent.toLowerCase().indexOf('opera') != -1 && window.event.preventDefault) window.event.preventDefault(); this.chat = window.open('https://webchat.miclaro.com.ec/Chat_MiClaroTienda/?usuario_miclaro=TiendaClaro&descripcionChat=', 'S1Gateway', 'toolbar=0,scrollbars=0,location=0,status=0,menubar=0,width=380,height=500,resizable=0'); this.chat.focus(); var windowwidth = 380; var windowheight = 500; var screenwidth = screen.availWidth; var screenheight = screen.availHeight; this.chat.moveTo(screenwidth - windowwidth,screenheight - windowheight);this.chat.opener=window;
    }

}

function ObjectLength_Modern( object ) {
    return Object.keys(object).length;
}

function ObjectLength_Legacy( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

var ObjectLength =
    Object.keys ? ObjectLength_Modern : ObjectLength_Legacy;


function activateElement(element,keepActive) {
    if ($(element).hasClass('active')){
        if(!keepActive)
            $(element).removeClass('active');
    }else{
        $(element).addClass('active');
    }
}


// Validation

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



/*Same height element*/
function resizeHeight(scope,height){
    $(scope).height(height);
}
function resizeMaxHeight(object) {
    $.each(object,function (key, value) {
        $(key).css('height','auto');
        if (getMaxHeight(key)!=value){
            resizeHeight(key,getMaxHeight(key));
            sameHeightObject[key] = getMaxHeight(key);
        }else{
            resizeHeight(key,value);
        }
    });
}
function getMaxHeight(scope){
    return Math.max.apply(null, $(scope).map(function (){
        return $(this).height();
    }).get());
}
var sameHeightObject = {};
var sameHeight = function (){
    $(window).resize(function() {
        resizeMaxHeight(sameHeightObject);
    });
}
var pushSameHeight = function (scope){
    sameHeightObject[scope] = getMaxHeight(scope);
    resizeHeight(scope,getMaxHeight(scope));
}


/*
* CUSTOM SELECT
* */

if ( $('.tnd-custom-select').length > 0 ){

    $('[tnd-validate-form] select').on('invalid', function(ev) {
        ev.preventDefault();
        var input = ev.currentTarget;
        var $input = $(input);
        $($input.parent()).addClass('tnd-error-input');
        $input.next('.tnd-error').remove();
        $($input.parent()).after(string([
            '<div class="tnd-msg-input tnd-error tnd-font-error">',
            input.validationMessage,
            '</div>',
        ]));
    });

    var x, i, j, selElmnt, a, b, c;
    /* Look for any elements with the class "tnd-custom-select": */
    x = document.getElementsByClassName("tnd-custom-select");

    for (i = 0; i < x.length; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);

        divsElements = createDivsElements(selElmnt);

        if (selElmnt.length > 0)
            x[i].appendChild(divsElements);

    }

    function createDivsElements(element){
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 0; j < element.length; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = element.options[j].innerHTML;
            var event = new Event('change');
            c.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, s, h;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                h = this.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        s.dispatchEvent(event);
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }

        return b;

    }

    $('.select-selected').on("click",document, function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        $($(this).parent()).next('.tnd-error').remove();
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });


    function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        for (i = 0; i < y.length; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);

}

function changeCombo(selectValue,selectId,msjDefault){

    $defaulOption = "<option value=''>"+msjDefault+"</option></select>";
    servidor = root;
    $.ajax({
        type: "POST",
        url: root + 'getCombo',
        data: 'key='+selectValue,
        success: function(response) {

            if (response.options == ""){
                $(selectId).html($defaulOption);
            }else{
                $(selectId).html(response.options);
            }

            divsElements = createDivsElements($(selectId)[0]);

            var customSelect =  $(selectId).closest('.tnd-custom-select');

            customSelect.find('.select-items').remove();

            customSelect.append(divsElements);



        },
        error: function(){
            $(selectId).html($defaulOption);
        },
    });

}

/** PREVIEWS **/

var previewTienda = function (elementToShow, url){
    $('#content-general').hide();
    window.scrollTo(0, 0);
    $('#previewsContainer,'+elementToShow).show();
    if (url!=null)
        location.href = url;
};

$('[tnd-fire-preview]').click( function (e){
    //e.preventDefault();
    previewTienda($(this).attr('tnd-fire-preview'), $(this).attr('href'));
});

$(window).on('load', function() {
    $('header, main, footer').show();
    $('#main-loading').fadeOut(function(){
        $(this).remove()
    });
});

$('a.amx-back-link').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.history.back();
});

/**
 * @return Array|Object
 * @param array Array|Object
 * @param key String
 * Incrementa el valor del array, según el key recibido. En caso de no existir el key, es creado y su valor se setea en 1.
 * Devuelve un array donde el contenido te dice las veces que se ha insertado el key.
 * */
function increment_by_key(array, key) {
    if(key.trim().length)
        array[key] =  array[key] === undefined ? 1 : array[key]+1;
}

/**
 * @return Array|Object
 * @param object Array|Object
 * @param f_callback function
 * @return Array|Object
 * Función general: Itera por el array recibido, realizando la acción señalada en la función de callback
 * */
function iterate_f(object, f_callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            if (false === f_callback.call(object[key], key, object[key])) {
                break;
            }
        }
    }
    return object;
}

/**
 * @return Array|Object
 * @param colors Array|Object
 * @return Array|Object
 * Función general: Ordena un array de colores según su HUE
 * Ejemplo de colors: [{hex: "#000000"}]
 * */
function sortColors(colors) {
    for (var c = 0; c < colors.length; c++) {
        /* Get the hex value without hash symbol. */
        var hex = colors[c].hex.substring(1);

        /* Get the RGB values to calculate the Hue. */
        var r = parseInt(hex.substring(0,2),16)/255;
        var g = parseInt(hex.substring(2,4),16)/255;
        var b = parseInt(hex.substring(4,6),16)/255;

        /* Getting the Max and Min values for Chroma. */
        var max = Math.max.apply(Math, [r,g,b]);
        var min = Math.min.apply(Math, [r,g,b]);

        /* Variables for HSV value of hex color. */
        var chr = max-min;
        var hue = 0;
        var val = max;
        var sat = 0;

        if (val > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            sat = chr/val;
            if (sat > 0) {
                if (r == max) {
                    hue = 60*(((g-min)-(b-min))/chr);
                    if (hue < 0) {hue += 360;}
                } else if (g == max) {
                    hue = 120+60*(((b-min)-(r-min))/chr);
                } else if (b == max) {
                    hue = 240+60*(((r-min)-(g-min))/chr);
                }
            }
        }

        /* Modifies existing objects by adding HSV values. */
        colors[c].hue = hue;
        colors[c].sat = sat;
        colors[c].val = val;
    }

    /* Sort by Hue. */
    return colors.sort(function(a,b){return a.hue - b.hue;});
}

function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}