<?php

namespace Dayscript\TiendaClaroBundle\Controller;

use Dayscript\TiendaClaroBundle\Traits\Controllers\Landings\ManagesClaroGamers;
use Dayscript\TiendaClaroBundle\Traits\Controllers\ManagesDefault;
use Dayscript\TiendaClaroBundle\Traits\Controllers\Movil\ManagesPortabilidad;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\PhpBridgeSessionStorage;



class DefaultNewController extends Controller
{
    use ManagesDefault, ManagesPortabilidad;

    function __construct()
    {
        /* Symphony session */

        if (session_id() == '') {
            //ini_set('session.save_handler', 'files');
            //ini_set('session.save_path', '/tmp');
            session_start();
        }

        $this->session = new Session(new PhpBridgeSessionStorage());
        $this->session->start();
    }

    /**
     * @Route("/", name="TiendaClaro_home")
     */
    public function newHomeAction(Request $request)
    {
        return $this->showIndexView($request);
        /*return $this->render('DayscriptTiendaClaroBundle:Home:index.html.twig', [
            'menu_principal' => $this->container->getParameter('Home__MenuPrincipal'),
            'catalogo' => $this->container->getParameter('Home__Catalogo'),
            'external' => $this->container->getParameter('Home__External'),
            'oferta' => $this->container->getParameter('Home__Oferta'),
            "bannersfooter1" => $this->getDoctrine()->getRepository('DayscriptTiendaClaroBundle:GenBanners')->findAllByTipoBanner('FOOTER SECTION 1')->getResult(),
            "bannersfooter2" => $this->getDoctrine()->getRepository('DayscriptTiendaClaroBundle:GenBanners')->findAllByTipoBanner('FOOTER SECTION 2')->getResult(),
            "bannerfooter3" => $this->getDoctrine()->getRepository('DayscriptTiendaClaroBundle:GenBanners')->findOneByName('BANNER SOMOS BY CLARO')->getOneOrNullResult()
        ]);*/
    }

    /**
     * NoRoute
     * @return mixed
     */
    public function getHeaderAction()
    {
        return $this->showHeader();
    }

    /**
     * NoRoute
     * @return mixed
     */
    public function getFooterAction()
    {
        return $this->showFooter();
    }

    /**
     * NoRoute
     * @param string $section
     * @return mixed
     */
    public function getBannersAction($section = "")
    {
        return $this->showBanners($section);
    }

    /**
     * NoRoute
     * @param string $customClass
     * @param string $parameter_fecha
     * @param string $texto1
     * @param string $texto2
     * @param string $texto3
     * @param string $texto4
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    public function getCronometroAction($customClass = "desktop", $parameter_fecha = 'countDownBF', $texto1 = 'PRECIOS', $texto2 = 'DE LOCURA', $texto3 = 'Por tiempo', $texto4 = 'limitado')
    {
        return $this->showCronometro($customClass);
    }


//    /**
//     * Route("/", methods={"POST"}, name="TiendaClaro_home_countClick")
//     */
//    public function countClickAction()
//    {
//        //short URL is http://bit.ly/2LNBSCw
//       // $url = 'https://api-ssl.bitly.com/v4/bitlinks/bit.ly/12a4b6c/clicks/summary?unit=minute&units=5&size=10&unit_reference=2021-01-01T15%3A04%3A05-0700';
//        $url = 'https://api-ssl.bitly.com/v4/bitlinks/bit.ly/2LNBSCw/clicks';
//        $token = 'e4bd6d4ae4e3fa6b6f59e474ba87580719631753';
//        $ch = curl_init($url);
//        curl_setopt($ch, CURLOPT_GETFIELDS, json_encode(['unit' => 'day', 'units' => -1]));
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//        curl_setopt($ch, CURLOPT_HTTPHEADER, [
//            "Authorization: Bearer " . $token,
//            "Content-Type: application/json"
//        ]);
//    }

}