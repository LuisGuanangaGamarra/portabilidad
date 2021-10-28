// Index

// Polyfill
// Constants
// Redirectors
// Nothing
// Modals
// Loaders
// Count likes
// Filter
// Send - data sending abstractions
// Form - full form data extraction
// Form utils - partial form logic
// Popup
// Compare
// Tabs
// Prepaid
// Load
// Dth
// Suggested
// Flow
// Devices
// Pin
// Experience
// Notification
// Landing
// Packages
// Content
// Validations
// Header
// Validation
// Modal alert
// Dialog
// Loader
// Steps and previews
// Authenticate
// Avatar
// Chat
// Plans show
// Plans migration confirm number
// Plans form

////////////////////////////// Polyfill //////////////////////////////

var string = function(array) { return array.join('\n'); };

if (!window.fetch) {
    window.fetch = function(url, options) {
        var options_ = options || {};

        var xhr = new XMLHttpRequest();
        xhr.open(options_.method || 'GET', url);
        xhr.send(options_.body);

        var text = function() {
            return new Promise(function(resolve, reject) {
                resolve(xhr.responseText);
            });
        };

        var json = function() {
            return new Promise(function(resolve, reject) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch(e) {
                    reject();
                }
            });
        };

        return new Promise(function(resolve, reject) {
            xhr.onload = function() {
                resolve({
                    ok: xhr.status == 200,
                    text: text,
                    json: json
                });
            };

            xhr.onerror = reject;
        });
    };
}

if (!Array.from) {
    Array.from = function(arrayLike) {
        var array = [];
        var length = arrayLike.length;

        for (var i = 0; i < length; i++) {
            array.push(arrayLike[i]);
        }

        return array;
    };
}

////////////////////////////// Constants //////////////////////////////

/*var root = location.href.match('tienda.claro') ?
    'https:tienda.claro.com.ec/' :
    location.href.match(/.+app_dev.php/)[0] + '/';*/

var domain = window.location.hostname;
// A map to translate numbers to options

var tags = {
    '1': 'plannuevo',
    '2': 'planportabilidad',
    '3': 'planrenovacion',
    '4': 'planmigracion',
    '6': 'planportabilidadnuevo'
};

// Deprecated
// all urls should be root based
// scattering is source of errors

var subarray = function(arr, start, end) { return arr.filter(function(_, i) { return i >= start && i <= end; }); };
var full = location.href.split('/');
var protocol = full[0] + '//';
var rest = subarray(full, 2, full.length);
var url = function(end) { return protocol + subarray(rest, 0, end).join('/') + '/'; };

var servidor = url(3);
var servidortemp = url(3);
var servidor2 = url(2);
var direccion = url(2);
var direccion2 = url(7);
var dirEquiposSamsung = url(3);
var dirEquipos = url(2);
var direccion3 = url(6);
var direccion4 = url(8);
var direccion5 = url(8);
var direplanes = url(3);
var diredth = url(2);

////////////////////////////// Redirectors //////////////////////////////

// Deprecated simple redirectors
// they should be inlined in the logic of the view
// like plansShow

function listplanes(id) {
    location.href= root+"plan/ValidaPin";
}

function regresar(url, content_hide, content_new, img) {
    location.href=url;
    mostrarPreview(content_hide, content_new, img );
}

function irDetalleCompraPlan(idplanseleccionado, formlinea) {
    var rutatotal = direccion5+idplanseleccionado+"/"+formlinea;
    window.location.replace(rutatotal);
}

function irPlanes(id) {
    var opcionseleccionada;
    var path;
    var idplan;
    idplan =  document.getElementById("idplanurl").value;
    if(id==="2")
    {
        opcionseleccionada=document.getElementById("opcionseleccionada").value;
    }
    else
    {
        opcionseleccionada=3;
    }
    if(opcionseleccionada!=0)
    {
        if(opcionseleccionada!=3)
        {
            path= dirEquiposSamsung+"Listado/"+opcionseleccionada;
        }
        else
        {
            path= dirEquiposSamsung+"IngresoPlanes/"+idplan;
        }
        location.href= path
    }
    else
    {
        alert("Seleccione una opcion para continuar");
    }
}

function cerrarModal() {
    location.href=servidor2;
}

function irDetalleCompra() {
    $('#hd_bandenvio').val(0);
    var idplanseleccionado = $('#hd_idplan').val();
    var idequipo = $('#hd_idequipo').val();
    var tipocambio = $('#hd_tipo').val();
    var codigo_ws = $('#hd_codigoplanws').val();
    var codigo_claro = $('#hd_codigoclaro').val();
    var cuota_equipo = $('#hd_cuota_equipo').val();
    var bandera = $('#banderavermas').val();
    var opcion = $('#opcion').val();
    var formlinea = $('#formlinea').val();
    document.getElementById('idplanfinal').value=idplanseleccionado;
    var loading_bar="";
    var backdrop_modal="";
    loading_bar=loading("irdetalle");
    backdrop_modal =backdropmodal("irdetalle");
    var deleteModalBody = 'S';
    var msg_alert = '';
    if(/Samsung/.test(direccion2))
    {
        rutatotal = direccion5+idplanseleccionado+"/"+formlinea;
    }
    else
    {
        rutatotal = direccion4+idplanseleccionado+"/"+formlinea;
    }
    window.location.replace(rutatotal);
}

////////////////////////////// Nothing //////////////////////////////

// These functions do nothing

function Enviocontent(id, section) {
    alert(id);
    var obj_data ='';
    var loading_bar = '<div id="loading-bar-spinner">'
        + '<div class="spinner-icon"></div>'
        + '</div>';
    var backdrop_modal = '<div id="modal-'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'
        + '<div class="modal-dialog">'
        + '</div>'
        + '</div>';
    $.ajax
    ({
        type: 'post',
        url: section,
        data: obj_data,
        dataType: "json",
        beforeSend: function( )
        {
            $( "#modal-"+id ).remove();
            $( "#content"+id ).append( backdrop_modal );
            $( "#content"+id ).append( loading_bar );
        },
        success: function(data)
        {
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-"+id ).remove();
            $( "#content"+id ).html( data.html );
        }
    });
}

function Irhome(path){
    $.ajax({ url: path,
        data: '',
        type: 'POST',
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $("#pas1").removeClass("text-red").addClass("text-purple");
            $("#pas2").addClass("text-red");
        }
    });
}

// Deprecated micro functions
// they should be inlined in the logic of the view

function verTerminosRequisitos() {
    $("#popUpterminos").modal('show');
}

function ToggleDiv(div) {
    $("#"+div).slideToggle("slow");
}

function ShowDiv(div) {
    $("#"+div).show();
}

function irFormularioAcc(url) {
    location.href = url;
}

function changeId(opcion) {
    document.getElementById("option").value = opcion;
}

function changeImgAcc(path) {
    var source;
    source = direccion+path;
    document.getElementById("imgVermasAcc").src = source;
}

////////////////////////////// Modals //////////////////////////////

// These modals are deprecated

var loading_bar = string([
    '<div id="loading-bar-spinner">',
    '<div class="spinner-icon"></div>',
    '</div>'
]);

var backdrop_modal = string([
    '<div id="modal-general" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">',
    '<div class="modal-dialog"></div>',
    '</div>'
]);

function loading(form) {
    var loading_bar="";
    if(form=="planesEquipos")
    {
        loading_bar='<div id="loading-bar-spinner" class="border-loading width-loading2" style="display: none;background:white;"><div><br/></div>'
            + '<div><br/></div><div class="center-block"><img style="width:40%" class="center-block" src="'+rootImg+'images/body/etiquetas/loading.gif"> </div><div><br/></div>'
            +'<div class="text-center" style="color:black;">Buscando tu plan ideal..</div>'
            +'<div class="text-center" style="color:black;"><div><br/></div></div>'
            + '</div>';
    }
    else if(form=="irdetalle")
    {
        loading_bar='<div id="loading-bar-spinner" class="border-loading width-loading2" style="display: none;background:white;"><div><br/></div>'
            + '<div><br/></div><div class="center-block"><img style="width:40%" class="center-block" src="'+rootImg+'images/body/etiquetas/loading.gif"> </div><div><br/></div>'
            +'<div class="text-center" style="color:black;">Calculando...</div>'
            +'<div class="text-center" style="color:black;"><div><br/></div></div>'
            + '</div>';
    }
    else{
        loading_bar='<div id="loading-bar-spinner" class="border-loading width-loading2" style="display: none;background:white;"><div><br/></div>'
            + '<div><br/></div><div class="center-block"><img style="width:40%" class="center-block" src="'+rootImg+'images/body/etiquetas/loading.gif"> </div><div><br/></div>'
            +'<div class="text-center" style="color:black;">Procesando, espera</div>'
            +'<div class="text-center" style="color:black;">unos segundos por favor.<div><br/></div></div>'
            + '</div>';}

    return loading_bar;
}

function backdropmodal(form) {
    var modal_size="";
    var backdrop_modal;
    backdrop_modal='<div id="modal-'+form+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'

        + '<div class="modal-dialog '+modal_size+'">'
        + '</div>'
        + '</div>';
    return backdrop_modal;
}

function alert_bootstrap(id, title, msg, size, type, functions) {
    var size = size || "lg";
    var modal_size = '';
    var button_size = '';
    var buttons = '';
    var functions_buttons = functions || false;
    switch(size)
    {
        case 'xsm':
            modal_size = 'modal-xsm';
            button_size = 'btn-sm';
            break;

        case 'sm':
            modal_size = 'modal-sm';
            button_size = 'btn-sm';
            break;

        case 'md':
            modal_size = 'modal-md';
            button_size = 'btn-md';
            break;

        case 'lg':
            modal_size = 'modal-lg';
            button_size = 'btn-md';
            break;
    }

    switch(type)
    {
        case 'alert':

            if(functions_buttons)
            {
                buttons = '<div class="col-xs-4 col-xs-offset-4">'
                    + '<button type="button" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="'+functions_buttons[0]+'"">'
                    + 'Aceptar'
                    //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                    + '</button>'
                    + '</div>';
            }
            else
            {
                buttons = '<div class="col-xs-4 col-xs-offset-4">'
                    + '<button type="button" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="close_modal(\''+id+'\')">'
                    + 'Aceptar'
                    //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                    + '</button>'
                    + '</div>';
            }
            break;

        case 'confirm':
            if(functions_buttons)
            {
                if(functions_buttons.length == 2)
                {
                    buttons = '<div class="col-xs-6 col-xs-offset-3">'
                        +'<div class="col-xs-5">'
                        +'<button type="button" class="btn btn-miclaro btn-miclaro-gris '+button_size+'" onclick="'+functions_buttons[1]+'">'
                        + 'Aceptar'
                        //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                        +'</button>'
                        + '</div>'
                        +'<div class="col-xs-5 col-xs-offset-2">'
                        +'<button type="button" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="'+functions_buttons[0]+'">'
                        + 'Cancelar'
                        //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                        +'</button>'
                        + '</div>'
                        + '</div>';
                }
                else
                {
                    buttons = '<div class="col-xs-6 col-xs-offset-3">'
                        + '<div class="col-xs-5">'
                        +'<button type="submit" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="'+functions_buttons[0]+'">'
                        + 'Aceptar'
                        +'</button>'
                        + '</div>'
                        + '<div class="col-xs-5 col-xs-offset-2">'
                        +'<button type="button" class="btn btn-miclaro btn-miclaro-gris '+button_size+'" onclick="close_modal(\''+id+'\')">'
                        + 'Cancelar'
                        +'</button>'
                        + '</div>'
                        + '</div>';
                }
            }
            break;
    }

    if(type == 'advertises')
    {
        var alert = '<div id="modal-'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog '+modal_size+'">'
            + '<div class="modal-content">'
            + '<div class="modal-header modal-header-alert">'
            + '<button type="button" class="close" onclick="close_modal(\''+id+'\')">'
            //+ '<span aria-hidden="true">&times;</span>'
            + '<img class="close-alert" src="../../images/close.png" />'
            + '</button>'
            + '<span class="ico-title ico-title-medium ico-title-alert"></span>'
            + '<h5 class="modal-title"> '+ title +' </h5>'
            + '</div>'
            + '<div class="modal-body without-padding">'
            + msg
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }
    else
    {
        var alert = '<div id="modal-'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog '+modal_size+'">'
            + '<div class="modal-content">'
            + '<div class="modal-header modal-header-alert col-md-12 col-xs-12">'
            + '<button type="button" class="close" onclick="close_modal(\''+id+'\')">'
            //+ '<span aria-hidden="true">&times;</span>'
            + 'x'
            + '</button>'
            + '<span class="ico-title ico-title-condiciones ico-title-alert"></span>'
            + '<h5 class="modal-title" > '+ title +' </h5>'
            + '</div>'
            + '<div class="modal-body" style="font-size:14px;">'
            + msg
            + '</div>'
            + '<div class="modal-footer">'
            + buttons
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }
    return alert;
}

function close_modal(form) {
    var n = form.indexOf("internal");
    if(n < 0) {
        $( "body" ).css("overflow-y", "scroll");
        $( "body" ).css("padding-right","");
        $("#alert").css("padding-right","");
    }
    $( "#modal-"+form ).modal('hide');
    $( "#modal-"+form ).remove();
}

function alert_bootstrap_tienda(id, title, msg, size, type, functions) {
    var size = size || "lg";
    var modal_size = '';
    var button_size = '';
    var buttons = '';
    var functions_buttons = functions || false;
    switch(size)
    {
        case 'xsm':
            modal_size = 'modal-xsm';
            button_size = 'btn-sm';
            break;

        case 'sm':
            modal_size = 'modal-sm';
            button_size = 'btn-sm';
            break;

        case 'md':
            modal_size = 'modal-md';
            button_size = 'btn-md';
            break;

        case 'lg':
            modal_size = 'modal-lg';
            button_size = 'btn-md';
            break;
        case 'xlg':
            modal_size = 'modal-xlg';
            button_size = 'btn-md';
            break;
    }

    switch(type)
    {
        case 'alert':

            if(functions_buttons)
            {

                buttons = '<div class="col-xs-4 col-xs-offset-4">'
                    + '<button type="button" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="'+functions_buttons[0]+'"">'
                    + 'Continuar'

                    //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                    + '</button>'
                    + '</div>';
            }
            else
            {


                buttons = '<div class="col-xs-4 col-xs-offset-4">'
                    + '<button type="button" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="close_modal(\''+id+'\')">'
                    + 'Continuar'

                    //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                    + '</button>'
                    + '</div>';
            }

            break;

        case 'confirm':

            if(functions_buttons)
            {
                if(functions_buttons.length == 2)
                {
                    buttons = '<div class="col-xs-6 col-xs-offset-3">'
                        +'<div class="col-xs-5">'
                        +'<button type="button" class="btn btn-miclaro btn-miclaro-gris '+button_size+'" onclick="'+functions_buttons[1]+'">'
                        + 'Aceptar'
                        //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                        +'</button>'
                        + '</div>'
                        +'<div class="col-xs-5 col-xs-offset-2">'
                        +'<button type="button" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="'+functions_buttons[0]+'">'
                        + 'Cancelar'
                        //+ '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>'
                        +'</button>'
                        + '</div>'
                        + '</div>';
                }
                else
                {
                    buttons = '<div class="col-xs-6 col-xs-offset-3">'
                        + '<div class="col-xs-5">'
                        +'<button type="submit" class="btn btn-miclaro btn-miclaro-red '+button_size+'" onclick="'+functions_buttons[0]+'">'
                        + 'Aceptar'
                        +'</button>'
                        + '</div>'
                        + '<div class="col-xs-5 col-xs-offset-2">'
                        +'<button type="button" class="btn btn-miclaro btn-miclaro-gris '+button_size+'" onclick="close_modal(\''+id+'\')">'
                        + 'Cancelar'
                        +'</button>'
                        + '</div>'
                        + '</div>';
                }
            }

            break;
    }

    if(type == 'advertises')
    {
        var alert = '<div id="modal-'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog '+modal_size+'">'
            + '<div class="modal-content">'
            + '<div class="modal-header_modal modal-header-alert_modal">'
            + '<button type="button" class="close" onclick="close_modal(\''+id+'\')">'
            //+ '<span aria-hidden="true">&times;</span>'
            + '<img class="close-alert" src="../../images/close.png" />'
            + '</button>'
            + '<span class="ico-title ico-title-medium ico-title-alert"></span>'
            + '<h5 class="modal-title"> '+ title +' </h5>'
            + '</div>'
            + '<div class="modal-body without-padding">'
            + msg
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }
    else
    {
        var alert = '<div id="modal-'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog '+modal_size+'">'
            + '<div class="modal-content-modal">'
            + '<div class="modal-header-alert_modal" >'
            /*cambiosvermas*/
            + '<button id="btncerrarmodal" type="button" class="close popupcabecera" data-dismiss="modal" style="height:52px" >X'
            /*fin cambiosvermas*/
            //  + 'x'
            + '</button>'
            /*cambiosvermas*/
            +'<h4 id="titulo" class="text-center"></h4>'
            /*fin cambiosvermas*/
            + '</div><div></div>'
            + '<div class="modal-body">'
            + msg
            + '</div>'
            + '<div class="modal-footer">'
            //+ buttons

            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }

    return alert;
}

function createModalOverBody(title, content, size, type, functions) {
    deleteModalOverBody();
    var btn_size = size || 'xlg';
    var type_modal = type || 'advertises';
    var functions_buttons = functions || false;
    if(title == 'Planes55')
    {
        functions_buttons = ["window.location.href = '"+servidor+"'"];
    }
    var a = document.createElement("div");
    a.className="modal-scrollbar-measure",
        $( "body" ).append(a);
    var paddingRight = a.offsetWidth - a.clientWidth;
    $( "body" ).css("padding-right", paddingRight );
    var msg_alert = alert_bootstrap_tienda( 'body', title, content, btn_size, type_modal, functions_buttons);
    $("body").prepend( msg_alert );
    $("#modal-body").modal('show');
}

function deleteModalOverBody() {
    $( "#modal-body" ).remove();
}

////////////////////////////// Loaders //////////////////////////////

function verCargando(id) {
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $("#"+id).append('');
    $("#"+id).append( backdrop_modal);
    $('#modal-opciones').modal('show');
    $("#"+id).append( loading_bar);
    $("#loading-bar-spinner").css('display','');
}

var flpreload = function() {
    var imgs = [rootImg+'images/body/etiquetas/loading.gif'];

    $.each(imgs, function( idx, img ){
        console.log( img );
        $('<img/>')[0].src = img;
    });
};
//flpreload();

function verTodos(url, content_hide, content_new){
    location.href = url;
    mostrarPreview(content_hide, content_new, 'null');
}

function mostrarPreview(content_hide, content_new, img){
    $(".imgLocation").attr("src", img);
    $("html, body").animate({ scrollTop: 0 }, "fast");
    $(content_hide).hide();
    $(content_new).fadeIn('slow');
}

function mostrarPreviewUTM(content_hide, content_new, img, event_name, event_category, event_label, event_value){
    mostrarPreview(content_hide, content_new, img);
    gtag('event', event_name, {
        'event_category': event_category,
        'event_label': event_label,
        'value': event_value
    });
}

function mostrarPreviewSlide(content_hide, content_new, img){
    $("#content-vermas").hide();
    $("#content-general").show();
    $(content_hide).hide();
    $(".imgLocation").attr("src", img);
    $("html, body").animate({ scrollTop: 0 }, "fast");
    $(content_new).fadeIn('slow');
}




////////////////////////////// Filter //////////////////////////////

function filtrarpor(path1,path2,ban) {
    var URLactual = window.location.pathname;
    var opcion,opcion1,formlinea;
    if(/cambiateaclaro/.test(URLactual))
    {
        path3 = document.forms.listadedeseosliquidacion.action;
        filtrarporliquidacion(path3,2); return;
    }
    opcion = $('#txtcontrol').val();
    formlinea = $('#formlinea').val();
    opcion1 = $('#opcion').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    var val="";
    if (ban=="1")
    {
        val="fav";
        if (opcion=="prepago")
        {
            document.getElementById("cboprecioprep").value = val;
            $.ajax({ url: path2,
                type: 'post',
                dataType: "json",
                beforeSend: function( ){
                    $("#content-equipostiendaprepago").append('');
                    $("#content-equipostiendaprepago").append( backdrop_modal);
                    $('#modal-opciones').modal('show');
                    $("#content-equipostiendaprepago").append( loading_bar);
                    $("#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    $("#loading-bar-spinner").remove();
                    $("#modal-opciones").remove();
                    $("#vista-equipos").css("display","none");
                    $('#content-equipostiendaprepago').html(data.html);
                }});
        }
        else if(opcion=="planes")
        {
            path2 = document.forms.listadedeseos.action;

            document.getElementById("cboprecioplanes").value = val;
            $.ajax({ url: path2,
                type: 'post',
                dataType: "json",
                beforeSend: function( ){
                    $("#content-plantienda").append('');
                    $("#content-plantienda").append( backdrop_modal);
                    $('#modal-opciones').modal('show');
                    $("#content-plantienda").append( loading_bar);
                    $("#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    $("#loading-bar-spinner" ).remove();
                    $("#modal-opciones" ).remove();
                    $("#vista-equipos").css("display","none");
                    $('#content-plantienda').html(data.html);
                }});
        }
        else if(opcion=="dth")
        {
            path2 = document.forms.listadedeseos.action;
            p3 ="fav";
            path1="";
            filtrarporEquipoDth(path1,path2,p3)
        }
        else if(opcion=="paquetes")
        {
            path2 = document.forms.listadedeseos.action;
            document.getElementById("cboprecio").value = val;
            $.ajax({ url: path2,
                type: 'post',
                dataType: "json",
                beforeSend: function( ){
                    $("#content-equipostienda").append('');
                    $("#content-equipostienda").append( backdrop_modal);
                    $('#modal-opciones').modal('show');
                    $("#content-equipostienda").append( loading_bar);
                    $("#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    $("#loading-bar-spinner").remove();
                    $("#modal-opciones").remove();
                    $("#vista-equipos").css("display","none");
                    $('#content-equipostienda').html(data.html);
                }});
        }
        else
        {
            document.getElementById("cboprecio").value = val;
            $.ajax({ url: path2,
                type: 'post',
                dataType: "json",
                beforeSend: function( ){
                    $("#content-equipostienda").append('');
                    $("#content-equipostienda").append( backdrop_modal);
                    $('#modal-opciones').modal('show');
                    $("#content-equipostienda").append( loading_bar);
                    $("#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    $("#loading-bar-spinner").remove();
                    $("#modal-opciones").remove();
                    $("#vista-equipos").css("display","none");
                    $('#content-equipostienda').html(data.html);
                }});

        }
    }
    else
    {
        value="";
        if (opcion=="prepago")
        {
            val = document.getElementById("cboprecioprep").value;
            if(val=="")
            {
                document.getElementById("cboprecioprep").value = val;
                $.ajax({ url: path2,
                    type: 'post',
                    dataType: "json",
                    beforeSend: function( ){
                        $("#content-equipostiendaprepago").append('');
                        $("#content-equipostiendaprepago").append( backdrop_modal);
                        $('#modal-opciones').modal('show');
                        $("#content-equipostiendaprepago").append( loading_bar);
                        $("#loading-bar-spinner").css('display','');
                    },
                    success: function(data){
                        $("#loading-bar-spinner").remove();
                        $("#modal-opciones").remove();
                        $("#vista-equipos").css("display","none");

                        $('#content-equipostiendaprepago').html(data.html);
                    }});
            }
            else
            {
                filtrarPorNumeroPrepago(path1);
            }
        }
        else if(opcion=="dth")
        {
            path2 = document.forms.listadedeseos.action;
            p3 ="fav";
            path1="";
            filtrarporEquipoDth(path1,path2,p3)
        }
        else
        {
            var obj_data = {'opcion':opcion1,'formlinea':formlinea};
            val = document.getElementById("cboprecio").value;
            if(val=="fav")
            {
                document.getElementById("cboprecio").value = val;
                $.ajax({ url: path2,
                    type: 'post',
                    data:obj_data,
                    dataType: "json",
                    beforeSend: function( ){
                        $("#content-equipostienda").append('');
                        $("#content-equipostienda").append( backdrop_modal);
                        $('#modal-opciones').modal('show');
                        $("#content-equipostienda").append( loading_bar);
                        $("#loading-bar-spinner").css('display','');
                    },
                    success: function(data){
                        $("#loading-bar-spinner").remove();
                        $("#modal-opciones").remove();
                        $("#vista-equipos").css("display","none");
                        $('#content-equipostienda').html(data.html);
                    }});
            }
            else
            {
                filtrarPorNumero(path1);
            }
        }
    }
}

function filtrarporMobile(path1, path2) {
    var val,formlinea,opcion;
    val = $('#cboprecioMobile').val();
    formlinea = $('#formlinea').val();
    opcion = $('#opcion').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    if (val=="fav")
    {
        $.ajax({ url: path2,
            type: 'post',
            dataType: "json",
            beforeSend: function( ){
                $("#content-equipostienda").append('');
                $("#content-equipostienda").append( backdrop_modal);
                $('#modal-opciones').modal('show');
                $("#content-equipostienda").append( loading_bar);
                $("#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $( "#loading-bar-spinner" ).remove();
                $( "#modal-opciones" ).remove();
                $("#vista-equipos").css("display","none");
                $('#content-equipostienda').html(data.html);
            }});
    }
    else
    {
        value="";
        filtrarPorNumeroMobile(path1);
    }
}

function filtrarporPlanes(path1,path2){
    var val;
    val = $('#cboprecioplanes').val();

    if (val=="fav")
    {
        idtiendalog = $('#idtiendalog').val();
        var obj_data = {
            'idtiendalog':idtiendalog
        };
        $.ajax({ url: path2,
            type: 'post',
            data: obj_data,
            dataType: "json",
            beforeSend: function( ){
                load();
            },
            success: function(data){
                loaded();
                $('#content-plantienda').html(data.html);
            }});
    }
    else
    {
        value="";
        filtrarPorNumeroPlanes(path1);
    }
}

function filtrarporEquipoDth(path1,path2,p3){
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    var val;
    var filtro1, filtro2;
    if(p3=="PC")
    {
        val = $('#cboprecioDth').val();
    }
    if(p3=="ED")
    {
        val = $('#cboequipodth').val();
    }
    if(p3=="MVP")
    {
        val = $('#cboprecioDthMobile').val();
    }
    if(p3=="MV")
    {
        val = $('#cboequiposDthMobile').val();
    }
    if(p3=="fav")
    {
        val = "fav";
    }
    if(p3=="REG")
    {
        val ="TODOS";
    }

    if (val=="fav")
    {
        $.ajax({ url: path2,
            type: 'post',
            dataType: "json",
            beforeSend: function( ){
                $("#content-tiendaDTH").append('');
                $("#content-tiendaDTH").append( backdrop_modal);
                $('#modal-opciones').modal('show');
                $("#content-tiendaDTH").append( loading_bar);
                $("#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $("#loading-bar-spinner").remove();
                $("#modal-opciones").remove();
                $("body" ).css("padding-right","");
                $("#vista-equipos").css("display","none");
                $('#content-tiendaDTH').html(data.html);
            }});
    }
    else
    {
        if(p3=="PC")
        {
            filtro1 = $('#cboprecioDth').val();
            filtro2 = $('#cboequipodth').val();
        }
        if(p3=="MVP")
        {
            filtro1 = $('#cboprecioDthMobile').val();
            filtro2 = $('#cboequiposDthMobile').val();
        }
        if(p3=="MV")
        {
            filtro1 = $('#cboprecioDthMobile').val();
            filtro2 = $('#cboequiposDthMobile').val();
        }
        if(p3=="ED")
        {
            filtro1 = $('#cboprecioDth').val();
            filtro2 = $('#cboequipodth').val();
        }
        if(p3=="REG")
        {
            filtro1 ="TODOS";
            filtro2 = 12;
        }

        var obj_data = {'filtro1':filtro1,'filtro2':filtro2};
        $.ajax({ url: path1,
            data: obj_data,
            type: 'post',
            dataType: "json",
            beforeSend: function( ){
                $("#content-tiendaDTH").append('');
                $("#content-tiendaDTH").append( backdrop_modal);
                $('#modal-opciones').modal('show');
                $("#content-tiendaDTH").append( loading_bar);
                $("#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $("#loading-bar-spinner").remove();
                $("#modal-opciones").remove();
                $("body" ).css("padding-right","");
                $("#vista-equipos").css("display","block");
                $('#content-tiendaDTH').html(data.html);
            }
            ,error: function (xhr, ajaxOptions, thrownError) {
            }
        });
    }
}

function filtrarPorNumeroPlanes(path){
    var filtro1, filtro2;
    filtro1 = $('#cboprecioplanes').val();
    filtro2 = $('#cboplanes').val();
    idtiendalog = $('#idtiendalog').val();
    var obj_data = {'filtro1':filtro1,'filtro2':filtro2,'idtiendalog':idtiendalog};
    $.ajax({ url: path,
        data: obj_data,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            load();
        },
        success: function(data){
            loaded();
            $('#content-plantienda').html(data.html);
        }
        ,error: function (xhr, ajaxOptions, thrownError) {
        }
    });
}

function filtrarporPlanesMobile(path1,path2){
    var val;
    val = $('#cboprecioplanesMobile').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");

    if (val=="fav")
    {
        $.ajax({ url: path2,
            type: 'post',
            dataType: "json",
            beforeSend: function( ){
                $("#content-plantienda").append('');
                $("#content-plantienda").append( backdrop_modal);
                $('#modal-opciones').modal('show');
                $("#content-plantienda").append( loading_bar);
                $("#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $( "#loading-bar-spinner" ).remove();
                $('#modal-opciones').remove();
                $("#vista-equipos").css("display","none");
                $('#content-plantienda').html(data.html);
            }});
    }
    else
    {
        value="";
        filtrarPorNumeroPlanesMobile(path1);
    }
}

function filtrarPorNumeroPlanesMobile(path) {
    var filtro1, filtro2;
    filtro1 = $('#cboprecioplanesMobile').val();
    filtro2 = $('#cboplanesMobile').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        data: 'filtro1='+filtro1+'&filtro2='+filtro2,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            $("#content-plantienda").append('');
            $("#content-plantienda").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-plantienda").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $('#modal-opciones').remove();
            $("#vista-equipos").css("display","block");
            $('#content-plantienda').html(data.html);
        }});
}

function filtrarporPrepago(path) {
    var filtrarpor, cantidad;
    filtrarpor = $('#cboprecioprep').val();
    cantidad = $('#cboequiposprep').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        data: 'filtrarpor='+filtrarpor+'&cantidad='+cantidad,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            $("#cont-catalogoEquipos").append('');
            $("#cont-catalogoEquipos").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#cont-catalogoEquipos").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("#loading-bar-spinner").remove();
            $("#modal-opciones").remove();
            $("#vista-equipos").css("display","block");
            $('#cont-catalogoEquipos').html(data.html);
        }});
}

function filtrarporPrepagoMobile(path1, path2) {
    var val;
    val = $('#cboprecioprepMobile').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    if (val=="fav")
    {
        $.ajax({ url: path2,
            type: 'post',
            dataType: "json",
            beforeSend: function( ){
                $("#content-equipostiendaprepago").append('');
                $("#content-equipostiendaprepago").append( backdrop_modal);
                $('#modal-opciones').modal('show');
                $("#content-equipostiendaprepago").append( loading_bar);
                $("#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $("#loading-bar-spinner").remove();
                $("#modal-opciones").remove();
                $("#vista-equipos").css("display","none");
                $('#content-equipostiendaprepago').html(data.html);
            }});
    }
    else
    {
        value="";
        filtrarPorNumeroPrepagoMobile(path1);
    }
}

function filtrarPorNumero(path){
    var filtro1, filtro2,formlinea,opcion;
    filtro1 = $('#cboprecio').val();
    filtro2 = $('#cboequipos').val();
    formlinea = $('#formlinea').val();
    opcion = $('#opcion').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        data: 'filtro1='+filtro1+'&filtro2='+filtro2+'&opcion='+opcion+'&formlinea='+formlinea,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            $("#content-equipostienda").append('');
            $("#content-equipostienda").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-equipostienda").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("#loading-bar-spinner").remove();
            $("#modal-opciones").remove();
            $("#vista-equipos").css("display","block");
            $('#content-equipostienda').html(data.html);
        }});
}

function filtrarPorNumeroMobile(path){
    var filtro1, filtro2;
    filtro1 = $('#cboprecioMobile').val();
    filtro2 = $('#cboequiposMobile').val();
    formlinea = $('#formlinea').val();
    opcion = $('#opcion').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        data: 'filtro1='+filtro1+'&filtro2='+filtro2+'&opcion='+opcion+'&formlinea='+formlinea,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            $("#content-equipostienda").append('');
            $("#content-equipostienda").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-equipostienda").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-opciones" ).remove();
            $("#vista-equipos").css("display","block");
            $('#content-equipostienda').html(data.html);
        }});
}

function filtrarPorNumeroPrepago(path) {
    var filtro1prep, filtro2prep;
    filtro1prep = $('#cboprecioprep').val();
    filtro2prep = $('#cboequiposprep').val();
    var obj_data = {'filtro1prep':filtro1prep,'filtro2prep':filtro2prep};
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        data: obj_data,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            $("#content-equipostiendaprepago").append('');
            $("#content-equipostiendaprepago").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-equipostiendaprepago").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("#loading-bar-spinner").remove();
            $("#modal-opciones").remove();
            $("#vista-equipos").css("display","block");
            $('#content-equipostiendaprepago').html(data.html);
        }
    });
}

function filtrarPorNumeroPrepagoMobile(path) {
    var filtro1prep, filtro2prep;
    filtro1prep = $('#cboprecioprepMobile').val();
    filtro2prep = $('#cboequiposprepMobile').val();
    var obj_data = {'filtro1prep':filtro1prep,'filtro2prep':filtro2prep};
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        data: obj_data,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            $("#content-equipostiendaprepago").append('');
            $("#content-equipostiendaprepago").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-equipostiendaprepago").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("#loading-bar-spinner").remove();
            $("#modal-opciones").remove();
            $("#vista-equipos").css("display","block");
            $('#content-equipostiendaprepago').html(data.html);
        }
    });
}

function filtrarporEquipos(path2,idmarca){
    //$("#search").val("");
	var URLactual = window.location.pathname;
    var opcion,opcion1,precio,equipos;
    opcion = "postpago";
    precio=document.getElementById("cboprecio").value;
    equipos=document.getElementById("cboequipos").value;
    var obj_data = {'filtro1':precio,'filtro2':equipos,'marca':idmarca};
    $.ajax({ url: path2,
        data:obj_data,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            load();
        },
        success: function(data){
            loaded();
            $('#cont-catalogoEquipos').html(data.html);

        }});
}


function filtrarAccesorio(path2) {
    var precio,accesorios;
    precio= $('#cboprecio').val();
    accesorios= $('#cboequipos').val();
    var marca = $("#marca").val() || "NA";
    var isectiontarcre = $("#isectiontarcre").val() || "0";
    var obj_data = {'filtro1':precio,'filtro2':accesorios,'marca':marca,'isectiontarcre':isectiontarcre};
    $.ajax({ url: path2,
        data:obj_data,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            load();
        },
        success: function(data){
            loaded();
            $('#cont-catalogoEquipos').html(data.html);

        } ,error: function (xhr, ajaxOptions, thrownError) {
        }});
}

function filtrarporliquidacion(path) {


    tipo_filtro = document.getElementById("cboprecio").value;
    tipo_oferta = document.getElementById("tipo").value;

    var obj_data = {
        'tipo_filtro': tipo_filtro,
        'tipo_oferta': tipo_oferta
    };
    $.ajax({
        url: path,
        type: 'post',
        data: obj_data,
        dataType: "json",
        beforeSend: function() {
            $('body').removeClass('modal-open');
            $("body").css("padding-right", "");
        },
        success: function(data) {
            $("#loading-bar-spinner").remove();
            $("#modal-opciones").remove();
            $('#content-equipostienda').html(data.html);
        }
    });
}


////////////////////////////// Send //////////////////////////////

function sendata(formulario, pathvalid, imagen){
    var form_user = $("#form-" + formulario);
    var form_data = form_user.serialize();
    var formid = "form#form-" + formulario + " :input[type=text], form#form-"+formulario+" :input[type=email], form#form-"+formulario+" :input[type=tel],form#form-" + formulario + " select";
    var invalid = false; //true si existe algun campo vacio
    var formapago = $('input[name=formapago]:checked').val() || "";
    var suscripcion = $('input[name=suscripcion]:checked').val() || "";
    var ocupacion = $("#ocupacion").val() || "";
    var pathimage = imagen || "";
    var selectorToGo = '';

    $(formid).each(function(){
        var pass = true;
        var id = $(this).attr('id');

        if (formapago=="BAN"){
            if (id=="tarjeta"||id=="numtarjeta"||id=="fechcadmes"||id=="fechcadanio"||id=="codigoseg"||id=="nomtarjeta"){
                pass=false;
            }
        }
        if (formapago=="TCR"){
            if (id=="camentfin"||id=="camtipcuenta"||id=="campnumcuenta"){
                pass=false;
            }
        }
        if (ocupacion=="Estudiante"||ocupacion=="Negocio Propio"||ocupacion=="Otros"){
            if (id=="codteletrabajo"||id=="camteletrab"||id=="extension"){
                pass=false;
            }
        }
        if (ocupacion=="Empleado"){
            if (id=="extension"){
                pass=false;
            }
        }

        if (pass){
            var input = $("#"+id).val();
            if(input.trim()!="")
            {
                $("#"+id).removeClass('form-controlinform');
                $("#"+id).addClass('form-control2');
                $("#tooltip"+id).addClass('hidden');
                $("#tooltip"+id).removeClass('visible');
            }
            else
            {
                $("#"+id).addClass('form-controlinform');
                $("#"+id).removeClass('form-control2');
                $("#tooltip"+id).addClass('visible');
                $("#tooltip"+id).removeClass('hidden');
                if (!invalid)
                    selectorToGo = '#'+id;
                invalid = true;
            }
        }
    });

    if (!invalid) {
        var seguir = true;
        var bantdoc = false;
        var msg = "";
        var tipodoc = $("#tipodocumento").val() || false;
        if(!tipodoc || tipodoc=="CED" )
        {
            var cedula = $("#numdoc").val() || false;
            bantdoc=true;
        }
        if(bantdoc)
        {
            if (cedula) {
                seguir=ValidarCedula(4);
                if(!seguir){
                    msg = "El número de cédula es inválido.";
                }
            }
        }
        if (seguir) {
            var camdireccion = $("#camdireccion").val() || false;
            var camreferencia = $("#camreferencia").val() || false;
            if (camdireccion && camreferencia){
                var palabrasdir=validaReferencia("camdireccion");
                var palabrasref=validaReferencia("camreferencia");
                if (palabrasdir<2){
                    msg = "Ayúdanos con más detalles en el campo Dirección.";
                    seguir = false;
                }else if(palabrasref<2){
                    msg = "Ayúdanos con más detalles en el campo Referencia.";
                    seguir = false;
                }
            }
        }

        if (seguir){
            var terminos = ($("#terminosycondiciones").length > 0) ? true : false;
            if (terminos){
                if ($("#terminosycondiciones").is(':checked')){
                    var recaptcha = ($("#g-recaptcha-response").length > 0) ? true : false;
                    if(recaptcha){
                        var recaptchaval = $("#g-recaptcha-response").val();
                        if (recaptchaval == ""){
                            msg = 'Demuestra que no eres un robot';
                            grecaptcha.reset();
                            seguir = false;
                        }
                    }
                }else{
                    msg = 'Primero, aceptemos los T&eacute;rminos y Condiciones';
                    grecaptcha.reset();
                    seguir = false;
                }
            }
        }

        if (seguir) {
            $.ajax({ url: pathvalid,
                data: form_data,
                type: 'post',
                beforeSend: function(){

                    if (typeof next === "function") {
                        next();
                    }
                    if(formulario=="clarohogarpaquetes" || formulario=="planesdth"){
                        mostrarPreview('#content-general > #content-contenidofondodth', '#content-general > #previewTp,#previewTp div',pathimage);
                    }else{
                        mostrarPreview('#content-general > #portabilidad-form,#content-general > .jc-container', '#previewTp,#previewTp div',pathimage);
                    }

                },
                success: function(data){
                    if (data.error){
                        if (typeof cancelNext === "function") {
                            cancelNext();
                        }
                        mostrarPreview('#previewTp,#previewTp div', '#content-general > #portabilidad-form,#content-general > .jc-container',pathimage);
                        modalAlert(data.msg);
                        if( $('input#isLanding').length > 0 ){
                            $('#form-'+formulario+' input[type=text],#form-'+formulario+' input[type=email]').val('');
                            $('#form-'+formulario+' select').prop('selectedIndex',0);
                        }
                        grecaptcha.reset();
                    }else if(data.redirect){
                        if(formulario=="clarohogarpaquetes" || formulario=="planesdth"){
                            mostrarPreview('#content-general > #content-contenidofondodth', '#content-general > #previewTp,#previewTp div',pathimage);
                        }else{
                            mostrarPreview('#content-general > #portabilidad-form,#content-general > .jc-container', '#previewTp,#previewTp div',pathimage);
                        }
                        $("#btncontinuar-"+formulario).attr("type","submit");
                        $(form_user).submit();
                    }
                },
                error : function (){
                    if (typeof cancelNext === "function") {
                        cancelNext();
                    }
                    mostrarPreview('#previewTp,#previewTp div', '#content-general > #portabilidad-form,#content-general > .jc-container',pathimage);
                    modalAlert("Ocurrio un error inesperado, vuelva a intentarlo mas tarde");
                    grecaptcha.reset();
                }
            });
        } else {
            modalAlert(msg);
        }
    }else {

        var up = ($(window).width() < 992) ? 72 : 60;

        $('html, body').stop().animate({
            scrollTop: $(selectorToGo).offset().top - up
        }, 300);
    }
}

function enviodatosopciones(path, landing){
    var telefono=$('#'+landing).val();
    telefono=telefono.trim();
    if (telefono=="")
    {
        alert("Ingresa tú número de celular");
    }
    else
    {
        if (telefono.length==10)
        {
            $.ajax({
                type:'POST',
                data: 'telefono='+telefono+'&landing='+landing,
                dataType: 'json',
                url: path,
                beforeSend: function()
                {
                    $("#content-landing").append( backdrop_modal );
                    $('#modal-general').on('shown.bs.modal', function () {
                        $('body').removeClass('modal-open');
                        $( "body" ).css("padding-right","");
                    })
                    $('#modal-general').modal('show');
                    $("#content-landing").append( loading_bar );
                    $( "#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    alert(data.message);
                    $( "#loading-bar-spinner" ).remove();
                    location.href=servidor2;
                }
            });
            return false;
        }
        else
        {
            alert("El número de celular debe tener 10 dígitos");
        }
    }
}

function enviarsolicitudLiquidacion(idequipo, id, path, opcion, descripcion) {
    var numero = document.getElementById("numerotelefono-"+id).value;

    numero=numero.trim();
    if (numero=="")
    {
        $("#popUpnumero").modal('show');
        return;
    }
    else
    {
        if (numero.length!=10)
        {
            $("#popUpnumero").modal('show'); return;
        }
    }
    $("#popUpnumero").modal('hide');
    $.ajax({
        type:'POST',
        data: 'idequipo='+idequipo+'&telefono='+numero+'&opcion='+opcion+'&descripcion='+descripcion,
        dataType: 'json',
        url: path,
        beforeSend: function()
        {
            $("#content-equipostienda").append( backdrop_modal );
            $('#modal-general').on('shown.bs.modal', function () {
                $('body').removeClass('modal-open');
                $( "body" ).css("padding-right","");
            })
            $('#modal-general').modal('show');
            $("#content-landing").append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            //alert(data.mensaje);
            if(data.mensaje==="S")
            {
                location.href=direplanes+"confirmacionLiquidacion/"+idequipo;
            }
        }
    });
}

function EnviarForm(path, form) {
    var modal_size="";
    var loading_bar="";
    var backdrop_modal ="";

    loading_bar = loading(form);
    backdrop_modal = backdropmodal(form);

    var form_user = $( "#form-"+form );
    var form_data = form_user.serialize();
    $.ajax({ url: path,
        data: form_data,
        type: 'post',
        beforeSend: function(){

            $("#equipo-login" ).append('');
            $("#equipo-login").append( backdrop_modal);
            $('#modal-'+form).modal('show');
            $("#equipo-login").append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("#loading-bar-spinner" ).remove();
            $( "#modal-"+form ).remove();
            $("#paso1").removeClass("colorpactivo").addClass("colorrealizado");
            $("#paso1_2").removeClass("colorpactivo").addClass("colorrealizado");
            $("#paso2").removeClass("colorrealizado").addClass("colorpactivo");
            $("#paso2_2").removeClass("colorrealizado").addClass("colorpactivo");

            $("#pasodatospersonales").removeClass("fondopasos").addClass("fondopasososcuro");

            var source1 = direccion+"images/pasoapaso/gris.png";
            var source2 = direccion+"images/pasoapaso/rojo.png";
            var sourcebarra = direccion+"images/pasoapaso/grisaclaro.png";
            $('#imgpaso1').attr("src",source1);
            $('#imgpaso2').attr("src",source2);
            $('#barra').attr("src",sourcebarra);
            $("#content-"+form).html(data);
            $("#textoPaso").html("<p id='pas' class='text-center text-red'><span id='textoPaso' style='color:#e31d1a;'>¡Un paso mas para Finalizar!</span></p>");
        }
    });
}

function send_form(form,nameFormSubmit,action,removeModalBody) {
    var modal_size = '';
    var form_user = $( "#form-"+form );
    var form_data = form_user.serialize();
    var form_action = action;
    var deleteModalBody = removeModalBody || 'S';

    var loading_bar = '<div id="loading-bar-spinner" style="display: none">'
        + '<div class="spinner-icon"></div>'
        + '</div>';

    var msg_alert = '';
    var backdrop_modal = '<div id="modal-'+form+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'

        + '<div class="modal-dialog '+modal_size+'">'
        + '</div>'
        + '</div>';
    $.ajax
    ({
        type: 'post',
        url: form_action,
        data: form_data,
        dataType: "json",
        beforeSend: function( )
        {
            if(deleteModalBody == 'S')
            {
                $( "#modal-body" ).remove();
            }
            $( "#content-transaccional" ).append('');
            $( "#content-transaccional").append( backdrop_modal);
            $('#modal-'+form).modal('show');
            $( "#content-transaccional").append( loading_bar);
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data)
        {
            modal_size = data.btnSize || 'sm';
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-"+form ).remove();

            if(data.error) //SI EXISTE ALGÚN ERROR
            {
                $( "#content-transaccional" ).css('display','');
                msg_alert = alert_bootstrap( form, 'Atenci&oacute;n', data.msg, modal_size, 'alert');
                $( "#content-transaccional").append( msg_alert );
                $('#modal-'+form).modal('show');
            }
            else if(data.anotherDivError) //SI EXISTE ALGÚN ERROR
            {
                $( "#content-transaccional").css('display','');
                msg_alert = alert_bootstrap( form, 'Atenci&oacute;n', data.msg, modal_size, 'alert');
                $( "#content-main-"+form ).append( msg_alert );
                $('#modal-'+form).modal('show');
            }
            else if(data.redirect) //SI SE REQUIERE UNA REDIRECCIÓN HA ALGUNA PÿGINA ESPECÿFICA
            {
                if(nameFormSubmit==="")
                {
                    location.reload();
                }
                else
                {
                    document.getElementById(nameFormSubmit).submit();
                }

                if (form==="registerUser")
                {
                    location.reload();
                    $( "#content-transaccional" ).css('display','');
                    msg_alert = alert_bootstrap( form, 'Atenci&oacute;n', data.msg, modal_size, 'alert');
                    $("#content-transaccional" ).append( msg_alert );
                    $('#modal-'+form).modal('show');
                }
            }
            else if(data.withoutModal) //CARGAR EL CONTENIDO SIN MOSTRAR MODALS
            {
                $( "#content-transaccional" ).html( data.html );
            }
            else if(data.modalOverBody) //CARGAR EL CONTENIDO SIN MOSTRAR MODALS
            {
                var title = data.title;
                var content = data.html;
                var type = data.typeModalOverBody || 'alert';
                var size = data.sizeModalOverBody || 'md';
                createModalOverBody(title, content, size, type);
            }
            else if(data.isHtml) //CARGAR EL CONTENIDO ANTES DE MOSTRAR EL MODAL
            {
                msg_alert = alert_bootstrap( form, 'Confirmaci&oacute;n', data.msg, modal_size, 'alert');
                $( "#content-transaccional").html( data.html );
                $( "#form-"+form ).append( msg_alert );
                $('#modal-'+form).modal('show');
            }
            else //PRIMERO MOSTRAR EL MODAL Y LUEGO RECARGA EL CONTENIDO AL CERRAR EL MODAL
            {
                functions = ["reload_content('"+form+"', '"+ servidor + data.section +"')"];
                msg_alert = alert_bootstrap( form, 'Confirmaci&oacute;n', data.msg, modal_size, 'alert', functions);
                $( "#content-transaccional" ).append( msg_alert );
                $('#modal-'+form).modal('show');
            }
        }
    });
    return false;
}

function EnviarFormPasoFinal(path, id, form) {
    var form_user = $( "#form-"+form );
    var form_data = form_user.serialize();
    var loading_bar ="";
    loading_bar  = loading(form);

    var backdrop_modal ="";
    backdrop_modal= backdropmodal(form);

    $.ajax({ url: path,
        data: form_data,
        type: 'POST',

        beforeSend: function(){
            $("#equipo-login" ).append('');
            $("#equipo-login").append( backdrop_modal);
            $('#modal-'+form).modal('show');
            $("#equipo-login").append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-"+form ).remove();
            $("#content-"+id).html(data);
            $("#pasos").html("");
        }
    });
}

function enviarsolicitud(nombre,precio,id,opcion,path) {
    var numero;
    if (opcion==1)
    {
        numero = document.getElementById("numerotelefono-"+id).value;
    }
    else
    {
        numero = document.getElementById("numerotelefono-"+id+"-mv").value;
    }

    numero=numero.trim();
    if (numero=="")
    {
        alert("Ingresa tú número de celular");
    }
    else
    {
        if (numero.length==10)
        {
            $.ajax({
                type:'POST',
                data: 'telefono='+numero+'&nombre='+nombre+'&precio='+precio,
                dataType: 'json',
                url: path,
                beforeSend: function()
                {
                    $("#content-equipostienda").append( backdrop_modal );
                    $('#modal-general').on('shown.bs.modal', function () {
                        $('body').removeClass('modal-open');
                        $( "body" ).css("padding-right","");
                    })
                    $('#modal-general').modal('show');
                    $("#content-landing").append( loading_bar );
                    $( "#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    $( "#loading-bar-spinner" ).remove();
                    if(data.mensaje=="exitoso")
                    {
                        location.href=servidor2+"PaqueteMegas/confirmacion/"+nombre;
                    }


                }
            });
        }
        else
        {
            alert("El número de celular debe tener 10 dígitos");
        }
    }
}

function enviodat(path, landing, mobile) {
    if (mobile==0)
    {
        var telefono=$('#telefono').val();
    }
    else if(mobile==1)
    {
        var telefono=$('#telefonomobile').val();
    }
    else
    {
        var telefono=$('#telefono-'+landing).val();
    }
    telefono=telefono.trim();
    if (telefono=="")
    {
        alert("Ingresa tú número de celular");
    }
    else
    {
        if (telefono.length==10)
        {
            if(mobile==2)
            {
                $("#btningresar-"+landing).button('loading');
            }
            /*else
                        {
                            $("#btningresar").button('loading');
                        }  */
            $.ajax({
                type:'POST',
                data: 'telefono='+telefono+'&landing='+landing,
                dataType: 'json',
                url: path,
                beforeSend: function()
                {
                    $("#content-landing").append( backdrop_modal );
                    $('#modal-general').on('shown.bs.modal', function () {
                        $('body').removeClass('modal-open');
                        $( "body" ).css("padding-right","");
                    })
                    $('#modal-general').modal('show');
                    $("#content-landing").append( loading_bar );
                    $( "#loading-bar-spinner").css('display','');
                },
                success: function(data){
                    //alert(data.message);
                    $( "#loading-bar-spinner" ).remove();
                    $("#resmsj").html(data.message);
                    $("#modal-general").modal('hide');
                    $("#modalAlerta").modal('show');
                    /* if(data.redirect && mobile!=2)
                                        {
                                            document.getElementById('btncontinuarmensaje').addEventListener('click', cerrarModal);
                                        }*/



                    //location.href=servidor2;
                }
            });
            return false;
        }
        else
        {
            alert("El número de celular debe tener 10 dígitos");
        }
    }
}

function enviarDatosPlay4() {
    var nombres=$("#nombres").val();
    var apellidos=$("#apellidos").val();
    var provincia=$("#provincia").val();
    var celular=$("#celular").val();
    var horallamada=$("#horallamada").val();
    var recaptcha = $("#g-recaptcha-response").val();
    var ban;
    var bandterminos = false;
    bandterminos = validaterminoscondicionesnuevo(1);

    $("#form-play4").validate({
        rules: {
            nombres: {required: true},
            apellidos: {required: true},
            cedula: {required: true},
            celular: {required: true},
            email: {required: true},
            horallamada: { required: true},
            camciudad: { required: true}

        },
        messages: {
            nombres: {
                required: 'El campo nombre es obligatorio'
            },
            apellidos: {
                required: 'El campo apellido es obligatorio'
            },
            cedula: {
                required: 'El campo cedula es obligatorio'
            },
            celular: {
                required: 'El campo celular es obligatorio'
            },
            email: {
                required: 'El campo email es obligatorio'
            },
            horallamada: {
                required: 'Campo obligatorio'
            },
            camciudad: {
                required: 'El campo ciudad es obligatorio'
            }
        }
    });
    ban = $("#form-play4").valid();
    if (ban)
    {
        tipodoc = document.getElementById('tipodocumento').value;
        if(tipodoc==="CED")
        {
            validarDocumento = ValidarCedula(1);
            if (!validarDocumento)
            {
                return;
            }
        }
        else
        {

            pasaporte = document.getElementById('pasaporte').value;
            if(pasaporte!="")
            {
                document.getElementById('cedula').value = document.getElementById('pasaporte').value;
            }
            else
            {
                alert("Debe ingresar el número de pasaporte");
                return;
            }
        }
        if (bandterminos == false)
        {
            alert("Aceptemos terminos y condiciones");
            return false;
        }
        if (recaptcha == "")
        {
            alert("Demuestra que no eres un robot");
            return false;
        }

        document.getElementById("form-play4").submit();
    }

}

////////////////////////////// Form //////////////////////////////

function irFormulario() {
    var dir =direplanes;
    opcion = $('#hd_opciones_planes').val();
    idplan = $('#hd_id_plan').val();
    nombreplan = $('#hd_nombre_plan').val();
    actionresult = dir+"formulario/"+opcion+"/"+idplan+"/"+nombreplan;
    document.forms.planestodos.action=actionresult;
    document.getElementById('planestodos').submit();
}

function formSubmitComentario(form, id) {
    var loading_bar = '<div id="loading-bar-spinner">'
        + '<div class="spinner-icon"></div>'
        + '</div>';
    var numEstrellas=$("#numEstrellas").val();

    if(numEstrellas>0)
    {
        $('#comentarios').html();
        target = $(form);
        $.ajax({
            type: "POST",
            url: target.attr('action'),
            data: target.serialize(),
            success: function(response) {
                alert("Se ha enviado su comentario");
                $("#comentarios-"+id).innerHTML="";
                $("#comentarios-"+id).html(response);
            },
            error: function(){},
            complete: function()
            {
                $('.auto-submit-star').rating({ callback: function(value, link)
                    {
                        if (typeof value === "undefined")
                        {
                            document.getElementById("numEstrellas").value=0;
                        }
                        else
                        {
                            document.getElementById("numEstrellas").value=value;
                        }
                    }
                });
            }
        });
    }
    else
    {
        alert("Califique al equipo");
    }
    return false;
}

function validarformPaso1(opcion)
{
    var nombre="",nombre2="";
    var apellido="",apellido2="";
    var cedula="";
    var estadoCivil="";
    var genero="";
    var dia="";
    var correo="";
    var mes="";
    var anio="";
    var telefono="";
    var celular="";
    var lugarent="";
    var prov="";
    var ciudad="";
    var referencia="";
    var direccion="";
    var band=true;

    if(opcion)
    {
        correo = document.getElementById("camcorreocompra").value;
        if(correo=="")
        {
            $("#astcorr").css("display","block");
            band=false;
        }
    }
    nombre=document.getElementById("nomcomple1").value;
    nombre2=document.getElementById("nomcomple2").value;
    apellido=document.getElementById("apepaterno").value;
    apellido2=document.getElementById("apematerno").value;
    cedula=document.getElementById("camcedula").value;
    estadoCivil=document.getElementById("camestcivil").value;
    if(document.getElementById("camgeneromas").checked)
    {
        genero=document.getElementById("camgeneromas").value;
    }
    else if(document.getElementById("camgenerofem").checked)
    {
        genero=document.getElementById("camgenerofem").value;
    }
    else
    {
        genero="";
    }
    if(document.getElementById("camlugarendom").checked)
    {
        lugarent=document.getElementById("camlugarendom").value;
    }
    else if(document.getElementById("camlugarentrab").checked)
    {
        lugarent=document.getElementById("camlugarentrab").value;
    }
    else
    {
        lugarent="";
    }
    dia=document.getElementById("camdia").value;
    mes=document.getElementById("cames").value;
    anio=document.getElementById("camano").value;
    telefono=document.getElementById("camtelefono").value;
    celular=document.getElementById("camcelular").value;
    //lugarent=document.getElementById("camlugaren").value;
    prov=document.getElementById("camprovincia").value;
    ciudad=document.getElementById("camciudad").value;
    direccion=document.getElementById("camdireccion").value;
    referencia=document.getElementById("camreferencia").value;
    $("#astnom1").css("display","none");
    $("#astnom2").css("display","none");
    $("#astape1").css("display","none");
    $("#astape2").css("display","none");
    $("#astced").css("display","none");
    $("#astestciv").css("display","none");
    $("#astgen").css("display","none");
    $("#astfec").css("display","none");
    $("#asttelef").css("display","none");
    $("#astcel").css("display","none");
    $("#astlugent").css("display","none");
    $("#astprov").css("display","none");
    $("#astciu").css("display","none");
    $("#astref").css("display","none");
    $("#astdir").css("display","none");

    if(nombre=="")
    {
        $("#astnom1").css("display","block");
        band=false;
    }
    if(nombre2=="")
    {
        $("#astnom2").css("display","block");
        band=false;
    }
    if(apellido=="")
    {
        $("#astape1").css("display","block");
        band=false;
    }
    if(apellido2=="")
    {
        $("#astape2").css("display","block");
        band=false;
    }
    if(cedula=="")
    {
        $("#astced").css("display","block");
        band=false;
    }
    if(estadoCivil=="")
    {
        $("#astestciv").css("display","block");
        band=false;
    }
    if(genero=="")
    {
        $("#astgen").css("display","block");
        band=false;
    }
    if(dia=="" || mes=="" || anio=="")
    {
        $("#astfec").css("display","block");
        band=false;
    }
    if(telefono=="")
    {
        $("#asttelef").css("display","block");
        band=false;
    }
    if(celular=="")
    {
        $("#astcel").css("display","block");
        band=false;
    }
    if(lugarent=="")
    {
        $("#astlugent").css("display","block");
        band=false;
    }
    if(prov=="")
    {
        $("#astprov").css("display","block");
        band=false;
    }
    if(ciudad=="")
    {
        $("#astciu").css("display","block");
        band=false;
    }
    if(referencia=="")
    {
        $("#astref").css("display","block");
        band=false;
    }
    if(direccion=="")
    {
        $("#astdir").css("display","block");
        band=false;
    }
    return band;
}

function validarformPaso2()
{
    var ocupacion="";
    var camforpago="";
    var campnumcuenta="";

    var camempresa="";
    var camteletrab="";
    var camprovinciatrab="";
    var camciudadtrab="";
    var camdirecciontrab="";
    var camreferenciatrab="";

    var numtarjeta="";
    var codigo_crc="";
    var mescad="";
    var aniocad="";
    var band=true;
    $("#astocup").css("display","none");
    $("#astemp").css("display","none");
    $("#astoteltrab").css("display","none");
    $("#astprovtrab").css("display","none");
    $("#astciutrab").css("display","none");
    $("#astdirtrab").css("display","none");
    $("#astreftrab").css("display","none");
    $("#astocup").css("display","none");
    $("#astnumctrab").css("display","none");
    $("#astformpago").css("display","none");

    $("#astnumctar").css("display","none");
    $("#astcodseg").css("display","none");
    $("#astfechacad").css("display","none");

    ocupacion=document.getElementById("ocupacion").value;
    camforpago=document.getElementById("camforpago").value;
    camempresa=document.getElementById("camempresa").value;
    camteletrab=document.getElementById("camteletrab").value;
    camprovinciatrab=document.getElementById("camprovinciatrab").value;
    camciudadtrab=document.getElementById("camciudadtrab").value;
    camdirecciontrab=document.getElementById("camdirecciontrab").value;
    camreferenciatrab=document.getElementById("camreferenciatrab").value;

    if(ocupacion=="")
    {
        $("#astocup").css("display","block");
        band=false;
        return band;
    }

    if(camforpago=="")
    {
        $("#astformpago").css("display","block");
        band=false;
        return band;
    }
    if(camforpago=="TCR")
    {
        numtarjeta=document.getElementById("numero_tarjeta").value;
        codigo_crc=document.getElementById("codigo_crc").value;
        mescad=document.getElementById("fecha_caducidad_mes").value;
        aniocad=document.getElementById("fecha_caducidad_anio").value;
        if(mescad=="" || aniocad=="")
        {
            $("#astfechacad").css("display","block");
            band=false;
        }

        if(numtarjeta=="")
        {
            $("#astnumctar").css("display","block");
            band=false;
        }
        if(codigo_crc=="")
        {
            $("#astcodseg").css("display","block");
            band=false;
        }
    }
    else
    {
        campnumcuenta=document.getElementById("campnumcuenta").value;
        if(campnumcuenta=="")
        {
            $("#astnumctrab").css("display","block");
            band=false;
        }
    }
    if(camempresa=="")
    {
        $("#astemp").css("display","block");
        band=false;
    }
    if(camteletrab=="")
    {
        $("#astoteltrab").css("display","block");
        band=false;
    }
    if(camprovinciatrab=="")
    {
        $("#astprovtrab").css("display","block");
        band=false;
    }
    if(camciudadtrab=="")
    {
        $("#astciutrab").css("display","block");
        band=false;
    }
    if(camdirecciontrab=="")
    {
        $("#astdirtrab").css("display","block");
        band=false;
    }
    if(camreferenciatrab=="")
    {
        $("#astreftrab").css("display","block");
        band=false;
    }

    return band;
}

function continuarForm(form,urlicon) {
    var nombre='';
    var apellido='';
    var email='';
    var numdoc='';
    var tipodoc='CED';
    var provincia='';
    var celular='';
    var id="";
    var bandpaquetes=false;
    var validarDocumento=true;
    var contcelu=0;
    var ciudad='';
    nombre=document.getElementById("nombre").value;
    apellido=document.getElementById("apellido").value;
    email=document.getElementById("correo").value;
    numdoc=document.getElementById("numdoc").value;
    //tipodoc=document.getElementById("tipodocumento").value;
    provincia=document.getElementById("provincia").value;
    celular=document.getElementById("celular").value;
    if(nombre.trim()=="")
    {
        $("#tooltipnombre").addClass('visible');
        $("#nombre").addClass('form-controlinform');
        $("#tooltipnombre").removeClass('hidden');
        $("#nombre").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(apellido.trim()=="")
    {
        $("#tooltipapellido").addClass('visible');
        $("#apellido").addClass('form-controlinform');
        $("#tooltipapellido").removeClass('hidden');
        $("#apellido").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(email.trim()=="")
    {
        $("#tooltipcorreo").addClass('visible');
        $("#correo").addClass('form-controlinform');
        $("#tooltipcorreo").removeClass('hidden');
        $("#correo").removeClass('form-control2');
        bandpaquetes=true;
    }
    else
    {
        id="correo";
        if(!validarcorreo(id))
        {
            $("#tooltipcorreo").addClass('visible');
            $("#correo").addClass('form-controlinform');
            $("#tooltipcorreo").removeClass('hidden');
            $("#correo").removeClass('form-control2');
            bandpaquetes=true;
        }
    }
    if(numdoc.trim()=="")
    {
        $("#tooltipnumdoc").addClass('visible');
        $("#numdoc").addClass('form-controlinform');
        $("#tooltipnumdoc").removeClass('hidden');
        $("#numdoc").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(tipodoc.trim()=="")
    {
        $("#tooltiptipodocumento").addClass('visible');
        $("#tipodocumento").addClass('form-controlinform');
        $("#tooltiptipodocumento").removeClass('hidden');
        $("#tipodocumento").removeClass('form-control2');
        bandpaquetes=true;
    }
    else
    {
        if(tipodoc.trim()=="CED")
        {
            //validarDocumento = ValidarCedula(4);
            var validarDocumento = validateIdentificationNumber(numdoc);
            if (!validarDocumento)
            {
                $("#tooltipnumdoc").addClass('visible');
                $("#numdoc").addClass('form-controlinform');
                $("#tooltipnumdoc").removeClass('hidden');
                $("#numdoc").removeClass('form-control2');
                bandpaquetes=true;
            }
        }
    }
    if(provincia.trim()=="")
    {
        $("#tooltipprovincia").addClass('visible');
        $("#provincia").addClass('form-controlinform');
        $("#tooltipprovincia").removeClass('hidden');
        $("#provincia").removeClass('form-control2');
        bandpaquetes=true;
    }
    if ( $("#ciudad").length && $("#ciudad").val().trim()=="") {
        $("#tooltipciudad").addClass('visible');
        $("#ciudad").addClass('form-controlinform');
        $("#tooltipciudad").removeClass('hidden');
        $("#ciudad").removeClass('form-control2');
        bandpaquetes=true;
    }

    if(celular.trim()=="")
    {
        $("#tooltipcelular").addClass('visible');
        $("#celular").addClass('form-controlinform');
        $("#tooltipcelular").removeClass('hidden');
        $("#celular").removeClass('form-control2');
        bandpaquetes=true;
    }
    else
    {
        contcelu=celular.length;
        if(contcelu<10)
        {
            $("#tooltipcelular").addClass('visible');
            $("#celular").addClass('form-controlinform');
            $("#tooltipcelular").removeClass('hidden');
            $("#celular").removeClass('form-control2');
            bandpaquetes=true;
        }
    }
    if (form == "Prepago" || form == "planesImeiInvalid"){

        /*formapago=document.getElementById("formapago").value;
        if(formapago=="")
        {
            $("#tooltipformapago").addClass('visible');
            $("#formapago").addClass('form-controlinform');
            $("#tooltipformapago").removeClass('hidden');
            $("#formapago").removeClass('form-control2');
            bandpaquetes=true;
        }*/
        if(!bandpaquetes){
            if(form=="Prepago"){
                mostrarPreview('#content-general > #content-contenido-form', '#content-general > #previewTp,#previewTp div',urlicon);
            }else if(form=="planesImeiInvalid"){
                mostrarPreview('#content-general > #content-contenidofondodth', '#content-general > #previewTp,#previewTp div',urlicon);
            }else{
                previewById('#next');
            }
        }

    }
    if(!bandpaquetes)
    {
        if(form!="Prepago" && form!="planesImeiInvalid"){
            next();
        }
        document.getElementById('form-'+form).submit();
    }
}

////////////////////////////// Form utils //////////////////////////////

function datosLaborales(value) {
    if (value == "") {
        $("#content-domicilio").css("display", "none");
    } else {
        $("#content-domicilio").css("display", "block");
        if(value == "Empleado" || value == "Otros") {
            if(value == "Empleado") {
                $("#content-telefonotrab").css("display", "");
            } else {
                $("#content-telefonotrab").css("display", "none");
            }
            $("#camempresa").removeAttr('disabled');
            $("#camempresa").val("");
        } else {
            $("#content-telefonotrab").css("display", "none");
            $("#camempresa").attr('disabled', 'disabled');
            $("#camempresa").val(value);
        }
    }
}

function llenarCiudadesDomicilio(path, opcion) {
    var provincia = "";
    if (document.getElementById('content-ciudad') && (opcion== 0 || opcion == 1))
    {
        provincia = document.getElementById('camprovincia').value;
    }
    else
    {
        provincia = document.getElementById('camprovinciatrab').value;
    }
    if(document.getElementById('content-ciudad') && (opcion== 0 || opcion == 1) )
    {
        if(provincia.trim()!=="")
        {
            $.ajax({
                type: "POST",
                url: path,
                data: 'provincia='+provincia,
                success: function(response) {
                    $("#content-ciudad").html(response);
                    if(opcion)
                    {
                        $("#content-ciudad").css("height","33px");
                        $("#camciudad").addClass("form-control");
                    }
                },
                error: function(){},
                complete: function(){}
            });
        }
        else
        {
            $("#content-ciudad").html("<select id='camciudad' name='camciudad' class='col-xs-12 form-control' style='height:33px'><option value=''>Seleccione</option></select>");
        }
    }else{
        if(document.getElementById('content-ciudadtrab'))
        {
            if(provincia.trim()!=="")
            {
                $.ajax({
                    type: "POST",
                    url: path,
                    data: 'provincia='+provincia,
                    success: function(response) {

                        $("#content-ciudadtrab").html(response);

                    },
                    error: function(){},
                    complete: function(){
                        $("#content-ciudadtrab > select").attr('id','camciudadtrab');
                        $("#content-ciudadtrab > select").attr('name','camciudadtrab');
                    }
                });
            }
            else
            {
                $("#content-ciudadtrab").html("<select id='camciudadtrab' name='camciudadtrab' class='col-xs-12' ><option value=''>Seleccione</option></select>");
            }
        }}
    return false;
}

function CambioPago(value) {
    if (value=="BAN")
    {
        $("#bancos").css("display","block");
        $("#tarjetas").css("display","none");
    }
    else if(value=="TCR")
    {
        $("#bancos").css("display","none");
        $("#tarjetas").css("display","block");
    }
    else
    {
        $("#bancos").css("display","none");
        $("#tarjetas").css("display","none");
    }
}

function cambiocpr() {
    if(document.getElementById("chk_cambiar").checked)
    {
        document.getElementById("cambiocpr").value=1;
    }
    else
    {
        document.getElementById("cambiocpr").value=0;
    }
}

function HabilitarLabel() {
    var tipodoc;
    tipodoc = document.getElementById('tipodocumento').value;
    document.getElementById('cedula').value="";
    document.getElementById('pasaporte').value="";

    if(tipodoc==="CED")
    {
        $("#cedula").css('display','block');
        $("#pasaporte").css('display','none');
    }
    else
    {
        $("#cedula").css('display','none');
        $("#pasaporte").css('display','block');
    }
}

function validaterminoscondicionesnuevo(idcheck)
{
    var opcion;
    $(document).ready(function () {
        if ($("#terminosycondiciones").is(':checked')) {
            opcion = true;
        } else {
            opcion = false;
        }
    });

    return opcion;
}

function validaterminoscondiciones(idcheck)
{
    var opcion;
    if (idcheck == 1)
    {
        $(document).ready(function () {
            if ($("#terminosycondiciones").is(':checked')) {
                opcion = true;
            } else {
                opcion = false;
            }
        });
    }
    else
    {
        $(document).ready(function () {
            if ($("#terminosycondiciones1").is(':checked')) {
                opcion = true;
            } else {
                opcion = false;
            }
        });
    }
    return opcion;
}

function llenarCiudades4Play(path) {
    var provincia = "";
    provincia = document.getElementById('provincia').value;
    if(provincia.trim()!=="")
    {
        $.ajax({
            type: "POST",
            url: path,
            data: 'provincia='+provincia,
            success: function(response) {
                $("#content-ciudad2").html(response);
            },
            error: function(){},
            complete: function(){}
        });
    }
    else
    {
        $("#content-ciudad").html("<select class='form-control' id='camciudad' name='camciudad' class='col-xs-12' ><option value=''>Seleccione</option></select>");
    }

    return false;
}

////////////////////////////// Popup //////////////////////////////

function abrirPopupOpciones(idplan, nombreplan, opcionrec, cambio) {
    var dir =direplanes;
    var opcion;

    if(opcionrec===3)
    {
        opcion="planrenovacion";
        if(cambio==="NA" )
        {
            opcion="planrenovacion";
            document.getElementById("hd_id_plan").value =idplan ;
            document.getElementById("hd_nombre_plan").value =nombreplan ;
            actionresult = dir+"plan/formulario/"+opcion+"/"+idplan+"/"+nombreplan;
            location.href = actionresult;
            next();
        }
    }
    else
    {
        if(opcionrec==1)
        {
            opcion="plannuevo";
        }
        else if(opcionrec==2)
        {
            opcion="planPortabilidad";
        }
        else
        {
            opcion="planmigracion";
        }
        document.getElementById("hd_id_plan").value =idplan ;
        document.getElementById("hd_nombre_plan").value =nombreplan ;
        actionresult = dir+"plan/formulario/"+opcion+"/"+idplan+"/"+nombreplan;
        location.href=actionresult;
        next();
    }

}

function abrirPopupOpcionesplanes(idplan, nombreplan, opcion) {
    var dir =direplanes;
    document.getElementById("hd_id_plan").value =idplan ;
    document.getElementById("hd_nombre_plan").value =nombreplan ;
    actionresult = dir+"formulario/"+opcion+"/"+idplan+"/"+nombreplan;
    document.forms.planestodos.action=actionresult;
    document.getElementById('planestodos').submit();
}

function abrirPopup(id,codigoequipo,opcion) {
    var URLactual = window.location.pathname;
    var action ="";
    var actionc="";
    var direc="";
    var idequipoplan=0;
    action=document.forms.equipostodos.action;
    var actionresult;

    if(/vermas/.test(URLactual))
    {

        var res = URLactual.split("vermas/");
        var parametros = res[1].split("/");
        var parametroscolor = parametros[1];
        var parametrosplan = parametros[3];
        document.getElementById('idequipo').value=id;
        document.getElementById('hd_codigoequipo').value=codigoequipo;
        idequipocolor = parametroscolor;
        document.getElementById('idcolorescogido').value=idequipocolor;

        //idequipoplan=document.getElementById('plan-'+id).value;
        idequipoplan=document.getElementById('idplanseleccionado').value;
        document.getElementById('idplanfinal').value=idequipoplan;

        location.href = servidor+"Solicitud/"+id+"/";

    }
    else
    {
        var res =  URLactual.split("/");
        if(/app_dev.php/.test(URLactual))
        {
            res[0]=URLactual;
        } else
        {

            var res =  URLactual.split("/");
            if(/app_dev.php/.test(URLactual))
            {
                res[0]=URLactual;
            } else
            {
                if(/web/.test(URLactual))
                {
                    if(/Samsung/.test(URLactual))
                    {
                        res[0]=servidor;
                    }
                    else{
                        res[0]=URLactual;
                        res[0]="/clarotiendavirtual/web/";
                    }


                }
                else
                {
                    res[0]=URLactual;
                }
            }

            idequipocolor=document.getElementById('color-'+id).value;
            parametrosplan=document.getElementById('plan-'+id).value;
            parametrosnombrequipo=document.getElementById('nombre-'+id).value;
            idequipoplan=parametrosplan;
        }
    }
    if(parametrosplan==idequipoplan)
    {
        actionresult = res[0]+"login/"+id+"/"+idequipocolor+"/"+parametrosnombrequipo+"/"+parametrosplan+"/"+opcion;
    }
    else
    {
        actionresult = res[0]+"login/"+id+"/"+idequipocolor+"/"+parametrosnombrequipo+"/"+idequipoplan+"/"+opcion;
    }

    document.forms.equipostodos.action=actionresult;
    document.getElementById('equipostodos').submit();
}

function abrirPopup2(id, codigoequipo, opcion) {
    var URLactual = servidor;

    var action ="";
    var actionc="";
    var idequipoplan=0;
    action=document.forms.equipostodos.action;

    var actionresult;
    idequipocolor=document.getElementById('color-'+id).value;
    parametrosplan=document.getElementById('plan-'+id).value;
    parametrosnombrequipo=document.getElementById('nombre-'+id).value;
    idequipoplan=parametrosplan;

    actionresult = servidor+"login/"+id+"/"+idequipocolor+"/"+parametrosnombrequipo+"/"+parametrosplan+"/"+opcion;

    document.forms.equipostodos.action=actionresult;
    document.getElementById('equipostodos').submit();
}

function abrirPopupplanes(id, url, numelementos, formlinea, opcion) {
    var bandenvio;
    var title = "";
    var content;
    var typo;
    var size;
    var elementos;
    var deleteModalBody = 'S';
    var loading_bar="";
    elementos = numelementos;
    var backdrop_modal="";
    bandenvio = $('#hd_bandenvio').val();

    if (bandenvio==0)
    {
        loading_bar = loading("planesEquipos");

        backdrop_modal = backdropmodal("planesEquipos");

        $.ajax({ url: url,
            data: 'equipo='+id+'&elementos='+elementos+'&opcion='+opcion+'&formline='+formlinea,
            type: 'post',
            beforeSend: function(){
                $('#hd_bandenvio').val(1);

                if(deleteModalBody == 'S')
                {
                    $( "#modal-body" ).remove();
                }
                $( "#content-productomobile" ).append('');
                $( "#content-productomobile" ).append( backdrop_modal);
                $('#modal-planesEquipos').modal('show');
                $( "#content-productomobile" ).append( loading_bar);
                $( "#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $('#hd_bandenvio').val(0);
                $( "#loading-bar-spinner" ).remove();
                $( "#modal-planesEquipos" ).remove();
                if(data.modalOverBody) //MODAL SOBRE EL CUERPO DE LA PAGINA
                {
                    content = data.html;
                    typo = data.typeModalOverBody || 'alert';
                    size = data.sizeModalOverBody || 'xlg';

                    createModalOverBody(title, content, size, typo);
                }

            }
        });
    }
}

////////////////////////////// Compare //////////////////////////////

// New compare

var selectedEquiposCompararNuevo = [];
var selectedEquipos = [];

function cerrarEquipo(cont, opcion, idequipo) {
    var path = $("#urladdphonempty").val();
    $.ajax({
        type: "POST",
        url: path,
        data: 'opcion='+opcion+'&cont='+cont,
        success: function(data){
            var cant = document.getElementsByClassName('equiponum').length;
            if (cant<=1){
                if ($(window).width() <= 767){
                    var maximo = 2;
                    var chkcomparar = "chk_comparar_Mobile";
                    var EquiposComparar = "EquiposCompararMobile";
                    var contentequicomp2 = "<div class='boxEquipo boxVaciosMobile'><div class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>";
                }else{
                    var maximo = 3;
                    var chkcomparar = "chk_comparar_";
                    var EquiposComparar = "EquiposComparar";
                    var contentequicomp2 = "<div class='equipoACompararR boxEquipoACompararR boxVacios'></div>";
                }
                $( "#"+EquiposComparar ).html("");
                for (var i = 0; i < maximo; i++)
                {
                    $( "#"+EquiposComparar ).append(contentequicomp2);
                }
                $('#content-slide').html("");
                $('#content-general').css('overflow-y','auto');
                $("#content-general").show();
                $('html,body').animate({
                    scrollTop: $("#content-general").offset().top
                }, 500);
            }else{
                $('#id-'+cont).html(data.html);
                if ($(window).width() <= 767){
                    $('#content-Generales-res'+cont).html('');
                    $('#content-Pantalla-res'+cont).html('');
                    $('#content-Memoria-res'+cont).html('');
                    $('#content-Datos-res'+cont).html('');
                    $('#content-Cámara-res'+cont).html('');
                    $('#content-Servicios-res'+cont).html('');
                    $('#content-Multimedia-res'+cont).html('');
                    $('#content-Adicionales-res'+cont).html('');
                    $('#content-Incluye-res'+cont).html('');
                    $('#content-Funcionalidades-res'+cont).html('');
                    $('#content-Red-res'+cont).html('');
                    $('#content-Conectividad-res'+cont).html('');
                    $('#content-Batería-res'+cont).html('');
                }else{
                    $('#content-Generales-'+cont).html('');
                    $('#content-Pantalla-'+cont).html('');
                    $('#content-Memoria-'+cont).html('');
                    $('#content-Datos-'+cont).html('');
                    $('#content-Cámara-'+cont).html('');
                    $('#content-Servicios-'+cont).html('');
                    $('#content-Multimedia-'+cont).html('');
                    $('#content-Adicionales-'+cont).html('');
                    $('#content-Incluye-'+cont).html('');
                    $('#content-Funcionalidades-'+cont).html('');
                    $('#content-Red-'+cont).html('');
                    $('#content-Conectividad-'+cont).html('');
                    $('#content-Batería-'+cont).html('');
                }

            }
            delete selectedEquipos["idequipo-"+idequipo];
        }});
}

function cerrarVentana(){
    if ($(window).width() <= 767){
        var maximo = 2;
        var chkcomparar = "chk_comparar_Mobile";
        var EquiposComparar = "EquiposCompararMobile";
        var contentequicomp2 = "<div class='boxEquipo boxVaciosMobile'><div class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>";
    }else{
        var maximo = 3;
        var chkcomparar = "chk_comparar_";
        var EquiposComparar = "EquiposComparar";
        var contentequicomp2 = "<div class='equipoACompararR boxEquipoACompararR boxVacios'></div>";
    }
    $("#"+EquiposComparar).html("");
    for (var i = 0; i < maximo; i++)
    {
        $("#"+EquiposComparar).append(contentequicomp2);
    }
    $('#content-slide').html("");
    //$('#content-general').css('overflow-y','auto');
    $('#content-general').show();
    selectedEquipos=[];
    selectedEquiposCompararNuevo=[];
    $('html,body').animate({
        scrollTop: $("#content-general").offset().top
    }, 500);
}

function cerrarVentanaPlanes() {
    $('#content-contenido_preview').hide();
    $('#content-slide').html("");
    $('#content-vermas').show();
    //$('#content-general').css('overflow-y','auto');
    $('#content-general').show();
}

function searchPhone(path,opcion){
    var descripcion   = $('#search').val();
    //var idmarca   = $('#idmarca').val();
    if (descripcion.trim()!="")
    {
        //var autocompletar = new Array();
        var descripcion2="";
        descripcion2=$.trim(descripcion);
        var regexp = / +/g; /* Expresión regular para buscar todos los espacios múltiples */
        descripcion2 = descripcion;
        descripcion2 = descripcion2.replace(regexp, " ");
        $('#search').val(descripcion2);
        var datas = {"filtro" : descripcion2, "opcion" : opcion};
        $.ajax({
            type: "POST",
            url: path,
            data: datas,
            success: function(data) {
                var autocompletartexto =data.value;
                $("#search").autocomplete({
                    source: autocompletartexto,
                    minLength: 1,
                    select: function(event, ui) {
						//Parche
						//$("#cboequipos").val("todos");
						//$("#cboprecio").val("");
                        var id=ui.item.id;//id del equipo o marca
                        var tipo = ui.item.tipo;// tipo puede ser equipo o marca
                        var label= ui.item.label;// descripcion del producto
                        id=parseInt(id);
                        searchCriteria(id,tipo,opcion);
                    }
                })
                    .autocomplete('instance')._renderItem = function (ul , item){
                    var li = $('<li>'),
                        img = $('<img class="imageClass">');
                    img.attr({
                        src: rootImg + item.imagen,
                        alt: item.label
                    })
                    li.attr('data-value', item.label);
                    li.append('<a>');
                    li.find('a').append(img).append(item.label);
                    return li.appendTo(ul);
                };
            }
        });
    }else{
        searchCriteria(null,"todos",opcion);
    }
}

function searchCriteria(id,tipo,opcion){
    if(id == null){
		$("#cboequipos").val("todos");
		$("#cboprecio").val("");
	}
	var vista = $("#cboequipos").val() || "";
	var filtrarpor = $("#cboprecio").val() || "";
	var datas = {"id" : id, "tipo" : tipo, "opcion" : opcion, "vista" : vista, "filtrarpor" : filtrarpor};
    var path = root + "search/criteria";
    $.ajax({
        type: "POST",
        url: path,
        data: datas,
        beforeSend: function(){
            load();
        },
        success: function(data) {
            loaded();
            $("#cont-catalogoEquipos").html(data.html);
			if(data.updateFilter){
				updateFilter(data);
			}
        }
    });
}

function updateFilter(data){
	var cant = document.getElementsByClassName("btntiendarenovacion").length;
	var cant = cant/2;
	var idmar = (data.idmarca==null) ? 0 : data.idmarca ;
	var onchan = 'filtrarporEquipos("'+data.onchange+'",'+idmar+');';
	//console.log(onchan);
	var combofilter = '<select id="cboequipos" name="cboequipos" class="combo-text col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 col-xs-6 col-xs-offset-3" onchange='+onchan+'>';
	combofilter += '<option value="todos" selected>Seleccione</option>';
	if(cant<=12){
		combofilter += '<option value="12">1-'+cant+' de '+cant+' equipos';
	}else{
		for(var i = 0; i < 3; i++){
			var numberFilter = cant - (i*(cant/4));
			var numberFilter2 = Math.floor(numberFilter);
			combofilter += '<option value="'+numberFilter2+'">'+'1-'+numberFilter2+' de '+cant+' equipos</option>';
		}
	}
	combofilter+='</select>';
	$("#content-cboequipos").html(combofilter);
	$("#cboprecio").attr("onchange",onchan);
	console.log(combofilter);
}

function autocompletar (id, path, opcion, cont)
{
    var descripcion   = $('#'+id).val();
    var idmarca   = $('#idmarca').val();
    if (descripcion.trim()!="")
    {
        //var autocompletar = new Array();
        var descripcion2="";
        descripcion2=$.trim(descripcion);
        var regexp = / +/g; /* Expresión regular para buscar todos los espacios múltiples */
        descripcion2 = descripcion;
        descripcion2 = descripcion2.replace(regexp, " ");
        $('#'+id).val(descripcion2);
        var path2= $("#urladdphone").val();
        $.ajax({
            type: "POST",
            url: path,
            data: 'filtro='+descripcion2+'&opcion='+opcion+'&idmarca='+idmarca,
            beforeSend: function()
            {
                //waitingDialog.show('Espere por favor ...');
            },
            success: function(data) {
                var autocompletartexto =data.value;
                $("#"+id).autocomplete({
                    source: autocompletartexto,
                    //minLength: 1,
                    select: function(event, ui) {
                        var existe=false;
                        for (var key in selectedEquipos) {
                            //console.log(selectedEquipos[key]);
                            if (ui.item.id==selectedEquipos[key]){
                                existe=true;
                            }
                        }
                        if (existe){
                            mensj ="Selecciona diferentes telefonos para comparar";
                            $('#mensj-compararPage').html(mensj);
                            $('#popUpComparacionPage').modal('show');
                            $("#mainSearchBox-"+cont).val("");
                            return false;
                        }else{
                            var idequipo=ui.item.id;
                            idequipo=parseInt(idequipo);
                            lookPhone(idequipo,path2,cont,opcion);
                        }
                    }/*,
							change: function(event, ui) {
								lookPhone(ui.item.id,path2,cont,opcion);
							}*/
                });
            }
        });
    }
}

function lookPhone(idequipo, path, cont, opcion) {
    var path2= $("#urladdphoneCompare").val();

    $.ajax({
        type: "POST",
        url: path,
        data: 'idequipo='+idequipo+'&cont='+cont+'&opcion='+opcion,
        success: function(data){
            selectedEquipos["idequipo-"+idequipo]=idequipo;
            $("#id-"+cont).html(data.html);


            var ids= $(".equiposVal").map(function() {
                return $(this).val();
            }).get();

            var idsComparar;
            $.each( ids, function( key, value ) {

                if(key==0) {
                    idsComparar=value;
                }
                else{
                    idsComparar+='**' + value;
                }

            });

            if ($(window).width() <= 767){
                if ($('#content-Generales-res'+cont).length <1) {
                    var id = "content-Generales-res"+cont;
                    $("#content-Generales-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $("#content-Generales-res"+cont).html(data.generales);

                if ($('#content-Pantalla-res'+cont).length <1) {
                    var id = "content-Pantalla-"+cont;
                    $("#content-Pantalla-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Pantalla-res'+cont).html(data.pantalla);

                if ($('#content-Memoria-res'+cont).length <1) {
                    var id = "content-Memoria-res"+cont;
                    $("#content-Memoria-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Memoria-res'+cont).html(data.memoria);

                if ($('#content-Datos-res'+cont).length <1) {
                    var id = "content-Datos-res"+cont;
                    $("#content-Datos-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Datos-res'+cont).html(data.datos);

                if ($('#content-Cámara-res'+cont).length <1) {
                    var id = "content-Cámara-res"+cont;
                    $("#content-Cámara-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Cámara-res'+cont).html(data.camara);

                if ($('#content-Servicios-res'+cont).length <1) {
                    var id = "content-Servicios-res"+cont;
                    $("#content-Servicios-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Servicios-res'+cont).html(data.servicios);

                if ($('#content-Multimedia-res'+cont).length <1) {
                    var id = "content-Multimedia-res"+cont;
                    $("#content-Multimedia-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Multimedia-res'+cont).html(data.multimedia);

                if ($('#content-Adicionales-res'+cont).length <1) {
                    var id = "content-Adicionales-res"+cont;
                    $("#content-Adicionales-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Adicionales-res'+cont).html(data.adicionales);

                if ($('#content-Incluye-res'+cont).length <1) {
                    var id = "content-Incluye-res"+cont;
                    $("#content-Incluye-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Incluye-res'+cont).html(data.incluye);

                if ($('#content-Funcionalidades-res'+cont).length <1) {
                    var id = "content-Funcionalidades-res"+cont;
                    $("#content-Funcionalidades-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Funcionalidades-res'+cont).html(data.funcionalidades);

                if ($('#content-Red-res'+cont).length <1) {
                    var id = "content-Red-res"+cont;
                    $("#content-Red-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Red-res'+cont).html(data.red);

                if ($('#content-Conectividad-res'+cont).length <1) {
                    var id = "content-Conectividad-res"+cont;
                    $("#content-Conectividad-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Conectividad-res'+cont).html(data.conectividad);

                if ($('#content-Batería-res'+cont).length <1) {
                    var id = "content-Batería-res"+cont;
                    $("#content-Batería-res").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Batería-res'+cont).html(data.bateria);
            }else{
                if ($('#content-Generales-'+cont).length <1) {
                    var id = "content-Generales-"+cont;
                    $("#content-Generales").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $("#content-Generales-"+cont).html(data.generales);

                if ($('#content-Pantalla-'+cont).length <1) {
                    var id = "content-Pantalla-"+cont;
                    $("#content-Pantalla").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Pantalla-'+cont).html(data.pantalla);

                if ($('#content-Memoria-'+cont).length <1) {
                    var id = "content-Memoria-"+cont;
                    $("#content-Memoria").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Memoria-'+cont).html(data.memoria);

                if ($('#content-Datos-'+cont).length <1) {
                    var id = "content-Datos-"+cont;
                    $("#content-Datos").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Datos-'+cont).html(data.datos);

                if ($('#content-Cámara-'+cont).length <1) {
                    var id = "content-Cámara-"+cont;
                    $("#content-Cámara").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Cámara-'+cont).html(data.camara);

                if ($('#content-Servicios-'+cont).length <1) {
                    var id = "content-Servicios-"+cont;
                    $("#content-Servicios").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Servicios-'+cont).html(data.servicios);

                if ($('#content-Multimedia-'+cont).length <1) {
                    var id = "content-Multimedia-"+cont;
                    $("#content-Multimedia").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Multimedia-'+cont).html(data.multimedia);

                if ($('#content-Adicionales-'+cont).length <1) {
                    var id = "content-Adicionales-"+cont;
                    $("#content-Adicionales").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Adicionales-'+cont).html(data.adicionales);

                if ($('#content-Incluye-'+cont).length <1) {
                    var id = "content-Incluye-"+cont;
                    $("#content-Incluye-").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Incluye-'+cont).html(data.incluye);

                if ($('#content-Funcionalidades-'+cont).length <1) {
                    var id = "content-Funcionalidades-"+cont;
                    $("#content-Funcionalidades-").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Funcionalidades-'+cont).html(data.funcionalidades);

                if ($('#content-Red-'+cont).length <1) {
                    var id = "content-Red-"+cont;
                    $("#content-Red-").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Red-'+cont).html(data.red);

                if ($('#content-Conectividad-'+cont).length <1) {
                    var id = "content-Conectividad-"+cont;
                    $("#content-Conectividad-").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Conectividad-'+cont).html(data.conectividad);

                if ($('#content-Batería-'+cont).length <1) {
                    var id = "content-Batería-"+cont;
                    $("#content-Batería-").append("<div id='"+id+"' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                }
                $('#content-Batería-'+cont).html(data.bateria);
            }
        }});
}

////////////////////////////// Tabs //////////////////////////////

function tabplanes(id, index, codigoclaro, cuota_equipo) {
    var tabs = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];

    for(var i=0; i < tabs.length; i++)
    {
        if(tabs[i] === id)
        {
            $('#hd_codigoclaro').val(codigoclaro);
            $('#hd_cuota_equipo').val(cuota_equipo);
            $('#hd_idplan').val(index);
            $('#'+id).addClass('tab-plan-active');
        }
        else
        {
            $('#'+tabs[i]).removeClass('tab-plan-active');
        }
    }
}

function tabplanesDth(id, index) {
    var tabs = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
    for(var i=0; i < tabs.length; i++)
    {
        if(tabs[i] === id)
        {
            $('#hd_idplan').val(index);
            $('#'+id).addClass('tab-plan-active');
        }
        else
        {
            $('#'+tabs[i]).removeClass('tab-plan-active');
        }
    }
}

////////////////////////////// Prepaid //////////////////////////////

function abrirPrepago(id,equipo,path) {
    $.ajax
    ({
        type: 'post',
        url: path,
        data: 'idequipoprepago='+equipo,
        dataType: "html",
        beforeSend: function()
        {
            $( "#content-"+id ).html( "<div id='loading-bar-spinner-relative'><div class='spinner-icon'></div></div>" );
        },
        success: function(data)
        {

            $( "#content-"+id ).html( data );

        },
    });
}

function verMasPrepago(path,id,idequipo){
    var modal_size = '';
    var valor = $("#content-"+id).css("display");
    var equipoactivoactual = document.getElementById("equipoactivopre").value;
    document.getElementById("equipoactivopre").value=idequipo;
    var equipoactivonuevo = document.getElementById("equipoactivopre").value;
    var loading_bar = '<div id="loading-bar-spinner" style="display: none">'
        + '<div class="spinner-icon"></div>'
        + '</div>';

    var msg_alert = '';
    var backdrop_modal = '<div id="modal-vermas" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'

        + '<div class="modal-dialog '+modal_size+'">'
        + '</div>'
        + '</div>';

    $.ajax({ url: path,
        data: 'idequipo='+idequipo,
        type: 'post',
        beforeSend: function( )
        {
            $( "#content-contenido").append('');
            $( "#content-contenido").append( backdrop_modal);
            $('#modal-vermas').modal('show');
            $( "#content-contenido").append( loading_bar);
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-vermas").remove();
            $("#content-"+id).html(data.html);
            if(equipoactivoactual==-1)
            {
                if (valor=="none")
                {
                    $("#content-"+id).slideToggle(1100);
                }
            }
            if (equipoactivoactual==idequipo)
            {
                $("#content-"+id).slideToggle(1100);
                document.getElementById("equipoactivopre").value=-1;
            }



        }
    });
}

function abrirPrepago2(equipo,postpago) {
    var action ="";
    var actionc="";
    var URLactual = window.location.protocol  + "//" + window.location.host + window.location.pathname + "/";
    if(/vermas/.test(URLactual))
    {
        var res = URLactual.split("vermas/");
        var resp = URLactual.split("/prepago");
        var parametros = res[1].split("/");
        /*idequipo*/
        var parametroside = parametros[0];
        /*idcolor*/
        var parametroscolor = parametros[1];
        /*nombrequipo*/
        var parametrosnombrequipo = parametros[2];
        /*plan*/
        idequipocolor = parametroscolor;
        var parametrosplan = 0;

        actionresult = resp[0]+"/prepago/login/"+equipo+"/"+idequipocolor+"/"+parametrosnombrequipo + "/";
    }
    else
    {

        var res =  URLactual.split("/prepago");


        idequipocolor=document.getElementById('color-'+equipo).value;

        parametrosnombrequipo=document.getElementById('nombre-'+equipo).value;

        idequipoplan=parametrosplan;
        actionresult = res[0]+"/prepago/login/"+equipo+"/"+idequipocolor+"/"+parametrosnombrequipo + "/";

    }

    document.forms.equipostodosPrepago.action=actionresult;
}

function EnviarFormPasoFinalPrepago(path, id, form) {

    var form_user = $( "#form-"+form );
    var form_data = form_user.serialize();
    var loading_bar = '<div id="loading-bar-spinner">'
        + '<div class="spinner-icon"></div>'
        + '</div>';

    $.ajax({ url: path,
        data: form_data,
        type: 'POST',
        beforeSend: function(){
            $("#content-"+id).html(loading_bar);
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $("#content-"+id).html(data);


        }
    });
}

function RegresarPrepago(path, id, form) {
    var form_user = $( "#form-"+form );
    var form_data = form_user.serialize();
    var loading_bar = '<div id="loading-bar-spinner">'
        + '<div class="spinner-icon"></div>'
        + '</div>';

    $.ajax({ url: path,
        data: form_data,
        type: 'POST',
        beforeSend: function(){
            $("#content-"+id).html(loading_bar);
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $("#pas1").removeClass("text-purple").addClass("text-red");
            $("#pas2").removeClass("text-red").addClass("text-black");

            $("#content-"+form).html(data);
            $("#textoPaso").html("<p id='pas' class='text-center text-red'><span id='textoPaso' style='color:#e31d1a;'>¡Dos pasos más y será tuyo!</span></p>");
        }
    });
}

////////////////////////////// Load //////////////////////////////

function cargarPlanesPorColor(idequipo, idequipocolor, path, id) {
    document.getElementById('color-'+idequipo).value=idequipocolor;
    document.getElementById('idcolorescogido').value=document.getElementById('color-'+idequipo).value;
    $.ajax({ url: path,
        data: "idequipo="+idequipo+"&idequipocolor="+idequipocolor+"&id="+id,
        type: 'post',
        beforeSend: function(){
            $("#content-"+id).append( backdrop_modal );
            $('#modal-general').on('shown.bs.modal', function () {
                $('body').removeClass('modal-open');
                $( "body" ).css("padding-right","");
            })
            $('#modal-general').modal('show');
            $("#content-"+id).append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $("#content-"+id).html("");
            $("#content-"+id).html(data.html);
        }
    });
}

function cargarPlanesPorColorMobile(path) {
    window.location.replace(path);
}

function cargarImagenes(id, contador, idequipo) {
    var comp,i;
    id="content-"+id;
    for (i = 0; i <= contador; i++) {
        if (id=="content-"+idequipo+"-"+i)
        {
            $("#content-"+idequipo+"-"+i).addClass("active");
        }
        else
        {
            $("#content-"+idequipo+"-"+i).removeClass("active");
        }
    }

    $("#popUpImagen-"+idequipo).modal("show");
}

function cargarModalPreguntas(urlAction) {
    $.ajax({
        type:'POST',
        url: urlAction,
        success: function(data) {
            $('#modal-preguntas').innerHTML="";
            $('#modal-preguntas').html(data.html);
            $(".modal-open .modal").css("overflow-y","none!important");
            $("#modal-preguntas").modal('show');
        }});
    return false;
}

function cargarimgVermas(idurl, path, id, count, contadorimg) {
    var idimg ="";
    document.getElementById(idurl).src = path;
    for(var i=1; i <=contadorimg; i++)
    {
        if( i === count)
        {
            idimg=id+"-"+count;
            document.getElementById(idimg).style.border = "solid #e31d1a";
        }
        else
        {
            idimg=id+"-"+i;
            document.getElementById(idimg).style.border = "1px solid #E7E7E7";
        }
    }
}

////////////////////////////// Dth //////////////////////////////

function abrirPopupplanesDTH(id,url,elementos) {
    var bandenvio;
    var title = "";
    var content;
    var typo;
    var size;
    bandenvio = $('#hd_bandenvio').val();
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    if (bandenvio==0)
    {
        $.ajax({ url: url,
            data: 'equipo='+id+'&elementos='+elementos,
            type: 'post',
            beforeSend: function(){
                $('#hd_bandenvio').val(1);
                $("#content-contenido" ).append('');
                $("#content-contenido" ).append( backdrop_modal);
                $('#modal-opciones').modal('show');
                $("#content-contenido").append( loading_bar);
                $("#loading-bar-spinner").css('display','');
            },
            success: function(data){
                $("#loading-bar-spinner").remove();
                $("#modal-opciones").remove();
                $('#hd_bandenvio').val(0);
                if(data.modalOverBody) //MODAL SOBRE EL CUERPO DE LA PAGINA
                {
                    content = data.html;
                    typo = data.typeModalOverBody || 'alert';
                    size = data.sizeModalOverBody || 'xlg';
                    createModalOverBody(title, content, size, typo);
                }
            }
        });
    }
}

function irDetalleDth(ruta) {
    $('#hd_bandenvio').val(0);
    var idplanseleccionado = $('#hd_idplan').val();
    var idplancambio;
    var plan;
    var idplanxdefault;
    var idequipo = $('#hd_idequipo').val();
    var loading_bar = loading("opciones");
    var backdrop_modal = backdropmodal("opciones");
    var obj_data = {
        'equipo': idequipo,
        'planseleccionado': idplanseleccionado
    };
    var nombrequipo = $('#hd_equipodth').val();
    location.href = diredth + 'Dth/vermas/' + idequipo + '/' + nombrequipo + '/' + idplanseleccionado;
}

function irCompraDth() {
    verCargando('content-contenido');
    var idplancambio= $('#hd_idplande').val();
    var plan;
    if(idplancambio=="0")
    {
        plan = $('#hd_idplan2').val();
    }
    else
    {
        plan =  idplancambio;
    }
    var ruta;
    ruta = document.forms.planestodosdth.action;
    var idequipo = $('#hd_equipo2').val();
    var nombreequipo = $('#hd_equipodth').val();
    nombreequipo = nombreequipo.trim(" ");
    ruta = diredth+'Dth/solicitud/'+idequipo+'/'+nombreequipo+'/'+plan;

    document.forms.planestodosdth.action=ruta;
    document.getElementById('planestodosdth').submit();
}

function irCompraComparadorDth(plan,idequipo) {
    verCargando('content-contenido');
    var nombreequipo= $('#nombre-'+idequipo).val();
    var ruta;
    ruta = diredth+'Dth/solicitud/'+idequipo+'/'+nombreequipo+'/'+plan;
    location.href=ruta;
}

function ComparadorDth(path) {
    var idsEquiposComparados;
    var tam=Object.keys(selectedEquiposCompararMobile).length;
    if(tam<2)
    {
        alert("Se debe elegir al menos 2 equipos");
        return false;
    }
    else
    {
        var strEquiposComparar = "";
        var cont=0;
        for(var key in selectedEquiposCompararMobile)
        {
            if(cont==0) {strEquiposComparar=selectedEquiposCompararMobile[key]+"**"; }
            else if (cont == (tam - 1)) strEquiposComparar=strEquiposComparar+selectedEquiposCompararMobile[key];
            else strEquiposComparar=strEquiposComparar+selectedEquiposCompararMobile[key]+"**";
            cont++;
        }
        idsEquiposComparados=strEquiposComparar;
    }
    $.ajax({ url: path,
        data: 'idsEquiposComparados='+idsEquiposComparados,
        type: 'post',
        beforeSend: function(){
            $("#content-contenido").append( backdrop_modal );
            $('#modal-general').on('shown.bs.modal', function () {
                $('body').removeClass('modal-open');
                $( "body" ).css("padding-right","");
            })
            $('#modal-general').modal('show');
            $("#content-contenido").append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){

            $( "#loading-bar-spinner" ).remove();
            $("#content-contenido").html(data.html);
        }
    });
}

var selectedEquiposCompararDth = [];
var selectedEquiposCompararMobileDth =[];
function compararEquipoDth(idEquipo,band) {
    if (!Object.keys) Object.keys = function(o)
    {
        if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k=[],p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
        return k;
    }
    if(band==1)
    {

        var long=Object.keys(selectedEquiposCompararDth).length;
        $(".boxVaciosDth").remove();
        if(long==3 && document.getElementById("chk_comparar_"+idEquipo+"_dth").checked)
        {
            alert("Sólo se pueden comparar máximo 3 equipos");
            $('#chk_comparar_'+idEquipo+'_dth').attr('checked', false);
        }
        else
        {
            if(document.getElementById("chk_comparar_"+idEquipo+"_dth").checked)
            {
                if(!document.getElementById("equipoAComparardth-"+idEquipo))
                {
                    selectedEquiposCompararDth["chk_comparar_"+idEquipo+"_dth"]=idEquipo;
                    var divImgPrincipal=$("#divImgPrincipalDth-"+idEquipo).clone(false);
                    divImgPrincipal.find("*[id]").andSelf().each(function() { $(this).attr("id", $(this).attr("id") + "_cloned"); });
                    var nombreEquipo=$("#nombreEquipoDth_"+idEquipo).text();
                    $( ".boxVaciosDth" ).remove();
                    $( "#EquiposCompararDth" ).append("<div id='equipoAComparardth_"+idEquipo+"' class='col-xs-2 equipoAComparar1' data-toggle='tooltip' data-placement='bottom' title='"+nombreEquipo+"'></div>");
                    $( "#equipoAComparardth_"+idEquipo).append(divImgPrincipal);
                    $( "#divImgPrincipalDth-"+idEquipo+"_cloned").removeClass("img-fono");
                    $( "#equipoAComparardth_"+idEquipo).css("background-color","#EEEEEE");
                }
            }
            else
            {
                delete selectedEquiposCompararDth["chk_comparar_"+idEquipo+'_dth'];
                $( "#equipoAComparardth_"+idEquipo ).remove();
            }
            var numBoxVacios=3-Object.keys(selectedEquiposCompararDth).length;
            for (var i = 0; i < numBoxVacios; i++)
            {
                $( "#EquiposCompararDth" ).append("<div class='equipoAComparar1 boxEquipoAComparar boxVaciosDth'></div>");
            }
        }
    }
    else{

        var long=Object.keys(selectedEquiposCompararMobileDth).length;
        $( ".boxVaciosMobile").remove();
        if(long==3 && document.getElementById("chk_comparar_Mobile"+idEquipo+"_dth").checked)
        {
            alert("Sólo se pueden comparar máximo 3 equipos");
            $('#chk_comparar_Mobile'+idEquipo+"_dth").attr('checked', false);
        }
        else
        {
            if(document.getElementById("chk_comparar_Mobile"+idEquipo+"_dth").checked)
            {
                if(!document.getElementById( "equipoAComparar-Mobile"+idEquipo))
                {
                    selectedEquiposCompararMobileDth["chk_comparar_Mobile"+idEquipo+"_dth"]=idEquipo;
                    var divImgPrincipal=$("#divImgPrincipalDth-"+idEquipo).clone(false);
                    divImgPrincipal.find("*[id]").andSelf().each(function() { $(this).attr("id", $(this).attr("id") + "_cloned"); });
                    var nombreEquipo=$("#nombreEquipo"+idEquipo).text();
                    $( ".boxVaciosMobile" ).remove();
                    $( "#EquiposCompararMobileDth" ).append("<div id='equipoAComparar_Mobile"+idEquipo+"' class='col-xs-2 equipoAComparar1' data-toggle='tooltip' data-placement='bottom' title='"+nombreEquipo+"'></div>");
                    $( "#equipoAComparar_Mobile"+idEquipo ).append(divImgPrincipal);
                    $( "#divImgPrincipal"+idEquipo+"_cloned").removeClass("img-fono");
                    $( "#equipoAComparar_Mobile"+idEquipo ).css("background-color","#EEEEEE");
                }
            }
            else
            {
                delete selectedEquiposCompararMobileDth["chk_comparar_Mobile"+idEquipo+"_dth"];
                $( "#equipoAComparar_Mobile"+idEquipo ).remove();
            }
            var numBoxVacios=3-Object.keys(selectedEquiposCompararMobileDth).length;
            for (var i = 0; i < numBoxVacios; i++)
            {
                $( "#EquiposCompararMobileDth" ).append("<div class='equipoACompararMobile1 boxEquipoACompararMobile boxVaciosMobile'></div>");

            }
        }

    }
    $('[data-toggle="tooltip"]').tooltip();
}

function validarcomparacionDth(path, band) {
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    var idsEquiposComparados;
    var strEquiposComparar = "";
    var cont=0;
    var tam;
    if(band == 1)
    {
        tam=Object.keys(selectedEquiposCompararDth).length;

        if(tam<2)
        {
            alert("Se debe elegir al menos 2 equipos");
            return false;
        }
        else
        {
            for(var key in selectedEquiposCompararDth)
            {
                if(cont==0) {strEquiposComparar=selectedEquiposCompararDth[key]+"**"; }
                else if (cont == (tam - 1)) strEquiposComparar=strEquiposComparar+selectedEquiposCompararDth[key];
                else strEquiposComparar=strEquiposComparar+selectedEquiposCompararDth[key]+"**";
                cont++;
            }
            //alert(strEquiposComparar);
            idsEquiposComparados=strEquiposComparar;
        }
    }
    else
    {

        tam=Object.keys(selectedEquiposCompararMobileDth).length;
        if(tam<2)
        {
            alert("Se debe elegir al menos 2 equipos");
            return false;
        }
        else
        {

            var strEquiposComparar = "";
            var cont=0;
            for(var key in selectedEquiposCompararMobileDth)
            {
                if(cont==0) {strEquiposComparar=selectedEquiposCompararMobileDth[key]+"**"; }
                else if (cont == (tam - 1)) strEquiposComparar=strEquiposComparar+selectedEquiposCompararMobileDth[key];
                else strEquiposComparar=strEquiposComparar+selectedEquiposCompararMobileDth[key]+"**";
                cont++;
            }
            idsEquiposComparados=strEquiposComparar;
        }
    }
    $.ajax({ url: path,
        data: 'idsEquiposComparados='+idsEquiposComparados,
        type: 'post',
        beforeSend: function(){
            $("#content-contenido").append('');
            $("#content-contenido").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-contenido").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("#loading-bar-spinner").remove();
            $("#modal-opciones").remove();
            $("#content-contenido").html(data.html);
        }
    });

}

function regresarDth(path) {
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    $.ajax({ url: path,
        type: 'post',
        beforeSend: function(){
            $("#content-contenido").append('');
            $("#content-contenido").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-contenido").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){

            $( "#loading-bar-spinner" ).remove();
            selectedEquiposCompararDth=[];
            selectedEquiposCompararMobileDth=[];
            //selectedEquiposCompararMobile=[];
            //alert(data.html);
            $("#content-contenido").html(data.html);
        }
    });
}

////////////////////////////// Suggested //////////////////////////////

function irSugeridos(path,transaccion) {
    $.ajax({ url: path,
        data: 'transaccion='+transaccion,
        type: 'post',
        beforeSend: function(){

        },
        success: function(data){
        }
    });
}

function VerificarCodigoSugeridos(urlAction, idplan, transaccion,ban) {
    var numerocelular,codigotelefono,numero,prefijocelular,data,emailfact;

    codigotelefono =  document.getElementById("codigotel").value;
    numero= document.getElementById("phone").value;
    /*prefijocelular = document.getElementById("pref_celular").value;
   numerocelular = prefijocelular+numero;*/
    // emailfact = document.getElementById("emailfact").value;
    var loading_bar="",backdrop_modal="";

    loading_bar=loading("general");
    backdrop_modal =backdropmodal("general");

    if(numero==="")
    {
        $("#detallemensaje").html("<p class='text-center'>El numero de Télefono es requerido</p>" );
        $("#popUpMensaje").modal('show');
        return;
    }
    /*if(!validarcorreo("emailfact"))
	{
		$("#detallemensaje").html("<p class='text-center'>Ingrese un email válido.</p>");
        $("#popUpMensaje").modal('show');
        return;
	}*/
    if(codigotelefono==="")
    {
        $("#detallemensaje").html("<p class='text-center'>Ingrese el código que fue enviado a su teléfono y al correo para continuar.</p>" );
        $("#popUpMensaje").modal('show');
        return;
    }
    data={'codigotelefono':codigotelefono,'celular':numero,'idplan':idplan,'transaccion':transaccion,'transaccionCP':'renovacion-sugeridos'};
    $.ajax({
        type:'POST',
        data: data,
        url: urlAction,
        beforeSend: function( ){
            $("#content-seguridad").append( backdrop_modal );
            $('#modal-general').on('shown.bs.modal', function () {
                $('body').removeClass('modal-open');
                $( "body" ).css("padding-right","");
            })
            $('#modal-general').modal('show');
            $("#content-seguridad").append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data) {
            if(data.error===false)
            {
                if (!ban) {
                    path = root + "plan/ActualizacionSugeridos/" + idplan + "/" + transaccion+"/"+data.idtienda;
                    location.href = path;
                }
                if (ban) {
                    path = root + "plan/upgradePlan/" + transaccion;
                    location.href = path;
                }

                /* path= dirEquiposSamsung+"ActualizacionSugeridos/"+idplan+"/"+transaccion;
                                   location.href =  path;*/
            }
            else
            {
                $("#detallemensaje").html("<p class='text-center'>"+data.msg+"</p>" );
                $( "#loading-bar-spinner" ).remove();
                $( "#modal-general" ).remove();
                $("#popUpMensaje").modal('show');


            }
        }});
}

function VerificarCodigoSugeridosFP(urlAction,transaccion)
{
    var numerocelular,codigotelefono,numero,prefijocelular,data,tipo;

    codigotelefono =  document.getElementById("codigotel").value;
    tipo =  document.getElementById("tipo").value;
    //numero= document.getElementById("camtelefono").value;
    //prefijocelular = document.getElementById("phone").value;
    numerocelular = document.getElementById("phone").value;
    if(numerocelular==="")
    {
        $("#detallemensaje").html("<p class='text-center'>El numero de Télefono es requerido</p>" );
        $("#popUpMensaje").modal('show');
        return;
    }
    if(codigotelefono==="")
    {
        $("#detallemensaje").html("<p class='text-center'>Ingrese el código que fue enviado a su teléfono y al correo para continuar.</p>" );
        $("#popUpMensaje").modal('show');
        return;
    }
    data={'codigotelefono':codigotelefono,'celular':numerocelular,'code':transaccion};
    $.ajax({
        type:'POST',
        data: data,
        url: urlAction,
        beforeSend: function( ){
            $("#content-equipostienda").append( backdrop_modal );
            $('#modal-general').on('shown.bs.modal', function () {
                $('body').removeClass('modal-open');
                $( "body" ).css("padding-right","");
            })
            $('#modal-general').modal('show');
            $("#content-equipostienda").append( loading_bar );
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data) {
            if(data.error===false)
            {
                path= root+"plan/ActualizacionSugeridosFP/"+transaccion+"/"+tipo;
                location.href =  path;
            }
            else
            {
                $("#detallemensaje").html("<p class='text-center'>"+data.msg+"</p>" );
                $("#popUpMensaje").modal('show');

            }
        }});
}

function PopupConfirmacionCambioFP(idplan, nombreplan, cambio, code, url, ban2) {

    if(cambio==="CPL" || cambio==="CPR" || cambio==="FT")
    {
        realizarCambioPlanSugeridosFP(url,idplan,code,cambio,ban2);
    }
    else
    {
        actionresult = root+"plan/FormularioSugeridosFP/"+code;
        location.href =  actionresult;
    }
}

function realizarCambioPlanSugeridosFP(urlAction,idplan,transaccion,cambio,ban2) {
    var tipocambio=0;
    var ban=0;
    var error="NA"
    var loading_bar = '<div id="loading-bar-spinner" class="border-loading width-loading" style="display: none;background:white;"><div><br/></div>'
        + '<div><br/></div><div class="center-block"><img style="width:20%" class="center-block" src="'+rootImg+'images/body/etiquetas/loading.gif"> </div><div><br/></div>'
        +'<div class="text-center" style="color:black;">Estamos procesando tu transacción, </div>'
        +'<div class="text-center" style="color:black;">puede tomar unos minutos.<div><br/></div></div>'
        + '</div>';

    var msg_alert = '';
    var backdrop_modal = '<div id="modal-cambiarplan" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'

        + '<div class="modal-dialog">'
        + '</div>'
        + '</div>';
    data={'tipo':cambio,'idplan':idplan};
    $("#popUpMensajeconfirmacion").modal('hide');
    $.ajax({
        type:'POST',
        data:data,
        url: urlAction,
        beforeSend: function( ){
            $( "#modal-body" ).remove();
            if(!ban2)
            {
                $( "#content-sugeridos" ).append('');
                $( "#content-sugeridos" ).append( backdrop_modal);

                $('#modal-cambiarplan').modal('show');
                $( "#content-sugeridos" ).append( loading_bar);
                $( "#loading-bar-spinner").css('display','');
            }
        },
        success: function(data) {
            if(!ban2)
            {
                $( "#loading-bar-spinner" ).remove();
                $( "#modal-cambiarplan" ).remove();
            }else
            {
                $('#modalprocesando').modal('hide');
            }
            if(data.error)
            {
                ban=1;
            }
            if(data.errortecnico)
            {
                error="ET";
            }
            location.href=root+"plan/ConfirmacionPlanSugeridosFP/"+idplan+"/"+transaccion+"/"+ban+"/"+error;
        }
    });
}

function PopupConfirmacionCambio(idplan, nombreplan, cambio, transaccion, url, ban2) {
    if(cambio==="CPL" || cambio==="CPR")
    {
        realizarCambioPlanSugeridos(url,idplan,transaccion,cambio,ban2);
    }
    else
    {
        actionresult = root+"plan/FormularioSugeridos/"+idplan+"/"+transaccion;
        location.href =  actionresult;
    }
}

function realizarCambioPlanSugeridos(urlAction, idplan, transaccion, cambio, ban2) {
    var tipocambio=0;
    var ban=0;
    var error="NA"
    var deleteModalBody = 'S';
    var modal_size='';
    var idlogtienda = $('#hd_logtienda').val();
    var loading_bar = '<div id="loading-bar-spinner" class="border-loading width-loading" style="display: none;background:white;"><div><br/></div>'
        + '<div><br/></div><div class="center-block"><img style="width:20%" class="center-block" src="'+rootImg+'images/body/etiquetas/loading.gif"> </div><div><br/></div>'
        +'<div class="text-center" style="color:black;">Estamos procesando tu transacción, </div>'
        +'<div class="text-center" style="color:black;">puede tomar unos minutos.<div><br/></div></div>'
        + '</div>';

    var msg_alert = '';
    var backdrop_modal = '<div id="modal-cambiarplan" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'

        + '<div class="modal-dialog'+modal_size+' ">'
        + '</div>'
        + '</div>';

    $("#popUpMensajeconfirmacion").modal('hide');
    $.ajax({
        type:'POST',
        data:'tipo='+cambio+'&idlogtienda='+idlogtienda,
        url: urlAction,
        beforeSend: function( ){

            if(deleteModalBody == 'S')
            {
                $( "#modal-body" ).remove();
            }
            if(!ban2)
            {
                $( "#content-sugeridos" ).append('');
                $( "#content-sugeridos" ).append( backdrop_modal);

                $('#modal-cambiarplan').modal('show');
                $( "#content-sugeridos" ).append( loading_bar);
                $( "#loading-bar-spinner").css('display','');
            }
        },
        success: function(data) {
            modal_size = 'xsm' || 'sm';
            if(!ban2)
            {
                $( "#loading-bar-spinner" ).remove();
                $( "#modal-cambiarplan" ).remove();
            }else
            {$('#modalprocesando').modal('hide');}
            if(data.error)
            {
                ban=1;
            }
            if(data.errortecnico)
            {
                error="ET";
            }
            if (!data.msjbit){
                location.href=root+"plan/ConfirmacionPlanSugeridos/"+idplan+"/"+transaccion+"/"+ban+"/"+error + "/" + data.idcarrito + "/" + data.ban;
            }
            else
            {
                $("#popUpMensajebitacora").modal('show');
            }

            //  ban=0;


        } });
}

////////////////////////////// Flow //////////////////////////////

function flujo(opcion) {
    var source="";
    document.getElementById("opcionseleccionada").value = opcion;
    $("#continuarindex").css('background-color','#DA262C');
    if(opcion==1)
    {
        source = rootImg+"images/home/popupopcion/plannuevorojo.jpg";
        document.getElementById('plannuevo').src = source;
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarmiplan.jpg";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";

    }
    else if(opcion==2)
    {
        source = rootImg+"images/home/popupopcion/cambiarmeaclarorojo.jpg";
        document.getElementById('cambiarmeaclaro').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/plannuevo.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarmiplan.jpg";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";
    }
    else if(opcion==3)
    {
        source = rootImg+"images/home/popupopcion/renovarmiplanrojo.jpg";
        document.getElementById('renovarmiplan').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/plannuevo.jpg";
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";
    }
    else
    {
        source = rootImg+"images/home/popupopcion/pasarmeaclarorojo.jpg";
        document.getElementById('pasarmeaclaro').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/plannuevo.jpg";
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarmiplan.jpg";
    }
}

function flujoSamsung(opcion) {
    var source="";
    document.getElementById("opcionseleccionadaEquipos").value = opcion;
    $("#continuarindex").css('background-color','#DA262C');
    if(opcion==1)
    {
        source = rootImg+"images/home/popupopcion/equiponuevored.png";
        document.getElementById('plannuevo').src = source;
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarEquipo.png";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";

    }
    else if(opcion==2)
    {
        source = rootImg+"images/home/popupopcion/cambiarmeaclarorojo.jpg";
        document.getElementById('cambiarmeaclaro').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/equiponuevo.png";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarEquipo.png";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";
    }
    else if(opcion==3)
    {
        source = rootImg+"images/home/popupopcion/renovarEquipored.png";
        document.getElementById('renovarmiplan').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/equiponuevo.png";
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";
    }
    else
    {
        source = rootImg+"images/home/popupopcion/pasarmeaclarorojo.jpg";
        document.getElementById('pasarmeaclaro').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/equiponuevo.png";
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarEquipo.png";
    }
}

////////////////////////////// Devices //////////////////////////////

// Probably deprecated

function flujoEquipos(opcion) {
    var source="";
    document.getElementById("opcionseleccionadaEquipos").value = opcion;
    $("#continuarindex").css('background-color','#DA262C');
    if(opcion==1)
    {
        source = rootImg+"images/home/popupopcion/equiponuevored.png";
        document.getElementById('plannuevo').src = source;
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarEquipo.png";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";

    }
    else if(opcion==2)
    {
        source = rootImg+"images/home/popupopcion/cambiarmeaclarorojo.jpg";
        document.getElementById('cambiarmeaclaro').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/equiponuevo.png";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarEquipo.png";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";
    }
    else if(opcion==3)
    {
        source = rootImg+"images/home/popupopcion/renovarEquipored.png";
        document.getElementById('renovarmiplan').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/equiponuevo.png";
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('pasarmeaclaro').src = rootImg+"images/home/popupopcion/pasarmeaclaro.jpg";
    }
    else
    {
        source = rootImg+"images/home/popupopcion/pasarmeaclarorojo.jpg";
        document.getElementById('pasarmeaclaro').src = source;
        document.getElementById('plannuevo').src = rootImg+"images/home/popupopcion/equiponuevo.png";
        document.getElementById('cambiarmeaclaro').src = rootImg+"images/home/popupopcion/cambiarmeaclaro.jpg";
        document.getElementById('renovarmiplan').src = rootImg+"images/home/popupopcion/renovarEquipo.png";
    }
}

function ContinuarEquiposSamsung(login) {
    var tran="";
    var opcionseleccionada;
    opcionseleccionada=document.getElementById("opcionseleccionadaEquipos").value;
    if(opcionseleccionada!=0)
    {
        tran="NA";
        location.href = dirEquiposSamsung+"CatalogoSamsung/"+opcionseleccionada+"/"+tran;
    }
    else
    {
        alert("Seleccione una opcion para continuar");
    }
}

function ContinuarEquipos(login) {
    var opcionseleccionada;
    var loading_bar ="";
    var backdrop_modal = "";
    opcionseleccionada=document.getElementById("opcionseleccionadaEquipos").value;
    if(opcionseleccionada!=0)
    {
        tran="NA";
        location.href = dirEquipos+"catalogoEquipos/"+opcionseleccionada+"/"+tran;
    }
    else
    {
        alert("Seleccione una opcion para continuar");
    }
}

function ComprarEquipos(id,nombreequipo,equipocolor,idplan,opcion,cuota,formlinea,loading,estaenpromocion, flag, urlimg,trandirecta) {
    mostrarPreview('#vermasEquipo', '#content-contenido_form', urlimg);
    nombreequipo = nombreequipo.replace(/\s/g,"_");

    //var URLactual = window.location.pathname;
    var ban=false;
    if(trandirecta)
    {
        if(opcion!="nuevo")
        {
            URLactual = root+"Solicitud/"+id+"/"+equipocolor+"/"+nombreequipo+"/"+idplan+"/"+opcion+"/"+formlinea;
        }
        else
        {
            URLactual = root+"login/"+id+"/"+equipocolor+"/"+nombreequipo+"/"+idplan+"/nuevo";
        }
    }
    else
    {
        if(estaenpromocion || flag == 1)
        {
            opcion = (opcion=="nuevo") ? ((flag == 1)? "nuevo" : "LineaNuevaPromocion") : opcion;
        }
        URLactual = root+"Solicitud/"+id+"/"+equipocolor+"/"+nombreequipo+"/"+idplan+"/"+opcion+"/"+formlinea;

        if(opcion=="Financiamiento")
        {
            URLactual = root+"formulario/equipo/"+nombreequipo+"/"+id+"/"+equipocolor+"/"+6;
        }

    }
    location.href =URLactual;
}

function mostrarPlanes(path, opcion, formlinea, id, idequipocolor, urlimg) {
    $("#content-general").slideUp(2000);
    $(".imgLocation").attr("src", urlimg);

    $.ajax({ url: path,
        data: 'equipo='+id+'&opcion='+opcion+'&formline='+formlinea+'&idequipocolor='+idequipocolor,
        type: 'post',
        beforeSend: function(){
            $("#content-general").css("overflow-y","hidden");
            $("body").css("padding-right","");

            $("#content-slide").css("background-color","#F4F4F4");
            var myhtml = $("#content-contenido_plan").html();
            $("#content-slide").html(myhtml);
        },
        success: function(data){
            if(data.bandplanes)
            {
                $("#content-slide").html(data.html);
            }
            else
            {
                $("#content-vermas").hide();
                $("#content-general").show();
                $("#content-slide").html("");
                $("#popUpSinPlan").modal('show');
                $('html,body').animate({
                    scrollTop: $("#content-general").offset().top
                }, 2000);
            }

        }
    });
}

function validarcomparacionEquiposMobile(path,formlinea,opcion) {
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    var idsEquiposComparados;
    var tam=Object.keys(selectedEquiposCompararMobile).length;
    if(tam<2)
    {
        alert("Se debe elegir al menos 2 equipos");
        return false;
    }
    else
    {

        var strEquiposComparar = "";
        var cont=0;
        for(var key in selectedEquiposCompararMobile)
        {
            if(cont==0) {strEquiposComparar=selectedEquiposCompararMobile[key]+"**"; }
            else if (cont == (tam - 1)) strEquiposComparar=strEquiposComparar+selectedEquiposCompararMobile[key];
            else strEquiposComparar=strEquiposComparar+selectedEquiposCompararMobile[key]+"**";
            cont++;
        }
        idsEquiposComparados=strEquiposComparar;
    }
    $.ajax({ url: path,
        data: 'idsEquiposComparados='+idsEquiposComparados+"&formlinea="+formlinea+"&opcion="+opcion,
        type: 'post',
        beforeSend: function(){
            $("#content-contenido").append('');
            $("#content-contenido").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-contenido").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-opciones" ).remove();
            $("#content-contenido").html(data.html);
        }
    });
}

function limpiar() {
    var id_equipo_prin = $('#id_equipo_prin').val();
    var id_color_seleccionado = $('#id_color_seleccionado').val();

    var inputs = document.getElementsByTagName("input");
    for(var i=0;i<inputs.length;i++){
        inputs[i].value = "";}
    var select = document.getElementsByTagName("select");
    for(var i=0;i<select.length;i++){
        select[i].value = "";
    }

    $('#id_equipo_prin').val(id_equipo_prin);
    $('#id_color_seleccionado').val(id_color_seleccionado);
}

function verplanes(path, id, idequipo) {
    $.ajax({ url: path,
        data: 'idequipo='+idequipo,
        type: 'post',
        beforeSend: function(){
        },
        success: function(data){
            $("#content-"+id).html(data.html);
            $("#content-"+id).slideToggle(1100);

        }
    });
}

function regresarEquipos(path, opcion, formlinea) {
    var loading_bar=loading("opciones");
    var backdrop_modal=backdropmodal("opciones");
    var data={'opcion':opcion,'formlinea':formlinea};
    $.ajax({ url: path,
        data: data,
        type: 'post',
        beforeSend: function(){
            $("#content-contenido").append('');
            $("#content-contenido").append( backdrop_modal);
            $('#modal-opciones').modal('show');
            $("#content-contenido").append( loading_bar);
            $("#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $( "#loading-bar-spinner" ).remove();
            $( "#modal-opciones" ).remove();
            $("#paso1").removeClass("colorrealizado").addClass("colorrealizado");
            $("#paso1_2").removeClass("colorpactivo").addClass("colorrealizado");
            $("#paso2").removeClass("colorrealizado").addClass("colorpactivo");
            $("#paso2_2").removeClass("colorrealizado").addClass("colorpactivo");
            $("#pasodatospersonales").removeClass("fondopasos").addClass("fondopasososcuro");
            var source1 = rootImg+"images/pasoapaso/gris.png";
            var source2 = rootImg+"images/pasoapaso/rojo.png";
            var sourcebarra = direccion+"images/pasoapaso/grisaclaro.png";
            $('#imgpaso1').attr("src",source1);
            $('#imgpaso2').attr("src",source2);
            $('#barra').attr("src",sourcebarra);
            $('.modal-open').css("overflow", "scroll");
            selectedEquiposComparar=[];
            selectedEquiposCompararMobile=[];
            $("#content-contenido").html(data.html);
        }
    });
}

////////////////////////////// Pin //////////////////////////////

// Probably deprecated

function generarCodigoCorreo(urlAction) {
    var ban= true;
    var telefono ="";

    telefono =  document.getElementById("phone").value;

    cant=telefono.length;
    if(cant<10)
    {
        ban=false;
    }
    if(ban)
    {
        $.ajax({
            type:'POST',
            data: 'telefono='+telefono,
            url: urlAction,
            beforeSend: function( ){
                load();
            },
            success: function(data) {
                loaded();
                $("#detallemensaje").html("<p class='text-center'>"+data.mensaje+"</p>" );
                if(data.envio)
                {
                    $("#detallemensaje").html("<p class='text-center'>"+data.mensaje+"</p><div class=''><button id='btnok' style=' background-color: #da1d19;color: white;font-size: 18px;height: 30px;border-radius: 2px;' class='center-block ' data-dismiss='modal'>Ok</button></div>" );
                    $("#generarCodigoCorreo").css("background","#31424F");
                    $("#btncontinuarinvitado").css("background","#da1d19");
                }
                $("#popUpMensaje").modal('show');
            }});
    }
}

function VerificarCodigos(urlAction, sugeridos) {
    var codigocorreo;
    var codigotelefono;
    var numero;
    var numerocelular;
    var prefijocelular;
    var codigoplan;
    var data;
    var emailfact;
    //codigocorreo =  document.getElementById("codigoCorreo").value;
    codigotelefono =  document.getElementById("code").value;
    numero= document.getElementById("phone").value;
    //emailfact = document.getElementById("emailfact").value;
    /*prefijocelular = document.getElementById("prefix").value;*/
    //numerocelular = numero;

    if(numero==="")
    {
        $("#detallemensaje").html("<p class='text-center'>El numero de Télefono es requerido</p>" );
        $("#popUpMensaje").modal('show');
        return;
    }
    /* if(!validarcorreo("emailfact"))
		{
			$("#detallemensaje").html("<p class='text-center'>Ingrese un email válido.</p>");
			$("#popUpMensaje").modal('show');
			return;
		}	*/

    if(codigotelefono==="")
    {

        $("#detallemensaje").html("<p class='text-center'>Ingrese el código que fue enviado a su teléfono y al correo para continuar.</p>" );
        $("#popUpMensaje").modal('show');
    }
    else
    {
        $.ajax({
            type:'POST',
            data: 'codigotelefono='+codigotelefono+'&celular='+numero,
            url: urlAction,
            beforeSend: function( ){
                $("#content-equipostienda").append( backdrop_modal );
                $('#modal-general').on('shown.bs.modal', function () {
                    $('body').removeClass('modal-open');
                    $( "body" ).css("padding-right","");
                })
                $('#modal-general').modal('show');
                $("#content-equipostienda").append( loading_bar );
                $( "#loading-bar-spinner").css('display','');
                // next();

            },
            success: function(data) {
                if(data.error===false)
                {
                    $("#vista-equipos").css("display","none");
                    $("#loading-bar-spinner" ).remove();
                    path= root +"plan/Listado/3/" + data.idtienda ;
                    //location.href =  path;
                    nextRed(path);
                    next();
                }
                else
                {
                    $('#next').hide();
                    $('#content-general > .container').show();
                    $("#detallemensaje").html("<p class='text-center'>"+data.msg+"</p>" );
                    $("#popUpMensaje").modal('show');

                }
            }});
    }
}

function VerificarCodigoLogin(urlAction, urlAction2) {
    var codigopin;
    var codigoplan=0;
    var nombreplan="";
    codigopin =  document.getElementById("codigologin").value;
    codigoplan =  document.getElementById("idplanurl").value;

    if(codigoplan==="0")
    {
        if(codigopin==="")
        {
            alert("Ingrese el código PIN que fue enviado a su teléfono");
        }
        else
        {
            $.ajax({
                type:'POST',
                data: 'codigopin='+codigopin,
                url: urlAction,
                beforeSend: function( ){
                    $("#content-equipostienda").append( backdrop_modal );
                    $('#modal-general').on('shown.bs.modal', function () {
                        $('body').removeClass('modal-open');
                        $( "body" ).css("padding-right","");
                    })
                    $('#modal-general').modal('show');
                    $("#content-equipostienda").append( loading_bar );
                    $( "#loading-bar-spinner").css('display','');
                },
                success: function(data) {
                    if(data.error)
                    {
                        $("#vista-equipos").css("display","none");
                        $( "#loading-bar-spinner" ).remove();
                        $('#content-contenido').html(data.html);
                    }
                    else
                    {
                        if(data.msg==="Hubo mucho tiempo de inactividad")
                        {

                        }
                        $("#detallemensaje").html("<p class='text-center'>"+data.msg+"</p>" );
                        $("#popUpMensaje").modal('show');
                    }
                }});
        }
    }
    else
    {
        nombreplan = document.getElementById("nombreurl").value;
        nombreplan = nombreplan.replace(/ /g, "_");
        if(codigopin==="")
        {
            alert("Ingrese el código PIN que fue enviado a su teléfono");
        }
        else
        {
            $.ajax({
                type:'POST',
                data: 'codigopin='+codigopin+"&codigoplan="+codigoplan,
                url: urlAction2,
                beforeSend: function( ){
                    $("#content-equipostienda").append( backdrop_modal );
                    $('#modal-general').on('shown.bs.modal', function () {
                        $('body').removeClass('modal-open');
                        $( "body" ).css("padding-right","");
                    })
                    $('#modal-general').modal('show');
                    $("#content-equipostienda").append( loading_bar );
                    $( "#loading-bar-spinner").css('display','');
                },
                success: function(data) {
                    if(data.error)
                    {

                        location.href=root+"planes/vermas/"+codigoplan+"/"+nombreplan+"/3/"+data.transaccion+"/2";

                    }
                    else
                    {
                        if(data.msg==="Hubo mucho tiempo de inactividad")
                        {

                        }
                        $("#detallemensaje").html("<p class='text-center'>"+data.msg+"</p>" );
                        $("#popUpMensaje").modal('show');
                    }
                }});
        }
    }

}

function generarCodigoPin(urlAction, vista) {
    var telefono;
    var prefijo;
    var telefonocompleto;

    if(vista===1)
    {
        telefono =  document.getElementById("camtelefonologin").value;
        prefijo =  document.getElementById("pref_celularlogin").value;
        if(telefono!=""){
            $("#generapinlogin").css("background","#2F3D47");
            $("#btncontinuar").css("background","#da1d19");
        }
    }
    else
    {
        telefono =  document.getElementById("camtelefono").value;
        prefijo =  document.getElementById("pref_celular").value;
    }
    telefonocompleto = prefijo+telefono;

    if(telefono==="")
    {
        alert("No se ha ingresado un número de teléfono");
        return;
    }

    if(telefono.length < 7 )
    {
        alert("El número de teléfono ingresado no es válido");
    }
    else
    {
        $.ajax({
            type:'POST',
            data: 'telefono='+telefonocompleto,
            url: urlAction,
            beforeSend: function( ){
                $("#content-equipostienda").append( backdrop_modal );
                $('#modal-general').on('shown.bs.modal', function () {
                    $('body').removeClass('modal-open');
                    $( "body" ).css("padding-right","");
                })
                $('#modal-general').modal('show');
                $("#content-equipostienda").append( loading_bar );
                $( "#loading-bar-spinner").css('display','');
            },
            success: function(data) {
                if(data.mensaje=="Hubo mucho tiempo de inactividad")
                {
                    location.reload()
                }
                $("#detallemensaje").html("<p class='text-center'>"+data.mensaje+"</p>");
                if(data.envio)
                {
                    $("#detallemensaje").html("<p class='text-center'>"+data.mensaje+"</p><div class=''><button id='btnok' style=' background-color: #da1d19;color: white;font-size: 18px;height: 30px;border-radius: 2px;' class='center-block ' data-dismiss='modal'>Ok</button></div>" );
                }

                $("#popUpMensaje").modal('show');
                $("#generarCodigoPin").css("background","#31424F");

            }});
    }
}

////////////////////////////// Experience //////////////////////////////

function AbrirPopupExperiencia() {
    var calificacion;
    var experiencia;
    calificacion= document.getElementById("calificacion").value;
    $('#gridSystemModal').modal('hide');
    $('#ModalComentario').modal('show');
    if(calificacion<=6 )
    {
        $("#ModalLabel").html('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
            +"<h5 class='modal-title tamañoletras' > <img  id='emoticon'  src='"+ root +"images/experienciausuario/emoticon3.png'> Tu opinión es importante para nosotros.</h5><span class='ico-title ico-title-condiciones ico-title-advertencia'></span>");
        $("#txtexperiencia1").html('<div id="txtexperiencia1" class="text-center" style="font-family: Roboto;font-weight: bolder;">Déjanos tus comentarios, juntos podemos lograrlo.</div>');
        $("#txtexperiencia2").html('<div id="txtexperiencia2" class="text-center" style="font-family: Roboto;font-weight: bolder;"></div>');
        experiencia=1;
    }
    if(calificacion>6 && calificacion<=8 )
    {
        experiencia=2;
        $("#ModalLabel").html('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
            +"<h5 class='modal-title tamañoletras' >Queremos que tu experiencia sea excelente.<img  id='emoticon'  src='"+ rootImg +"images/experienciausuario/emoticon2.png' ></h5><span class='ico-title ico-title-condiciones ico-title-advertencia'></span>");
        $("#txtexperiencia1").html('<div id="txtexperiencia1" class="text-center" style="font-family: Roboto;font-weight: bolder;">Por favor cuéntanos en qué podemos mejorar.</div>');
        $("#txtexperiencia2").html('<div id="txtexperiencia2" class="text-center" style="font-family: Roboto;font-weight: bolder;"></div>');
    }
    if(calificacion>8)
    {
        experiencia=3;
        $("#ModalLabel").html('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
            +"<h5 class='modal-title tamañoletras'>Nos complace brindarte un excelente servicio.<img id='emoticon'  src='"+ rootImg +"images/experienciausuario/emoticon1.png' ></h5><span class='ico-title ico-title-condiciones ico-title-advertencia'></span>");
        $("#txtexperiencia1").html('<div id="txtexperiencia1" class="text-center" style="font-family: Roboto;font-weight: bolder;">Por favor déjanos tus comentarios para seguir mejorando.</div>');
        $("#txtexperiencia2").html('<div id="txtexperiencia2" class="text-center" style="font-family: Roboto;font-weight: bolder;"></div>');
    }
    document.getElementById("experiencia").value=experiencia;
    document.getElementById("calificacion").value=calificacion;
}

function Enviarexperiencia(url) {
    var experiencia,comentario,transaccion,servicio,calificacion,email,medioing;
    experiencia= document.getElementById("experiencia").value;
    comentario= document.getElementById("message-text").value;
    transaccion= document.getElementById("transaccion").value;
    servicio= document.getElementById("servicio").value;
    calificacion=document.getElementById("calificacion").value;
    email=document.getElementById("email").value;
    medioing="NA";
    if(document.getElementById("referido").checked)
    {medioing="REFERIDO";}
    if(document.getElementById("busc").checked)
    {medioing="GOOGLE";}
    if(document.getElementById("faceb").checked)
    {medioing="FACEBOOK";}
    if(document.getElementById("claro").checked)
    {medioing="CLARO.COM";}


    $.ajax({
        type:'POST',
        data:'experiencia='+experiencia+'&comentario='+comentario+'&transaccion='+transaccion+'&servicio='+servicio+'&calificacion='+calificacion+'&email='+email+'&medio='+medioing,
        url: url,
        beforeSend: function( ){
        },
        success: function(data) {
            if(data.envio)
            {
                $('#ModalComentario').modal('hide');

            }
        } });

}

function cambiarimgestado(opcion) {
    var source1;
    if(opcion==0)
    {
        source1 =  rootImg + "images/experienciausuario/Pregunta.png";
    }
    if(opcion==1)
    {
        source1 = rootImg + "images/experienciausuario/sad.png";
    }
    if(opcion==2)
    {
        source1 = rootImg + "images/experienciausuario/indiferente.png";
    }
    if(opcion==3)
    {
        source1 = rootImg + "images/experienciausuario/happy.png";
    }

    $('#idimgestado').attr("src",source1);
}

////////////////////////////// Notification //////////////////////////////

function popupnotificaciones() {
    $("#popUpNotificaciones").modal('show');
}

function enviarregistronotificacion(path) {
    var dianac,mesnac,numerocelular,pref_cell,correonot,celular,numeromax,lenght,anionac;
    dianac= document.getElementById("dianac").value;
    mesnac= document.getElementById("mesnac").value;
    anionac= document.getElementById("anionac").value;
    numerocelular= document.getElementById("numerocelular").value;
    pref_cell= document.getElementById("pref_cell").value;
    correonot= document.getElementById("correonot").value;
    servicio= document.getElementById("camservicio").value;
    celular=pref_cell+""+numerocelular;
    numeromax=numerocelular.length;
    $("#popUpFaltadatos").modal('hide');
    lenght= document.getElementById("numerocelular").maxLength;

    if(correonot !="" && numerocelular !="" && dianac !="" && mesnac !="" && anionac !="" && servicio !="")
    {
        if(!validarcorreo("correonot"))
        {
            document.getElementById("correonot").value="";
            $("#mensajevalidacion").html("Correo incorrecto");
            $("#popUpFaltadatos").modal('show');
            return false;
        }

        if(numeromax>lenght)
        {
            $("#mensajevalidacion").html("Debe ingresar solo"+lenght+" dígitos para el número celular");
            $("#popUpFaltadatos").modal('show');
            return;
        }
        else
        {
            if(lenght!=numeromax)
            {
                $("#mensajevalidacion").html("Debe ingresar "+lenght+" dígitos para el número celular");
                $("#popUpFaltadatos").modal('show');
                return;
            }
        }
        $.ajax({
            type:'POST',
            data:'dianac='+dianac+'&mesnac='+mesnac+'&celular='+celular+'&email='+correonot+'&anionac='+anionac+'&servicio='+servicio,
            url: path,
            beforeSend: function( ){
            },
            success: function(data) {
                if(data.envio)
                {
                    $("#popUpNotificaciones").modal('hide');
                    document.getElementById("dianac").value="";
                    document.getElementById("mesnac").value="";
                    document.getElementById("numerocelular").value="";
                    document.getElementById("correonot").value="";
                    //alert("Listo ya estás inscrito");
                    $("#mensajevalidacion").html("Excelente!! ya estas suscrito y serás el primero en saber de nuestras promociones!!");
                    $("#popUpFaltadatos").modal('show');
                }
                else
                {
                    $("#mensajevalidacion").html("Debe ingresar los datos solicitados");
                    $("#popUpFaltadatos").modal('show');
                }
            } });
    }
    else
    {
        //alert("Ingrese los datos necesarios");
        $("#mensajevalidacion").html("Ingrese los datos necesarios");
        $("#popUpFaltadatos").modal('show');
    }
}

function cerrarnotificacion() {
    $("#imgnotificaciones").addClass('hidden-md');
    $("#imgnotificaciones").addClass('hidden-lg');
    $("#imgnotificaciones").removeClass('visible-lg');
    $("#imgnotificaciones").removeClass('visible-md');
}

function cerrarnotificacion2() {
    $("#imgnotificaciones2").addClass('hidden-xs');
    $("#imgnotificaciones2").addClass('hidden-sm');
    $("#imgnotificaciones2").removeClass('visible-xs');
    $("#imgnotificaciones2").removeClass('visible-sm');

    $("#tooltipins").addClass('hidden-xs');
    $("#tooltipins").addClass('hidden-sm');
    $("#tooltipins").removeClass('visible-xs');
    $("#tooltipins").removeClass('visible-sm');
}

////////////////////////////// Landing //////////////////////////////

function datosLandingPromocion(path,opcion) {
    var telefono="";
    var nombres="";
    var idpromocion="";
    var idtransaccion="";

    if(opcion==1)
    {
        telefono=$('#telefono').val();
        nombres=$('#nombres').val();
        idpromocion=$('#promo').val();
        idtransaccion=$('#transaccion').val()
    }
    else
    {
        telefono=$('#telefonores').val();
        nombres=$('#nombresres').val();
        idpromocion=$('#promores').val();
        idtransaccion=$('#transaccionres').val();
    }
    telefono=telefono.trim();
    nombres=nombres.trim();
    if (telefono=="" || nombres=="" || idpromocion=="" || idtransaccion=="")
    {
        alert("Ingresa los datos necesarios");
    }
    else
    {
        if (telefono.length==10)
        {
            $("#btningresar").button('loading');
            $.ajax({
                type:'POST',
                data: 'telefono='+telefono+'&nombres='+nombres+'&idpromocion='+idpromocion+'&idtransaccion='+idtransaccion,
                dataType: 'json',
                url: path,
                beforeSend: function()
                {
                    $('body').removeClass('modal-open');
                    $( "body" ).css("padding-right","");
                },
                success: function(data){
                    $( "#loading-bar-spinner" ).remove();
                    document.getElementById("nombres").value = "";
                    document.getElementById("telefono").value = "";
                    location.href=root+"ofertas/confirmacionLiquidacion/0";
                }
            });
            return false;
        }
        else
        {
            alert("El número de celular debe tener 10 dígitos");
        }
    }
}

function datosLandingClaroTv(path, opcion){
    var telefono="";
    var nombres="";
    var apellidos="";
    var cedula="";
    var idpromocion="";
    var mensaje="";
    var validarDocumento=true;
    var esnumero=true;
    var esnumero2=true;
    if(opcion==1)
    {

        telefono=$('#telefono').val();
        nombres=$('#nombres').val();
        apellidos=$('#apellidos').val();
        cedula=$('#cedula').val();
        validarDocumento=ValidarCedula(3);
        idpromocion=$('#promo').val()
    }
    else
    {
        telefono=$('#telefonores').val();
        nombres=$('#nombresres').val();
        idpromocion=$('#promores').val();
        apellidos=$('#apellidosres').val();
        cedula=$('#cedulares').val();
        validarDocumento=ValidarCedula(4);
    }
    telefono=telefono.trim();
    nombres=nombres.trim();
    if (telefono=="" || nombres=="" || idpromocion=="" || apellidos=="" || cedula=="")
    {
        mensaje="Ingresa los datos necesarios";
        $("#mensajpopup").html("<p class='text-center'>"+mensaje+"</p>");
        $("#popUpnumero").modal('show');
        return;
    }
    else
    {       if(opcion==2)
    {
        esnumero=validateNumeros1(1);
        esnumero2=validateNumeros1(2);
        if(esnumero == false || esnumero2 == false)
        {
            mensaje="Debe ingresar números no letras";
            $("#mensajpopup").html("<p class='text-center'>"+mensaje+"</p>");
            $("#popUpnumero").modal('show');

            return;
        }
        if(telefono.length>10)
        {
            mensaje="El número de identificación debe tener 10 digitos";
            $("#mensajpopup").html("<p class='text-center'>"+mensaje+"</p>");
            $("#popUpnumero").modal('show');

            return;
        }
        if(cedula.length>10)
        {
            mensaje="El número de cedula debe tener 10 digitos";
            $("#mensajpopup").html("<p class='text-center'>"+mensaje+"</p>");
            $("#popUpnumero").modal('show');

            return;
        }
    }
        if (telefono.length==10)
        {

            if (!validarDocumento)
            {
                mensaje="Número de Identificación Incorrecto";
                $("#mensajpopup").html("<p class='text-center'>"+mensaje+"</p>");
                $("#popUpnumero").modal('show');
                return;
            }


            $.ajax({
                type:'POST',
                data: 'telefono='+telefono+'&nombres='+nombres+'&apellidos='+apellidos+'&idpromocion='+idpromocion+'&cedula='+cedula,
                dataType: 'json',
                url: path,
                beforeSend: function()
                {
                    $('body').removeClass('modal-open');
                    $( "body" ).css("padding-right","");
                },
                success: function(data){
                    $( "#loading-bar-spinner" ).remove();
                    if(opcion==1)
                    {
                        document.getElementById("nombres").value = "";
                        document.getElementById("telefono").value = "";
                        document.getElementById("apellidos").value = "";
                        document.getElementById("cedula").value = "";
                    }
                    else
                    {

                        document.getElementById("nombresres").value = "";
                        document.getElementById("telefonores").value = "";
                        document.getElementById("apellidosres").value = "";
                        document.getElementById("cedulares").value = "";
                    }

                    location.href=root+"ofertas/confirmacionLiquidacion/0";
                }
            });
        }
        else
        {
            mensaje="El número de celular debe tener 10 dígitos";
            $("#mensajpopup").html("<p class='text-center'>"+mensaje+"</p>");
            $("#popUpnumero").modal('show');
            return;
        }
    }
}

////////////////////////////// Packages //////////////////////////////

function cuentaLikesPaquetes(paquetes,path,opcion){
    var estado,equipopaque,classold,classnew;
    if(opcion==2){
        equipopaque = "paquete"+paquetes;
    }else{
        equipopaque = "paqueteMobile"+paquetes;
    }
    classold = $('#'+equipopaque).attr('class');
    if (classold=="corazonoff pull-right")
    {
        classnew = "corazonon pull-right";
        estado = 1;
    }
    else
    {
        classnew = "corazonoff pull-right";
        estado = 2;
    }
    $("#"+equipopaque).removeClass(classold).addClass(classnew);
    //agregar lista de deseos
    $.ajax({ url: path,
        data: 'IDPAQUETE='+paquetes+'&idestado='+estado,
        type: 'post',
        success: function(data){

        }
    });
}

function continuarPaquetes(form)
{
    var nombre='';
    var apellido='';
    var email='';
    var numdoc='';
    var tipodoc='';
    var provincia='';
    var celular='';
    var id="";
    var bandpaquetes=false;
    var validarDocumento=true;
    var contcelu=0;
    nombre=document.getElementById("nombre").value;
    apellido=document.getElementById("apellido").value;
    email=document.getElementById("correo").value;
    numdoc=document.getElementById("numdoc").value;
    tipodoc="CED";
    provincia=document.getElementById("provincia").value;
    celular=document.getElementById("celular").value;

    if(nombre=="")
    {
        $("#tooltipnombre").addClass('visible');
        $("#nombre").addClass('form-controlinform');
        $("#tooltipnombre").removeClass('hidden');
        $("#nombre").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(apellido=="")
    {
        $("#tooltipapellido").addClass('visible');
        $("#apellido").addClass('form-controlinform');
        $("#tooltipapellido").removeClass('hidden');
        $("#apellido").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(email=="")
    {
        $("#tooltipcorreo").addClass('visible');
        $("#correo").addClass('form-controlinform');
        $("#tooltipcorreo").removeClass('hidden');
        $("#correo").removeClass('form-control2');
        bandpaquetes=true;
    }
    else
    {
        id="correo";
        if(!validarcorreo(id))
        {
            $("#tooltipcorreo").addClass('visible');
            $("#correo").addClass('form-controlinform');
            $("#tooltipcorreo").removeClass('hidden');
            $("#correo").removeClass('form-control2');
            bandpaquetes=true;
        }
    }
    if(numdoc=="")
    {
        $("#tooltipnumdoc").addClass('visible');
        $("#numdoc").addClass('form-controlinform');
        $("#tooltipnumdoc").removeClass('hidden');
        $("#numdoc").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(tipodoc=="")
    {
        $("#tooltiptipodocumento").addClass('visible');
        $("#tipodocumento").addClass('form-controlinform');
        $("#tooltiptipodocumento").removeClass('hidden');
        $("#tipodocumento").removeClass('form-control2');
        bandpaquetes=true;
    }
    else
    {
        if(tipodoc=="CED")
        {
            validarDocumento = ValidarCedula(4);
            if (!validarDocumento)
            {
                $("#tooltipnumdoc").addClass('visible');
                $("#numdoc").addClass('form-controlinform');
                $("#tooltipnumdoc").removeClass('hidden');
                $("#numdoc").removeClass('form-control2');
                bandpaquetes=true;
            }
        }
    }
    if(provincia=="")
    {
        $("#tooltipprovincia").addClass('visible');
        $("#provincia").addClass('form-controlinform');
        $("#tooltipprovincia").removeClass('hidden');
        $("#provincia").removeClass('form-control2');
        bandpaquetes=true;
    }
    if(celular=="")
    {
        $("#tooltipcelular").addClass('visible');
        $("#celular").addClass('form-controlinform');
        $("#tooltipcelular").removeClass('hidden');
        $("#celular").removeClass('form-control2');
        bandpaquetes=true;
    }
    else
    {
        contcelu=celular.length;
        if(contcelu<10)
        {
            $("#tooltipcelular").addClass('visible');
            $("#celular").addClass('form-controlinform');
            $("#tooltipcelular").removeClass('hidden');
            $("#celular").removeClass('form-control2');
            bandpaquetes=true;
        }
    }

    if(!bandpaquetes)
    {
        if(form==1)
        {
            //verCargando('content-productomobile');
            mostrarPreview('#content-contenidofondodth','#equipment-success',null);
            document.getElementById("form-clarohogarpaquetes").submit();
        }
        if(form==2)
        {
            verCargando('content-productomobile');
            document.getElementById("form-clarohogarpromocion").submit();
        }
        if(form==3)
        {
            var urlimg = $("#img-equipo").attr('src');
            mostrarPreview('#content-vermas','#content-contenido_tpg',urlimg);
            document.getElementById("form-equipoconplan").submit();
        }
    }
}

function cambiarcombo(id) {
    var opcion;
    opcion=document.getElementById(id).value;
    if(opcion=="")
    {
        $("#tooltip"+id).addClass('visible');
        $("#"+id).addClass('form-controlinform');
        $("#tooltip"+id).removeClass('hidden');
        $("#"+id).removeClass('form-control2');
    }else
    {
        $("#tooltip"+id).addClass('hidden');
        $("#"+id).addClass('form-control2');
        $("#tooltip"+id).removeClass('visible');
        $("#"+id).removeClass('form-controlinform');

        if(opcion=="CED" || opcion=="PAS")
        {
            document.getElementById("numdoc").value="";
            $("#numdoc").removeAttr('maxlength');
            if(opcion=="CED")
            {
                $("#numdoc").attr("maxlength","10");
            }
            else
            {
                $("#numdoc").attr("maxlength","20");
            }
        }
    }
}

function cambiarInputClaroHogar(id) {
    var inputgen;
    var ban;
    var tipodoc;
    inputgen=document.getElementById(id).value;

    if(inputgen.trim()!="")
    {
        $("#"+id).removeClass('form-controlinform');
        $("#"+id).addClass('form-control2');
        $("#tooltip"+id).addClass('hidden');
        $("#tooltip"+id).removeClass('visible');
    }
    else
    {
        $("#"+id).addClass('form-controlinform');
        $("#"+id).removeClass('form-control2');
        $("#tooltip"+id).addClass('visible');
        $("#tooltip"+id).removeClass('hidden');
    }
}

function cambiarImg(obj,urldesp) {
    var equipet;
    equipet = obj.id;
    document.getElementById(equipet).src = urldesp;
    $("#"+equipet ).addClass( "position-absolute" );
    $("#"+equipet).css("z-index","1");
    $("#"+equipet).css("width","200%");
    //$("#"+equipet).css("transition","width 2s ease-in-out");
}

function cambiarImgClaroHogar(obj,urldesp) {
    var equipet;
    equipet = obj.id;
    document.getElementById(equipet).src = urldesp;
    $("#"+equipet ).addClass( "position-absolute" );
    $("#"+equipet).css("z-index","1");
    $("#"+equipet).css("width","200%");
    //$("#"+equipet).css("transition","width 2s ease-in-out");
}

function normalImg(obj,url){
    var equipet;
    equipet = obj.id;
    document.getElementById(equipet).src = url;
    $( "#"+equipet ).removeClass( "position-absolute" );
    $("#"+equipet).removeAttr('style');
}

var selectedEquiposCompararMobileR = [];
function compararEquipoMobileR(idEquipo,ban)
{
    if (!Object.keys) Object.keys = function(o)
    {
        if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k=[],p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
        return k;
    }
    if(ban)
    {
        $('#chk_comparar_Mobile'+idEquipo).attr('checked', false);
    }
    var long=Object.keys(selectedEquiposCompararMobileR).length;

    if(long==2 && document.getElementById("chk_comparar_Mobile"+idEquipo).checked)
    {
        alert("Sólo se pueden comparar máximo 2 equipos");
        $('#chk_comparar_Mobile'+idEquipo).attr('checked', false);
    }
    else
    {
        if(document.getElementById("chk_comparar_Mobile"+idEquipo).checked)
        {
            if(!document.getElementById("equipoAComparar-Mobile"+idEquipo))
            {
                selectedEquiposCompararMobileR["chk_comparar_Mobile"+idEquipo]=idEquipo;
                var divImgPrincipal=$("#divImgPrincipal-"+idEquipo).clone(false);
                divImgPrincipal.find("*[id]").andSelf().each(function() { $(this).attr("id", $(this).attr("id") + "_cloned"); });
                $( ".boxVaciosMobile" ).remove();
                $( "#EquiposCompararMobile" ).append("<div id='equipoAComparar_Mobile"+idEquipo+"' class='boxEquipo'><button class='btntiendacomparar col-xs-8 col-xs-offset-2' onclick='compararEquipoMobileR("+idEquipo+", 1);'>Cerrar</button><div id='img-resp"+idEquipo+"' class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>");
                $(divImgPrincipal).removeAttr("style");
                $( "#img-resp"+idEquipo ).append(divImgPrincipal);
                $( "#divImgPrincipal"+idEquipo+"_cloned").css("width","50%");
            }
        }
        else
        {
            delete selectedEquiposCompararMobileR["chk_comparar_Mobile"+idEquipo];
            $( "#equipoAComparar_Mobile"+idEquipo ).remove();

        }

        var long2=Object.keys(selectedEquiposCompararMobileR).length;
        if(long2==0)
        {long2=1;}
        var numBoxVacios=2-long2;
        for (var i = 1; i <=numBoxVacios; i++)
        {
            $( "#EquiposCompararMobile" ).append("<div class='boxEquipo boxVaciosMobile'><div class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>");

        }
    }
}

////////////////////////////// Content //////////////////////////////

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

function verMas(path, id, idequipo) {
    var tabs = ['fila-2','fila-4','fila-6','fila-8','fila-10'];
    var filaactual=document.getElementById("filaactiva").value;

    var idequipocolor=0;
    var valor = $("#content-"+id).css("display");

    var equipoactivoactual = document.getElementById("equipoactivo").value;
    document.getElementById("equipoactivo").value=idequipo;
    var equipoactivonuevo = document.getElementById("equipoactivo").value;

    var loading_bar = '<div id="loading-bar-spinner" style="display: none">'
        + '<div class="spinner-icon"></div>'
        + '</div>';

    var msg_alert = '';
    var backdrop_modal = '<div id="modal-'+id+'" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'

        + '<div class="modal-dialog ">'
        + '</div>'
        + '</div>';

    $("body").css("padding-right","-17px!impotant");
    $("body").removeAttr('style');
    $.ajax({ url: path,
        data: 'idequipo='+idequipo+'&id='+id+'&idequipocolor='+idequipocolor+'&equipoactivo='+equipoactivonuevo,
        type: 'post',
        beforeSend: function( )
        {
            $( "#content-equipostienda").append('');
            $( "#content-equipostienda").append( backdrop_modal);
            $( "#modal-"+id).modal('show');
            $( "#content-equipostienda").append( loading_bar);
            $( "#loading-bar-spinner").css('display','');
        },
        success: function(data){
            $("body").removeAttr('style');
            $("#content-"+id).html(data.html);
            if(equipoactivoactual==-1)
            {
                if (valor=="none")
                {
                    document.getElementById("filaactiva").value=id;
                    $("#content-"+id).slideToggle(1100);
                }
            }
            if (equipoactivoactual==idequipo)
            {
                for(var i=0; i < tabs.length; i++)
                {
                    if(tabs[i] === id)
                    {
                        $("#content-"+id).slideToggle(1100);
                        document.getElementById("filaactiva").value=id;
                    }
                }
                document.getElementById("equipoactivo").value=-1;
            }
            else
            {
                if (filaactual!="")
                {
                    if(id!=filaactual)
                    {
                        document.getElementById("filaactiva").value=id;
                        $("#content-"+filaactual).slideToggle(1100);
                        $("#content-"+id).slideToggle(1100);
                    }

                }
            }



            $( "#loading-bar-spinner" ).remove();
            $( "#modal-"+id).remove();
        }
    });
}

function generarVisitas(path, par) {
    var equipovisitado = $('#equipovisitado').val();
    var valorgenerado =  $('#valorgenerado').val();
    var opcion ='opcion='+par+'&equipo='+equipovisitado+'&valorgenerado='+valorgenerado; //1 cuando se genera por primera vez
    $.ajax({
        type: 'POST',
        url: path,
        data: opcion,
        success: function(data) {
            visitas = data.numerogenerado;
            setTimeout(function() {
                document.getElementById("equipovisitado").value=data.equipovisitas;
                document.getElementById("valorgenerado").value=data.numerogenerado;
                $("#cantidad_clientes_ingresaron").html(data.numerogenerado);
                $("#cantidad_clientes").css('display','block');
                $("#cantidad_clientes").fadeOut(12000);
            },3000);//fin timeout
        }
    });
}

function changeName(path, id, num) {
    if(num===2) {
        $('#content-name1').removeClass('col-xs-8');
        $('#li-activo').css("display", "none");
    }

    $.ajax({ url: path,
        type: 'post',
        beforeSend: function(){

        },
        success: function(data){
            $("#content-"+id).html(data);
        }
    });
}

function iropcionesPrincipal(path) {
    var loading_bar="",backdrop_modal="";
    var deleteModalBody="S";
    loading_bar=loading("irdetalle2");
    backdrop_modal =backdropmodal("irdetalle2");
    if(deleteModalBody == 'S')
    {
        $( "#modal-body" ).remove();
    }
    $( "#content-banner-postpago" ).append('');
    $( "#content-banner-postpago" ).append( backdrop_modal);
    $('#modal-irdetalle2').modal('show');
    $( "#content-banner-postpago" ).append( loading_bar);
    $( "#loading-bar-spinner").css('display','');

    location.href=path;
}

////////////////////////////// Validations //////////////////////////////
/*
var validateIdentificationNumber = function(number) {
    var prov = parseInt(number.substring(0, 2));
	if (prov < 1 || prov > 24) {
		return false;
	}
	var digit3 = number[2];
    var modulus11 = [7, 6, 5, 4, 3, 2];

    /* Natural */
  /*  if (digit3 >= 0 && digit3 <= 5) {
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
  /*  if (digit3 == 6) {
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
  /*  if (digit3 == 9) {
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
};*/

// Deprecated, they should be done with html5 validation api,
// like the 'pattern' attribute

function validarsoloNumeros(evt) {
    var charCode = evt.which || event.keyCode;
    return (charCode >= 48 && charCode <= 57) || charCode == 8 || charCode == 9;
}

function soloLetras(evt) {
    var tecla = evt.which || event.keyCode;

    if (tecla == 8 || tecla == 9 || tecla == 241 || tecla == 209) {
        return true;
    }

    var pattern = /^[a-no-z A-NO-Z]$/;
    var te = String.fromCharCode(tecla);
    return pattern.test(te);
}

function soloLetrasYnumeros(evt) {
    tecla = (evt.which) ? evt.which : event.keyCode;
    patron =/^[a-no-z A-NO-Z0-9]$/;
    te = String.fromCharCode(tecla);
    return patron.test(te);
}

function validarEmail( email ) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(email) )
        return true;
}

function validateNumeros(campo,input) {
    var RegExPattern = /^[0-9]+$/;
    var errorMessage = 'No se permiten espacios en blanco,caracteres especiales, ni letras en el campo '+input+'.';
    if ((campo.value.match(RegExPattern)) && (campo.value!='')) {
    } else {
        alert(errorMessage);
        campo.focus();
    }
}

function ValidarCedula(cedula) {
    var id = [
        'cedula',
        'camcedula',
        'cedula',
        'numdoc'
    ][cedula - 1] || 'cedulares';
    var value = document.getElementById(id).value;
    return validateIdentificationNumber(value);
}

function validateespacios(campo,input) {
    var errorMessage = 'No se permiten espacios en blanco ni caracteres especiales';
    if (campo.value!='') {
    } else {
        alert(errorMessage);
        campo.focus();
    }
}

function validateNumeros1(band) {
    var RegExPattern = /^[0-9]+$/;
    var numero;

    if(band==1)
    {
        numero=document.getElementById("telefonores").value;
        if ((document.getElementById("telefonores").value.match(RegExPattern)) && (numero!='')) {
            return true;
        } else {
            document.getElementById("telefonores").value = "";
            return false;

        }
    }
    else
    {
        numero= document.getElementById("cedulares").value;
        if ((document.getElementById("cedulares").value.match(RegExPattern)) && (numero!='')) {
            return true;
        } else {
            document.getElementById("cedulares").value = "";
            return false;
        }
    }
}

function validarsoloNumeros2(id) {
    var numero,lenght;
    var ban=0;
    var numerolength=0;
    numero = $('#'+id).val();
    numerolength=numero.length;
    lenght= document.getElementById(id).maxLength;
    if (/^([0-9])*$/.test(numero)){
        ban=1;
    }
    if(ban)
    {
        if(lenght>numerolength){
            return true;
        }
    }
    return false;
}

function validarcorreo(id)
{
    var txtemail;
    txtemail=$('#'+id+'').val();
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(txtemail)) {
        return true;
    } else {
        return false;
    }
}

function validartipodoc(evt)
{
    var tipodoc;
    var ban=false;
    /* tipodoc=document.getElementById("tipodocumento").value;
           if(tipodoc=="CED")
           {*/
    ban = validarsoloNumeros(evt);
    /*}
           else
           {
               ban= true;
           }  */
    return ban;
}

function validargenero()
{
    var ban=true;
    $("#camgenero").val("");
    if($("#camgeneromas").is(':checked'))
    {
        $("#camgenero").val("M");
    }
    else if($("#camgenerofem").is(':checked'))
    {
        $("#camgenero").val("F");
    }
    else
    {
        ban=false;
    }
    return ban;
}

function validarLugarentrega()
{
    var ban=true;
    $("#camlugaren").val("");
    if($("#camlugarendom").is(':checked'))
    {
        $("#camlugaren").val("DOM");
    }
    else if($("#camlugarentrab").is(':checked'))
    {
        $("#camlugaren").val("TRA");
    }
    else
    {
        ban = false;
    }
    return ban;
}

function validarFormaPago()
{
    var ban=true;
    $("#camforpago").val("");
    if ($("#camcuentaban").is(':checked')) {
        $("#camforpago").val("BAN");
    }
    else if ($("#camtarjetacre").is(':checked')) {
        $("#camforpago").val("TCR");
    }
    else
    {
        ban = false;
    }
    return ban;
}

function validaReferencia(txt) {
    var textoArea = document.getElementById(txt).value;
    textoArea = textoArea.trim();
    var numeroCaracteres = textoArea.length;
    var inicioBlanco = /^ /
    var finBlanco = / $/
    var variosBlancos = /[ ]+/g
    textoArea = textoArea.replace(inicioBlanco,"");
    textoArea = textoArea.replace(finBlanco,"");
    textoArea = textoArea.replace(variosBlancos," ");
    var textoAreaDividido = textoArea.split(" ");
    var numeroPalabras = textoAreaDividido.length;
    return numeroPalabras;
}

// Header

$(function() {
    var menu = document.querySelector('#menu');
    var nav = document.querySelector('#bottom nav');
    var top = document.querySelector('#top');
    var menuItems = Array.from(document.querySelectorAll('#bottom .has-children'));
    var bottomMenu = document.querySelector('#bottom .menu');

    // Change + for x, slide down the nav

    menu.onclick = function(ev) {
        menu.classList.toggle('open');
        nav.classList.toggle('open');
    };

    // When one clicked, toggle it and close the others

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

    // Hide top header and move nav up if scrolled

    addEventListener('scroll', function() {
        if (scrollY < 37) {
            top.style.display = 'flex';
            nav.classList.remove('down');
        } else {
            top.style.display = 'none';
            nav.classList.add('down');
        }
    });

    // Close desktop menu at mouse leave

    if (innerWidth > 960) {
        bottomMenu.onmouseleave = function() {
            menuItems.forEach(function(el) {
                el.classList.remove('open');
            });
        };
    }
});

// Validation

$(function() {
    var $inputs = $('[data-validate] input, [data-validate] select');

    $inputs.on('invalid', function(ev) {
        ev.preventDefault();
        var input = ev.currentTarget;
        var $input = $(input);
        $input.next('.error').remove();
        $input.after(string([
            '<div class="error">',
            input.validationMessage,
            '</div>',
        ]));
    });

    $inputs.on('blur', function(ev) {
        ev.currentTarget.checkValidity();
    });

    $inputs.on('focus', function(ev) {
        var input = ev.currentTarget;
        input.setCustomValidity("");
        $(input).next('.error').remove();
    });

    // Radio validation

    var $radios = $('[data-validate] input[type="radio"]');
    $radios.off();

    $radios.on('invalid', function(ev) {
        ev.preventDefault();
        var input = ev.currentTarget;
        var $label = $(input).parent();
        $label.siblings('.error').remove();
        $label.parent().append(string([
            '<div class="error">',
            input.validationMessage,
            '</div>',
        ]));
    });

    $radios.on('focus', function(ev) {
        $(ev.currentTarget).parent().siblings('.error').remove();
    });

    // Identification number validation

    $('[data-identification-number]').on('blur', function(ev) {
        var input = ev.currentTarget;
        if (!validateIdentificationNumber(input.value)) {
            input.setCustomValidity("Cédula inválida");
            input.checkValidity();
        }
    });
});

// Modal alert

var modalAlert;

$(function() {
    document.body.insertAdjacentHTML('beforeend', string([
        '<div id="modal-alert" class="modal fade jc-modal">',
        '<div class="modal-dialog modal-sm">',
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<div class="title">',
        '<img src="'+ rootImg +'images/body/icons/ico-title-medium.png">',
        '<span id="titleModal"></span>',
        '</div>',
        '<button type="button" class="close" data-dismiss="modal">×</button>',
        '</div>',
        '<div class="modal-body">',
        '</div>',
        '<div class="modal-footer">',
        '<button class="btn red" data-dismiss="modal">Ok</button>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ]));

    var modal = document.querySelector('#modal-alert');
    var body = document.querySelector('#modal-alert .modal-body');
    var title = document.querySelector('#modal-alert .modal-header .title #titleModal');

    modalAlert = function(html,titleModal = '') {
        body.innerHTML = html;
        title.innerHTML= titleModal;
        $(modal).modal('show');
    };

});

// Dialog

$(function() {
    $('[data-open]').click(function(ev) {
        var target = ev.currentTarget.dataset.open;
        $(target).addClass('open');
    });

    $('[data-close]').click(function(ev) {
        var target = ev.currentTarget.dataset.close;
        $(target).removeClass('open');
    });
});

var openDialog = function(target) {
    $(target).addClass('open');
};

var closeDialog = function(target) {
    $(target).removeClass('open');
};

// Loader

var load, loaded;

$(function() {
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
});

// Steps and previews

// Lazy because they need the DOM
var next, prev, cancelNext, previewById, nextMobile, prevMobile;

$(function() {
    var stepsComponent = document.querySelector('#content-general > .container .steps');

    if (!stepsComponent) {
        return;
    }

    var index = stepsComponent.dataset.stepIndex - 1;
    var steps = Array.from(stepsComponent.querySelectorAll('a'));
    var ids = steps.map(function(x) { return x.dataset.preview; });

    // Inject steps behaviour

    steps.forEach(function(el) {
        if ('preview' in el.dataset && el.getAttribute('href')) {
            el.onclick = function() {
                $('#content-general > .container').hide();
                $(el.dataset.preview).show();
            };
            el.ontouchstart = function () {
                $('#content-general > .container').hide();
                $(el.dataset.preview).show();
                setTimeout(function () {
                    window.location.href = el.href;
                }, 500);

            };

        }
    });

    // Fill

    next = function() {
        window.scrollTo(0, 0);
        var id = ids[index + 1];
        if (id) {
            $('#content-general > .container').hide();
            $(id).show();
        }
    };

    prev = function() {
        window.scrollTo(0, 0);
        var id = ids[index - 1];
        if (id) {
            $('#content-general > .container').hide();
            $(id).show();
        }
    };

    prevMobile = function(url) {
        prev();
        setTimeout(function() {
            window.location.href = url;},500);
    };

    cancelNext = function() {
        var id = ids[index + 1];
        if (id) {
            $('#content-general > .container').show();
            $(id).hide();
        }
    };

    previewById = function(id) {
        $('#content-general > .container').hide();
        $(id).show();
    };

    nextMobile = function(url) {
        next();
        setTimeout(function() {
            window.location.href = url;},500);
    };



});

var preview = function (idToShow,url){
    $('#content-general > div').hide();
    window.scrollTo(0, 0);
    $(idToShow).show();
    if (url!=null)
        location.href = url;
}

var nextRed = function(url) {
    if($(window).width() <= 767)
    {
        setTimeout(function() {
            window.location.href = url;
        },500);
    }
    else{
        window.location.href = url;
    }
};

var prevStepRed = function(url,id) {
    if($(window).width() <= 767)
    {
        if (id) {
            $('#content-general > .container').hide();
            $(id).show();
        }
        setTimeout(function() {
            window.location.href = url;
        },500);
    }
    else{
        window.location.href = url;
    }
};

var prevStep = function(accion) {
    $('#content-general > .container').hide();
    $('#prev'+accion).show();
};

var prevStepEquipment = function(accion) {

    if(accion == 2){
        var img = $('#img-equipo').attr('src');
        if(img){
            $(".imgLocation").attr("src", img);
        }
    }

    $('#vermasEquipo,#portabilidad-form,#accesorieDetail').hide();
    $('#prev-'+accion+' > div').show();
};

var prevStepDth = function(accion) {
    $('#content-general > .container-fluid > .container,#content-general > .jc-container').hide();
    $('#prev-'+accion+' > div').show();
};

// Authenticate

var authenticate;

$(function() {
    var qs = function(x) { return document.querySelector(x); };
    var login = qs('#login');
    var loginFields = Array.from(login.querySelectorAll('input'));
    var register = qs('#register');
    var registerFields = Array.from(register.querySelectorAll('input'));
    var olvidatepass = qs('#olvidat');
    var olvidatepassFields = Array.from(olvidatepass.querySelectorAll('input'));

    var ignore = function() {};
    var submit_ = ignore;
    var success_ = ignore;
    var error_ = ignore;
    authenticate = function(fs) {
        openDialog('#auth');
        var fs_ = fs || {};
        submit_ = fs_.submit || ignore;
        success_ = fs_.success || ignore;
        error_ = fs_.error || ignore;
    };

    $('#guest').click(function() {
        submit_();
        closeDialog('#auth');
        success_();
    });

    $('#login-submit').click(function() {
        if ( loginFields.every(function(x) { return x.checkValidity(); }) ) {
            submit_();
            closeDialog('#auth');

            var data = new FormData(login);
            var options = { method: 'POST', credentials: 'same-origin', body: data };
            var futureRes = fetch(root + "security/login", options);
            var futureJson = futureRes.then(function(res) { return res.json(); });

            futureJson.then(function(json) {
                if (json.error) {
                    error_();
                    openDialog('#auth');
                    modalAlert(json.msg);
                } else {
                    success_();
                }
            });
        }
    });

    var loginuser = root + "me";
    $("#btnexitform").click(function() {
        $('#hide').show();
        $('#show').hide();
        fetch(loginuser, { credentials: 'same-origin' })
            .then(function(res) { return res.json(); })
            .then(function(json) {

                if (json.ok) {
                    $('#already-email').text(json.email);
                    $('#already-id').text(json.identification);
                    $('#auth .slide-panel').css({ left: 0 });
                }else{
                    $('#auth .slide-panel').css({ left: '-100%' });
                }
            });

    });

    $('#olvidatepassword').click(function() {
        $('#olvidat').slideToggle();
    });

    var patholvidate = root + "security/olvidatepassword"
    $('#olvpass-submit').click(function() {
        if ( olvidatepassFields.every(function(x) { return x.checkValidity(); }) ) {
            load();
            var data = new FormData(olvidatepass);
            var options = { method: 'POST', credentials: 'same-origin', body: data };
            var futureRes = fetch(patholvidate, options);
            var futureJson = futureRes.then(function(res) { return res.json(); });

            futureJson.then(function(json) {
                loaded();
                if (json.error) {
                    modalAlert(json.msg);
                } else {
                    submit_();
                    closeDialog('#auth');
                    success_();
                }
            });
        }
    });

    $('#want-create').click(function() {
        $('#register').slideToggle();
    });

    $('#register-submit').click(function() {
        if ( registerFields.every(function(x) { return x.checkValidity(); }) ) {
            load();
            var data = new FormData(register);
            var options = { method: 'POST', credentials: 'same-origin', body: data };
            var futureRes = fetch(root + "security/register/user", options);
            var futureJson = futureRes.then(function(res) { return res.json(); });

            futureJson.then(function(json) {
                loaded();
                if (json.error) {
                    $('input[type="text"],input[type="email"],input[type="password"]').val('');
                    modalAlert(json.msg);
                } else {
                    submit_();
                    closeDialog('#auth');
                    success_();
                }
            });
        }
    });

    // Already logged

    var me = root + "me";
    fetch(me, { credentials: 'same-origin' })
        .then(function(res) { return res.json(); })
        .then(function(json) {

            if (json.ok) {
                $('#already-email').text(json.email);
                $('#already-id').text(json.identification);
                $('#auth .slide-panel').css({ left: 0 });
            }
        });

    $('#another').click(function() {
        load();

        var logout = root + "security/logoutTienda";
        fetch(logout, { credentials: 'same-origin' }).then(function(res) {
            if (res.ok) {
                loaded();
                $('#avatar').hide();
                $('#auth .slide-panel').css({ left: '-100%' });
            }
        });
    });

    $('#already').click(function() {
        submit_();
        closeDialog('#auth');
        success_();
    });
});

// Avatar

var avatar = function(route) {
    var routes = {
        'TiendaClaro_planes_Listado': { y: 334 },
        'TiendaClaro_producto_vermas': { parent: '#content-general > #vermasEquipo > .container' },
        'TiendaClaro_formulariocompra1': { y: 32, parent: '#content-formularioline' },
        'TiendaClaro_formulariocompra2': { y: 32, parent: '#content-formularioline' },
        'TiendaClaro_formulariocompra3': { y: 32, parent: '#content-formularioline' },
        'TiendaClaro_Dth_home': { parent: '#content-general > .container-fluid > .container' },
        'TiendaClaro_dth_vermas': { parent: '#content-general > .container-fluid > .container' },
        'TiendaClaro_portabilidad': {  parent: '#content-general > #portabilidad-form' },
        'TiendaClaro_portabilidad_registro': {  parent: '#content-general > #portabilidad-form' },
        'TiendaClaro_solicitud_dth': {  parent: '#content-general > #portabilidad-form' },
        'TiendaClaro_envio_dth' : {  parent: '#content-general > #portabilidad-form' },
        'TiendaClaro_producto_vermas_prepago': { parent: '#content-general > .jc-container > #content-vermas > .content-equipo-box-paquetes' }
    };

    var options = routes[route] || {};
    var style = function() {
        var s = "";
        if (innerWidth > 768) {
            s += options.x ? "right: " + options.x + "px; " : "";
            s += options.y ? "top: " + options.y + "px;" : "";
        }
        return s;
    };

    $(function() {
        var futureRes = fetch(root + "me", { credentials: 'same-origin' });
        var futureJson = futureRes.then(function(res) { return res.json(); });

        futureJson.then(function(json) {
            if (json.ok) {
                var container = document.querySelector(options.parent || '#content-general > .container');
                container.insertAdjacentHTML('afterbegin', string([
                    '<div id="avatar" style="' + style() + '">',
                    '<div class="wrap">',
                    '<div class="info">',
                    '<strong>' + json.firstName + ' ' + json.lastName + '</strong><br>',
                    json.identification + '<br>',
                    '<a href="' + root + 'security/logoutTienda">Cerrar sesión</a>',
                    '</div>',
                    '</div>',
                    '<div class="pic">',
                    '<div class="ball mask">',
                    '<div class="ball head"></div>',
                    '<div class="ball body"></div>',
                    '</div>',
                    '</div>',
                    '</div>'
                ]));
            }
        });
    });
};

// Chat

/*$(function() {
    setInterval(5000);

    var timeOfLastActivity;
    $(window).on('touchstart mousemove keypress', function() {
        timeOfLastActivity = new Date().getTime();
    });

    var chat = document.querySelector('#content-chat');
    setTimeout(function() {
        chat.style.display = 'block';
        setInterval(function() {
            if (new Date().getTime() - timeOfLastActivity > 5000) {
                chat.style.display = 'block';
            }
        }, 5000);
    }, 5000);
});*/

//Volver Arriba

$(function(){

    $('.boton-volver').click(function(){
        $('body, html').animate({
            scrollTop: '0px'
        }, 300);
    });

    $(window).scroll(function(){
        if( $(this).scrollTop() > 0 ){
            $('.subir-container').slideDown(300);
        } else {
            $('.subir-container').slideUp(300);
        }
    });

})


// Plans show

var plansShow = function(id, name, transaction, claroCode) {
    var showAuthenticate = function(success) {
        authenticate({
            submit: next,
            success: success,
            error: cancelNext
        });
    };

    $('[data-want]').click(function(ev) {
        var option = parseInt(ev.currentTarget.dataset.want);
        var formInLine = parseInt(ev.currentTarget.dataset.formulario);
        var tag = tags[option];

        switch (option) {
            case 1:
                if(formInLine==1){
                    openDialog('#new-line-confirm');
                    $('#new-line-confirm .red').click(function() {
                        showAuthenticate(function() {
                            next();
                            location.href = root + "plan/formulario/" + tag + "/" + id + "/" + name;
                        });
                    });
                }
                else
                {
                    next();
                    location.href = root + "plan/formulario/" + tag + "/" + id + "/" + name;
                }
                break;
            case 2:
            case 6:
                next();
                location.href = root + "plan/formulario/" + tag + "/" + id + "/" + name;
                break;
            case 3:
                idlogtienda = $('#hd_logtienda').val();
                cambiarPlan (transaction,option,id,name,idlogtienda,claroCode);
                break;
            case 4:
                if(formInLine==1){
                    showAuthenticate(function() {
                        next();
                        location.href = root + "plan/confirmar_numero/" + tag + "/" + id + "/" + name;
                    });
                }
                else
                {
                    next();
                    location.href = root + "plan/formulario/" + tag + "/" + id + "/" + name;
                }
                break;
        }
    });
}

// Plans migration confirm number

var plansMigrationConfirmNumber = function(tag, id, name) {
    var identificationNumber, phone, generateToken, token, continue_;

    $(function() {
        var qs = function(x) { return document.querySelector(x); };
        identificationNumber = qs('#identification-number'); // input
        phone = qs('#phone');  // input
        generateToken = qs('#generate-token');  // button
        token = qs('#token');  // input
        continue_ = qs('#continue');  // button
        generateToken.onclick = generateTokenClick;
        continue_.onclick = continueClick;
    });

    var generateTokenClick = function() {
        if (!identificationNumber.checkValidity() || !phone.checkValidity() ) {
            return;
        }

        // Match phone and id

        load();
        var data = new FormData();
        data.append('identificationNumber', identificationNumber.value);
        data.append('phone', phone.value.substring(2, 10)); // The api expects only the last 8 numbers
        var options = { method: 'POST', credentials: 'same-origin', body: data };
        var futureRes = fetch(root + "plan/match-phone-and-id", options);
        futureRes.then(handleMatchPhoneAndId);
    };

    var handleMatchPhoneAndId = function(res) {
        if (!res.ok) {
            loaded();
            modalAlert(string([
                "Favor procede a regularizar los datos de tu línea prepago.",
                "Para continuar la migración comunícate al *611 opción 5-3."
            ]));
            return;
        }

        // Generate token

        var body2 = JSON.stringify({ serviceNumber: phone.value.substring(2, 10), notifyFlag: "Y" });
        var options2 = { method: 'POST', credentials: 'same-origin', body: body2 };
        var futureRes2 = fetch(root + "plan/GenerateToken", options2);
        var futureJson2 = futureRes2.then(function(res) { return res.json(); });
        futureJson2.then(handleGenerateToken);
    };

    var handleGenerateToken = function(json2) {
        loaded();
        if (!json2.response.customFaultMessage) {
            modalAlert("Hemos enviado el código a tu celular");
        } else {
            modalAlert("Línea Prepago debe encontrarse activa para la migración");
        }
    };

    var continueClick = function() {
        if (!identificationNumber.checkValidity() || !phone.checkValidity() || !token.checkValidity()) {
            return;
        }

        // Validate token

        load();
        var body = JSON.stringify({ serviceNumber: phone.value.substring(2, 10), tokenNumber: token.value });
        var options = { method: 'POST', credentials: 'same-origin', body };
        var futureRes = fetch(root + "plan/ValidateToken", options);
        var futureJson = futureRes.then(function(res) { return res.json(); });
        futureJson.then(handleValidateToken);
    };

    var handleValidateToken = function(json) {
        loaded();
        if (true || !json.response.customFaultMessage) {
            $('#migration-confirm-number').text(phone.value);
            openDialog('#migration-confirm');

            $('#migration-confirm-continue').click(function() {
                location.href = root + "plan/formulario/" + tag + "/" + id + "/" + name;
                next();
                closeDialog('#migration-confirm');
            });
        } else {
            modalAlert("El NIP ingresado esta incorrecto, verificar e ingresar nuevamente.");
        }
    };
};

// Plans form

function plansForm(option, tag, id, name) {
    $(function() {
        $('#camimei').blur(function(ev) {
            load();

            var data = new FormData();
            data.append('imei', ev.currentTarget.value);
            data.append('option', option);
            var options = { method: 'POST', credentials: 'same-origin', body: data };
            var futureRes = fetch(root + "plan/validate-imei", options);
            var futureJson = futureRes.then(function(res) { return res.json() });

            futureJson.then(function(json) {
                loaded();

                if (json.SessionError) {

                    modalAlert(json.error);
                    setTimeout(function() {
                        location.href = root + "plan/confirmar_numero/" + tag + "/" + id + "/" + name;
                    },400);
                }


                if (!json.error) {
                    $('#cammarca').val(json.brand);
                    $('#cammodelo').val(json.model);
                } else {
                    modalAlert(json.error);
                }


            });
        });
    });
}

//Dth Equipment
function mostrarPlanesDth(path, urlimg) {
    $("#content-general").slideUp(400);
    $(".imgLocation").attr("src", urlimg);

    $.ajax({ url: path,
        type: 'post',
        beforeSend: function(){
            $("#content-general").css("overflow-y","hidden");
            $("body").css("padding-right","");
            $("#content-slide").css("background-color","#F4F4F4");
            var myhtml = $("#content-contenido_plan").html();
            $("#content-slide").html(myhtml);
        },
        success: function(data){
            $("#content-slide").html(data.html);
        }
    });
}

var selectedEquiposCompararNuevoDth = [];
var selectedEquiposDth = [];
function compararEquipoDthNuevo(idEquipo,ban)
{
    var maximo = 2;
    mensj="";
    if ($(window).width() <= 767){
        //maximo = 2;
        var chkcomparar = "chk_comparar_dth_";
        var box = ".boxVaciosMobile";
        var equipoAComparar = "equipoAComparar-Mobile";
        var EquiposComparar = "EquiposCompararMobile";
        var equiAComparar = "equipoAComparar_Mobile";
        var equiACom = "img-resp";
        var contentequicomp = "<div id='"+equiAComparar+idEquipo+"' class='boxEquipo'><button class='btntiendacomparar col-xs-8 col-xs-offset-2' onclick='compararEquipoDthNuevo("+idEquipo+", 1);'>Cerrar</button><div id='img-resp"+idEquipo+"' class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>"
        var contentequicomp2 = "<div class='boxEquipo boxVaciosMobile'><div class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>";
    }else{
        var chkcomparar = "chk_comparar_dth_";
        var box = ".boxVacios";
        var equipoAComparar = "equipoAComparar-";
        var EquiposComparar = "EquiposComparar";
        var equiAComparar = "equipoAComparar_";
        var equiACom = "equipoAComparar_";
        var contentequicomp = "<div id='"+equiAComparar+idEquipo+"' class='equipoACompararR boxEquipoACompararR'><img id='' class='imgcerrar cursor' onclick='compararEquipoDthNuevo("+idEquipo+",1);'  src='/images/body/etiquetas/eliminarequipo.png'/></div>";
        var contentequicomp2 = "<div class='equipoACompararR boxEquipoACompararR boxVacios'></div>";
    }
    if (!Object.keys) Object.keys = function(o)
    {
        if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k=[],p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
        return k;
    }
    if(ban)
    {
        document.getElementById(chkcomparar+idEquipo).checked = false;
    }
    var long=Object.keys(selectedEquiposCompararNuevoDth).length;
    $(box).remove();
    if(ban==0 && long==maximo && document.getElementById(chkcomparar+idEquipo).checked)
    {
        mensj ="Sólo se pueden comparar máximo "+maximo+" equipos";
        $('#mensj-comparar').html(mensj);
        $('#popUpComparacion').modal('show');

        $('#'+chkcomparar+idEquipo).prop('checked', false);
    }
    else
    {
        if(document.getElementById(chkcomparar+idEquipo).checked)
        {
            if(!document.getElementById(equipoAComparar+idEquipo))
            {
                selectedEquiposCompararNuevoDth[chkcomparar+idEquipo]=idEquipo;
                selectedEquiposDth["idequipo-"+idEquipo]=idEquipo;
                var divImgPrincipal=$("#divImgPrincipal-"+idEquipo).clone(false);
                divImgPrincipal.attr("id", "divImgPrincipal-"+idEquipo + "_cloned");
                divImgPrincipal.children("[id]").attr("id", "divImgPrincipal-"+idEquipo + "_cloned");
                $(box).remove();
                $("#"+EquiposComparar).append(contentequicomp);
                $(divImgPrincipal).removeAttr("style");
                $( "#"+equiACom+idEquipo ).append(divImgPrincipal);
                if ($(window).width() <= 767){
                    $( "#divImgPrincipal-"+idEquipo+"_cloned").css("min-height","75px");
                    $( "#divImgPrincipal-"+idEquipo+"_cloned").removeClass("imagedth");

                }else{
                    $( "#divImgPrincipal-"+idEquipo+"_cloned").addClass("center-block");
                    $( "#divImgPrincipal-"+idEquipo+"_cloned").addClass("img-responsive");
                    $( "#divImgPrincipal-"+idEquipo+"_cloned").removeClass("imagedth");
                    $( "#divImgPrincipal-"+idEquipo+"_cloned").css("padding-top","15%");
                }
            }
        }
        else
        {
            delete selectedEquiposCompararNuevoDth[chkcomparar+idEquipo];
            $( "#"+equiAComparar+idEquipo ).remove();
            delete selectedEquiposDth["idequipo-"+idEquipo];
        }
        var numBoxVacios=maximo-Object.keys(selectedEquiposCompararNuevoDth).length;
        for (var i = 0; i < numBoxVacios; i++)
        {
            $("#"+EquiposComparar).append(contentequicomp2);
        }
    }
    $('[data-toggle="tooltip"]').tooltip();
}

function validarcomparacionDthNuevo(path) {
    var idsEquiposComparados;
    var mensj ="";
    var tam=Object.keys(selectedEquiposCompararNuevoDth).length;
    if(tam<2)
    {
        mensj ="Se debe elegir al menos 2 equipos";
        $('#mensj-comparar').html(mensj);
        $('#popUpComparacion').modal('show');
        return false;
    }
    else
    {
        var strEquiposComparar = "";
        var cont=0;
        for(var key in selectedEquiposCompararNuevoDth)
        {
            if(cont==0) {strEquiposComparar=selectedEquiposCompararNuevoDth[key]+"**"; }
            else if (cont == (tam - 1)) strEquiposComparar=strEquiposComparar+selectedEquiposCompararNuevoDth[key];
            else strEquiposComparar=strEquiposComparar+selectedEquiposCompararNuevoDth[key]+"**";
            cont++;
        }
        idsEquiposComparados=strEquiposComparar;
    }

    var res = strEquiposComparar.split("**");
    $( res ).each(function(index, element) {
        var images = $('#divImgPrincipal-' + element).attr('src');
        var c = index + 1;
        $("#p" + c).attr("src", images);
        $("#p" + c + 'xs').attr("src", images);
    });
    $("body" ).css("padding-right","");
    $("#content-general").slideUp(400);
    var myhtml = $("#content-contenido_comp").html();
    $("#content-slide").html(myhtml);
    $.ajax({ url: path,
        data: 'idsEquiposComparados='+idsEquiposComparados,
        type: 'post',
        beforeSend: function(){
            $("#content-contenido").append('');
            $("#content-general").css("overflow-y","hidden");
        },
        success: function(data){
            $("#content-slide").html(data.html);

            selectedEquiposCompararNuevoDth=[];
            if ($(window).width() <= 767){
                $("input[name='comparadorEquipoMobile[]']").each( function () {
                    $("input[name='comparadorEquipoMobile[]']").prop('checked', false);
                });
            }else{
                $("input[name='comparadorEquipo[]']").each( function () {
                    $("input[name='comparadorEquipo[]']").prop('checked', false);
                });

            }
        }
    });
}

function cerrarVentanaDth(){
    if ($(window).width() <= 767){
        var maximo = 2;
        var chkcomparar = "chk_comparar_Mobile";
        var EquiposComparar = "EquiposCompararMobile";
        var contentequicomp2 = "<div class='boxEquipo boxVaciosMobile'><div class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>";
    }else{
        var maximo = 2;
        var EquiposComparar = "EquiposComparar";
        var contentequicomp2 = "<div class='equipoACompararR boxEquipoACompararR boxVacios'></div>";
    }
    $("#"+EquiposComparar).html("");
    for (var i = 0; i < maximo; i++)
    {
        $("#"+EquiposComparar).append(contentequicomp2);
    }
    $('#content-slide').html("");
    //$('#content-general').css('overflow-y','auto');
    $('#content-general').show();
    //selectedEquipos=[];
    selectedEquiposDth=[];
    $('html,body').animate({
        scrollTop: $("#content-general").offset().top
    }, 500);
}

function cerrarEquipoDth(cont, idequipo, categorias) {
    var path = $("#urladdphonempty").val();
    $.ajax({
        type: "POST",
        url: path,
        data: 'cont='+cont,
        success: function(data){
            var cant = document.getElementsByClassName('equiponum').length;
            if (cant<=1){
                if ($(window).width() <= 767){
                    var maximo = 2;
                    var chkcomparar = "chk_comparar_Mobile";
                    var EquiposComparar = "EquiposCompararMobile";
                    var contentequicomp2 = "<div class='boxEquipo boxVaciosMobile'><div class='equipoACompararRes boxEquipoACompararRes col-xs-8 col-xs-offset-2'></div></div>";
                }else{
                    var maximo = 3;
                    var chkcomparar = "chk_comparar_";
                    var EquiposComparar = "EquiposComparar";
                    var contentequicomp2 = "<div class='equipoACompararR boxEquipoACompararR boxVacios'></div>";
                }
                $("#"+EquiposComparar ).html("");
                for (var i = 0; i < maximo; i++)
                {
                    $("#"+EquiposComparar ).append(contentequicomp2);
                }
                $('#content-slide').html("");
                $('#content-general').css('overflow-y','auto');
                $("#content-general").show();
                $('html,body').animate({
                    scrollTop: $("#content-general").offset().top
                }, 500);
            }else{
                $('#id-'+cont).html(data.html);
                for(var i in categorias)
                {
                    //var id = categorias[i].id;
                    var name = categorias[i].NAMECATEGORIA;
                    if ($(window).width() <= 767){
                        var tag = "#content-"+name+"-res"+cont;
                    }else{
                        var tag = "#content-"+name+"-"+cont;
                    }
                    //console.log(tag);
                    $(tag).html('---');
                }
            }
            delete selectedEquiposDth["idequipo-"+idequipo];
        }});
}

function autocompletarDth(id, path,cont)
{
    var descripcion = $('#' + id).val();
    if (descripcion.trim() != "")
    {
        //var autocompletar = new Array();
        var descripcion2 = "";
        descripcion2 = $.trim(descripcion);
        var regexp = / +/g; /* Expresión regular para buscar todos los espacios múltiples */
        descripcion2 = descripcion;
        descripcion2 = descripcion2.replace(regexp, " ");
        $('#' + id).val(descripcion2);
        var path2 = $("#urladdphone").val();
        $.ajax({
            type: "POST",
            url: path,
            data: 'filtro=' + descripcion2,
            beforeSend: function ()
            {
                //waitingDialog.show('Espere por favor ...');
            },
            success: function (data) {
                var autocompletartexto = data.value;
                $("#" + id).autocomplete({
                    source: autocompletartexto,
                    //minLength: 1,
                    select: function (event, ui) {
                        var existe = false;
                        for (var key in selectedEquiposDth) {
                            //console.log(selectedEquipos[key]);
                            if (ui.item.id == selectedEquiposDth[key]) {
                                existe = true;
                            }
                        }
                        if (existe) {
                            mensj = "Selecciona diferentes smartv para comparar";
                            $('#mensj-compararPage').html(mensj);
                            $('#popUpComparacionPage').modal('show');
                            $("#mainSearchBox-" + cont).val("");
                            return false;
                        } else {
                            var idequipo = ui.item.id;
                            idequipo = parseInt(idequipo);
                            lookPhoneDth(idequipo, path2, cont);
                        }
                    }
                });
            }
        });
    }
}

function lookPhoneDth(idequipo, path, cont) {
    var path2 = $("#urladdphoneCompare").val();

    $.ajax({
        type: "POST",
        url: path,
        data: 'idequipo=' + idequipo + '&cont=' + cont,
        success: function (data) {
            selectedEquiposDth["idequipo-" + idequipo] = idequipo;
            $("#id-" + cont).html(data.html);


            var ids = $(".equiposVal").map(function () {
                return $(this).val();
            }).get();

            var idsComparar;
            $.each(ids, function (key, value) {

                if (key == 0) {
                    idsComparar = value;
                }
                else {
                    idsComparar += '**' + value;
                }

            });
            var arreglo = data.arreglo;
            for(var key in arreglo)
            {
                //console.log(key);
                if ($(window).width() <= 767) {
                    if ($('#content-'+key+'-res' + cont).length < 1) {
                        var id = "content-"+key+"-res" + cont;
                        $("#content-"+key+"-res").append("<div id='" + id + "' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                    }
                    $("#content-"+key+"-res" + cont).html(arreglo[key]);
                } else {
                    if ($('#content-'+key+'-' + cont).length < 1) {
                        var id = "content-"+key+"-" + cont;
                        $("#content-"+key).append("<div id='" + id + "' class='col-xs-12 col-sm-3 col-md-3 col-lg-4 margin-top-15'></div>");
                    }
                    $("#content-"+key+"-" + cont).html(arreglo[key]);
                }
            }

        }});
}

function filterDevice(path,idContent){

    precio=document.getElementById("type").value;
    equipos=document.getElementById("number").value;
    var obj_data = {'type':precio,'number':equipos};
    $.ajax({ url: path,
        data:obj_data,
        type: 'post',
        dataType: "json",
        beforeSend: function( ){
            load();
        },
        success: function(data){
            loaded();
            $(idContent).html(data.html);
        }});


}

/*ACCESORIES DEVICE*/

function verifyItemInput(input,idVerify){

    var find = true;

    if (input.length>=0){
        input.each(function () {
            if ($(this).val() == idVerify){
                find = false;
            }
        });
    }

    return find;

}

var  AddAccesorie = function(idAccesorie,name){

    var max = 3;
    var flagNewAccesorie = true;
    var listAccesories = $('input[name="carritoAccesorios[]"]');
    var flagNewAccesorie = verifyItemInput(listAccesories,idAccesorie);

    if (flagNewAccesorie){
        if (listAccesories.length < max){
            var newAccesorie = '<div id="newAccesorie-'+idAccesorie+'"><span class="accesorietitle"> + <span id="labelContAccesorie-'+idAccesorie+'"> </span>' + name.toUpperCase() +' </span><span class="removeaccesorie" onclick="removeAccesorie('+idAccesorie+')">Quitar accesorio</span><br>'
                +'<input type="hidden" name="carritoAccesorios[]" value="'+idAccesorie+'" >'
                +'<input type="hidden" name="nameAccesories[]" value="'+name+'">'
                +'<input type="hidden" name="contAccesorie[]" value="1" id="inputContAccesorie-'+idAccesorie+'">';
            $('#listAccesories').append(newAccesorie);
            if ($(window).width() <= 767 ){
                $('.container-accesories').css('padding-top' , ((listAccesories.length + 1) + 9) +'em')
            }
        }else{
            modalAlert('Puedes seleccionar hasta un máximo de 3 Accesorios diferentes');
        }
    }else{
        var AddAccesorie = $('#inputContAccesorie-'+idAccesorie);
        var contador = Number(AddAccesorie.val())+1;
        $('#labelContAccesorie-'+idAccesorie).html('('+contador+')');
        AddAccesorie.val(contador);
    }

};

function removeAccesorie(idAccesorie){

    var accesorie = $('#inputContAccesorie-'+idAccesorie);
    var accesorieCont = Number(accesorie.val());
    var listAccesories = $('input[name="carritoAccesorios[]"]');

    if (accesorieCont > 1){

        if (accesorieCont == 2){

            $('#labelContAccesorie-'+idAccesorie).html('');
            accesorie.val(1);

        }else{

            accesorieCont = accesorieCont - 1;
            $('#labelContAccesorie-'+idAccesorie).html('('+accesorieCont+')');
            accesorie.val(accesorieCont);

        }

    }else{

        if ($(window).width() <= 767 ){
            $('.container-accesories').css('padding-top' , (11 - (3 - (listAccesories.length))) +'em')
        }
        $( "#newAccesorie-"+idAccesorie ).remove();


    }

}

function changeImgById(idImg,imgSrc){

    $(idImg).attr('src',imgSrc);

}
function enviarAyuda(idplan, transaccion,urlayuda) {
    /*var loading_bar="",backdrop_modal="";
    loading_bar=loading("general");
    backdrop_modal =backdropmodal("general");
	$("#content-seguridad").append( backdrop_modal );
    $('#modal-general').modal('show');
    $("#content-seguridad").append( loading_bar );
    $( "#loading-bar-spinner").css('display','');*/
    load();
    if(urlayuda !="")
    {
        path = urlayuda;
    }
    else
    {
        path = root + "plan/ayuda/" + idplan + "/" + transaccion + "/";
    }


    location.href = path;
}

/*END ACCESORIES DEVICES*/
/* Landing otros usuarios*/
function sendataLanding(formulario, pathvalid,urlback) {
    var form_user = $("#form-" + formulario);
    var form_data = form_user.serialize();
    var formid = "form#form-" + formulario + " :input[type=text], form#form-" + formulario + " :input[type=email], form#form-" + formulario + " :input[type=tel],form#form-" + formulario + " select";
    var invalid = false; //true si existe algun campo vacio
    var formapago = $('input[name=formapago]:checked').val() || "";
    var ocupacion = $("#ocupacion").val() || "";
    //var pathimage = imagen || "";

    $(formid).each(function () {
        var pass = true;
        var id = $(this).attr('id');

        if (formapago == "BAN") {
            if (id == "tarjeta" || id == "numtarjeta" || id == "fechcadmes" || id == "fechcadanio" || id == "codigoseg" || id == "nomtarjeta") {
                pass = false;
            }
        }
        if (formapago == "TCR") {
            if (id == "camentfin" || id == "camtipcuenta" || id == "campnumcuenta") {
                pass = false;
            }
        }
        if (ocupacion == "Estudiante" || ocupacion == "Negocio Propio" || ocupacion == "Otros") {
            if (id == "codteletrabajo" || id == "camteletrab" || id == "extension") {
                pass = false;
            }
        }
        if (ocupacion == "Empleado") {
            if (id == "extension") {
                pass = false;
            }
        }

        if (pass) {
            var input = $("#" + id).val();
            if (input.trim() != "")
            {
                $("#" + id).removeClass('form-controlinform');
                $("#" + id).addClass('form-control2');
                $("#tooltip" + id).addClass('hidden');
                $("#tooltip" + id).removeClass('visible');
            }
            else
            {
                $("#" + id).addClass('form-controlinform');
                $("#" + id).removeClass('form-control2');
                $("#tooltip" + id).addClass('visible');
                $("#tooltip" + id).removeClass('hidden');
                invalid = true;
            }
        }
    });

    if (!invalid) {
        var seguir = true;
        var bantdoc = false;
        var msg = "";
        var tipodoc = $("#tipodocumento").val() || false;
        if (!tipodoc || tipodoc == "CED")
        {
            var cedula = $("#numdoc").val() || false;
            bantdoc = true;
        }
        if (bantdoc)
        {
            if (cedula) {
                seguir = ValidarCedula(4);
                if (!seguir) {
                    msg = "El número de cédula es inválido.";
                }
            }
        }
        if (seguir) {
            var camdireccion = $("#camdireccion").val() || false;
            var camreferencia = $("#camreferencia").val() || false;
            if (camdireccion && camreferencia) {
                var palabrasdir = validaReferencia("camdireccion");
                var palabrasref = validaReferencia("camreferencia");
                if (palabrasdir < 2) {
                    msg = "Ayúdanos con más detalles en el campo Dirección.";
                    seguir = false;
                } else if (palabrasref < 2) {
                    msg = "Ayúdanos con más detalles en el campo Referencia.";
                    seguir = false;
                }
            }
        }

        if (seguir) {
            var terminos = ($("#terminosycondiciones").length > 0) ? true : false;
            if (terminos) {
                if ($("#terminosycondiciones").is(':checked')) {
                    var recaptcha = ($("#g-recaptcha-response").length > 0) ? true : false;
                    if (recaptcha) {
                        var recaptchaval = $("#g-recaptcha-response").val();
                        if (recaptchaval == "") {
                            msg = 'Demuestra que no eres un robot';
                            grecaptcha.reset();
                            seguir = false;
                        }
                    }
                } else {
                    msg = 'Primero, aceptemos los T&eacute;rminos y Condiciones';
                    grecaptcha.reset();
                    seguir = false;
                }
            }
        }

        if (seguir) {
            $.ajax({url: pathvalid,
                data: form_data,
                type: 'post',
                beforeSend: function () {
                },
                success: function (data) {
                    if (data.error) {
                        var msg_alert = alert_bootstrap(formulario, 'Atenci&oacute;n', data.msg, 'sm', 'alert');
                        $("#landop").append(msg_alert);
                        $('#modal-' + formulario).modal('show');

                    } else if (data.redirect) {
                        var msg_alert = alert_bootstrap(formulario, 'Atenci&oacute;n', data.msg, 'sm', 'alert');
                        $("#landop").append(msg_alert);
                        $('#modal-' + formulario).modal('show');
                        setTimeout(function () {
                            window.location.href = urlback;
                        }, 2000);

                    }
                },
                error: function () {
                    var msg_alert = alert_bootstrap(formulario, 'Atenci&oacute;n', 'Ocurrio un error inesperado, vuelva a intentarlo mas tarde', 'sm', 'alert');
                    $("#landop").append(msg_alert);
                    $('#modal-' + formulario).modal('show');
                }
            });
        } else {
            var msg_alert = alert_bootstrap(formulario, 'Atenci&oacute;n', msg, 'sm', 'alert');
            $("#landop").append(msg_alert);
            $('#modal-' + formulario).modal('show');
        }
    }
}
function obteneroferta(id,descripcion,urlimg)
{
    $("#form-lop").removeClass('scale-in-center');
    var tag ="<div class='col-md-5 col-xs-4 col-sm-3'><img id='img-oferta' style='width: 20%;' class='center-block img-responsive' src=''></div>\n\
            <div class='col-md-6 col-xs-8 col-sm-6' id='oferta' style='font-size:1.4em;'>"+descripcion+"</div>";
    urlimg = root + urlimg;
    document.getElementById("idoferta").value =  id;
    document.getElementById("promocionseleccionada").innerHTML="";
    $("#promocionseleccionada").append(tag);
    $("#img-oferta").attr('src',urlimg);
    $("#promoSelec").removeClass('hidden');
    scrolltopTienda('form-landing');

}
function scrolltopTienda(id)
{
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top
    }, 1000);
    $("#form-lop").addClass('scale-in-center');
}
/*Landing otros usuarios*/
var globalValidateToken = function (form, buttonSubmit, successFunction = null){

    $('#container-verify-code').hide();

    $(buttonSubmit).prop("disabled",true);

    $('#btn-g-pin').click(function () {
        var numberInput = document.getElementById('phone');
        var planTargetInput = document.getElementById('plan-target');
        if (numberInput.checkValidity()) {
            var randomInput = document.getElementById('random');
            ///plan/GenerarCodigoCorreo
            $.ajax({
                type: $(form).attr('method'),
                data: 'phone=' + numberInput.value + '&plan=' + planTargetInput.value + (randomInput ? '&oferta=' + randomInput.value : ''),
                url: $(form).data('genpin'),
                beforeSend: function () {
                    load();
                },
                success: function (data) {
                    loaded();
                    if (!data.error) {
                        modalAlert(data.message);
                        $(buttonSubmit).prop("disabled", false);
                        $('#btn-g-pin').prop('disabled', true)
                        countdown(60, '.countdown-container', function () {
                            $('#btn-g-pin').prop('disabled', false)
                            $('.countdown-container').hide();
                        });
                        $('.countdown-container,#container-verify-code').show();
                    } else {
                        $('#container-verify-code').hide();
                        modalAlert(data.message);
                    }
                },
                error: function () {
                    $('#container-verify-code').hide();
                    loaded();
                    modalAlert('Hubo un error al generar el código PIN. Inténtelo nuevamente en unos minutos.');
                }
            });
        }
    });

    $(buttonSubmit).click(function () {
        var validateForm = document.querySelector(form);
        var validateTokensFields = Array.from(validateForm.querySelectorAll('input'));
        if ( validateTokensFields.every(function(x) { return x.checkValidity(); }) ) {
            var phone = document.getElementById('phone');
            var code = document.getElementById('code');
            var data = $(form).serialize();
            $.ajax({
                type: $(form).attr('method'),
                data: data,
                url: $(form).data('valpin'),
                beforeSend: function () {
                    load();
                },
                success: function (data) {
                    if (!data.error) {
                        if (typeof successFunction === "function") {
                            successFunction();
                        } else {
                            $(form).submit();
                        }
                    } else {
                        loaded();
                        modalAlert(data.message);
                    }
                },
                error: function () {
                    loaded();
                    modalAlert('Hubo un error al validar el código PIN. Inténtelo nuevamente en unos minutos.');
                }
            });
        }
    });
};

/**/
/*Js para el landing de encuestas*/
function validarTrivia() {

    var flag = true;

    $(".pregunta").each(function (index, value) {

        var idPregunta = $(this).attr('id');
        var esobligatorio = $("#esoblig-" + idPregunta).val();
        var opcion_selected = $('input[name=opcion' + idPregunta + ']:checked').val();

        if (!opcion_selected && esobligatorio=="1")
        {
            flag = false;
            $("#req" + idPregunta).show();
        } else {
            $("#req" + idPregunta).hide();
        }

    });

    return flag;

}
function grabarTrivia(url) {

    var validacion = validarTrivia();
    var opcion_selected = "";
    if (validacion) {

        var respuestas = [];
        $(".pregunta").each(function (index, value) {

            var row = {};

            var idPregunta = $(this).attr('id');
            var esobligatorio = $("#esoblig-" + idPregunta).val();
            opcion_selected = $('input[name=opcion' + idPregunta + ']:checked').val();
            if(opcion_selected==undefined)
            {
                opcion_selected = "NA";
            }

            row.pregunta = idPregunta;
            row.respuesta = opcion_selected;

            respuestas.push(row);

        });

        var user = localStorage.getItem("user");

        var parametros = {
            "respuestas": respuestas,
            "user" : user
        };

        $.ajax({
            type: 'post',
            url: url,
            data: parametros,
            dataType: "json",
            beforeSend: function () {

                $('.loading').show();

            },
            success: function (data) {

                if (data.error) {

                    $("#mensajevalidacion").html(data.msg);
                    $("#myModal").modal();

                } else {
                    $('.loading').hide();
                    location.href = data.url;
                }

            },
            error: function (e) {

                $('.loading').hide();
                $("#mensajevalidacion").html('Ocurrió un error. Por favor, intenta nuevamente.');
                $("#myModal").modal();


            }
        });

    }
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


        if (element.name == 'telefono') {
            var cel = element.value;
            if (cel.length < 10)
            {
                $("#tool-" + element.name).fadeIn();
                $("#" + element.name).addClass('requerido');
            }


        }

    });

    return flag;
}
function guardarDatos(form) {

    var formData = $("#"+form).serializeArray();
    var validaForm = validarFormulario(formData);
    var validaCorreo = validarcorreoenc('correo');
    var cedula = $("#cedula").val();
    var validacedula = validarcedulaenc(cedula);

    if (validaForm && validaCorreo && validacedula) {
        var url = $('#'+form).attr('action');
        var parametros = formData;

        $.ajax({
            type: 'post',
            url: url,
            data: parametros,
            dataType: "json",
            beforeSend: function () {
                $('.loading').show();
            },
            success: function (data) {
                if (localStorage.getItem("user") !== null) {
                    localStorage.removeItem("user");
                }
                $('.loading').hide();

                if (data.error) {
                    $("#mensajevalidacion").html(data.msg);
                    $("#myModal").modal();
                } else {

                    if (data.id > 0) {

                        localStorage.setItem("user", data.id);
                        location.href = data.url;
                    } else {
                        $("#mensajevalidacion").html('Ocurrió un error. Por favor, intenta nuevamente.');
                        $("#myModal").modal();
                    }

                }

            },
            error: function (e) {

                $('.loading').hide();
                $("#mensajevalidacion").html('Ocurrió un error. Por favor, intenta nuevamente.');
                $("#myModal").modal();

            }
        });
    }
}
function validarcedulaenc(cedula)
{

    var i;
    var acumulado;
    var instancia;
    acumulado = 0;
    for (i = 1; i <= 9; i++)
    {
        if (i % 2 != 0)
        {
            instancia = cedula.substring(i - 1, i) * 2;
            if (instancia > 9)
                instancia -= 9;
        }
        else
            instancia = cedula.substring(i - 1, i);
        acumulado += parseInt(instancia);
    }
    while (acumulado > 0)
        acumulado -= 10;
    if (cedula.substring(9, 10) != (acumulado * -1))
    {
        $("#tool-cedula").fadeIn();
        $("#cedula").addClass('requerido');
        return false;

    }
    return true;
}
function validarcorreoenc(correo)
{
    var txtemail = $("#" + correo).val();
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(txtemail)) {

        $("#tool-" + correo).fadeOut();
        $("#" + correo).removeClass('requerido');
        return true;

    } else {

        $("#tool-" + correo).fadeIn();
        $("#" + correo).addClass('requerido');
        return false;
    }
}

function deleteItems(id,valor,section)
{
    var stringData="CARRITO:";
    removeItemCotizador(id,valor,section);
    $('#inforitem-'+id).remove();
    $.each($('.infoequipos'),function (index, value) {
        stringData += value.value + "|";
    });
    $('#stringData').val(stringData);
    updateTableCart()
}

function updateTableCart() {
    if($('tr#row-btn-show-more-table').length>0){
        var itemsTable = $('tr.item-table')
        if(itemsTable.length<=2){
            $('tr#row-btn-show-more-table').remove();
            itemsTable.removeClass('accordion-table')
        }else{
            itemsTable.each(function (index,value) {
                if(index>=2){
                    if (!$(this).hasClass('accordion-table'))
                        $(this).addClass('accordion-table')
                }else {
                    if ($(this).hasClass('accordion-table'))
                        $(this).removeClass('accordion-table')
                }
            });
        }
    }
}

function cambiarPlan (transaction,opcion,id,name,idlogtienda,claroCode){
    if (transaction == 'NA') {
        next();
        location.href = root + "plan/formulario/" + tags[opcion] + "/" + id + "/" + name;
    } else {
        openDialog('#change-plan-confirm');
        $("#change-plan-confirm .red")[0].onclick = null;
        $('#change-plan-confirm .red').click(function() {
            next();
            closeDialog('#change-plan-confirm');
            var data = new FormData();
            data.append('tipo', transaction);
            data.append('idlogtienda', idlogtienda);
            var options = { method: 'POST', credentials: 'same-origin', body: data };
            var futureRes = fetch(root + "plan/CambiarPlan/" + claroCode, options);
            var futureJson = futureRes.then(function(res) { return res.json(); });

            futureJson.then(function(json) {
                var flag = json.error ? 1 : 0;
                var error = json.errortecnico ? 'ET' : 'NA';
                //location.href = root + "/plan/RptaCambioPlan/" + id + "/" + name + "/" + transaction + "/" + 0 + "/" + flag + "/" + error + "/" + json.idcarrito;
                if (!json.msjbit){
                    location.href = root + "plan/RptaCambioPlan/" + id + "/" + name + "/" + transaction + "/" + 0 + "/" + flag + "/" + error + "/" + json.idcarrito;
                }
                else
                {
                    $("#popUpMensajebitacora").modal('show');
                }
            });
        });
    }
}

function goCambiate(){
    var nombres = $("#nombres").val();
    nombres = nombres.trim();
    var celular = $("#celular").val();
    celular = celular.trim();
    var cedula = $("#cedula").val();
    cedula = cedula.trim();
    $(".inputransparent").css("border-bottom","1px solid black");
    var valido = true;
    $("#leyend1,#leyend2,#leyend3").css("display","none");
    if(nombres==""){
        $("#nombres").css("border-bottom","1px solid red");
        $("#leyend1").css("display","block");
        valido = false;
    }
    if(celular==""){
        $("#celular").css("border-bottom","1px solid red");
        $("#leyend2").css("display","block");
        valido = false;
    }
    var valido = ValidarCedula(1);
    if(cedula==""||!valido){
        $("#cedula").css("border-bottom","1px solid red");
        $("#leyend3").css("display","block");
        valido = false;
    }
    var url = $("#urlcambiateaclaro").val();
    if(valido){
        $.ajax({
            type: 'post',
            url: url,
            data: "nombres="+nombres+"&celular="+celular+"&cedula="+cedula,
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                if(data.error){
                    alert(data.msg);
                }else{
                    document.getElementById("form-cambiateaclaro").reset();
                    $("#modal-cambiateaclaro").modal("hide");
                    $("#modal-congratulations").modal("show");
                }

            },
            error: function (e) {
                alert("Ha ocurrido un error, por favor intenta nuevamente.");
            }
        });
        $("body").css("padding-right","");
    }
}

function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

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

//Boton Te Llamamos
$(function() {

    //Buscador
    $("[data-search-target]").on('keyup',  function (e) {
        toSearch = $(this).val().toLowerCase();
        elementsToSearch = $(e.target.dataset.searchTarget).find("[data-search-item]");
        $(elementsToSearch).each(function () {
            if ($(this).filter('[data-search-item *= ' + toSearch + ']').length > 0 || toSearch.length < 1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });


	$('#btn-floating-callback,.btn-floating-callback').click(function(){
		$('.boton-volver-cb').hide();
		$(".contenido-cb").show();
	});

	$('#btn-callback').on('click',function() {

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


/************* FUNCIONALIDAD DE NUEVA SECCIÓN DE PORTABILIDAD *************/

function appendPlanes(planes, id_element, min_price, max_price) {
    var ya_planes = [];
    load();
    $(id_element + ' .nav-catalog, '+ id_element + ' .tab-content').empty();
    $(planes).each(function (i, plan) {
        var id_plan = (plan.TIPO.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')).replace(/\s/g, '_');
        var nombre_plan = plan.TIPO.charAt(0).toUpperCase() + plan.TIPO.slice(1).toLowerCase();
        if(!ya_planes.includes(plan.TIPO)) {
            ya_planes.push(plan.TIPO);
            $(id_element + ' .nav-catalog').append('<li><a data-toggle="tab" href="#' +id_plan + '" aria-expanded="false">' + nombre_plan + '</a></li>');
            $(id_element + ' .tab-content').append('<div id="' + id_plan + '" class="tab-pane fade in"><div class="content-catalog"></div></div>');
        }
        appendPlan(plan, id_element + ' .tab-content #' + id_plan + ' .content-catalog', id_plan);
    });
    $('.container-tooltip').filter(function() {
        return Number.parseFloat($(this).attr("data-price")) >= Number.parseFloat(min_price)-1 && Number.parseFloat($(this).attr("data-price")) <= Number.parseFloat(max_price)+1;
    }).show();
    $(ya_planes).each(function (i, tipoplan) {
        var id_plan = (tipoplan.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')).replace(/\s/g, '_');
        if($(id_element + ' .tab-content #' + id_plan + ' .content-catalog .container-tooltip').filter(function () {
            return $(this).css('display') != 'none';
        }).length === 0) {
            $(id_element + ' .nav-catalog li a[href="#' + id_plan + '"]').hide();
        }

    });
    var mostrandose = $(".content-catalog .hoverShadow").filter(function() { return $(this).css("display") != "none" }).length;
    if(mostrandose != planes.length)
        $('a.show-all-planes').show();
    else
        $('a.show-all-planes').hide();
    $('a.show-min-planes').hide();
    $(id_element + ' .nav-catalog,' + id_element + ' .tab-content').removeClass('hidden');
    $('.tab-pane').removeClass('active');
    var first = false;
    $(id_element + ' .nav-catalog li a').each(function () {
        $(this).parent().removeClass('active');
        if(!first && $(this).css('display') !== 'none') {
            $(this).click();
            first = !first;
        }
    });
    loaded();
}
function appendPlan(plan, id_parent, tipo_plan) {
    var tarifa_sin_imp = (parseFloat(plan.VALOR_SIN_IMP).toFixed(2)).replace('.', ',');
    var tarifa_sin_imp_parts = tarifa_sin_imp.split(',');
    var tarifa_con_imp = (parseFloat(plan.VALOR_CON_IMP).toFixed(2)).replace('.', ',');
    var html_gigas = '', html_incluye = '', html_promociones = '', html_suscripciones = '';
    var giga_cant = 0, promociones = [], suscripciones = [], otros = [], promociones_all = [];
    var giga_frase = '', giga_descripcion = '', giga_img = '';
    for (var feature in plan.INCLUYE){
        var promo = plan.INCLUYE[feature];
        if(promo.NOMBRE.includes("GIGA") && !promo.NOMBRE.includes("CLARO VIDEO")) {
            var cantidad = Number.isNaN(Number.parseFloat(promo.CANTIDAD)) ? 0 : Number.parseFloat(promo.CANTIDAD);
            giga_cant += cantidad;
            giga_frase += Number.isNaN(Number.parseFloat(promo.CANTIDAD)) ? promo.CANTIDAD : '';
            giga_descripcion += (giga_descripcion !== '' ? '<br>' : '') + (Number.isNaN(Number.parseFloat(promo.CANTIDAD)) ? '' : (Number.parseFloat(promo.CANTIDAD) + ' ').replace('.', ',')) + (promo.DESCRIPCION.includes("ADICIONALES") ? 'GIGA' +(cantidad > 1 ? 'S' : '') + ' POR ' + promo.VIGENCIA.trim() : (promo.VIGENCIA === null ? (cantidad > 1 ? 'GIGAS INCLUIDOS' : 'GIGA INCLUIDO') : promo.DESCRIPCION));
            giga_img = promo.URIMGLANDING !== '' ? promo.URIMGLANDING.replace('.png', '.svg') : giga_img;
        } else if(promo.NOMBRE.includes("BONO PORTABILIDAD")) {
            var cantidad = Number.parseFloat(promo.DESCRIPCION.replace("GIGA PORTABILIDAD", '').trim());
            if(!Number.isNaN(cantidad)) {
                giga_cant += cantidad;
                giga_descripcion += (giga_descripcion !== '' ? '<br>' : '') + cantidad + ' GIGA POR ' + promo.VIGENCIA.trim();
            }
        } else if(promo.IDTIPOSERVICIO == 1 && promo.CANTIDAD !== null) {
            html_incluye +=
                '<div class="row center-flex">' +
                '   <div class="col-xs-2">' +
                '   <img class="img-responsive" src="' + rootImg + promo.URIMGLANDING.replace('.png', '.svg') + '" alt="">' +
                '   </div>' +
                '   <div class="col-xs-5">' +
                '       <span style="font-size: ' + (Number.isNaN(Number.parseFloat(promo.CANTIDAD)) ? '1.4em' : '1.8em') + '; font-weight: bold">' + promo.CANTIDAD + '</span>' +
                '   </div>' +
                '   <div class="col-xs-5" style="line-height: 0.9em">' +
                '       <span>' + promo.DESCRIPCION + '</span>' +
                '   </div>' +
                '</div>';
        }
        else if(promo.IDTIPOSERVICIO == 2) {
            promociones.push(
                '<div class="col-xs-6 center-flex">' +
                '   <div class="col-xs-4" style="padding-right: 5px">' +
                '   <img class="img-responsive" src="' + rootImg + (promo.DESCRIPCION.includes('CLARO') ? promo.URIMGLANDING : promo.URIMGLANDING.replace('.png', '.svg')) + '" alt="">' +
                '   </div>' +
                '   <div class="col-xs-8" style="line-height: 0.9em">' +
                '       <p class="catalog-item-title">' +  (promo.CANTIDAD != null ? promo.CANTIDAD : (promo.VIGENCIA != null ? promo.VIGENCIA : 'PROMOCIÓN')) + '</p>' +
                '       <p class="catalog-item-subtitle">' + promo.DESCRIPCION + '</p>' +
                '   </div>' +
                '</div>'
            );
        }
        else if(promo.IDTIPOSERVICIO == 4) {
            suscripciones.push(
                '<div class="col-xs-6 center-flex">' +
                '   <div class="col-xs-4" style="padding-right: 5px">' +
                '   <img class="img-responsive" src="' + rootImg + (promo.DESCRIPCION.includes('SUSCRIPCIÓN') ? promo.URIMGLANDING : promo.URIMGLANDING.replace('.png', '.svg')) + '" alt="">' +
                '   </div>' +
                '   <div class="col-xs-8" style="line-height: 0.9em">' +
                '       <p class="catalog-item-title">' +  (promo.VIGENCIA == null ? (promo.CANTIDAD != null ? promo.CANTIDAD : 'PROMOCIÓN') : promo.VIGENCIA) + '</p>' +
                '       <p class="catalog-item-subtitle">' + promo.DESCRIPCION + '</p>' +
                '   </div>' +
                '</div>'
            );
        } else {
            if(promo.NOMBRE.includes('CLARO')) {
                suscripciones.push(
                    '<div class="col-xs-6 center-flex">' +
                    '   <div class="col-xs-4" style="padding-right: 5px">' +
                    '   <img class="img-responsive" src="' + rootImg + promo.URIMGLANDING + '" alt="">' +
                    '   </div>' +
                    '   <div class="col-xs-8" style="line-height: 0.9em">' +
                    '       <p class="catalog-item-title">' +  (promo.VIGENCIA == null ? (promo.CANTIDAD != null ? promo.CANTIDAD : 'PROMOCIÓN') : promo.VIGENCIA) + '</p>' +
                    '       <p class="catalog-item-subtitle">' + promo.DESCRIPCION + '</p>' +
                    '   </div>' +
                    '</div>'
                );
            } else if(promo.DESCRIPCION !== undefined && promo.DESCRIPCION.includes('PORTABILIDAD')) {
                otros.push(
                    '<div class="col-xs-6 center-flex">' +
                    '   <div class="col-xs-4" style="padding-right: 5px">' +
                    '   <img class="img-responsive" src="' + rootImg + (promo.DESCRIPCION.includes('CLARO') ? promo.URIMGLANDING : promo.URIMGLANDING.replace('.png', '.svg')) + '" alt="">' +
                    '   </div>' +
                    '   <div class="col-xs-8" style="line-height: 0.9em">' +
                    '       <p class="catalog-item-title">' +  promo.DESCRIPCION.replace("PORTABILIDAD", "").trim() + '</p>' +
                    '       <p class="catalog-item-subtitle">' + promo.NOMBRE + '</p>' +
                    '   </div>' +
                    '</div>'
                );
            } else {
                otros.push(
                    '<div class="col-xs-6 center-flex">' +
                    '   <div class="col-xs-4" style="padding-right: 5px">' +
                    '   <img class="img-responsive" src="' + rootImg + (promo.DESCRIPCION.includes('CLARO') ? promo.URIMGLANDING : promo.URIMGLANDING.replace('.png', '.svg')) + '" alt="">' +
                    '   </div>' +
                    '   <div class="col-xs-8" style="line-height: 0.9em">' +
                    '       <p class="catalog-item-title">' +  (promo.CANTIDAD != null ? promo.CANTIDAD : (promo.VIGENCIA != null ? promo.VIGENCIA : 'PROMOCIÓN')) + '</p>' +
                    '       <p class="catalog-item-subtitle">' + promo.DESCRIPCION + '</p>' +
                    '   </div>' +
                    '</div>'
                );
            }
        }
    }
    promociones_all = promociones.concat(otros);
    for(var i = 1; i <= promociones_all.length; i++) {
        if(i % 2 != 0) {
            html_promociones += '<div class="row center-flex">';
        }
        html_promociones += promociones_all[i-1];
        if(i % 2 == 0) {
            html_promociones += '</div>';
        }
    } html_promociones += promociones_all.length % 2 != 0 ? '</div>' : '';
    for(i = 1; i <= suscripciones.length; i++) {
        if(i % 2 != 0) {
            html_suscripciones += '<div class="row center-flex">';
        }
        html_suscripciones += suscripciones[i-1];
        if(i % 2 == 0) {
            html_suscripciones += '</div>';
        }
    } html_suscripciones += suscripciones.length % 2 != 0 ? '</div>' : '';
    if((giga_cant !== 0 && giga_frase === '') || (giga_cant === 0 && giga_frase !== '')) {
        html_gigas = '<div class="row center-flex">' +
            '   <div class="col-xs-2">' +
            '       <img class="img-responsive" src="' + rootImg + giga_img + '" alt="">' +
            '   </div>' +
            '   <div class="col-xs-5">' +
            '       <span style="font-size: 1.8em; font-weight: bold">' + (giga_frase !== '' ? giga_frase : (giga_cant + 'GB').replace('.', ',')) + '</span>' +
            '   </div>' +
            '   <div class="col-xs-5">' +
            '       <span>' + giga_descripcion + '</span>' +
            '   </div>' +
            '</div>';
    }
    var etiquetas = plan.ETIQUETAS != null ? JSON.parse(plan.ETIQUETAS) : [];
    var html =
        '<div class="container-tooltip hoverShadow col-xs-12 col-sm-6 col-md-4 col-lg-3" data-type="' + tipo_plan + '" data-price="' + Number.parseFloat(plan.VALOR_SIN_IMP) + '" data-target="' + plan.ID + '" style="display: none;">' +
        '   <div class="header-item-catalog col-xs-12' + (etiquetas.length > 0 ? ' con-etiquetas' : '')+ '">' +
        '       <div class="col-xs-11">' +
        '           <div style="height: 29px; text-align: right">' +
        '               <label class="checkcontainer col-xs-11">' +
        '                   <input type="checkbox" name="portabilidad-plan" value="' + plan.ID + '">' +
        '                   <span>Seleccionar</span>' +
        '                   <span class="customCheck"></span>' +
        '               </label>' +
        '           </div>' +
        '       </div>' +
        '       <div class="txt-light">PLAN</div>' +
        '       <div class="item-title-catalog" style="/*height: 27px;*/">' + plan.NOMBRE + '</div>';
    if(etiquetas.length > 0) {
        html += '       <div class="col-xs-12" style="margin-top: 5px">';
        etiquetas.forEach(function(etiqueta) {
            html += '           <div class="label-equipo-etiqueta left"><span class="truncate">' + etiqueta + '</span></div>';
        });
        html += '       </div>';
    }
    html +=
        '   </div>' +
        '   <div class="body-item-catalog">' +
        '       <div class="catalog-features row no-margin-bot">' +        html_gigas + '</div>' +
        '       <div class="catalog-features row no-margin-bot">' + html_incluye + '</div>' +
        '       <div class="catalog-aditionals row no-margin-bot">' + html_promociones + '</div>' +
        '       <div class="catalog-aditionals row no-margin-bot">' + html_suscripciones + '</div>' +
        '   </div>' +
        '   <div class="catalog-price row">' +
        '       <div class="col-xs-3">' +
        '           <img class="img-responsive position-absolute" src="' + rootImg +'images/landingmigration/claro.svg">' +
        '       </div>' +
        '       <div class="col-xs-9">' +
        '           <p class="no-margin" style="">Tarifa básica</p>' +
        '           <p class="no-margin">' +
        '               <span class="col-xs-4 price-enteros">$ ' + tarifa_sin_imp_parts[0] + ',</span>' +
        '               <span class="col-xs-8">' + tarifa_sin_imp_parts[1] + '<br>+ IVA</span>' +
        '           </p>' +
        '           <p class="no-margin" style="">Tarifa mensual final: $' + tarifa_con_imp + '</p>' +
        '       </div>' +
        '   </div>' +
        '</div>';
    $(id_parent).append(html);
}

function validateByType(type, content) {
    if(content.trim().length) {
        switch (type) {
            case "email" :
                var patternEmail = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
                return patternEmail.test(content.trim());
            case "cedula":
                return isCedula(content.trim());
            case "text":
                var patternText = new RegExp(/[!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>\/?0-9`´¨¬€~]/);
                return !patternText.test(content.trim());
            case "cellphone":
                var patternCell = new RegExp(/^09\d\d\d\d\d\d\d\d$/g);
                return patternCell.test(content.trim());
            default:
                return true;
        }
    }
    return false;
}

function modulo10_Cedula_RucNatural(cedruc) {
    var suma = 0;
    var residuo = 0;
    var coeficientes_arr = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    for (i = 0; i < coeficientes_arr.length; i++) {
        var v = parseInt(cedruc.charAt(i)) * coeficientes_arr[i];
        if(v > 9) {
            v = v -9;
        } suma = suma + v;
    } residuo = suma % 10;
    if(residuo == 0) {
        return 0;
    } return (10 - residuo);
}

function isCedula(cedula) {
    var tipo = parseInt(cedula.substring(2, 3));
	if (tipo > 5) {
		return false;
	}
	if(cedula.length != 10 || !($.isNumeric(cedula))) {
        return false;
    } var prov = parseInt(cedula.substring(0, 2));
    if (prov < 1 || prov > 24) {
        return false;
    } var digito_verificador = modulo10_Cedula_RucNatural(cedula);
    if(digito_verificador != parseInt(cedula.slice(-1))) {
        return false;
    } return true;
}

/**/
/*COUNTDOWUN JS*/

var countdown =
    function (secondsParameter,container,action) {

        var intervalCountDown = setInterval(function(){ showTime(secondsParameter--) }, 1000);

        var showTime = function  (seconds){
            if (seconds == -1) {
                clearInterval(intervalCountDown);
                action();
            }else{
                let hours = Math.floor( seconds / 3600 );
                let minutes = Math.floor( (seconds % 3600) / 60 );
                seconds = seconds % 60;
                printTime(hours,minutes,seconds);
            }
        }

        var showContainer = document.querySelectorAll(container);

        var printTime = function (h,m,s){

            if (m == 1 && s == 0){
                showContainer.forEach(function(itemCountDown) {
                    itemCountDown.querySelector('.hours').innerHTML = '';
                    itemCountDown.querySelector('.minutes').innerHTML = '';
                    itemCountDown.querySelector('.seconds').innerHTML = 60;
                });
            }else{
                m = m < 10 ? '0' + m : m;
                s = s < 10 ? '0' + s : s;
                showContainer.forEach(function(itemCountDown) {
                    itemCountDown.querySelector('.hours').innerHTML = h > 0 ? h + ' :' : '';
                    itemCountDown.querySelector('.minutes').innerHTML = m > 0 ? m + ' :' : '';
                    itemCountDown.querySelector('.seconds').innerHTML = s;
                });
            }

        }

    }
