$(document).ready(function () {

    const servicio = $('#hogar-catalogo').attr('data-servicio');
    const gaCategory = $('#sectionHogar').attr('data-gaCategory') || 'Servicios_Hogar';

    // Seguimiento page_view:
    EventGtmHandler.gtagTrigger('Página Vista', gaCategory);

    /////////////////////////////////
    /// Acciones y eventos
    /////////////////////////////////

    $(`li.tipo-servicio[data-servicio="${servicio}"]`).addClass('seleccionado');
    $('ul.filter-servicio li.tipo-servicio').click(function (e) {
        e.preventDefault();
        if ($(this).attr('data-url').length) {
            window.location.href = $(this).attr('data-url');
        }
    });

    if (!servicio) {
        if (window.screen.width < 768) {
            $(`.accordeon-element-header li.tipo-servicio[data-servicio="internet"]`).show();
            $(`li.tipo-servicio[data-servicio="internet"]`).addClass('seleccionado');
        }
    } else {
        $(`.accordeon-element-header li.tipo-servicio[data-servicio="${servicio}"]`).show();
    }

    if (window.screen.width < 768) {
        $(`.accordeon-element-body li.tipo-servicio[data-servicio="${servicio}"]`).hide();
    }

    // $(`li.tipo-servicio.seleccionado[data-servicio="${servicio}"]`).attr(`src`, `{{ asset("/images/planeshogar/iconos/Icon_Internet_normal_white.svg") }}`);


    $('.iconDownShow').click(function () {
        $('.iconDownShow').hide();
        $('.iconUPShow').show();
        $('.border-up').show();
        $('.div-caracteristica').removeClass('div-caracteristica-box-s');
    });
    $('.iconUPShow').click(function () {
        $('.iconUPShow').hide();
        $('.iconDownShow').show();
        $('.border-up').hide();
        $('.div-caracteristica').addClass('div-caracteristica-box-s');
    });

    //Ver mas
    $('.tnd-btn').click(function (e) {
        e.preventDefault();
        // Seguimiento item_selected
        EventGtmHandler.gtagTrigger('Elección', gaCategory, [new EventPlan($(this).attr('data-token'), $(this).attr('data-plan'), $(this).attr('data-total'), (`HOGAR ${servicio || 'SERVICIO'}`).toUpperCase(), servicio.toUpperCase())]);
        window.location.href = $(this).attr('data-vermas');
    });

    $('.slick-center').slick({
        centerMode: true,
        slidesToShow: 1,
        centerPadding: '40px',
        arrows: true,
        mobileFirst: true,
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    centerMode: true,
                    centerPadding: '80px',
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 991,
                settings: {
                    infinite: true,
                    slidesToShow: 3
                }
            }
        ]
    });


    /**
     * TODO: Acordeon "incluye" para paquetes 2 y 3 play
     **/
    // let servicioAcc = $('#accordenoServicio').attr('data-servicio');
    //
    //  if(servicio == servicioAcc){
    //      $(`li.tipo-servicio[data-servicio="${servicio}"]`).addClass('seleccionado');
    //  }
    //
    // let strMessage1 = $('#filter-servicio');
    // let strMessage2 = '<li class="tipo-servicio" data-servicio='.${servicio}.'data-url="#" value="internet"><img class="tnd-pr-10-xs" src="{{ asset("/images/planeshogar/iconos/Icon_Internet_normal_v1.svg") }}" alt="">Internet <a id="show_more_planes"></a></li>';
    // strMessage1.innerHTML = strMessage2;
});