function hoverCheck() {
    $('.hoverBtn').css({
        "animation": "floating-left 1s",
        "animation-fill-mode": "forwards",
        "color": "#ffffff",
        "background": "linear-gradient(0deg, #20B038 0%, #60D66A 100%)",
        "margin-right": "15px"
    });
}
function hoverOcult() {
    //  alert("Han pasado 7 segundos");
    $('.hoverBtn').css({
        "animation": "floating-right 3s",
        "animation-fill-mode": "forwards",
        "color": "transparent",
        "background": "transparent",
    });
}

setTimeout('hoverCheck()', 3000);
setTimeout('hoverOcult()', 10000);

$(document).ready(function () {
    $('.contentWS').click(function (e) {
        e.preventDefault();
        //let seccion = $(this).attr('data-target');
        let seccion = jQuery(this).attr("data-target") || 'Botón WhatsApp';
        //let seccion = element.getAttribute('data-target');
        gtag('event', 'Chat Venta', {
            'event_category': 'Botón WhatsApp',
            'event_label': seccion
        });

        //para produccción
        let url = `/external/chat-ventas`;

        //para desarrollo
  /*      let str = window.location.pathname;
        let res = str.slice(0, 39);
        let url = `${res}/external/chat-ventas/`;*/
  

        $.ajax({
            method: "POST",
            url: url,
            data: { seccion: `${seccion}` },
            success: function(respuesta) {
                if(!respuesta.error)
                    window.location.href = respuesta.url;
            }
        });

    });
})

