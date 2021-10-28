$(document).ready(function () {

    const plan = $('div.contenido-planes.plan-hogar');
    EventGtmHandler.addProduct(new EventPlan(plan.attr('data-token'), plan.attr('data-nombre'), plan.attr('data-total'), (`HOGAR ${plan.attr('data-tipo')}`).toUpperCase(), plan.attr('data-tipo').toUpperCase()));

    // Seguimiento page_view
    EventGtmHandler.gtagTrigger('Plan Visto', plan.attr('data-gaCategory'));
    EventGtmHandler.dlTrigger('ViewContent');
    //EventGtm.gtag('Plan visto', [{ category: 'Servicios_Hogar', plan: plan.attr('data-nombre'), tipo: plan.attr('data-tipo'), price: plan.attr('data-total') }] ),

    $("form.planInfo").submit(function(e){
        e.preventDefault();
        Cart.add(
            new CartPlan(
                'ServiciosHogar',
                plan.attr('data-thumbnail'),
                plan.attr('data-token'),
                plan.attr('data-slug'),
                plan.attr('data-nombre'),
                plan.attr('data-tipo'),
                plan.attr('data-transaccion'),
                plan.attr('data-tarifa'),
                plan.attr('data-total'),
            )
        );
        // Seguimiento add_to_cart
        EventGtmHandler.dlTrigger('AddToCart');
        EventGtmHandler.gtagTrigger('Carrito', plan.attr('data-gaCategory'));
    });

    $('.slider-nav').slick({
        //slidesToShow: 4,
        mobileFirst: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: false,
        focusOnSelect: true,
        infinite: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    centerMode: true,
                    infinite: true,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 991,
                settings: {
                    infinite: true,
                    slidesToShow: 4
                }
            }
        ]
    });

    $('#buscador').keyup(function(){
        let nombres = $('.nombres');
        let buscando = $(this).val();
        //let nombres = $('#div-canal').attr('data-search-item');
        let item='';
        for( var i = 0; i < nombres.length; i++ ){
            item = $(nombres[i]).html().toLowerCase();
            for(var x = 0; x < item.length; x++ ){
                if( buscando.length == 0 || item.indexOf( buscando ) > -1 ){
                    $(nombres[i]).parents('.item').show();
                }else{
                    $(nombres[i]).parents('.item').hide();
                }
            }
        }
    });


    /*$('.slick-center').slick({
        centerMode: true,
        slidesToShow: 1,
        centerPadding: '40px',
        arrows: false,
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
                    slidesToShow: 4
                }
            }
        ]
    });*/

    function __gaTrigger(category, action, plan, tipo, price) {
        try {
            gtag('event', action, {
                'event_category': category,
                'event_label': `Plan: ${plan.toUpperCase()} | Tipo: ${tipo.toUpperCase()} | Detalle: (ninguno)`,
                'value': price
            });
        } catch (e) {   }
    }
});