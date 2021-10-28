<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 04/04/2019
 * Time: 15:07
 */

namespace Dayscript\TiendaClaroBundle\Traits\Controllers\Movil;

use Dayscript\TiendaClaroBundle\Entity\RegPortabilidad;
use Dayscript\TiendaClaroBundle\Entity\RegPortabilidadRepository;
use Dayscript\TiendaClaroBundle\Entity\TipoProducto;
use Dayscript\TiendaClaroBundle\Model\opcionesSelectsNew;
use Dayscript\TiendaClaroBundle\Traits\DefinesUtils;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Dayscript\TiendaClaroBundle\Service\Metodos\ConsumoNIPService;
use Dayscript\TiendaClaroBundle\Helper\Classes\WebService;
use Dayscript\TiendaClaroBundle\Helper\Classes\DbLogger;

trait ManagesPortabilidad
{
    use DefinesUtils;

    /**
     * @var bool
     */
    private $test_environment;

    /**
     * ManagesPortabilidad constructor.
     */
    public function __construct()
    {
        $this->provideListLandingPortabilidad = [
            'acc'=>'portabilidad-landing-acc',
            'ecom'=>'portabilidad-landing-ecom',
            'digital'=>'portabilidad-landing-digital',
            'cant'=>'portabilidad-landing-cant',
            'pbp'=>'portabilidad-landing-pbp',
            'bpo'=>'portabilidad-landing-bpo',
            'ccc'=>'portabilidad-landing-ccc',
            'cac'=>'portabilidad-landing-cac',
            'geeks'=>'portabilidad-landing-geeks',
            'anexa' =>'portabilidad-landing-anexa',
            'partener' => 'portabilidad-landing-partener',
            'cant-ppa' =>'portabilidad-landing-cant-ppa',
            'partener-ppa' =>'portabilidad-landing-partener-ppa',
            'ccc-ppa' =>'portabilidad-landing-ccc-ppa',
            'srg' =>'portabilidad-landing-srg',
            'dig-cant' =>'portabilidad-landing-dig-cant',
            'dig-acc' =>'portabilidad-landing-dig-acc',
            'dig-pabelpe' =>'portabilidad-landing-dig-pabelpe',
            'dig-convertia' =>'portabilidad-landing-dig-convertia',
            'dig-socios-online' =>'portabilidad-landing-dig-socios-online',
            'alg' =>'portabilidad-landing-alg',
            'drg' =>'portabilidad-landing-drg',
            /*  'abiatar'=>'portabilidad-landing-abiatar',*/
            /*'tln'=>'portabilidad-landing-tln',*/
        ];
    }


    /**
     * @param Request $request
     * @return mixed
     */
    public function showIndexView(Request $request, $ahora = null)
    {
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $planes = $configPortabilidad['planes'];
        /*$planesConexion = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findAll(['p.idTipo in (1,2,11,12)','p.id in ('.implode(',',$planes).')']);
        $planesDatos = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findAll(['p.idTipo in (10)','p.id in ('.implode(',',$planes).')']);
        $planPrepago = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findAll(['p.idTipo in (16)','p.id in ('.implode(',',$planes).')']);
        */
        $planesConexion = array();
        $planesDatos = array();
        $planPrepago = array();
        $provincia = " ";
        $ciudad = " ";
        $email = " ";
        if (is_null($ahora)) {
            return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:Index.html.twig',[
                'planes'            => $planesConexion,
                'planesDatos'       => $planesDatos,
                'planPrepago'       => $planPrepago,
                'idOptionCb'        => 45,
                'stringDataCb'      => "Ayuda Portabilidad: Sección postpago",
                'sQueueNameCb'      => 'Callback_Tienda_1',
                "sQueueNameJITCB"   => "CLIC2CALL_TIENDA2_2019",
                'banners'           => $configPortabilidad['banners']['section'],
                'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
                'infoPostpago'      => $configPortabilidad['tipo']['postpago'],
                'infoPrepago'       => $configPortabilidad['tipo']['prepago'],
                'timeStart'         => $configPortabilidad['timeStart'],
                'timeFinish'        => $configPortabilidad['timeFinish'],
                'metadata'          => $configPortabilidad['metadata'],
                'hideChat'          => true,
                'hideBtnCallback'   => true,
            ]);
        }else{
            return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:Index.html.twig',[
                'planes'            => $planesConexion,
                'planesDatos'       => $planesDatos,
                'planPrepago'       => $planPrepago,
                'idOptionCb'        => 45,
                'stringDataCb'      => "Ayuda Portabilidad: Sección postpago",
                'sQueueNameCb'      => 'Callback_Tienda_1',
                "sQueueNameJITCB"   => "CLIC2CALL_TIENDA2_2019",
                'banners'           => $configPortabilidad['banners']['section'],
                'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
                'infoPostpago'      => $configPortabilidad['tipo']['postpago'],
                'infoPrepago'       => $configPortabilidad['tipo']['prepago'],
                'timeStart'         => $configPortabilidad['timeStart'],
                'timeFinish'        => $configPortabilidad['timeFinish'],
                'metadata'          => $configPortabilidad['metadata'],
                'hideChat'          => true,
                'hideBtnCallback'   => true,
                'hideBtnTipo'       => true,
            ]);
        }


    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function showCreateView(Request $request, $slugPlan, $equipo = null)
    {
        $em = $this->getDoctrine()->getManager();
        $negocio_movil = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:TipoNegocio')->findOneBy(['codigo' => 'MOVIL']);
        $transaccion = $em->getRepository('DayscriptTiendaClaroBundle:TipoTransaccion')->findOneBy(['slug' => 'portabilidad', 'idNegocio' => $negocio_movil->getId()]);
        $plan = $em->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findBySlug($slugPlan);
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $planes = $configPortabilidad['planes'];
        $hasProduct = false;
        $operadoras = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findBy(['isCompetencia' => true, 'deletedAt' => null]);
        $equipoCard = "";
        $productos = "";

        if ($plan && in_array($plan->getId(), $planes)) {
            $planId = $plan->getId();
            $slugs = isset($configPortabilidad['slugs']) ? $configPortabilidad['slugs'] : [];
            $negocio_movil = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:TipoNegocio')->findOneBy(['codigo' => 'MOVIL']);
            $transaccion = $em->getRepository('DayscriptTiendaClaroBundle:TipoTransaccion')->findOneBy(['slug' => 'portabilidad', 'idNegocio' => $negocio_movil->getId()]);
            if($plan->getSlug() == 'plan-basico'){
            if (is_null($equipo)) {
                try {
                    $productos = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findOneByPlan(TipoProducto::mobileSlugs(), TipoProducto::mobileParameters(['transacciones' => [$transaccion->getSlug()], 'productos' => $slugs, 'tipo_pago' => 'contado', 'plan' => $planId]));
                } catch (\Exception $e) { }
            } else {
                if(in_array($equipo, $slugs)){
                    try {
                        $productos = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findOneByPlan(TipoProducto::mobileSlugs(), TipoProducto::mobileParameters(['transacciones' => [$transaccion->getSlug()], 'productos' => $equipo, 'tipo_pago' => 'contado', 'plan' => $planId]));
                        $equipoCard = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findBySlug($equipo);
                        $hasProduct = true;
                    } catch (\Exception $e) { }
                }else{
                    return $this->redirect($this->generateUrl('TiendaClaro_portabilidad_solicitud_create', $plan->getSlug()));
                }
            }
            }

           // dump($productos);
           // dump($hasProduct);
           // exit();
            $provincia = " ";
            $ciudad = " ";
            $email = " ";
            return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:Create.html.twig', [
                'equipos'           => $productos,
                'equipoCard'        => $equipoCard,
                'plan'              => $plan,
                'infoPostpago'      => $configPortabilidad['tipo']['postpago'],
                'infoPrepago'       => $configPortabilidad['tipo']['prepago'],
                'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
                'metadata'          => $configPortabilidad['metadata'],
                'operadoras'        => $operadoras,
                'idOptionCb'        => 45,
                'stringDataCb'      => "Ayuda Portabilidad: Sección postpago",
                'sQueueNameCb'      => 'Callback_Tienda_1',
                "sQueueNameJITCB"   => "CLIC2CALL_TIENDA2_2019",
                //"sQueueNameJITCB"   => "CLIC2CALL_TIENDA3_2019",
                "hasProduct"        => $hasProduct,
                'banners'           => $configPortabilidad['banners']['section'],
                'hideChat'          => true,
                'hideBtnCallback'   => true,
                'financiados'       => $this->container->getParameter('Sticker__Promocion'),
                'preventa'          => $this->container->getParameter('Sticker__Preventa'),
            ]);

        } else {
            return $this->redirect($this->generateUrl('TiendaClaro_portabilidad_create'));
        }
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function showCreatePrepagoView(Request $request, $ahora = null)
    {
/*        $em = $this->getDoctrine()->getManager();
        $opcionesSelectsnew = new opcionesSelectsNew();
        $operadoras = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findBy(['isCompetencia' => true, 'deletedAt' => null]);
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        return $this->render('DayscriptTiendaClaroBundle:Portabilidad:CreatePrepago.html.twig', [
            'provincias' => $opcionesSelectsnew->get['Provincias'],
            'operadoras' => $operadoras,
            'banners' => $configPortabilidad['banners']['prepago'],
            'hideChat'          => true,
            'hideBtnCallback'   => true,
        ]);*/
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $planes = $configPortabilidad['planes'];
        $planesConexion = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findAll(['p.idTipo in (1,2,11,12)','p.id in ('.implode(',',$planes).')']);
        $planesDatos = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findAll(['p.idTipo in (10)','p.id in ('.implode(',',$planes).')']);
        $planPrepago = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findAll(['p.idTipo in (16)','p.id in ('.implode(',',$planes).')']);
        $provincia = " ";
        $ciudad = " ";
        $email = " ";
        if (is_null($ahora)) {
            return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:CreatePrepago.html.twig',[
                'planes'            => $planesConexion,
                'planesDatos'       => $planesDatos,
                'planPrepago'       => $planPrepago,
                'idOptionCb'        => 45,
                'stringDataCb'      => "Ayuda Portabilidad: Sección prepago",
                'sQueueNameCb'      => 'Callback_Tienda_1',
                "sQueueNameJITCB"   => "CLIC2CALL_TIENDA4_2019",
                //"sQueueNameJITCB" => "CLIC2CALL_TIENDA3_2019",
                'banners'           => $configPortabilidad['banners']['section'],
                'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
                'infoPostpago'      => $configPortabilidad['tipo']['postpago'],
                'infoPrepago'       => $configPortabilidad['tipo']['prepago'],
                'timeStart'         => $configPortabilidad['timeStart'],
                'timeFinish'        => $configPortabilidad['timeFinish'],
                'metadata'          => $configPortabilidad['metadata'],
                'hideChat'          => true,
                'hideBtnCallback'   => true,
            ]);
        }else{
            return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:CreatePrepago.html.twig',[
                'planes'            => $planesConexion,
                'planesDatos'       => $planesDatos,
                'planPrepago'       => $planPrepago,
                'idOptionCb'        => 45,
                'stringDataCb'      => "Ayuda Portabilidad: Sección prepago",
                'sQueueNameCb'      => 'Callback_Tienda_1',
                "sQueueNameJITCB"   => "CLIC2CALL_TIENDA4_2019",
                //"sQueueNameJITCB" => "CLIC2CALL_TIENDA3_2019",
                'banners'           => $configPortabilidad['banners']['section'],
                'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
                'infoPostpago'      => $configPortabilidad['tipo']['postpago'],
                'infoPrepago'       => $configPortabilidad['tipo']['prepago'],
                'timeStart'         => $configPortabilidad['timeStart'],
                'timeFinish'        => $configPortabilidad['timeFinish'],
                'metadata'          => $configPortabilidad['metadata'],
                'hideChat'          => true,
                'hideBtnCallback'   => true,
                'hideBtnTipo'       => true,
            ]);
        }

    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function showTypView(Request $request){

        $inputs = $request->request->all();

        $em = $this->getDoctrine()->getManager();
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $plan = $em->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findOneById(base64_decode(trim(isset($inputs['plan-solicitud']) ? $inputs['plan-solicitud'] : '')));
        $equipo = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findBySlug(isset($inputs['equipo']) ? $inputs['equipo'] : '' );

        if ($equipo)
            $equipo->precioEquipo  = $inputs['precio-equipo'];

        $provider = (isset($inputs['providerCb']) ? $inputs['providerCb'] : null );

        $operadoraDonante = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('codigo' => base64_decode(trim($inputs['operadora-actual'])), 'isCompetencia' => true));
        $persona = [
            "nombre"=>$inputs['nombre'],
            "apellido"=>$inputs['apellido'],
            "cedula"=>$inputs['numdoc'],
            "email"=>$inputs['email'],
            "numero"=>$inputs['celular'],
            "operadora"=>$operadoraDonante->getNombreComercial(),
            "tipo-servicio"=>ucfirst($inputs['tipo-servicio']),
           // "tipo_solicitud"=>$inputs['tipo_solicitud'],
        ];

        return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:Typ.html.twig',[
            'plan'=>$plan,
            "provider"=>$provider,
            'equipo'=>$equipo,
            'persona'=>$persona,
            'banners'           => $configPortabilidad['banners']['section'],
            'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
            'hideChat'          => true,
            'hideBtnCallback'   => true,
        ]);
    }
    /**
     * @param Request $request
     * @return mixed
     */
    public function showCreateLandingView(Request $request,$provideCb = 'acc')
    {
        if (!isset($this->provideListLandingPortabilidad[$provideCb])){
            return $this->redirect($this->generateUrl('TiendaClaro_home'));
        }

        $em = $this->getDoctrine()->getManager();
        $opcionesSelectsnew = new opcionesSelectsNew();
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $operadoras = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findBy(['isCompetencia' => true, 'deletedAt' => null]);

        return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Landing:CreateLanding.html.twig', [
            'provincias' => $opcionesSelectsnew->get['Provincias'],
            'metadata'   => $configPortabilidad['metadata'],
            'operadoras' => $operadoras,
            'provide'=> $provideCb,
            'noTiendajs'=>true,
            'hideChat'          => true,
            'hideBtnCallback'   => true,
        ]);

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function storePortabilidadLandingForm(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $solicitud = new RegPortabilidad();

        $form_codigo = base64_encode(md5(random_bytes(10)));
        $solicitud->setFormCodigo($form_codigo);
        $solicitud->setFormPaso(0);
        $solicitud->setIp($request->getClientIp());

        $inputs = $request->request->all();

        $operadoraDonante = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('codigo' => base64_decode(trim($inputs['operadora-actual'])), 'isCompetencia' => true));
        $solicitud->setIdDonante($operadoraDonante);
        $operadoraReceptor = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('isNosotros' => true, 'isCompetencia' => false));
        $solicitud->setIdReceptor($operadoraReceptor);

        $solicitud->setIsPrepagoBefore(mb_strtolower(trim($inputs['tipo-servicio']), 'UTF-8') === 'prepago');

        $solicitud->setClienteNombre(mb_strtoupper(trim($inputs['nombre']). ' '.trim($inputs['apellido']), 'UTF-8'));
        $solicitud->setClienteIsNatural(true);
        $solicitud->setClienteIdentificacion(trim($inputs['numdoc']));
        $solicitud->setClienteEmail(mb_strtolower(trim($inputs['email']), 'UTF-8'));

        $solicitud->setDocFirma(base64_encode(trim($inputs['portabilidad-firma'])));

        $solicitud->setIsLanding(true);
        $solicitud->setProviderCb(trim($inputs['providerCb']));

        $solicitud = $portabilidadREP->save($solicitud);

        $secuencia = $portabilidadREP->countConfirmados();

        do {
            $secuencia++;
            try {
                $portabilidadREP->confirmar($solicitud, $this->addZerosBefore($secuencia, 6));
                $portabilidadREP->save($solicitud);
                $saved = true;
            } catch (\Exception $e) {
                // Si hay error es porque la secuencia no era única :(
            }
        } while(!$saved);

        $subpath = 'solicitudes/portabilidad/'.$solicitud->getId().'/';

        $parameter_mailing = isset($inputs['providerCb']) ? $inputs['providerCb'] : 'acc';

        $portabilidadREP->addNumberLanding($solicitud, trim($inputs['celular']));

        $portabilidadREP->removeAnexos($solicitud);
        //Guardo las imágenes

        foreach ($request->files->all() as $inputname => $file) {
            $fileName = $this->get('app.services.file_uploader')->uploadImage($file, str_replace('foto', $solicitud->getClienteIdentificacion(), $inputname), $subpath, 600*1024, 1000, 1000);
            if(!$fileName)
                return new JsonResponse(['error'=>true,'code' => $solicitud->getFormCodigo(), 'step' => 0, 'errors' => [$inputname => 'File error (3).']], 442);
            $portabilidadREP->addAnexoLanding($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, mb_strtoupper(str_replace('foto', 'ced', $inputname), 'UTF-8'));
        }
        //Genero y guardo el PDF
        $fileName = $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath);
        $portabilidadREP->addAnexoLanding($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, 'solicitud');

        $this->notificarCliente($solicitud);
        $this->notificarAsesores($solicitud,$this->provideListLandingPortabilidad[$parameter_mailing]);

        return new JsonResponse(['error'=>false,'code' => $solicitud->getFormCodigo(), 'step' => 0, 'solicitud' => $solicitud->jsonSerialize($this->get('templating.helper.assets'))]);

    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function storePortabilidadPaso1(Request $request)
    {
        $solicitud = $this->filledFirstPart($request);
        return new JsonResponse(['error'=>false,'code' => $solicitud->getFormCodigo(), 'step' => 0]);
    }

    public function filledFirstPart(Request $request){

        $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');

        $setSecuencia = false;

        $inputs = $request->request->all();

        if (!empty($inputs['solicitud'])) {
            $solicitud = $portabilidadREP->findOneByFormCodigo($inputs['solicitud']);
        } else {
            $solicitud = new RegPortabilidad();
            $form_codigo = base64_encode(md5(random_bytes(10)));
            $solicitud->setFormCodigo($form_codigo);
            $setSecuencia = true;
        }

        $solicitud->setFormPaso(1);
        $solicitud->setIp($request->getClientIp());
        if(isset($inputs['plan-solicitud'])) {
            $plan = $em->getRepository('DayscriptTiendaClaroBundle:StoPlan')->findOneById(base64_decode(trim($inputs['plan-solicitud'])));
            $solicitud->setStoPlan($plan);
            $solicitud->setPlanNombre($plan->getNombre());
            $solicitud->setPlanCodigo($plan->getCustomPlan()->getBp());
            $solicitud->setPlanTarifa($plan->getCuotaSinImp());
            $solicitud->setTipoSolicitud(trim($inputs['tipo_solicitud']));
        }

        $solicitud->setClienteNombre(mb_strtoupper(trim($inputs['nombre']) . ' ' . trim($inputs['apellido']), 'UTF-8'));
        $solicitud->setClienteIsNatural(true);
        $solicitud->setClienteIdentificacion(trim($inputs['numdoc']));
        $solicitud->setClienteEmail(mb_strtolower(trim($inputs['email']), 'UTF-8'));

        $operadoraDonante = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('codigo' => base64_decode(trim($inputs['operadora-actual'])), 'isCompetencia' => true));
        $solicitud->setIdDonante($operadoraDonante);
        $operadoraReceptor = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('isNosotros' => true, 'isCompetencia' => false));
        $solicitud->setIdReceptor($operadoraReceptor);
        $solicitud->setIsPrepagoAfter(0);
        $solicitud->setIsPrepagoBefore(mb_strtolower(trim($inputs['tipo-servicio']), 'UTF-8') === 'prepago');


//        if (!isset($inputs['not-required-envio'])){

//            $solicitud->setObtenerSim(mb_strtolower(trim($inputs['tipoEnvio']), 'UTF-8') === 'domicilioSim');
//        }

        $solicitud = $portabilidadREP->save($solicitud);
    /*   dump($solicitud);
      exit();*/

        if ($setSecuencia){
            $secuencia = $portabilidadREP->countConfirmados();
            do {
                $secuencia++;
                try {
                    $portabilidadREP->confirmar($solicitud, $this->addZerosBefore($secuencia, 6));
                    $portabilidadREP->save($solicitud);
                    $saved = true;
                } catch (\Exception $e) {
                    // Si hay error es porque la secuencia no era única :(
                }
            } while (!$saved);
        }
        $portabilidadREP->addNumberLanding($solicitud, trim($inputs['celular']));

        return $solicitud;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function storePortabilidadRedesignForm(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $infoPrepago = $configPortabilidad['tipo']['prepago']['paso3'];
        $infoPostpago = $configPortabilidad['tipo']['postpago']['paso3'];

        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $inputs = $request->request->all();
        $solicitud = $this->filledFirstPart($request);
        $planNombre = $solicitud->getPlanNombre();

        $solicitud->setFormPaso(2);
        $numPortabilidad = $solicitud->getNumeros()[0];
        $numPortabilidad->setNip($inputs['nipIngresado']);
        $numPortabilidad->setNipRequestedAt(new \DateTime());

        $portabilidadREP->saveNumero($numPortabilidad);


        /*            if ($inputs['tipoEnvio'] == 'cacSim'){
                $solicitud->setDireccionProvincia(trim($inputs['provinciaCAC']));
                $solicitud->setDireccionCiudad(trim($inputs['ciudadCAC']));
                $solicitud->setAgencia(trim($inputs['centro']));
            }else{
                $solicitud->setDireccionProvincia(trim($inputs['provincia']));
                $solicitud->setDireccionCiudad(trim($inputs['ciudad']));
                $solicitud->setContacto1(trim($inputs['telfcontacto']));
                $solicitud->setDireccionExacta(trim($inputs['txtdireccion']));
                $solicitud->setDireccionReferencia(trim($inputs['txtreferencia']));
                $solicitud->setLugar(trim($inputs['lugar']));
            }*/


        $subpath = 'solicitudes/portabilidad/'.$solicitud->getId().'/';

        $carpeta = $this->getParameter('kernel.root_dir').'/../web/uploads/solicitudes/portabilidad/'.$solicitud->getId().'/';;
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0755, true);
        }

        if(($infoPrepago == true && $planNombre == 'TU CLARO CHIP') || ($infoPostpago == true && $planNombre != 'TU CLARO CHIP')){
            $solicitud->setDireccionProvincia(trim($inputs['provincia']));
            $solicitud->setDireccionCiudad(trim($inputs['ciudad']));
            $solicitud->setDireccionExacta(trim($inputs['txtdireccion']));
            $solicitud->setDireccionReferencia(trim($inputs['lat-long']));
        }

        $solicitud->setDocFirma(base64_encode(trim($inputs['portabilidad-firma'])));

        if (!isset($inputs['not-required-id'])){
            foreach ($request->files->all() as $inputname => $file) {
                if(!is_null($file)){
                    $fileName = $this->get('app.services.file_uploader')->uploadImage($file, str_replace('foto', $solicitud->getClienteIdentificacion(), $inputname), $subpath, 600*1024, 1000, 1000);
                    if(!$fileName)
                        return new JsonResponse(['error'=>true,'code' => $solicitud->getFormCodigo(), 'step' => 0, 'errors' => [$inputname => 'File error (3).']], 442);
                    $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, mb_strtoupper(str_replace('foto', 'ced', $inputname), 'UTF-8'));
                }
            }
        }
        //Genero y guardo el PDF
        $fileName = $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath, $numPortabilidad->getNip());
        $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, 'solicitud');

        if(!empty($inputs['equipo'])){
            $equipo = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findOneBySlug($inputs['equipo']);
            $solicitud->setProducto($equipo);
            $solicitud->setNombreProducto($equipo->getNombreComercial());
        }

        if (isset($inputs['suscripcion'])){
            $solicitud->setSuscripcion(1);
        }

        if($inputs['isLanding']){
            $solicitud->setIsLanding(true);
        }

        $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);

        ///REQUEST RESPONSE NIP
/*        $externalTransactionId = 'glink31295c945d8a1a25e9b58063487';
        $userId = '1576606562072521930';
        $userName = 'hwbss';

        $dataRequest = $this->get('app.services.consumo_nip')->generateXMLRequest(
            Log $logger, $ambiente = 0, 'CRMHW', 'Claro', 'REGULARIZATION', date("Y-m-d H:i:s"), $externalTransactionId,
                                'Zbc1234', $remoteIP, $userId, $userName, 0, 1, 40, $sequenceNumber, $phoneNumber);*/

       // $dataResponse = $this->get('app.services.consumo_nip')->getReportePorConsumo();

        $portabilidadREP->save($solicitud);
        $operadoraDonante = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('codigo' => base64_decode(trim($inputs['operadora-actual'])), 'isCompetencia' => true));
        $this->notificarCliente($solicitud);
        //$productos = [new \Dayscript\CallbackWs\Models\Product("Portabilidad", 1, $solicitud->getNombreProducto(), $solicitud->getPlanNombre(), null)];
        $productos = [new \Dayscript\CallbackWs\Models\Product("Portabilidad", $solicitud->getPlanNombre(), null, $solicitud->getPlanNombre(), null)];
        $utm_params = $this->get('app.services.utm_handler')->getUtmParams();
        //Compruebo el callback
        $callbacks_parameters = json_decode($em->getRepository('DayscriptTiendaClaroBundle:Plan')->getParameter("URL_CALLBACK_SECCION_PORTABILIDAD")['VALOR'], true);
        if($solicitud->getIsPrepagoAfter()) {
            if($callbacks_parameters['Prepago']['hasCallback']) {
                $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Prepago | '.$operadoraDonante->getNombreComercial().' ('.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').')'/*.$solicitud->getDocSecuencia()*/;
                $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Prepago']['sTypeInteraction'], $callbacks_parameters['Prepago']['sQueueName'], $callbacks_parameters['Prepago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
            }
        } else {
            //Envio los correos
            $this->notificarCliente($solicitud);

            if($planNombre == 'TU CLARO CHIP' || $solicitud->getPlanNombre()=='PAQUETE MÁS GIGAS'){
                $this->notificarAsesores($solicitud, 'prepago');
                if($callbacks_parameters['Prepago']['hasCallback']) {
                    $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Prepago | '.$operadoraDonante->getNombreComercial().' ('.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').')'/*.$solicitud->getDocSecuencia()*/;
                    $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Prepago']['sTypeInteraction'], $callbacks_parameters['Prepago']['sQueueName'], $callbacks_parameters['Prepago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
                }
            }else{
                $this->notificarAsesores($solicitud);
                if($callbacks_parameters['Postpago']['hasCallback']) {

                    $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Postpago | '.$operadoraDonante->getNombreComercial().' ('.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').')'/*.$solicitud->getDocSecuencia()*/;
                    $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Postpago']['sTypeInteraction'], $callbacks_parameters['Postpago']['sQueueName'], $callbacks_parameters['Postpago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
                }
            }
        }
        return new JsonResponse(['error'=>false,'code' => $solicitud->getFormCodigo(), 'step' => 0]);
    }

    /**
     * @param Request $request
     * @param $numero
     * @return JsonResponse
     * @throws \Exception
     */
    public function generarNIP(Request $request, $numero){
        $em = $this->getDoctrine()->getManager();
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $test_environment = $configPortabilidad['test_environment'];
        
        $fecha = new \DateTime();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        //$secuence_n = 0001;
        $nextSequence =  $portabilidadREP->getNextSequence();
        $number = $nextSequence;
        $length = 4;
        $sequence_n = substr(str_repeat(0, $length).$number, - $length);
        $secuence = '40'.$fecha->format('y').$fecha->format('m').$fecha->format('d').'5'.$sequence_n;
        $ip = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);

        $ws = new WebService(new DbLogger($em));
        $urlNipMethod = $test_environment ? 'http://192.168.37.205:8001/Portability/SendPinGenerationRequest/V1.0' : 'http://esbthirdparty.integra.conecel.com/Portability/SendPinGenerationRequest/V1.0';
        $response_nip_generated = $ws->SendPinGeneration($numero, $secuence, $ip, 'portabilidad-nip-generate-'.($test_environment ? 'test' : 'prod'), $urlNipMethod);

        if(!$response_nip_generated['error']) {
/*            $messageID = json_decode($response_nip_generated['response']->MessageID);
            $messageTime = json_decode($response_nip_generated['response']->MessageTime);
            $sequenceNumber = json_decode($response_nip_generated['response']->SequenceNumber);
            $orderNumber = json_decode($response_nip_generated['response']->AscpOrderNumber);

            $solicitud = $portabilidadREP->save($solicitud);
            $solicitud->setMessageID($messageID);
            $solicitud->setMessageTime($messageTime);
            $solicitud->setSequenceNumber($sequenceNumber);
            $solicitud->setOrderNumber($orderNumber);

            $portabilidadREP->save($solicitud);*/

            try {
                $_SESSION['portabilidad_numero'] = $response_nip_generated['linea'];
                $_SESSION['NIP_TIME'] = $fecha;
                return new JsonResponse([
                    'error' => false,
                    'response' => '$response',
                    'NIP' => $response_nip_generated['linea'],
                    'time' =>  $fecha->format('Y-m-d H:i:s'),
                    'response' => $response_nip_generated['response'],
                ]);
            } catch (\Exception $e) { }
        }

        return new JsonResponse(['error' => true, 'message' => 'No se puede generar el código NIP. Revise el número ingresado e intente nuevamente.']);
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function validarNIP(Request $request){
/*        $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
       // $solicitud = $this->filledFirstPart($request);
        $numero = $_SESSION['portabilidad_numero'];

        $portabilidadREP->saveNumero($numero);

        return ['error' => false, 'response' => 'ok'];*/

        return $request;
    }




    /**
     * @param Request $request
     * @return mixed
     */
    public function showMapaView(Request $request, $idSolicitud){
        $em = $this->getDoctrine()->getManager();
        $configPortabilidad = $this->getParameter('sections')['PORTABILIDAD'];
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $solicitud = $portabilidadREP->findById($idSolicitud);
        if ($solicitud && !empty($solicitud->getDireccionReferencia())){

            return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Redesign:Mapa.html.twig',[
                'coordenadas'       => $solicitud->getDireccionReferencia(),
                'provincia'         => $solicitud->getDireccionProvincia(),
                'ciudad'            => $solicitud->getDireccionCiudad(),
                'direccion'         => $solicitud->getDireccionExacta(),
                'banners'           => $configPortabilidad['banners']['section'],
                'bannersPrepago'    => $configPortabilidad['banners']['prepago'],
                'hideChat'          => true,
                'hideBtnCallback'   => true,
            ]);
        }
        throw new HttpException(Response::HTTP_NOT_FOUND, 'Catálogo no encontrado.');
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function storePortabilidadAsesorForm(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $inputs = $request->request->all();
        $solicitud = $this->filledFirstPart($request);
        //$solicitud->setIsPrepagoAfter(false);
        //$solicitud->setIsPrepagoBefore(false);
        if($solicitud->getPlanNombre()=='TU CLARO CHIP' || $solicitud->getPlanNombre()=='PAQUETE MÁS GIGAS'){
            $solicitud->setIsPrepagoAfter(true);
        }else{
            $solicitud->setIsPrepagoAfter(false);
        }
        $solicitud->setIsPrepagoBefore(mb_strtolower(trim($inputs['tipo-servicio']), 'UTF-8') === 'prepago');
        $solicitud->setFormPaso(2);
        $operadoraDonante = $em->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('codigo' => base64_decode(trim($inputs['operadora-actual'])), 'isCompetencia' => true));
        //if (!$inputs['compraOption'] == 'llamada') {
        //dump(!$inputs['compraOption'] == 'llamada');
        //exit();
        //}
        $subpath = 'solicitudes/portabilidad/'.$solicitud->getId().'/';
        $solicitud->setDocFirma(null);
        if (!isset($inputs['not-required-id'])){
            foreach ($request->files->all() as $inputname => $file) {
                if(!is_null($file)){
                    $fileName = $this->get('app.services.file_uploader')->uploadImage($file, str_replace('foto', $solicitud->getClienteIdentificacion(), $inputname), $subpath, 600*1024, 1000, 1000);
                    if(!$fileName)
                        return new JsonResponse(['error'=>true,'code' => $solicitud->getFormCodigo(), 'step' => 0, 'errors' => [$inputname => 'File error (3).']], 442);
                    $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, mb_strtoupper(str_replace('foto', 'ced', $inputname), 'UTF-8'));
                }
            }
        }

        $carpeta = $this->getParameter('kernel.root_dir').'/../web/uploads/solicitudes/portabilidad/'.$solicitud->getId().'/';;
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0755, true);
        }

        //Genero y guardo el PDF
       // $fileName = $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath);
       // $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, 'solicitud');


        if (isset($inputs['suscripcion'])){
            $solicitud->setSuscripcion(1);
        }

        if($inputs['isLanding']){
            $solicitud->setIsLanding(true);
        }
        if(!empty($inputs['equipo'])){
            $equipo = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findOneBySlug($inputs['equipo']);
            $solicitud->setProducto($equipo);
            $solicitud->setNombreProducto($equipo->getNombreComercial());
        }
        $portabilidadREP->save($solicitud);

        $this->notificarCliente($solicitud);
        //$productos = [new \Dayscript\CallbackWs\Models\Product("Portabilidad", 1, $solicitud->getNombreProducto(), $solicitud->getPlanNombre(), null)];
        $productos = [new \Dayscript\CallbackWs\Models\Product("Portabilidad", $solicitud->getPlanNombre(), null, $solicitud->getPlanNombre(), null)];
        $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
        $utm_params = $this->get('app.services.utm_handler')->getUtmParams();
        //Compruebo el callback
        $callbacks_parameters = json_decode($em->getRepository('DayscriptTiendaClaroBundle:Plan')->getParameter("URL_CALLBACK_SECCION_PORTABILIDAD")['VALOR'], true);
        //Envio los correos
        $this->notificarCliente($solicitud);
        if($solicitud->getPlanNombre()=='TU CLARO CHIP' || $solicitud->getPlanNombre()=='PAQUETE MÁS GIGAS' ){
            $this->notificarAsesores($solicitud, 'prepago');
            $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Prepago  | '.$operadoraDonante->getNombreComercial().' ('.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').') | Llamada';
            $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Prepago']['sTypeInteraction'], $callbacks_parameters['Prepago']['sQueueName'], $callbacks_parameters['Prepago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
        }else{
            $this->notificarAsesores($solicitud);
            $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Postpago | '.$operadoraDonante->getNombreComercial().' ('.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').') | Llamada';
            $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Postpago']['sTypeInteraction'], $callbacks_parameters['Postpago']['sQueueName'], $callbacks_parameters['Postpago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
        }

        return new JsonResponse(['error'=>false,'code' => $solicitud->getFormCodigo(), 'step' => 0]);
    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function storePortabilidadPrepagoForm(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');

        $solicitud = $this->filledFirstPart($request);
        $solicitud->setIsPrepagoAfter(true);

        $solicitud->setFormPaso(2);

        $inputs = $request->request->all();

        $solicitud->setDocFirma(base64_encode(trim($inputs['portabilidad-firma'])));

        $subpath = 'solicitudes/portabilidad/'.$solicitud->getId().'/';

        if (!isset($inputs['not-required-id'])){
            foreach ($request->files->all() as $inputname => $file) {
                if(!is_null($file)){
                    $fileName = $this->get('app.services.file_uploader')->uploadImage($file, str_replace('foto', $solicitud->getClienteIdentificacion(), $inputname), $subpath, 600*1024, 1000, 1000);
                    if(!$fileName)
                        return new JsonResponse(['error'=>true,'code' => $solicitud->getFormCodigo(), 'step' => 0, 'errors' => [$inputname => 'File error (3).']], 442);
                    $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, mb_strtoupper(str_replace('foto', 'ced', $inputname), 'UTF-8'));
                }
            }
        }

        $carpeta = $this->getParameter('kernel.root_dir').'/../web/uploads/solicitudes/portabilidad/'.$solicitud->getId().'/';;
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0755, true);
        }

        //Genero y guardo el PDF
        $fileName = $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath);
        $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, 'solicitud');

        if(!empty($inputs['equipo'])){
            $equipo = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findOneBySlug($inputs['equipo']);
            $solicitud->setProducto($equipo);
            $solicitud->setNombreProducto($equipo->getNombreComercial());
        }

        if (isset($inputs['suscripcion'])){
            $solicitud->setSuscripcion(1);
        }

        if(isset($inputs['isLanding']) && $inputs['isLanding']){
            $solicitud->setIsLanding(true);
        }

        $portabilidadREP->save($solicitud);

        $this->notificarCliente($solicitud);
        $productos = [new \Dayscript\CallbackWs\Models\Product("Portabilidad", 1, $solicitud->getNombreProducto(), $solicitud->getPlanNombre(), null)];
        $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
        $utm_params = $this->get('app.services.utm_handler')->getUtmParams();
        //Compruebo el callback
        $callbacks_parameters = json_decode($em->getRepository('DayscriptTiendaClaroBundle:Plan')->getParameter("URL_CALLBACK_SECCION_PORTABILIDAD")['VALOR'], true);
        //var_dump($solicitud);
        //exit();
        if($solicitud->getIsPrepagoAfter()) {
            //$this->notificarCliente($solicitud);
            $this->notificarAsesores($solicitud, 'prepago');
            if($callbacks_parameters['Prepago']['hasCallback']) {
                $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Prepago'/*.$solicitud->getDocSecuencia()*/;
                $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Prepago']['sTypeInteraction'], $callbacks_parameters['Prepago']['sQueueName'], $callbacks_parameters['Prepago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
            }
        } else {
            //Envio los correos
            $this->notificarCliente($solicitud);
            $this->notificarAsesores($solicitud);
            if($callbacks_parameters['Postpago']['hasCallback']) {
                $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Postpago'/*.$solicitud->getDocSecuencia().' :'.$solicitud->getPlanNombre()*/;
                $this->get('app.services.callback_executer')->executeJIT($callbacks_parameters['Postpago']['sTypeInteraction'], $callbacks_parameters['Postpago']['sQueueName'], $callbacks_parameters['Postpago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), null, $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $productos, $utm_params, $solicitud->isSuscripcion() ? 'S' : 'N', $remoteIP);
            }
        }
        return new JsonResponse(['error'=>false,'code' => $solicitud->getFormCodigo(), 'step' => 0]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function storePortabilidadForm(Request $request)
    {
        $code = $request->get('form_code', 'NA');
        $step = $request->get('form_step', -9999);
        if($step < 0 || $step > 5 || $code === 'NA' || empty($code)) {
            throw new HttpException(Response::HTTP_BAD_REQUEST, 'Los datos de la solicitud son incorrectos. Por favor, ingréselos nuevamente.');
        } $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $solicitud = $portabilidadREP->findOrCreateByCode($code, $request->getClientIp());
        if(!$solicitud)
            throw $this->createNotFoundException('Solicitud incorrecta.');
        if($solicitud->getFormIsConfirmado() && $step != 5)
            throw new HttpException(Response::HTTP_BAD_REQUEST, 'Los datos de la solicitud son incorrectos. Por favor, ingréselos nuevamente.');
        $subpath = 'solicitudes/portabilidad/'.$solicitud->getId().'/';
        $portabilidadREP->fillByStep($solicitud, $step, $request->request->all());
        if($step == 4 && !$solicitud->getIsPrepagoAfter()) { //Cambio solicitado por Adriana Esponisa (2019-07-25)
            $portabilidadREP->removeAnexos($solicitud);
            //Guardo las imágenes
            foreach ($request->files->all() as $inputname => $file) {
                $fileName = $this->get('app.services.file_uploader')->uploadImage($file, str_replace('foto', $solicitud->getClienteIdentificacion(), $inputname), $subpath, 600*1024, 1000, 1000);
                if(!$fileName)
                    return new JsonResponse(['code' => $solicitud->getFormCodigo(), 'step' => $step, 'errors' => [$inputname => 'File error (3).']], 442);
                $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, mb_strtoupper(str_replace('foto', 'ced', $inputname), 'UTF-8'));
            }
            //Genero y guardo el PDF
            $fileName = $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath);
            $portabilidadREP->addAnexo($solicitud, str_replace($this->getParameter('kernel.root_dir').'/../web', '', $fileName), $fileName, 'solicitud');
        }
        $errors = $this->validator__validate([$solicitud]);
        if (count($errors) > 0) {
            $logger = $this->get('logger');
            //$msj_log = str_replace('=', ':', http_build_query($errors, null, ','));
            //$logger->error('storePortabilidadForm@PortabilidadNewController: FORMULARIO INVALIDO: '.$msj_log);
            $logger->error('storePortabilidadForm@PortabilidadNewController: FORMULARIO INVALIDO: [['.$solicitud->getId().']]');
            return new JsonResponse(['code' => $solicitud->getFormCodigo(), 'step' => $step, 'errors' => [$errors]], 442);
        } else {
            $portabilidadREP->save($solicitud);
            if($step == 5 && $request->request->has('terminosycondiciones')) {
                $saved = false;
                $secuencia = $portabilidadREP->countConfirmados();
                do {
                    $secuencia++;
                    try {
                        $portabilidadREP->confirmar($solicitud, $this->addZerosBefore($secuencia, 6));
                        $portabilidadREP->save($solicitud);
                        $saved = true;
                    } catch (\Exception $e) {
                        // Si hay error es porque la secuencia no era única :(
                    }
                } while(!$saved);
                if(!$solicitud->getIsPrepagoAfter()) {
                    //Genero por última vez el pdf
                    $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath);
                }
                //Compruebo el callback
                $callbacks_parameters = json_decode($em->getRepository('DayscriptTiendaClaroBundle:Plan')->getParameter("URL_CALLBACK_SECCION_PORTABILIDAD")['VALOR'], true);
                if($solicitud->getIsPrepagoAfter()) {
                    if($callbacks_parameters['Prepago']['hasCallback']) {
                        $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Prepago | '/*.$solicitud->getDocSecuencia()*/;
                        $this->get('app.services.callback_executer')->executePlain($callbacks_parameters['Prepago']['sTypeInteraction'], $callbacks_parameters['Prepago']['sQueueName'], $callbacks_parameters['Prepago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $request->getClientIp());
                    }
                } else {
                    //Envio los correos
                    $this->notificarCliente($solicitud);
                    $this->notificarAsesores($solicitud);
                    if($callbacks_parameters['Postpago']['hasCallback']) {
                        $stringData = 'PORTABILIDAD: '.($solicitud->getIsPrepagoBefore() ? 'Prepago' : 'Postpago').' a Postpago | '/*.$solicitud->getDocSecuencia()*/;
                        $this->get('app.services.callback_executer')->executePlain($callbacks_parameters['Postpago']['sTypeInteraction'], $callbacks_parameters['Postpago']['sQueueName'], $callbacks_parameters['Postpago']['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $solicitud->getNumeros()[0]->getNumero(), $solicitud->getDireccionProvincia(), $solicitud->getDireccionCiudad(), $request->getClientIp());
                    }
                }
            }
            return new JsonResponse(['code' => $solicitud->getFormCodigo(), 'step' => $step, 'solicitud' => $solicitud->jsonSerialize($this->get('templating.helper.assets'))]);
        }
    }

    /**
     * @param Request $request
     * @param $code
     * @param $step
     * @return JsonResponse
     */
    public function deletePortabilidadForm(Request $request, $code, $step)
    {
        if($step < 1 || $step > 5 || $code === 'NA' || $code === 'new' || empty($code)) {
            throw new HttpException(Response::HTTP_BAD_REQUEST, '---- '.$code. '---- '.$step.' Los datos de la solicitud son incorrectos. Por favor, ingréselos nuevamente.');
        } $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $solicitud = $portabilidadREP->findByCodeAndIp($code, $request->getClientIp());
        if(!$solicitud)
            throw $this->createNotFoundException('Solicitud incorrecta.');
        $portabilidadREP->delete($solicitud);
        return new JsonResponse(['code' => $solicitud->getFormCodigo()]);
    }

    /**
     * @param Request $request
     * @param $form_base64
     * @param $doc_base64
     * @return mixed
     */
    public function showConfirmView(Request $request, $form_base64, $doc_base64)
    {
        $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $solicitud = $portabilidadREP->findPendingByCodigoAndSecuencia(base64_decode($form_base64), base64_decode($doc_base64));
        if(!$solicitud)
            throw $this->createNotFoundException('Solicitud incorrecta.');
        return $this->render('DayscriptTiendaClaroBundle:Portabilidad:Confirm.html.twig', ['solicitud' => $solicitud, 'formCode' => $form_base64, 'docSecuencia' => $doc_base64, 'show' => $solicitud->getSentCallme() !== null, 'hideChat' => true, 'hideBtnCallback' => true]);
    }

    /**
     * @param Request $request
     * @param $form_base64
     * @param $doc_base64
     * @return mixed
     */
    public function helpPortabilidadForm(Request $request, $form_base64, $doc_base64)
    {
        $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $solicitud = $portabilidadREP->findPendingByCodigoAndSecuencia(base64_decode($form_base64), base64_decode($doc_base64));
        if(!$solicitud)
            throw $this->createNotFoundException('Solicitud incorrecta.');
        $phone = $request->get('Number');
        $callbacks_parameters = json_decode($em->getRepository('DayscriptTiendaClaroBundle:Plan')->getParameter("URL_CALLBACK_SECCION_PORTABILIDAD")['VALOR'], true)['Administrador'];
        if($callbacks_parameters['hasCallback']) {
            $stringData = 'PORTABILIDAD: Necesitamos hablar contigo'/*.$solicitud->getDocSecuencia()*/;
            $response = $this->get('app.services.callback_executer')->executePlain($callbacks_parameters['sTypeInteraction'], $callbacks_parameters['sQueueName'], $callbacks_parameters['sQueueNameJIT'], $stringData, $solicitud->getClienteNombre(), null, $solicitud->getClienteIdentificacion(), $solicitud->getClienteIsNatural() ? 'CED' : 'RUC', $solicitud->getClienteEmail(), $phone, null, null, $request->getClientIp());
        } else
            $response = 'success';
        if($response === 'success') {
            $portabilidadREP->saveLlamame($solicitud);
        }
        return new JsonResponse($response);
    }

    /**
     * UTIL: Envía el correo a los asesores, sobre la solicitud recibida como parámetro
     * @param RegPortabilidad $solicitud
     * @return bool
     */
    public function notificarAsesores(RegPortabilidad $solicitud,$tipo = 'portabilidad')
    {
        try {
            if(!$solicitud)
                throw $this->createNotFoundException('Solicitud incorrecta.');
            $em = $this->getDoctrine()->getManager();
            $recipients = json_decode($em->getRepository('DayscriptTiendaClaroBundle:Plan')->getParameterClob("MAILING_DESTINATARIOS")['VALOR'], true)[$tipo];
            //$recipients = ['to'=>['jtorres@grupo-link.com','ffarfan@grupo-link.com'],'cc'=>[],'cco'=>[]];
            $to_asesores = $recipients['to'];
            $cc = $recipients['cc'];
            $cco = $recipients['cco'];

            $sent = $this->get('app.services.mailer')->sendSolicitudRecibidaToAsesores($solicitud, $to_asesores, $cc, $cco);
            if($sent) {
                $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
                $solicitud->setSentToClaroAt(new \DateTime());
                $portabilidadREP->save($solicitud);
            } return $sent;

        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * UTIL: Envía un correo de notificación al solicitante incluido en la solicitud recibida como parámetro
     * @param RegPortabilidad $solicitud
     * @return bool
     */
    public function notificarCliente(RegPortabilidad $solicitud)
    {
        try {
            if(!$solicitud)
                throw $this->createNotFoundException('Solicitud incorrecta.');
            //return $html = $this->render('DayscriptTiendaClaroBundle:Portabilidad/Mails:Received.html.twig', compact($solicitud));
            $sent = $this->get('app.services.mailer')->sendSolicitudRecibidaToClient($solicitud);
            if($sent) {
                $em = $this->getDoctrine()->getManager();
                $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
                $solicitud->setSentToClientAt(new \DateTime());
                $portabilidadREP->save($solicitud);
            } return $sent;

        } catch (\Exception $e) {
            return false;
        }
    }

    /*
     * TEST: Funcionalidad para probar mailing
     * param Request $request
     * return Response
     * ONLY FOR TEST
     */
    /*public function testMail(Request $request, $mail = "")
    {
        $em = $this->getDoctrine()->getManager();
        $solicitud = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad')->findByCodeAndIp('ZDZlYmIyNDMwYTVkYjNhOTRkYzkxYTk2MWMyZGY4ODM=', $request->getClientIp(), false);
        if(!empty($mail))
            $solicitud->setClienteEmail($mail);
        return new Response($this->notificarCliente($solicitud) ? 'yes' : 'false');
    }*/

    /**
     * TEST: Funcionalidad para reenviar el mailing de las solicitudes confirmadas
     * @param Request $request
     * @return Response
     * ONLY FOR TEST
     */
    /*public function test(Request $request)
    {
        ini_set('max_execution_time', 300000);
        ini_set('memory_limit', '3072M');
        $em = $this->getDoctrine()->getManager();
        $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
        $ides = [5539, 5543, 5558, 5564, 5644, 5645, 5667, 5678, 5694, 5718, 5734, 5743, 5753, 5763, 5781, 5783, 5786, 5817, 5818, 5832, 5835, 5852, 5866, 5869, 5888, 5889, 5890, 5891, 5894, 5910, 5916, 5917, 5926, 5927, 5937, 5961, 5973, 5976, 5978, 5980, 5982, 6001, 6002, 6044, 6045, 6074, 6076, 6085, 6088, 6097, 6098, 6124, 6130, 6165, 6221, 6227, 6243, 6256];
        $resolved = [];
        foreach ($ides as $id) {
            $solicitud = $portabilidadREP->findById($id);
            $subpath = 'solicitudes/portabilidad/'.$solicitud->getId().'/';
            if($solicitud->getFormPaso() == 5) {
                $saved = false;
                do {
                    try {
                        $secuencia = $portabilidadREP->countConfirmados() + 1;
                        $portabilidadREP->confirmar($solicitud, $this->addZerosBefore($secuencia, 6));
                        $portabilidadREP->save($solicitud);
                        $saved = true;
                    } catch (\Exception $e) {
                        // Si hay error es porque la secuencia no era única :(
                    }
                } while(!$saved);
                if(!$solicitud->getIsPrepagoAfter()) {
                    //Genero por última vez el pdf
                    $this->get('app.services.pdf_generator')->generateSolicitudPortabilidad($solicitud, $solicitud->getClienteIdentificacion().'-solicitud.pdf', $subpath);
                    //Envio los correos
                    $this->notificarCliente($solicitud);
                    $this->notificarAsesores($solicitud);
                    array_push($resolved, $id);
                }
            }
        }
        return new JsonResponse($resolved);
    }*/

    protected function validaCaptcha(Request $request)
    {
        $secret = $this->getParameter('secretdatasitekey');
        $recaptcha = new \ReCaptcha\ReCaptcha($secret);
        $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
        $resp = $recaptcha->verify($request->request->get('g-recaptcha-response'), $remoteIP);
        $invalido = true;
        if ($resp->isSuccess()) {
            $invalido = false;
        }
        return $invalido;
    }

}