<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 15/03/2019
 * Time: 10:29
 */

namespace Dayscript\TiendaClaroBundle\Traits\Controllers;

use Dayscript\TiendaClaroBundle\Entity\ConfigSection;
use Dayscript\TiendaClaroBundle\Entity\GenEtiqueta;
use Dayscript\TiendaClaroBundle\Entity\Servicios1Play;
use Dayscript\TiendaClaroBundle\Entity\StoEquipo;
use Dayscript\TiendaClaroBundle\Entity\StoEquipoEspecificacion;
use Dayscript\TiendaClaroBundle\Entity\StoEquipoImg;
use Dayscript\TiendaClaroBundle\Entity\StoEquipoPlan;
use Dayscript\TiendaClaroBundle\Entity\TipoEquipo;
use Dayscript\TiendaClaroBundle\Entity\TipoEtiqueta;
use Dayscript\TiendaClaroBundle\Helper\Classes\CarritoService;
use Dayscript\TiendaClaroBundle\Traits\Entities\GetsEquiposTV;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Dayscript\TiendaClaroBundle\Model\opcionesSelectsNew;

/**
 * Trait ManagesEquiposTV
 * @package Dayscript\TiendaClaroBundle\Traits\Controllers
 * Define todas las funciones que deben llamarse desde las acciones de los controladores.
 * Se divide su funcionalidad para que puedan existir distintos Traits según los distintos cambios de la Tienda, pero los controladores se mantengan igual.
 */
trait ManagesEquiposTV
{
    /**
     * Contiene funcionalidades para la obtención de listas personalizadas de Equipos de TV.
     */
    use GetsEquiposTV;

    /**
     * @var string
     * Define el nombre de la sección que debe incluirse en las transacciones del carrito.
     * Si esta sección no está habilitada para el Carrito, se llamará al formulario personalizado.
     */
    public static $cart_section = 'TV';//'TV-disabled';

    /**
     * @param Request $request
     * @return mixed
     * @throws Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * Redirige la ruta al "index" que haya sido configurado en base. En caso de no existir, arroja un error 404.
     */
    public function redirectToIndexSection(Request $request)
    {
        // Como index, busco en base para redirigir a la siguiente sección
        $em = $this->getDoctrine()->getManager();
        $redirect_section = $em->getRepository(ConfigSection::class)->findOneBy(['routeFrom' => /*'TiendaClaro_home_TV'*/$request->get('_route')]);
        if($redirect_section) {
            return $this->redirectToRoute($redirect_section->getRouteTo());
        } else {
            throw $this->createNotFoundException('La sección no fue encontrada.');
        }
    }


    /**
     * @param Request $request
     * @param $showBy
     * @param int $cuotas_preferencia
     * @return mixed
     * Retorna la vista index que contiene el catálogo de equipos de TV
     */
    public function showIndexView(Request $request, $showBy, $cuotas_preferencia = 24)
    {
        $equipos = array();
        $params = explode(':', $showBy);
        $marca = sizeof($params) > 2 ? mb_strtoupper(trim($params[2]), 'UTF-8') : 'NA';
        if(mb_strtoupper($params[0], 'UTF-8') == 'TIPO') {
            $equipos = $marca != 'NA' ? $this->get__equipos_by_tipo($params[1], $cuotas_preferencia, $marca) : $this->get__equipos_by_tipo($params[1], $cuotas_preferencia);
        }
        if(sizeof($equipos))
            return $this->render("DayscriptTiendaClaroBundle:Tv:Index.html.twig", ['equipos' => $equipos, 'leyenda_cuota_final' => 'Cuota final mensual', 'gaCategory' => 'Equipos_SmartTv', 'hideWishList' => false]);
        throw $this->createNotFoundException('No existe el tipo de equipo, por lo que la sección no puede ser mostrada.');
    }

    /**
     * @param Request $request
     * @param $idBase64
     * @param int $cuotas_preferencia
     * @return mixed
     * Retorna la vista details, que contiene la opción de agregar al carrito una TV
     */
    public function showDetailsView(Request $request, $slug, $cuotas_preferencia = 24)
    {
        //Repositorios
        $em = $this->getDoctrine()->getManager();
        $equiposTvREP = $em->getRepository(StoEquipo::class);
        $especificacionesREP = $em->getRepository(StoEquipoEspecificacion::class);
        $etiquetasREP = $em->getRepository(GenEtiqueta::class);
        $imgsTvRep = $em->getRepository(StoEquipoImg::class);
        $planesbyEquipoREP = $em->getRepository(StoEquipoPlan::class);
        //Tipos
        $tipo_etiquetas = $em->getRepository(TipoEtiqueta::class)->findAll();
        $tipo_planes_tv = $em->getRepository(Servicios1Play::class)->getTypeByName('tv');

        //Equipo según parámetros recibidos, y sus dependencias
        $equipo = $equiposTvREP->findBySlug($slug, $cuotas_preferencia != 1);
        if($equipo) {
            $equipo['imgs'] = $imgsTvRep->findAllByEquipo($equipo[0]);
            $equipo['etiquetas'] = array();
            foreach ($tipo_etiquetas as $tipo_et) {
                $equipo['etiquetas'][$tipo_et->getNombre()] = $etiquetasREP->findByEquipo($equipo[0], $tipo_et);
            } $equipo['etiquetas']['ESPECIFICACION'] = $especificacionesREP->findAllImportanteByEquipo($equipo[0]);
            $equipo['especificaciones'] = $especificacionesREP->findAllByEquipo($equipo[0]);
            //Planes vinculados al equipo
            $planes = array();
            foreach ($tipo_planes_tv as $tipo) {
                //Debo cargar los planes según el tipo, y si están vinculados al equipo
                $planes[$tipo['TIPO']] = $planesbyEquipoREP->findByTipoAndEquipo($tipo['TIPO'], $equipo[0]);
            }
            //Carrito
            $carritoService = new CarritoService($this->getDoctrine()->getManager());
            $cart = $carritoService->getStateCarritoTransaccion(self::$cart_section);
            return $this->render("DayscriptTiendaClaroBundle:Tv:Show.html.twig", compact('equipo', 'planes', 'cart'));
        }
        throw $this->createNotFoundException('El equipo no existe.');
    }

    /**
     * @param Request $request
     * @return mixed
     * Retorna la vista del formulario general personalizado
     */
    public function showPurchaseView(Request $request)
    {
        //Solo se debe llamar a la funcionalidad si la sección del carrito no está activa
        $carritoService = new CarritoService($this->getDoctrine()->getManager());
        $cart = $carritoService->getStateCarritoTransaccion(self::$cart_section);
        if(!$cart['show']) {
            try {
            $slug_parts = explode('--', base64_decode($request->get('s')));
            $slug_plans = sizeof($slug_parts) > 1 ? explode('-', explode('PLAN_', $slug_parts[1])[1]) : [];
            $meses = base64_decode($request->get('m'));

            $equiposREP = $this->getDoctrine()->getManager()->getRepository(StoEquipo::class);
            $planesRep = $this->getDoctrine()->getManager()->getRepository(StoEquipoPlan::class);

            $equipo = $equiposREP->findOneById(explode('EQ_TV-', $slug_parts[0])[1]);
            $equipo_img = $equiposREP->getImagenPrincipal($equipo);
            $plan = sizeof($slug_parts) > 1 ? $planesRep->findOneByIdAndEquipo($slug_plans[1], $equipo) : null;

            $financiamiento = $equiposREP->getFinanciamiento($equipo, $meses, $plan);

            $opcionesSelectsnew = new opcionesSelectsNew();
            $urlSecure = $this->container->getParameter("urlSecure");
            $precio = $financiamiento->getCuotaConImp() + ($plan ? $plan->getCuotamensualfinal() : 0);
            $stringData = $plan ? 'PAQUETE '.$plan->getCodigo() : 'TV';
            $items[] = [
                'iditem' => $equipo->getId(),
                "url_img" => $equipo_img ? $equipo_img->getRutaThumb() : '',//Imagen de la tele
                "nombre" => $equipo->getNombre(),
                "plan" => $plan ? $plan->getNombre() : '',
                "seccion" => $plan ? 'PAQUETE '.$slug_plans[0] : 'TV',
                "cantidad" => 1,
                "meses" => $financiamiento->getTiempoCuota(),
                "precio" => $precio,
            ];

            $args = [
                'cuotamensualfinal' => $precio,
                'items'=> $items,
                'provincias' => $opcionesSelectsnew->get['Provincias'],
                'ciudades' => null,
                'stringData' => $stringData,
                'urlicon' => $urlSecure."images/thankyoupage/CarritoTransaction.svg",
                'pathForm' => $this->generateUrl('TiendaClaro_tv_purchased_slash',["slug" => base64_encode($equipo->getNombre().($plan ? ' + PLAN '.$plan->getNombre() : '').'__'.$precio.'__'.$stringData)]),
                'pathPreviewBack' => 'Tv/Previews:tv-show.html.twig',
                'urlBack' => $this->generateUrl('TiendaClaro_tv_show_slash',["slug" => $equipo->getSlug()]),
                'equipo' => $equipo->getNombre(),
                'nombre_plan' => $plan ? $plan->getNombre() : '',
                'sectionConfig' => 'TV',
                'idtransaccion' => $equipo->getId().($plan ? '__'.$plan->getCodigo() : ''),
            ];

            return $this->render("DayscriptTiendaClaroBundle:Default:formIndex.html.twig", $args);

            } catch (\Exception $e) {
                $logger = $this->get('logger');
                $logger->critical('showPurchaseView@TvController: '.$e->getMessage(), $e->getTrace());
            }
        }
        return $this->redirect($this->generateUrl('TiendaClaro_tv_catalogo_slash'));
    }

    /**
     * @param Request $request
     * @return mixed
     * Retorna la vista con la vista que contiene la compra correcta.
     */
    public function showPurchasedMessageView(Request $request, $slug)
    {
        //Solo se debe llamar a la funcionalidad si la sección del carrito no está activa
        $carritoService = new CarritoService($this->getDoctrine()->getManager());
        $cart = $carritoService->getStateCarritoTransaccion(self::$cart_section);
        if(!$cart['show']) {
            if ($request->isMethod('POST')) {
                return $this->redirect($this->generateUrl('TiendaClaro_tv_purchased_slash', ['slug' => $slug]));
            } else {
                //Primero reviso si la sesión de los valores del carrito está correcta
                $session = $request->getSession();
                $carrito_values = $session->get('carrito-values', []);
                //return new JsonResponse($carrito_values);
                if(sizeof($carrito_values)) {
                    $slug_parts = explode('__', base64_decode($slug)); //Formato: item__precio__stringData
                    //Luego reviso que sea el stringData correcto
                    if($slug_parts[2] == $carrito_values['stringData']) {
                        $metatitle = "Ya tengo mi  ".$slug_parts[0]." Todo por $" .$slug_parts[1] ."+imp. ¡Aprovecha esta publicación dale click y reserva el tuyo!";
                        /*Share Buttons*/
                        $urlSecure = $this->container->getParameter("urlSecure");
                        $urlpromociones = $this->generateUrl('TiendaClaro_home');
                        $title = "Cuéntale a tus amigos sobre esta mega promo";
                        $content = "";
                        $urlimage = $urlSecure . "/images/body/icons/logo-claro.png";
                        $redirect = $urlSecure . "/servicio/";
                        $metadata = array($metatitle, $content, $urlimage, $redirect);
                        $metadata = implode("||", $metadata);
                        $metadata = base64_encode($metadata);
                        $urlmetadata = $urlSecure . "compartir/" . $metadata;
                        $urlicon = "images/thankyoupage/Tv.svg";
                        /*End Share Buttons*/
                        $args = [
                            'urlpromociones' => $urlpromociones,
                            'title' => $title,
                            'content' => $content,
                            'urlimage' => $urlimage,
                            'urlmetadata' => $urlmetadata,
                            'metatitle' => $metatitle,
                            'urlicon' => $urlicon,
                            'email' => $carrito_values['email'],
                            'telefono' => $carrito_values['telefono'],
                            'transaccion' => 6,
                        ];
                        $session->remove('carrito-values');
                        return $this->render("DayscriptTiendaClaroBundle:Carrito/Messages:Succes.html.twig", $args);
                    }
                }
            }
        }
        return $this->redirect($this->generateUrl('TiendaClaro_tv_catalogo_slash'));
    }
}