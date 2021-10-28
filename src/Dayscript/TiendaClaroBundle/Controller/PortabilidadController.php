<?php

namespace Dayscript\TiendaClaroBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\PhpBridgeSessionStorage;
use Dayscript\TiendaClaroBundle\Model\opcionesSelects;
use Dayscript\TiendaClaroBundle\Model\opcionesSelectsNew;
use Dayscript\TiendaClaroBundle\Model\DayscriptSoap;
use Dayscript\TiendaClaroBundle\Entity\Plan;
use Dayscript\TiendaClaroBundle\Helper\Classes\Step;
use Dayscript\TiendaClaroBundle\Helper\Classes\ConfigClaro;
use Dayscript\TiendaClaroBundle\Entity\Accesorios_DatosTiendaPersonas;


/**
* @Route("/formulario")
*/
class PortabilidadController extends Controller {
    
    function __construct() {
        /* Symphony session */

        if (session_id() == '') {
            //ini_set('session.save_handler', 'files');
            //ini_set('session.save_path', '/tmp');
            session_start();
        }
        
        $this->session = new Session(new PhpBridgeSessionStorage());
        $this->session->start();

        /* Steps initialization */

        $index = new Step("catalogue-1.png", "catalogue-2.png", "catalogue-3.png", "Catálogo", "equipment-index");
        $show = new Step("eye-1.png", "eye-2.png", "eye-3.png", "Detalle<br>de plan", "equipment-detail");
        $form = new Step("form-1.png", "form-2.png", "form-3.png", "Formulario", "equipment-form");
        $success = new Step("check-1.png", "check-2.png", "check-3.png", "¡Listo!", "equipment-success");

        $this->newLineSteps = [$index, $show, $form, $success];
        $this->callbackSteps = [$index, $show, $form];
        $this->portabilitySteps = [$index, $show, $form, $success];
        $this->renovationSteps = [$index, $show, $form, $success];
        $this->migrationSteps = [$index, $show, $form, $success];
        $this->deviceSteps = [$index, $show, $form, $success];


        $this->options = [
            'nuevo' => 1,
            'portabilidad' => 2,
            'renovacion' => 3,
            'migracion' => 4,
            'Portabilidad' => 2
        ];

        $this->tags = [
            1 => 'nuevo',
            2 => 'portabilidad',
            3 => 'renovacion',
            4 => 'migracion'
        ];
    }

    function getSteps($option) {
        switch ($option) {
            case 1:
                return $this->newLineSteps;
            case 2:
                $callback = $this->getDoctrine()->getManager()->getRepository(Plan::class)->getParameter('BANDERA_CALLBACK');
                return $callback['VALOR'] == 'S' ? $this->portabilityStepsCB : $this->portabilitySteps;
            case 3:
                return $this->renovationSteps;
            case 4:
                return $this->migrationSteps;
            default:
                return $this->portabilitySteps;
        }
    }

    function getStepIndex($tag, $option) {
        switch ($tag) {
            case 'index':
                return 1;
            case 'show':
                return 2;
            case 'form':
                return 3;
            case 'success':
                return 4;
        }
    }
	
	function getOpciones($tipodeportabilidad,$idequipo) {
                $em = $this->getDoctrine()->getManager();


        switch ($tipodeportabilidad) {
            case 'LineaNueva':
                $opciontrx = 1;
                $equipo=$em->getRepository('DayscriptTiendaClaroBundle:Equipo')->consultarDatos($idequipo,$opciontrx)[0];
		$cuotainicial = $equipo["CUOTAINICIAL"];
                if ($cuotainicial!="0"):
                    $subject="Línea nueva con equipo financiado y cuota inicial";
                    $opciontable = 4; 
                else:
                    $subject="Línea nueva con equipo financiado";
                    $opciontable = 9; 
                endif;
                break;
            case 'LineaNuevaPromocion':
                $opciontrx = 1;
				$subject="Línea nueva con equipo financiado";
				$opciontable = 5;
				break;
            case 'Portabilidad':
                $opciontrx = 2;
				$subject="Portabilidad con equipo financiado";
				$opciontable = 2;
				break;
			case 'PortabilidadEquipo':
                $opciontrx = 9;
                $subject="Renovación de equipo";
                $opciontable = 37;
                break;
            case 'Renovacion':
                $opciontrx = 3;
				$subject="Renovación de equipo";
				$opciontable = 1;
				break;
            case 'RenovacionEquipo':
                $opciontrx = 8;
                $subject="Renovación de equipo";
                $opciontable = 36;
                break;
			case 'Migracion':
                $opciontrx = 4;
				$subject="Solicitud Migración";
				$opciontable = 3;
				break;
            case 'Iot':
                $opciontrx = 15;
                $subject="Solicitud Equipo IOT";
                $opciontable = 15;
				break;
            case 'Accesorios':
                $opciontrx = 14;
                $subject="Solicitud de Accesorio";
                $opciontable = 14;
				break;
            case 'EquiposFinanciados':
                $opciontrx = 18;
                $subject="Solicitud Equipo Financiado";
                $opciontable = 18;
                break;
			case 'IotNuevo':
                $opciontrx = 7;
                $subject="Solicitud CAMPAÑAS SMS IOT";
                $opciontable = 28;
				break;
			case 'VentaWhatsapp':
                $opciontrx = null;
                $subject="Solicitud Venta Whatsapp";
                $opciontable = 35;
				break;
			case 'VentaWhatsappCel':
                $opciontrx = null;
                $subject="Solicitud Venta Celular Whatsapp";
                $opciontable = 38;
				break;
			case 'LandingCanalesDth':
                $opciontrx = 46;
                $subject="Solicitud Canales Dth Abril";
                $opciontable = 46;
				break;
        }
		
		$opciones = [
			"opciontrx"   => $opciontrx,
			"subject"     => $subject,
			"opciontable" => $opciontable
		];

		return $opciones;
    }

	function getStepsWithUrls($stepIndex, $data) {
        $steps = [];
		$em = $this->getDoctrine()->getManager();
		$equipo=$em->getRepository('DayscriptTiendaClaroBundle:Equipo')->mostrarEquipoInicial($data["idequipo"],$data['option'])[0];
		$callback = $equipo["BANDFORM"];
        switch ($data['option']) {
            case 2:
                //$steps = $callback ? $this->callbackSteps : $this->portabilitySteps;
				$steps = $this->portabilitySteps;
                break;
            case 3:
				//$steps = $callback ? $this->callbackSteps : $this->renovationSteps;
				$steps = $this->renovationSteps;
                break;
            case 4:
				//$steps = $callback ? $this->callbackSteps : $this->migrationSteps;
				$steps = $this->migrationSteps;
                break;
            case 6:
                $steps = $this->deviceSteps;
                break;
            default:
				$steps = $this->newLineSteps;
        }

        foreach ($steps as $i => &$step) {
            if ($i < $stepIndex) {
                $this->setStepUrl($step, $data);
            }
        }
		
        return $steps;
    }
	
	function setStepUrl($step, $data) {
        switch ($step->id) {
            case 'equipment-index':
                if($data['marca']!="NA")
                {
                    $args = [
                       'opcion' => $data['option'],
                       'marca' => $data['marca']
                       ];
                    $step->url = $this->generateUrl("TiendaClaro_EquipoMarca", $args);
                }else{ 
                   $args = [
                    'opcion' => $data['option'],
                    'transaccion' => 'NA'
                    ];
                    $step->url = $this->generateUrl("TiendaClaro_Catalogo_Equipos", $args);  
                }
               
                break;
			case 'equipment-detail':
				$args = [
                    'opcion' => $data['option'],
                    'idequipo' => $data['idequipo'],
                    'idequipoco' => $data['idequipoco'],
                    'nombrequipo' => $data['nombrequipo'],
                    'planxdefault' => $data['planxdefault'],
                    'formlinea' => $data['marca']
                ];
                $step->url = $this->generateUrl("TiendaClaro_producto_vermas", $args);
                break;
			case 'equipment-form':
			    if ($data['option'] ==  6){
                    $args = [
                        'idequipo' => $data['idequipo'],
                        'nombrequipo' => $data['nombrequipo'],
                        'opcion' => $data['option'],
                        'idequipoco' => $data['idequipoco']
                    ];
                    $step->url = $this->generateUrl("TiendaClaro_formoffline", $args);

                }else{
                    $args = [
                        'url' => $data['url'],
                        'idequipo' => $data['idequipo'],
                        'idequipoco' => $data['idequipoco'],
                        'nombrequipo' => $data['nombrequipo'],
                        'planxdefault' => $data['planxdefault'],
                        'opcion' => $data['option'],
                        'formlinea' => $data['marca']
                    ];
                    $step->url = $this->generateUrl("TiendaClaro_portabilidad", $args);
                }
                break;
        }
    }

    /**
     * @Route("/ingreso/{url}/{idequipo}/{idequipoco}/{nombrequipo}/{planxdefault}/{opcion}/{formlinea}", name="TiendaClaro_portabilidad")
     * @Route("/ingreso/{url}/{idequipo}/{idequipoco}/{nombrequipo}/{planxdefault}/{opcion}/{formlinea}/", name="TiendaClaro_portabilidad_slash")
     */
    function form_paso1Action(Request $request, $url, $idequipo, $idequipoco, $nombrequipo, $planxdefault, $opcion, $formlinea) {

        $Accesories = array();
        $em = $this->getDoctrine()->getManager();
		$priceAcc = 0;
        if($request->isMethod('POST')){

            if(isset($_POST['carritoAccesorios'])){

                foreach ( $_POST["carritoAccesorios"] as $key=>$itemAccesorio ) {
                    $priceAccesory = $em->getRepository('DayscriptTiendaClaroBundle:Accesorio')->getAccesoryById($itemAccesorio)['VALOR_CUOTA'];
                    $allFor = $priceAccesory * $_POST["contAccesorie"][$key];


                    $Accesories[] = [

                        'idaccesorie'=>$itemAccesorio,
                        "name"=>strtoupper($_POST["nameAccesories"][$key]),
                        "cantity"=>$_POST["contAccesorie"][$key],
                        "allFor"=>$allFor

                    ];
				$priceAcc += $allFor;
                }

            }


        }elseif (isset($_SESSION['listAccesories'][$idequipo])){

            $Accesories = $_SESSION['listAccesories'][$idequipo];

        }

        $_SESSION['listAccesories'][$idequipo]=$Accesories;

        $idplan=$planxdefault;

        $opcionesSelectsnew= new opcionesSelectsNew();
        $provincias=$opcionesSelectsnew->get['Provincias'];
        $ciudades=null;

        switch ($opcion){
            case 8:
                $opcion = 3;
                $opcionOrigen = 8;
                break;
            case 9:
                $opcion = 2;
                $opcionOrigen = 9;
                break;
            default:
                $opcionOrigen = $opcion;
                break;
        }


		$opcion= ($opcion==6 || $opcion==9) ? 1 : $opcion;
		$etiquetasequipo = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->etiquetasporEquipo($idequipo,$opcion);
        $accesorioequipo = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->accesorioPorEquipo($idequipo,$opcion);
		$equipo=$em->getRepository('DayscriptTiendaClaroBundle:Equipo')->mostrarEquipoInicial($idequipo,$opcion);
		$promocion = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanPromocion($idplan);
		$incluye = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanIncluye($idplan);
		$plan = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanEquipo2($idplan);
		$TermyCond = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->PlanterminosyCond($idplan);				
		$equipoColor=$em->getRepository('DayscriptTiendaClaroBundle:EquipoColor')->BuscarEquipoColor($idequipoco);
		$equipoporcolor = $em->getRepository('DayscriptTiendaClaroBundle:EquipoColor')->buscarColor($idequipo,$idequipoco);
		$id_plan=$plan[0]['CODIGOCLARO'];
		$planBase=$em->getRepository('DayscriptTiendaClaroBundle:Plan')->buscarPlanSeleccionado($id_plan);
        $equipo[0]["IMAGEN"]=$equipoporcolor[0]["URLIMGFRONTAL"];
		$estaenpromocion=$equipo[0]["ENPROMO"];
        $id_equipo_webservices=$equipoColor[0]["CODIGO_WS4"];

        // validar si el plan es correcto
        $planes_configurados = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->getEquipoPlanes($idequipo, $opcion);
        $planEncontrado = 0;
        
        foreach($planes_configurados as $itemPlan){
            if($itemPlan['IDPLAN'] == $planxdefault){
                $planEncontrado = 1;
            }
        }

        if($planEncontrado != 1)
        {
            // redirect al plan principal
            $datadicional = $equipo[0]["DATOSADICIONALES"];

            if($datadicional=="1"){
            	$datosadicionales = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->consultarDatos($idequipo, $opcion)[0];
                $bpdestacado = $datosadicionales["IDPLAN"];
            }else{
                $bpdestacado = $equipo[0]['IDPLANDESTACADO'];
            }
            $args = [
            	"url"=>$url,
            	"idequipo"=>$idequipo,
            	"idequipoco"=>$idequipoco,
            	"nombrequipo"=>$nombrequipo,
            	"planxdefault"=>$bpdestacado,
            	"opcion"=>$opcion,
            	"formlinea"=>$formlinea
            ];

            $url = $this->generateUrl('TiendaClaro_portabilidad', $args);
            return $this->redirect($url);
        }

		if($estaenpromocion){
			$valores = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->buscarEquipoEnPromo($idequipo,$opcion,$idplan)[0];
			$cantmeses=$valores["CUOTAMESES"];
		}
		else{ 
			$valores=$this->valoresPlan($idplan,$id_equipo_webservices,$idequipo,$opcion);
			$cantmeses = $valores["CANTMESES"];
		}
		//print_r($valores);
		$equipo[0]["TODOINCLACCESORIOS"] = $valores["TODOPOR"]+$priceAcc;
		$equipo[0]["tarifa_basica_plan"] = $valores["TARIFABASICAMENSUAL"];
		$equipo[0]["cuota_no_finan"] = $valores["CUOTANOFINAN"];
		$equipo[0]["mensualFinal"] = $valores["CUOTAMENSUALFINAL"];
        $equipo[0]["cuota_equipo"] = $valores["CUOTAEQUIPO"];
        $equipo[0]['nombrePlan'] = $planBase[0]['NOMBREPLAN'];
        $equipo[0]['TODOPORINCLUIDOIMPUESTOS'] = $valores["TODOPOR"];
		$equipo[0]['VALORPOSTPAGO'] = $valores["TODOPOR"];

        $bandcambios = $equipo[0]["BANDFORM"];

        $tran = ($url == "LineaNuevaPromocion" || $url == "LineaNueva" ) ? "LINEA-NUEVA:" : strtoupper($url) . ":";
        $paraconsulta = "URLCALLBACK_" . $tran;
        $urlcall = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->UrlCallBack($paraconsulta);
        $nombretemp = mb_strtoupper($equipo[0]["NOMBRECOMERCIAL"], 'UTF-8');//str_replace(" ", "-", $equipo[0]["NOMBRECOMERCIAL"]);
        $nombreplantemp =  mb_strtoupper($plan[0]["NOMBREPLAN"], 'UTF-8');//str_replace(" ", "-", $plan[0]["NOMBREPLAN"]);
        $urltem  = "descripcionCallBack=" . $tran . " " . $nombretemp . " + " . $nombreplantemp;//"descripcionCallBack=" . $tran . "-" . $nombretemp . "-" . $nombreplantemp;
        $urltem2 = $tran . " " . $nombretemp . " + " . $nombreplantemp;//$tran . "-" . $nombretemp . "-" . $nombreplantemp;
        
        foreach ( $Accesories as $key=>$itemAccesorio ) {
            $urltem  .= ' + '.$itemAccesorio['cantity'].' '.mb_strtoupper($itemAccesorio['name'], 'UTF-8');//'-+-'.$itemAccesorio['cantity'].'-'.str_replace(" ", "-",$itemAccesorio['name']);
            $urltem2 .= ' + '.$itemAccesorio['cantity'].' '.mb_strtoupper($itemAccesorio['name'], 'UTF-8');//'|'.$itemAccesorio['cantity'].'-'.str_replace(" ", "-",$itemAccesorio['name']);
        }
		
        $urlform = $urlcall . "" . $urltem;
		
        $previewSteps = $this->setStepPreview();

        $stepIndex = $this->getStepIndex('form', $opcion);
        $steps = $this->getStepsWithUrls($stepIndex, ['option' => $opcion, 'idequipo' => $idequipo, 'idequipoco' => $idequipoco, 'nombrequipo' => $nombrequipo, 'planxdefault' => $planxdefault, 'url' => $url,'marca'=>$formlinea]);

		if ($formlinea == "NA") {
            $args = ['opcion' => $opcionOrigen, 'transaccion' => 'NA'];
            $urlbackCatal = $this->generateUrl('TiendaClaro_Catalogo_Equipos', $args);
        } else {
            $args = ['opcion' => $opcionOrigen, 'marca' => $formlinea];
            $urlbackCatal = $this->generateUrl('TiendaClaro_EquipoMarca', $args);
        }
        $argsvm = ['opcion' => $opcionOrigen, 'idequipo' => $idequipo, 'idequipoco' => $idequipoco, 'nombrequipo' => $nombrequipo, 'planxdefault' => $planxdefault, 'formlinea' => $formlinea];
        $urlbackvermas = $this->generateUrl('TiendaClaro_producto_vermas', $argsvm);
		$urlSecure = $this->container->getParameter("urlSecure");
		$urlicon = $urlSecure."images/thankyoupage/Telefono.svg";
        $args = [
            'opcion' => $opcionOrigen,
            'option' => $opcionOrigen,
            'steps' => $steps,
            'stepIndex' => $stepIndex,
            'equipos' => $equipo,
            'promocion' => $promocion,
            'cantpromo' => count($promocion),
            'incluye' => $incluye,
            'cantincluye' => count($incluye),
            'formuCallBack' => $bandcambios,
            'urltemp' => $urlform,
            'prevStep' => $previewSteps,
            'contacc' => count($accesorioequipo),
            'accesorios' => $accesorioequipo,
            'conteti' => count($etiquetasequipo),
            'etiquetasequipo' => $etiquetasequipo,
            'equipoColor' => $equipoColor,
            'provincias' => $provincias,
            'tipodeportabilidad' => $url,
            'idequipo' => $idequipo,
            'idequipoco' => $idequipoco,
            'nombrequipo' => $nombrequipo,
            'planxdefault' => $planxdefault,
            'termycond' => $TermyCond,
            'cantmeses' => $cantmeses,
            'urlcatalogo' => $urlbackCatal,
            'urlvermas' => $urlbackvermas,
			'formlinea'=>$formlinea,
			'Accesories' => $Accesories,
            'ciudades'=>$ciudades,
            'stringData'=>$urltem2,
            'accequipo'=>$accesorioequipo,
			'urlicon'=>$urlicon
        ];

        return $this->render('DayscriptTiendaClaroBundle:RenovacionEquipos:IndexPaso1.html.twig', $args);     	
    }

    public function valoresPlan($idplan, $id_equipo_webservices, $idequipo, $opcion) {
        $em = $this->getDoctrine()->getManager();
        $dayscriptSoap = new DayscriptSoap();
        $tarifa_basica_plan = 0;
        $cuota_equipo = 0;
        $cuota_no_finan = 0;
        $adicional = 0;
        $cuota_mensual_final = 0;
        $linea_equipo = "LINEA_FINANCIAMIENTO=5|TIPOS_APROBACION=14,10,20,11|CODIGO_EQUIPOS=" . $id_equipo_webservices . "|";
        $v_par_cuatro = "236,262";
        $v_par_cinco = "2,1";
        $v_par_seis = "PRCCCOMP";
        $result_equipo = $dayscriptSoap->doRequestSR("2006", $linea_equipo, $v_par_cuatro, $v_par_cinco, $v_par_seis, "");
        $cantmeses = 18;
        $bandplan = false;
        $datadicional = "0";
        //$equipo = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->Buscarequipo($idequipo)[0];
        $plan = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanEquipo2($idplan)[0];
        $equip = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->mostrarEquipoInicial($idequipo, $opcion)[0];
        $id_plan = $plan['CODIGOCLARO'];
        $datadicional = $equip["DATOSADICIONALES"];
        $enliquidacion = $equip["ENLIQUIDACION"];
        if ($datadicional == "1") {
            $datosadicionales = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->consultarDatos($idequipo, $opcion)[0];
            $cantmeses = $datosadicionales["CUOTAMESES"];
        }
        $xml = simplexml_load_string($result_equipo);
        if ($xml !== false) {
            foreach ($xml->element as $item) {
                for ($i = 0; $i < count($item->planes->plan); $i++) {
                    if ($item->planes->plan[$i]->id_plan == $id_plan) {
                         $bandplan = true;
                        if ($cantmeses == 24 || $enliquidacion == "1") {
                            $todopor = (float) $item->planes->plan[$i]->cuota_incluida_sin_iva;
                            $cuota_equipo = (float) $item->planes->plan[$i]->cuota_equipo;
                            $cuota_mensual_final = (float) $item->planes->plan[$i]->cuota_incluida_fin;
                        }
                        if ($cantmeses == 18) {
                            $todopor = (float) $item->planes->plan[$i]->cuota_incluida_sin_iva_18;
                            $cuota_equipo = (float) $item->planes->plan[$i]->cuota_equipo_18;
                            $cuota_mensual_final = (float) $item->planes->plan[$i]->cuota_incluida_fin_18;
                        }
                        $tarifa_basica_plan = (float) $item->planes->plan[$i]->tarifa_basica_plan;
                        $cuota_no_finan = (float) $item->planes->plan[$i]->cuota_inicial_no_financiable;
                    }
                }
            }
        }
        if(!$bandplan)
        {
            if ($datadicional == "0") {
                $equipoTabla = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->Buscarequipo($idequipo);

                $todopor = $equipoTabla[0]["VALOR_POSTPAGO17"];
                $cuota_mensual_final = $equipoTabla[0]["TODO_POR_INCLUIDO_IMPUESTOS20"];
                $tarifa_basica_plan = $plan["TARIFABASICAMENSUAL"];
                $cuota_equipo = $todo_por - $tarifa_basica_plan;
            } else if ($datadicional == "1") {

                $todopor = $datosadicionales["VALORPOSTPAGO"];
                $cuota_mensual_final = $datosadicionales["TODOPORINCLUIDOIMPUESTOS"];
                $tarifa_basica_plan = $plan["TARIFABASICAMENSUAL"];
                $cuota_equipo = $todopor - $tarifa_basica_plan;
            }
        } 

        $equipos = [
            "CUOTANOFINAN" => $cuota_no_finan,
            "CUOTAMENSUALFINAL" => $cuota_mensual_final,
            "CUOTAEQUIPO" => $cuota_equipo,
            "TARIFABASICAMENSUAL" => $tarifa_basica_plan,
            "TODOPOR" => $todopor,
            "CANTMESES" => $cantmeses
        ];
        return $equipos;
    }

    /**
     * @Route("/validarformpaso1porta", name="TiendaClaro_validarformpaso1porta")
     * @Route("/validarformpaso1porta/", name="TiendaClaro_validarformpaso1porta_slash")
     */
    public function validarformpasoporta1Action(request $request)    
    {
		$response = new JsonResponse();
		$error=true;
		$redirect = false;
		$msg="";
		$sololetras = "/^[a-zA-ZñÑ\s]+$/";
		$solonumeros = "/^[0-9]+$/";
		$sololetrasynumeros = "/^[0-9a-zA-Z ]+$/";

		$nombre = trim($_POST['nombre']);
		$apellido = trim($_POST['apellido']);
        $numdoc = trim($_POST['numdoc']);
        $celular = trim($_POST['celular']);
        $email = trim($_POST['email']);
        $provincia = trim($_POST['provincia']);
        $ciudad = trim($_POST['ciudad']);
		$stringData = trim($_POST['stringData']);
        //$tipodocumento = trim($_POST['tipodocumento']);
        $tipodocumento = 'CED';
        if(isset($_POST['suscripcion'])) {

            $suscripcion = 'S';

        }else{

            $suscripcion = 'N';

        }
		$recaptcha = trim($_POST['g-recaptcha-response']);
		
		if (!isset($nombre) || empty($nombre) || !preg_match($sololetras,$nombre) || !isset($apellido) || empty($apellido) || !preg_match($sololetras,$apellido)){
			$msg="Ingresa tu nombre correctamente.";
		}elseif (!isset($email) || empty($email)){
			$msg="Ingrese correctamente el correo de compra";
        }elseif (!isset($tipodocumento) || empty($tipodocumento)){
            $msg="Seleccione el tipo de documento";
        }elseif($this->emailValidator($email)["error"]){
			$msg = $this->emailValidator($email)["msg"];
		}elseif (!isset($numdoc) || empty($numdoc) || !preg_match($solonumeros,$numdoc) || ( $tipodocumento == 'CED' and  strlen($numdoc) != 10) ){
			$msg="Ingresa tu numero de cedula correctamente.";
		}elseif (!isset($provincia) || empty($provincia)){
			$msg="Selecciona la provincia donde vives.";
		}elseif (!isset($ciudad) || empty($ciudad)){
            $msg="Selecciona la ciudad donde vives.";
        }elseif (!isset($celular) || empty($celular) || !preg_match($solonumeros,$celular) || (strlen($celular) != 10)){
			$msg="Ingresa tu numero de celular correctamente.";
		}elseif(!isset($recaptcha) || empty($recaptcha) || $this->validaCaptcha($request)){
			$msg="Demuestra que no eres un robot";
		}else{
			$em = $this->getDoctrine()->getManager();
			$tipodeportabilidad = trim($_POST['tipodeportabilidad']);
			$planxdefault = trim($_POST['planxdefault']);
			$nombrequipo = trim($_POST['nombrequipo']);
                        $idequipo = trim($_POST['idequipo']);
			$remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
			$opciones = $this->getOpciones($tipodeportabilidad,$idequipo);
			$subject = $opciones["subject"];
			$opciontable = $opciones["opciontable"];
			$plan = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanEquipo2($planxdefault)[0];
			$nombreplan = $plan["NOMBREPLAN"];
			$codigoclaro= $plan["CODIGOCLARO"];
			$equiponombre=str_replace ("_", " ", $nombrequipo);
			$ide = $em->getRepository('DayscriptTiendaClaroBundle:Compra')->findbyId();

            $opcionesSelectsnew= new opcionesSelectsNew();
            $ciudad = $opcionesSelectsnew->get[$provincia][$ciudad];
            $provincia = $opcionesSelectsnew->get['Provincias'][$provincia];

			if (isset($_POST['executeCB'])){
				$con = new \Dayscript\CallbackWs\CallbackWsConnection();
				$phone = substr($celular, 1, 9); 
				$name=$nombre." ".$apellido." ".$numdoc;
				$stringData = $stringData."|".$provincia."|".$ciudad."|".$email;

				switch ($opciones["opciontrx"]){
                    case 1:
                    case 15:
                    case 2:
                    case 3:
					case 9:
                    case 8:
                        $sQueueName = "Callback_Tienda_1";
                        break;
                    case 4:
                        $sQueueName = "Callback_CAT_Mig";
                        break;
					case 7:
                        $sQueueName = "";
                        break;
                    default:
                        $sQueueName = "Callback_Tienda_por";
                        break;
                }
                
				$requestcallback = [
					"telefono"   => $phone,
					"nombre"     => $name,
					"stringData" => $stringData,
					"sQueueName" => $sQueueName
				];
				$requestcallback = json_encode($requestcallback);
				$responsecallback=$con->executeCallback($phone,$name,$stringData,$sQueueName);
				$responsecallback= json_encode($responsecallback);
				if (strpos($responsecallback,"SUCCESS")){
					$status = "success";
				}else{
					$status = "error";
				}
				
				$message = \Dayscript\CallbackWs\CallbackMessage::getMessage($status); 
				$_SESSION["messagecallback"]=$message;
			}else{
				$requestcallback=null;
				$responsecallback=null;
			}
			$em->getRepository('DayscriptTiendaClaroBundle:Compra')->insertadatos($ide,$nombre,$apellido,$email,$numdoc,$celular,$provincia,$opciontable,$equiponombre,$codigoclaro,$nombreplan,null,$remoteIP,$tipodocumento,$ciudad,$suscripcion,$requestcallback,$responsecallback);
//            $ide = 50;



            $Accesories = array();
            if(isset($_POST['carritoAccesorios'])){

                foreach ( $_POST["carritoAccesorios"] as $key=>$itemAccesorio ) {


                    $purchasedAccesory = new Accesorios_DatosTiendaPersonas();

                    $purchasedAccesory->setIdDatostiendapersonas($ide);
                    $purchasedAccesory->setIdAccesorio($itemAccesorio);
                    $purchasedAccesory->setCantidad($_POST["contAccesorie"][$key]);

                    $datosAccesory = $em->getRepository('DayscriptTiendaClaroBundle:Accesorio')->getAccesoryById($itemAccesorio);

                    $purchasedAccesory->setNombre($datosAccesory['NOMBRECOMERCIAL']);
                    $purchasedAccesory->settodopor($datosAccesory['VALORPOSTPAGO']);
                    $purchasedAccesory->setPrecioFinal($datosAccesory['TODOPORINCLUIDOIMPUESTOS']);

                    $Accesorios_datosRepository = $em->getRepository('DayscriptTiendaClaroBundle:Accesorios_DatosTiendaPersonas');
                    $Accesorios_datosRepository->saveAccesoriosCompra($purchasedAccesory);

                    $Accesories[] = [

                        'idaccesorie'=>$itemAccesorio,
                        "name"=>strtoupper($datosAccesory['NOMBRECOMERCIAL']),
                        "cantity"=>$_POST["contAccesorie"][$key],
                        "allFor"=>$datosAccesory['TODOPORINCLUIDOIMPUESTOS']

                    ];

                }

            }

            $suscripcion = $opcionesSelectsnew->get[$suscripcion];

            if (!isset($_POST['executeCB'])) {
                $mensaje = $this->creaMensaje($nombreplan, $equiponombre, $nombre, $apellido, $email, $celular, $provincia, $numdoc, $Accesories, $ciudad, $suscripcion);
                $this->enviarCorreo($subject, $mensaje, $opciones["opciontrx"]);
            }

            $_SESSION["datosportabilidad"] = [
				"servicio" => $celular,
				"email"    => $email
			];
			$error=false;
			$redirect = true;
		}
		
		$response->setData(array("error"=>$error,
								 "msg"=>$msg,
								 "redirect"=>$redirect));
		return $response;
	}
	
    /**
     *   @Route("/confirmacion/{tipodeportabilidad}/{idequipo}/{idequipoco}/{nombrequipo}/{planxdefault}", name="TiendaClaro_portabilidad_registro")
     *   @Route("/confirmacion/{tipodeportabilidad}/{idequipo}/{idequipoco}/{nombrequipo}/{planxdefault}/", name="TiendaClaro_portabilidad_registro_slash")
     */
   public function form_paso2Action(Request $request,$tipodeportabilidad,$idequipo,$idequipoco,$nombrequipo,$planxdefault)
   {
       $formlinea = "NA";
	   $opciones = $this->getOpciones($tipodeportabilidad,$idequipo);
       switch ($opciones["opciontrx"]){
           case 8:
               $opciones["opciontrx"] = 3;
               $opcionOrigen = 8;
               break;
           case 9:
               $opciones["opciontrx"] = 2;
               $opcionOrigen = 9;
               break;
           default:
               $opcionOrigen = $opciones["opciontrx"];
               break;
       }
	   $urlbackvermas ="";
	   if (!$request->isMethod('POST')){
		   $args = [
				'url'          => $tipodeportabilidad,
				'idequipo'     => $idequipo,
				'idequipoco'   => $idequipoco,
				'nombrequipo'  => $nombrequipo,
				'planxdefault' => $planxdefault,
				'opcion'       => $opcionOrigen,
				'formlinea'    => $formlinea
		   ];
		   return $this->redirect($this->generateUrl('TiendaClaro_portabilidad',$args));
	   }else{
		   $em = $this->getDoctrine()->getManager();
		   
		   

		   $equipo=$em->getRepository('DayscriptTiendaClaroBundle:Equipo')->mostrarEquipoInicial($idequipo,$opciones["opciontrx"]);
		   //var_dump($equipo);exit();
		   $plan = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanEquipo2($planxdefault);
		   $datosportabilidad = $_SESSION["datosportabilidad"];
		   $previewSteps = $this->setStepPreview();
		   $argsvm = ['opcion'=>$opcionOrigen,'idequipo'=>$idequipo,'idequipoco'=>$idequipoco,'nombrequipo'=>$nombrequipo,'planxdefault'=>$planxdefault,'formlinea'=>$formlinea];
           $urlbackvermas = $this->generateUrl('TiendaClaro_producto_vermas',$argsvm);
		   $stepIndex = $this->getStepIndex('success', $opcionOrigen);
           $steps = $this->getStepsWithUrls($stepIndex,['option' => $opcionOrigen, 'idequipo' => $idequipo, 'idequipoco' => $idequipoco, 'nombrequipo' => $nombrequipo, 'planxdefault' => $planxdefault, 'url' => $tipodeportabilidad,'marca'=>$formlinea]);
		   /*Share Buttons*/
		   $urlSecure = $this->container->getParameter("urlSecure");
		   $urlpromociones = $this->generateUrl('TiendaClaro_home');
		   //$title = "Comparte en tus redes sociales la reserva de tu nuevo smartphone";
		   //$metatitle = "He realizado la reserva del ".ucwords(strtolower($equipo[0]["NOMBREMARCA"]))." ".ucwords(strtolower($equipo[0]["NOMBRECOMERCIAL"]))." con ".ucwords(strtolower($plan[0]["NOMBREPLAN"]));
		   //$content = "Tarifa del plan $".$_SESSION["metadata"]["tarifaplan"].", Cuota por equipo $".$_SESSION["metadata"]["cuotaequipo"].", Todo por $".$_SESSION["metadata"]["todopor"].", Cuota mensual con IMP. $".$_SESSION["metadata"]["cuotamensual"];
		   $title = "Cuéntale a tus amigos sobre esta mega promo";
		   $content="";
		   $metatitle = "Ya tengo mi ".ucwords(strtolower($equipo[0]["NOMBREMARCA"]))." ".ucwords(strtolower($equipo[0]["NOMBRECOMERCIAL"])). " con ".ucwords(strtolower($plan[0]["NOMBREPLAN"]))." Todo Por $".$_SESSION["metadata"]["todopor"]."+imp. ¡Aprovecha esta publicación dale click y reserva el tuyo!";
		   $urlimage = $urlSecure.$equipo[0]["URLIMGPRINCIPAL"];
		   $redirect = $urlSecure."vermas/".$opcionOrigen."/".$idequipo."/".$idequipoco."/".$nombrequipo."/".$planxdefault."/NA";
		   $metadata = array($metatitle,$content,$urlimage,$redirect);
		   $metadata = implode("||",$metadata);
		   $metadata = base64_encode($metadata);
		   $urlmetadata = $urlSecure."compartir/".$metadata;
		   $urlicon = "images/thankyoupage/Telefono.svg";
		   /*End Share Buttons*/
		   $args = [
				'equipos' =>$equipo,
				'idequipo'=>$idequipo,
				'idequipoco'=>$idequipoco,
				'nombrequipo'=>$nombrequipo,
				'planxdefault'=>$planxdefault,
				'plan'=>$plan,
				'servicio'=>$datosportabilidad["servicio"],
				'email'=>$datosportabilidad["email"],
				'tipodeportabilidad'=>$opciones["opciontrx"],
				'steps'=>$steps,
				'stepIndex'=>$stepIndex,
				'prevStep' => $previewSteps,
				'opcion'   => $opcionOrigen,
				'urlvermas'=> $urlbackvermas,
				'urlpromociones' => $urlpromociones,
				'title' => $title,
				'content' => $content,
				'urlimage' => $urlimage,
				'urlmetadata' => $urlmetadata,
				'metatitle' => $metatitle,
				'urlicon' => $urlicon
		   ];
		   
		   if($opcionOrigen==4){
				return $this->render('DayscriptTiendaClaroBundle:RenovacionEquipos:IndexPaso2.html.twig',$args);
		   }else{
				return $this->render('DayscriptTiendaClaroBundle:RenovacionEquipos:CallbackIndex.html.twig',$args);
		   }
	   }
   }
   
    /**
     *   @Route("/experienciaUsuario", name="TiendaClaro_portabilidad_experienciaUsuario")
     *   @Route("/experienciaUsuario/", name="TiendaClaro_portabilidad_experienciaUsuario_slash")
     */
    public function ExperienciaUsuarioAction(){ 
    $experiencia=$_POST['experiencia'];
    $comentario=$_POST['comentario'];
    $transaccion=$_POST['transaccion'];
    $servicio=$_POST['servicio'];
    $calificacion=$_POST['calificacion'];
    $email=$_POST['email'];
    $medio=$_POST['medio'];
    $response = new JsonResponse();
    $em = $this->getDoctrine()->getManager();
	if($servicio!="")
	{
		$insert = $em->getRepository('DayscriptTiendaClaroBundle:DatosPersonas')->ExperienciaUsuario($experiencia,$comentario,$transaccion,$servicio,$email,$calificacion,$medio);
	}
    
    $response->setData(
                    array(
                        'envio' => "1"
                    ));
        return $response;  
        
   }
   
   function emailValidator($email){
		$error = false;
		$msg = "";
		$dayscriptSoap=new DayscriptSoap();
		$respmethod = $dayscriptSoap->doRequest_new($email);
		$xml = simplexml_load_string($respmethod);
		if ($xml !== false) {
			if($xml->PCK_RESPUESTA->COD_RESPUESTA == '1'){
				$error = true;
				$msg = "El correo ingresado es inválido.";
			}
		}else{				
				$error = true;
				$msg = "Ocurrió un error, por favor intenta de nuevo.";
		}
		
		$resp = [
			"error" => $error,
			"msg"   => $msg
		];
		
		return $resp;
    }
   
   function setStepPreview() {
        $prevCat  =  "DayscriptTiendaClaroBundle:Section/Vermas/previews:catalogo.html.twig"; //catalogo
        $prevDeta = "DayscriptTiendaClaroBundle:Section/Vermas/previews:show.html.twig"; //vermas
        $prevForm = "DayscriptTiendaClaroBundle:Section/Vermas/previews:form.html.twig"; //formulario		
		$preview = [$prevCat, $prevDeta, $prevForm];
		return $preview;
	}
	
	function validaCaptcha(request $request){
		$secret = $this->container->getParameter("secretdatasitekey");
		$recaptcha = new \ReCaptcha\ReCaptcha($secret);
		$remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
		$resp = $recaptcha->verify($request->request->get('g-recaptcha-response'), $remoteIP);
		$invalido = true;
		if ($resp->isSuccess()){
			$invalido = false;
		}
		return $invalido;
	}
   
     public function creaMensaje($plan,$equinom,$nomb,$apell,$email,$celular,$provincia,$cedula,$accesorios = array(),$ciudad = null,$suscripcion = null)
	 {
        $contenido	= "";
        $contenido	.= "<div style = 'width:500px;min-height:200px;height:auto;' align='center'>";
        $contenido	.= '    <div style="BORDER-BOTTOM:black thin solid;BORDER-LEFT:black thin solid;WIDTH:100%;BORDER-TOP:black thin solid;BORDER-RIGHT:black thin solid" align="center">';
        $contenido  .=          '<table border="0" align="center" width="500">';
        $contenido	.= '            <tr><td colspan="2"><p align="center">Formulario de Registro:</p></td></tr>';
        if($plan!=null)
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>PLAN: </b></td><td align="left">'.$plan.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>EQUIPO: </b></td><td align="left">'.$equinom.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>NOMBRE: </b></td><td align="left">'.$nomb.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>APELLIDO: </b></td><td align="left">'.$apell.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>EMAIL: </b></td><td align="left">'.$email.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>CELULAR: </b></td><td align="left">'.$celular.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>PROVINCIA: </b></td><td align="left">'.$provincia.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>CIUDAD: </b></td><td align="left">'.$ciudad.'</td></tr>';
        $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>SUSCRIPCION: </b></td><td align="left">'.$suscripcion.'</td></tr>';
         $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>CEDULA/PASAPORTE: </b></td><td align="left">'.$cedula.'</td></tr>';
         if (count($accesorios)>0){
             foreach ($accesorios as $key=>$itemAccesorio){
                 $contenido	.= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>ACCESORIO: </b></td><td align="left">'.$itemAccesorio['cantity'].' '.$itemAccesorio['name'].'</td></tr>';     }

         }
            $contenido	.= '            <tr><td colspan="2" height="30px">&nbsp;</td></tr>';
            $contenido	.= '        </table>';
            $contenido  .= '    </div>';
            $contenido	.= "</div>";
            
            return $contenido;
     }
     public function enviarCorreo($subject, $message, $opciontrx)
	 {
            $config = new ConfigClaro();
            $to=array("redessociales@claro.com.ec","vmedinag@claro.com.ec");
			//$to="jquinonez@grupo-link.com";
            switch($opciontrx){
                case 1:
                    $remitente='lineanuevacuotainicial@iclaro.com.ec';
					$to = "SACCCSUPVENTASDIGITAL@claro.com.ec";
                    break;
                case 2:
                    $remitente='portabilidad@iclaro.com.ec';
					$to = "SACCCSUPVENTASDIGITAL@claro.com.ec";
                    break;
				case 3:
                    $remitente='renovacion@iclaro.com.ec';
                    $to = "SACCCSUPVENTASDIGITAL@claro.com.ec";
                    break;
                case 4:
                    $remitente='migracion@iclaro.com.ec';
                    $to=array("redessociales@claro.com.ec");
                    break;
                case 9:
                    $remitente='portabilidad@iclaro.com.ec';
                    $to = "SACCCSUPVENTASDIGITAL@claro.com.ec";
                    break;
                case 8:
                    $remitente='renovacion@iclaro.com.ec';
                    $to = "SACCCSUPVENTASDIGITAL@claro.com.ec";
                    break;
                case 15:
                    $remitente='compraIot@iclaro.com.ec';
                    break;
                case 18:
                    $remitente='financiamientoEquipo@iclaro.com.ec';
                    $to= "SACCCSUPVENTASDIGITAL@claro.com.ec";
                    break;
				case 7:
                    $remitente='compraIot@iclaro.com.ec';
                    break;
				case 46:
                    $remitente='canalabrildth@iclaro.com.ec';
					$to = array("jquinonez@grupo-link.com");
                    break;
            }
            //$to=array("jquinonez@grupo-link.com");
            
            $config->setMAIL_FROM($remitente);
            $INTRA_BASE_PATH    = "/procesos/www/";
            $INTRA_BASE_HOST    = $config->getINTRA_BASE_HOST_SECURE(); //"https://www.porta.net";
            $INTRA_BASE_URL     = "/";
            $HEADER_IMAGE       = $INTRA_BASE_PATH . "WebSerTmp/images/mapa.jpg";
            $SITE_NAME          = $config->getSITE_NAME(); //"TU CUENTA PORTA";

            $mailer  = $this->get('mailer');
            $msg = $mailer->createMessage()
                              ->setSubject($subject)
                              ->setFrom(array($config->getMAIL_FROM() => $SITE_NAME))
                              ->setTo($to)
                              //->setCc($v_copy)
							  ->setBody(
                                       $this->renderView(
                                                                'DayscriptTiendaClaroBundle:Portabilidad:formulario.html.twig',
                                                                array('message' => $message)
                                                         ),
                                            'text/html'
                                                         );
            if($mailer->send($msg))
            {
                return true;
            }
            else
            {
                throw new \Exception("Hubo un problema con el servidor de correos.");
            }
     }
	 /*Landing otros usuarios*/
	  /**
     * @Route("/validarformLanding", name="TiendaClaro_validarformLanding")
     * @Route("/validarformLanding/", name="TiendaClaro_validarformLanding_slash")
     */
    public function validarformpaso1TvAction(request $request) {
        $response = new JsonResponse();
        $error = true;
        $redirect = false;
        $msg = "";
        $comentario = "";
        $sololetras = "/^[a-zA-ZñÑ\s]+$/";
        $solonumeros = "/^[0-9]+$/";
        $sololetrasynumeros = "/^[0-9a-zA-Z ]+$/";
        $nombrecompleto = trim($_POST['nombre']);
        $requestcallback=null;
        $responsecallback=null;
        $bandotrosform = true;
        $tipodocumento = 'CED';
        $numdoc = trim($_POST['numdoc']);
        $celular = trim($_POST['celular']);
        $recaptcha = trim($_POST['g-recaptcha-response']);
        $idseleccion = trim($_POST['idoferta']);
        $em = $this->getDoctrine()->getManager();
        $BannersRepo = $em->getRepository('DayscriptTiendaClaroBundle:Banners');
        if (!isset($nombrecompleto) || empty($nombrecompleto) || !preg_match($sololetras, $nombrecompleto) ) {
            $msg = "Ingresa tu nombre correctamente.";
        } elseif (!isset($tipodocumento) || empty($tipodocumento)) {
            $msg = "Seleccione el tipo de documento";
        }  elseif (!isset($idseleccion) || empty($idseleccion)) {
            $msg = "Seleccione la oferta";
        } elseif (!isset($numdoc) || empty($numdoc) || !preg_match($solonumeros, $numdoc) || ( $tipodocumento == 'CED' and strlen($numdoc) != 10)) {
            $msg = "Ingresa tu número de cédula correctamente.";
        } elseif (!isset($celular) || empty($celular) || !preg_match($solonumeros, $celular) || (strlen($celular) != 10)) {
            $msg = "Ingresa tu número de celular correctamente.";
        } elseif (!isset($recaptcha) || empty($recaptcha) || $this->validaCaptcha($request)) {
            $msg = "Demuestra que no eres un robot";
        } else {
            $msg = "Listo, en breve uno de nuestros asesores se comunicará contigo";
            $idseleccion = trim($_POST['idoferta']);
            
            $to = array('mlucas@grupo-link.com');
            $subject = "solicitud landing nuevos usuarios";
            $oferta = $BannersRepo->getOferta($idseleccion);
			$idsection = $oferta['IDSECTION'];
            $opciontabla = ($idsection=="1") ? 6 : 10 ; 
            $bdcallback = $oferta['CALLBACK'];
            $datacallback = $oferta['URLCALLBACK'];
            $infocallback = explode(',',$datacallback);
            $comentario = $oferta['DESCRIPCION'];
            $comentario =  trim($comentario);
            $subject = $oferta['ASUNTO'];
            $destinatarios = $oferta['DESTINATARIO'];
            if ($bdcallback=="1"){
                $con = new \Dayscript\CallbackWs\CallbackWsConnection();
                $phone = $celular;
                $name=$nombrecompleto." ".$numdoc;
                $sQueueName = $infocallback[0];
                $stringData = $infocallback[1] ."-".$comentario;
				
                $requestcallback = [
                    "telefono"   => $phone,
                    "nombre"     => $name,
                    "stringData" => $stringData,
                    "sQueueName" => $sQueueName
                ];

                $requestcallback = json_encode($requestcallback);
                $responsecallback=$con->executeCallback($phone,$name,$stringData,$sQueueName);
                $responsecallback= json_encode($responsecallback);
                if(strpos($responsecallback,"SUCCESS")){
                    $status = "success";
                    $error = false;
                }else{
                    $status = "error";
                    $error = true;
                }

                $message = \Dayscript\CallbackWs\CallbackMessage::getMessage($status);
                $msg=$message['content'];
                $bandotrosform = false;
            }
            if($bandotrosform)
            {
                $to = explode(',',$destinatarios);
                $v_mensaje = $this->creaMensajeLanding($nombrecompleto, $celular, $numdoc, $comentario);
                $this->enviarCorreoLanding($subject, $v_mensaje, $to); 
                $error = false;
            }    
            $BannersRepo->InsertOfertaLanding($nombrecompleto, "", $numdoc, $celular, $comentario,$requestcallback,$responsecallback,$opciontabla);
            $redirect = true;
        }
        $response->setData(array("error" => $error,
            "msg" => $msg,
            "redirect" => $redirect));

        return $response;
    }

    public function obtenerDestinatarios($desoferta){
        $to = "";
        $asunto = "";
        if (($desoferta == "Triple Play") || ($desoferta == "Internet Hogar")):
            $asunto = "Asunto: Oportunidad Comercial: Hogar Social Mention";
            $to = array("ventashogar@grupocant.com", "redessociales@grupocant.com", "cmorenoa@claro.com.ec");
		elseif ($desoferta == "Tv Satelital"):
            $asunto = "Oportunidad Comercial: DTH Social Mention";
            $to = array("vdth.claro@abiatar.com.ec", "liliana.russi@abiatar.ec", "cmorenoa@claro.com.ec");
        elseif (($desoferta == "Postpago Datos") || ($desoferta == "Postpago Voz")):
            $asunto = "Oportunidad Comercial: Portabilidad - Landing Districlaro";
            $to = array("vtaportabilidad@abiatar.com.ec", "alexander.ruiz@abiatar.com.ec");
        else:
            $asunto = "Oportunidad Comercial: Prepago - Landing Districlaro";
            $to = array("SACCCSUPVENTASDIGITAL@claro.com.ec", "vmedinag@claro.com.ec", "pjimener@claro.com.ec");
        endif;
        $args = [
         'asunto'=>$asunto,
         'to' =>$to 
        ];
        return $args;
    }

    public function creaMensajeLanding($nombresCompleto, $telefono, $documento, $comentario) {
        $contenido = "";
        $contenido .= "<div style = 'width:500px;min-height:200px;height:auto;' align='center'>";
        $contenido .= '    <div style="BORDER-BOTTOM:black thin solid;BORDER-LEFT:black thin solid;WIDTH:100%;BORDER-TOP:black thin solid;BORDER-RIGHT:black thin solid" align="center">';
        $contenido .= '<table border="0" align="center" width="500">';
        $contenido .= '            <tr><td colspan="2"><p align="center">Comentarios de Equipo:</p></td></tr>';
        $contenido .= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>NOMBRES COMPLETOS: </b></td><td align="left">' . $nombresCompleto . '</td></tr>';
        $contenido .= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>TELÉFONO: </b></td><td align="left">' . $telefono . '</td></tr>';
        $contenido .= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>DOCUMENTO: </b></td><td align="left">CED: ' . $documento . '</td></tr>';
        $contenido .= '            <tr><td width="25px" align="left" style="padding-left:50px;"><b>OFERTA: </b></td><td align="left">' . $comentario . '</td></tr>';
        $contenido .= '            <tr><td colspan="2" height="30px">&nbsp;</td></tr>';
        $contenido .= '        </table>';
        $contenido .= '    </div>';
        $contenido .= "</div>";
        return $contenido;
    }
	
    public function enviarCorreoLanding($subject, $message, $to) {

        $config = new ConfigClaro();
        $INTRA_BASE_PATH = "/procesos/www/";
        $INTRA_BASE_HOST = $config->getINTRA_BASE_HOST_SECURE(); //"https://www.porta.net";
        $INTRA_BASE_URL = "/";
        $HEADER_IMAGE = $INTRA_BASE_PATH . "WebSerTmp/images/mapa.jpg";
        $SITE_NAME = $config->getSITE_NAME(); //"TU CUENTA PORTA";

        $mailer = $this->get('mailer');
        $msg = $mailer->createMessage()
                ->setSubject($subject)
                ->setFrom(array($config->getMAIL_FROM() => $SITE_NAME))
                //->setReplyTo(array($to => $config->getSITE_NAME()))
                ->setTo($to)
                //->setBcc(array($v_copy => 'Ericka Talledo'))
                ->setBody(
                $this->renderView(
                        'DayscriptTiendaClaroBundle:Planes:formulario.html.twig', array('message' => $message)
                ), 'text/html'
        );
        if ($mailer->send($msg)) {
            return true;
        } else {
            throw new \Exception("Hubo un problema con el servidor de correos.");
        }
    }

    /**
     * @Route("/equipo/{nombrequipo}/{idequipo}/{idequipoco}/{opcion}", name="TiendaClaro_formoffline")
     * @Route("/equipo/{nombrequipo}/{idequipo}/{idequipoco}/{opcion}/", name="TiendaClaro_formoffline_slash")
     */
    function form_offlineAction(Request $request,$nombrequipo,$idequipo,$idequipoco,$opcion) {

        $em =$this->getDoctrine()->getManager();

        $opcionesSelectsnew = new opcionesSelectsNew();
        $provincias = $opcionesSelectsnew->get['Provincias'];
        $ciudades = null;

        $stepIndex = $this->getStepIndex('form', $opcion);
        $steps = $this->getStepsWithUrls($stepIndex, ['idequipoco' => $idequipoco, 'marca' => 'NA', 'option' => $opcion, 'planxdefault' => '0', 'idequipo' => $idequipo, 'nombrequipo' => $nombrequipo]);
        $equipo = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->getInfoDevice($idequipo, $idequipoco);

        $bandcambios = $equipo[0]["BANDFORM"];
        $accesorioequipo = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->accesorioPorEquipo($idequipo, $opcion);

        $argsvm = ['opcion' => $opcion, 'idequipo' => $idequipo, 'idequipoco' => $idequipoco, 'nombrequipo' => $nombrequipo, 'planxdefault' => '0', 'formlinea' => 'NA'];
        $urlbackvermas = $this->generateUrl('TiendaClaro_producto_vermas', $argsvm);
        
        //print_r($accesorioequipo);
        $args = ['opcion' => $opcion, 'transaccion' => 'NA'];
        $urlbackCatal = $this->generateUrl('TiendaClaro_Catalogo_Equipos', $args);
        $previewSteps = $this->setStepPreview();
		$urlSecure = $this->container->getParameter("urlSecure");
		$urlicon = $urlSecure."images/thankyoupage/Telefono.svg";
        $args = [
            'stringData'=>'Financiamiento-de-equipo:-'.str_replace("_", "-", $nombrequipo),
            'executeCallBack'=>$equipo[0]['BANDFORM'],
			'formuCallBack'=>$equipo[0]['BANDFORM'],
            'equipo' => $equipo,
            'prevStep'=>$previewSteps,
            'opcion' => $opcion,
            'option' => $opcion,
            'steps' => $steps,
            'stepIndex' => $stepIndex,
            'provincias' => $provincias,
            'urlcatalogo' => $urlbackCatal,
            'equipos'=>$equipo,
            'tipodeportabilidad'=>'EquiposFinanciados',
            'idequipo'=>$idequipo,
            'idequipoco'=>$idequipoco,
            'nombrequipo'=>$nombrequipo,
            'otherForm'=>true,
            'ciudades'=>$ciudades,
            'inputNombreEquipo'=>$nombrequipo,
            'notCheck'=>true,
            'accequipo'=>$accesorioequipo,
            'pathValidate'=>$this->generateUrl('TiendaClaro_validarformpaso1equipo'),
            'pathCancel'=>$this->generateUrl('TiendaClaro_home'),
            'pathForm'=>$this->generateUrl('TiendaClaro_equipo_registro',['opcion' => $opcion, 'idequipo' => $idequipo, 'idequipoco' => $idequipoco, 'nombrequipo' => $nombrequipo]),
            'urlicon' => $urlicon,
            'urlvermas'=>$urlbackvermas
        ];

        return $this->render('DayscriptTiendaClaroBundle:RenovacionEquipos:IndexPaso1.html.twig', $args);
    }

    /**
     * @Route("/validarformpaso1equipo", name="TiendaClaro_validarformpaso1equipo")
     * @Route("/validarformpaso1equipo/", name="TiendaClaro_validarformpaso1equipo_slash")
     */
    public function validarformpaso1equipoAction(request $request)
    {
        $response = new JsonResponse();
        $error=true;
        $redirect = false;
        $msg="";
        $sololetras = "/^[a-zA-ZñÑ\s]+$/";
        $solonumeros = "/^[0-9]+$/";
        $sololetrasynumeros = "/^[0-9a-zA-Z ]+$/";

        $nombre = trim($_POST['nombre']);
        $apellido = trim($_POST['apellido']);
        //$numdoc = "";
		$numdoc = (isset($_POST['cedula'])? $_POST['cedula'] : null );
        $celular = trim($_POST['celular']);
        $email = " ";
        $provincia = " ";
        $ciudad = " ";
        $stringData = trim($_POST['stringData']);
		
		$equipo = (isset($_POST['cboequipos'])? "_".str_replace(" ","",$_POST['cboequipos']) : null );
		
		//var_dump($equipo);exit();
        //$tipodocumento = trim($_POST['tipodocumento']);
        $tipodocumento = 'CED';
        if(isset($_POST['suscripcion'])) {

            $suscripcion = 'S';

        }else{

            $suscripcion = 'N';

        }
        $recaptcha = trim($_POST['g-recaptcha-response']);

        if (!isset($nombre) || empty($nombre) || !preg_match($sololetras,$nombre) || !isset($apellido) || empty($apellido) || !preg_match($sololetras,$apellido)){
            $msg="Ingresa tu nombre correctamente.";
        }elseif (!isset($celular) || empty($celular) || !preg_match($solonumeros,$celular) || (strlen($celular) != 10)){
            $msg="Ingresa tu numero de celular correctamente.";
        }elseif(!isset($recaptcha) || empty($recaptcha) || $this->validaCaptcha($request)){
            $msg="Demuestra que no eres un robot";
        }else{
            $em = $this->getDoctrine()->getManager();
            $tipodeportabilidad = trim($_POST['tipodeportabilidad']);
            $nombrequipo = trim($_POST['nombreequipo']);
            $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
            $opciones = $this->getOpciones($tipodeportabilidad,null);
            $subject = $opciones["subject"];
            $opciontable = $opciones["opciontable"];
            $equiponombre=str_replace ("_", " ", $nombrequipo);
            $ide = $em->getRepository('DayscriptTiendaClaroBundle:Compra')->findbyId();

            $opcionesSelectsnew= new opcionesSelectsNew();
            //$ciudad = $opcionesSelectsnew->get[$provincia][$ciudad];
            //$provincia = $opcionesSelectsnew->get['Provincias'][$provincia];
            if ( isset($_POST['executeCallback']) and $_POST['executeCallback'] == 1){
                $con = new \Dayscript\CallbackWs\CallbackWsConnection();
                $phone = substr($celular, 1, 9);
                $name=$nombre." ".$apellido." ".$numdoc;
                if($tipodeportabilidad=="EquiposFinanciados"){
					$sQueueName = "Callback_CCC_RenovOut";
				}elseif($tipodeportabilidad=="IotNuevo"){
					$sQueueName = "Callback_CAT_Vent_IOT ";
				}elseif($tipodeportabilidad=="VentaWhatsapp"){
					$sQueueName = "Callback_CAT_Vent_IOT "; 
				}elseif($tipodeportabilidad=="VentaWhatsappCel"){
					$sQueueName = "Callback_Tienda_1"; 
				}else{
					$sQueueName = "";
				}
				

                $requestcallback = [
                    "telefono"   => $phone,
                    "nombre"     => $name,
                    "stringData" => $stringData."".$equipo.'|'.$provincia.'|'.$ciudad.'|'.$email,
                    "sQueueName" => $sQueueName
                ];

                $requestcallback = json_encode($requestcallback);
                $responsecallback=$con->executeCallback($phone,$name,$stringData,$sQueueName);
                $responsecallback= json_encode($responsecallback);
                if (strpos($responsecallback,"SUCCESS")){
                    $status = "success";
                }else{
                    $status = "error";
                }

                $message = \Dayscript\CallbackWs\CallbackMessage::getMessage($status);
                $_SESSION["messagecallback"]=$message;
            }else{
                $requestcallback=null;
                $responsecallback=null;
            }
			$equiponombre = (empty($equiponombre)? str_replace("_","",$equipo) : $equiponombre);
            $em->getRepository('DayscriptTiendaClaroBundle:Compra')->insertadatos($ide,$nombre,$apellido,$email,$numdoc,$celular,$provincia,$opciontable,$equiponombre,null,null,null,$remoteIP,$tipodocumento,$ciudad,$suscripcion,$requestcallback,$responsecallback);
//            $ide = 50;


            $suscripcion = $opcionesSelectsnew->get[$suscripcion];

            $mensaje = $this->creaMensaje(null,$equiponombre,$nombre,$apellido,$email,$celular,$provincia,$numdoc,null,$ciudad,$suscripcion);
			
            if($tipodeportabilidad!="IotNuevo"&&$tipodeportabilidad!="VentaWhatsapp"&&$tipodeportabilidad!="VentaWhatsappCel"){
				$this->enviarCorreo($subject,$mensaje,$opciones["opciontrx"]);
			}

            $_SESSION["datosportabilidad"] = [
                "servicio" => $celular,
                "email"    => $email
            ];
            $error=false;
            $redirect = true;
        }

        $response->setData(array("error"=>$error,
            "msg"=>$msg,
            "redirect"=>$redirect));
        return $response;
    }


    /**
     *   @Route("/confirmacionequipo/{nombrequipo}/{idequipo}/{idequipoco}/{opcion}", name="TiendaClaro_equipo_registro")
     *   @Route("/confirmacionequipo/{nombrequipo}/{idequipo}/{idequipoco}/{opcion}/", name="TiendaClaro_equipo_registro_slash")
     */
    public function form_pasoequipo2Action(Request $request,$nombrequipo,$idequipo,$idequipoco,$opcion)
    {
        if (!$request->isMethod('POST')){
            $args = [
                'idequipo'     => $idequipo,
                'idequipoco'   => $idequipoco,
                'nombrequipo'  => $nombrequipo,
                'opcion'=> $opcion
            ];
            return $this->redirect($this->generateUrl('TiendaClaro_formoffline',$args));
        }else {
            $em = $this->getDoctrine()->getManager();
            $equipo = $em->getRepository('DayscriptTiendaClaroBundle:Equipo')->getInfoDevice($idequipo, $idequipoco);
            $datosportabilidad = $_SESSION["datosportabilidad"];
            $previewSteps = $this->setStepPreview();
            $argsvm = ['opcion' => $opcion, 'transaccion' => 'NA'];
            $urlbackvermas = $this->generateUrl('TiendaClaro_Catalogo_Equipos', $argsvm);
            $stepIndex = $this->getStepIndex('success', $opcion);
            $steps = $this->getStepsWithUrls($stepIndex, ['option' => $opcion, 'idequipo' => $idequipo, 'planxdefault'=>'0','idequipoco' => $idequipoco, 'nombrequipo' => $nombrequipo, 'marca' => 'NA']);

            /* Share Buttons */
            $urlSecure = $this->container->getParameter("urlSecure");
            $urlpromociones = $this->generateUrl('TiendaClaro_home');
            //$title = "Comparte en tus redes sociales la reserva de tu nuevo smartphone";
            //$metatitle = "He realizado la reserva del ".ucwords(strtolower($equipo[0]["NOMBREMARCA"]))." ".ucwords(strtolower($equipo[0]["NOMBRECOMERCIAL"]));
            //$plan = $em->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanEquipo2($planxdefault);
            $title = "Cuéntale a tus amigos sobre esta mega promo";
            $metatitle = "Ya tengo mi " . ucwords(strtolower($equipo[0]["NOMBREMARCA"])) . " " . ucwords(strtolower($equipo[0]["NOMBRECOMERCIAL"])) . " Todo Por $" . $equipo[0]["VALORPOSTPAGO"] . "+imp. ¡Aprovecha esta publicación dale click y reserva el tuyo!";
            $content = "";
            $urlimage = $urlSecure . $equipo[0]["URLIMGPRINCIPAL"];
            $redirect = $urlSecure . "formulario/equipo/" . $nombrequipo . "/" . $idequipo . "/" . $idequipoco . "/" . $opcion;
            $metadata = array($metatitle, $content, $urlimage, $redirect);
            $metadata = implode("||", $metadata);
            $metadata = base64_encode($metadata);
            $urlmetadata = $urlSecure . "compartir/" . $metadata;
            $urlicon = "images/thankyoupage/Telefono.svg";
            /* End Share Buttons */
            $args = [
                'equipos' => $equipo,
                'idequipo' => $idequipo,
                'idequipoco' => $idequipoco,
                'nombrequipo' => $nombrequipo,
                'servicio' => $datosportabilidad["servicio"],
                'email' => $datosportabilidad["email"],
                'steps' => $steps,
                'stepIndex' => $stepIndex,
                'prevStep' => $previewSteps,
                'opcion' => $opcion,
                'urlvermas' => $urlbackvermas,
                'tipodeportabilidad' => 'EquiposFinanciados',
				'urlpromociones' => $urlpromociones,
				'title' => $title,
				'content' => $content,
				'urlimage' => $urlimage,
				'urlmetadata' => $urlmetadata,
				'metatitle' => $metatitle,
				'urlicon' => $urlicon
            ];

            if ($opcion == 4) {
                return $this->render('DayscriptTiendaClaroBundle:RenovacionEquipos:IndexPaso2.html.twig', $args);
            } else {
                $messagecallback = $_SESSION["messagecallback"];
                return $this->render('DayscriptTiendaClaroBundle:RenovacionEquipos:CallbackIndex.html.twig', $args);
            }
        }

    }
	
	
	/**
     * @Route("/cambiateaclaro", name="TiendaClaro_cambiateaclaro")
     * @Route("/cambiateaclaro/", name="TiendaClaro_cambiateaclaro_slash")
     */
    public function cambiateaclaroAction(request $request)
    {
        $response = new JsonResponse();
        $sololetras = "/^[a-zA-ZñÑ\s]+$/";
        $solonumeros = "/^[0-9]+$/";
		$nombres = trim($_POST['nombres']);
		$celular = trim($_POST['celular']);
		$cedula = trim($_POST['cedula']);
        $email = " ";
        $provincia = " ";
        $ciudad = " ";
		$msg = null;
		$error=true;
        if (!isset($nombres) || empty($nombres) || !preg_match($sololetras,$nombres)){
            $msg="Ingresa tu nombre correctamente.";
        }elseif (!isset($celular) || empty($celular) || !preg_match($solonumeros,$celular) || (strlen($celular) != 10)){
            $msg="Ingresa tu numero de celular correctamente.";
        }elseif (!isset($cedula) || empty($cedula) || !preg_match($solonumeros,$cedula) || (strlen($cedula) != 10)){
            $msg="Ingresa tu numero de cedula correctamente.";
        }else{
            $em = $this->getDoctrine()->getManager();
            $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
            $ide = $em->getRepository('DayscriptTiendaClaroBundle:Compra')->findbyId();
            $con = new \Dayscript\CallbackWs\CallbackWsConnection();
            $phone = substr($celular, 1, 9);
            $name=$nombres." ".$cedula;
			$opciontable = "40";
			$stringData="Cambiate-a-claro".'|'.$provincia.'|'.$ciudad.'|'.$email;
			$sQueueName="Callback_Tienda_1";
			$requestcallback = [
				"telefono"   => $phone,
				"nombre"     => $name,
				"stringData" => $stringData,
				"sQueueName" => $sQueueName
			];
			$requestcallback = json_encode($requestcallback);
			$responsecallback=$con->executeCallback($phone,$name,$stringData,$sQueueName);
			$responsecallback= json_encode($responsecallback);
            $em->getRepository('DayscriptTiendaClaroBundle:Compra')->insertadatos($ide,$nombres,null,null,$cedula,$celular,null,$opciontable,null,null,null,null,$remoteIP,null,null,null,$requestcallback,$responsecallback);
			$error=false;
        }
        $response->setData(compact('msg', 'error'));
        return $response;
    }


	
	/**
     * @Route("/tellamamos", name="TiendaClaro_tellamamos")
     * @Route("/tellamamos/", name="TiendaClaro_tellamamos_slash")
     */
    public function tellamamosAction(request $request)
    {
		$response = new JsonResponse();
        $sololetras = "/^[a-zA-ZñÑ\s]+$/";
        $solonumeros = "/^[0-9]+$/";
        $error = false;
        $phone = trim($_POST["Number"]);
        $name = mb_strtoupper(trim($_POST["Name"]), 'UTF-8');
        $provincia = " ";
        $ciudad = " ";
        $email = " ";
        $stringData = "Ayuda Tienda Virtual";
        $sTypeInteraction = 'JIT';
        $sQueueName = 'Callback_Tienda_1';
        $sQueueNameJIT = 'CLIC2CALL_TIENDA2_2019';
        //$sQueueNameJIT = 'CLIC2CALL_TIENDA3_2019';
		$opcionId = 48;
        if (!isset($name) || empty($name) || !preg_match($sololetras,$name)){
            $msg="Ingresa tu nombre correctamente.";
            $error = true;
        }elseif (!isset($phone) || empty($phone) || !preg_match($solonumeros,$phone) || strlen($phone) != 10 ){
            $msg="Ingresa tu numero de celular correctamente.";
            $error = true;
        }

        if(!$error){
            $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
            $this->get('app.services.callback_executer')->executePlain($sTypeInteraction, $sQueueName, $sQueueNameJIT, $stringData, $name, null, null, null, null, $phone, null, null, $remoteIP);
            $msg = "Nos contactaremos contigo en unos minutos.";
        }

        $response->setData(array("error"=>$error,"msg"=>$msg));
        return $response;
	}

    /**
     * @Route("/callback", methods={"POST"},name="TiendaClaro_callback")
     * @Route("/callback/", methods={"POST"},name="TiendaClaro_callback_slash")
     */
    function callback(Request $request)
    {

        $response = new JsonResponse();

        $sololetras = "/^[a-zA-ZñÑ\s]+$/";
        $solonumeros = "/^[0-9]+$/";

        $error = false;

        $phone = $_POST["number-cb"];
        $stringData = $_POST["stringDataCb"];
        $sQueueName = $_POST["sQueueNameCb"];
        $operadora = $_POST["operadora-cb"];
        //$servicio = $_POST["servicio-cb"];
        $sQueueNameJIT = $_POST["sQueueNameJITCB"];
        //$planName = strtoupper($_POST["plan-name-cb"]);
        $planName = null;
        $planNameStringData = null;
        if($sQueueNameJIT == 'CLIC2CALL_TIENDA4_2019'){
            $planName = 'Prepago';
            $planNameStringData = 'Servicio deseado: '.$planName;
        }else{
            $planName = strtoupper($_POST["plan-name-cb"]);
            $planNameStringData = 'Plan deseado: '.$planName;
        }
        $utm_params = $this->get('app.services.utm_handler')->getUtmParams();

        if ( isset($_POST["name-cb"]) && ( empty($_POST["name-cb"]) || !preg_match($sololetras,$_POST["name-cb"]) ) ){
            $msg="Ingresa tu nombre correctamente.";
            $error = true;
        }elseif (empty($operadora)){
            $msg="Selecciona tu operadora actual.";
            $error = true;
        }/*elseif (empty($servicio)){
            $msg="Selecciona su servicio actual.";
            $error = true;
        }*/elseif (empty($planName) && $sQueueNameJIT == 'CLIC2CALL_TIENDA2_2019'){
            $msg="Selecciona su servicio actual.";
            $error = true;
        }elseif (empty($phone) || !preg_match($solonumeros,$phone) || strlen($phone) != 10 ){
            $msg="Ingresa tu numero de celular correctamente.";
            $error = true;
        }elseif (isset($_POST["ced-cb"]) && ( empty($_POST["ced-cb"]) || !preg_match($solonumeros,$_POST["ced-cb"]) || strlen($_POST["ced-cb"]) != 10) ){
            $msg="Ingresa tu numero de cédula correctamente.";
            $error = true;
        }elseif (empty($stringData)){
            $msg="Ocurrio un error inesperado, vuelva a intentarlo mas tarde";
            $error = true;
        }elseif (empty($sQueueName)){
            $msg="Ocurrio un error inesperado, vuelva a intentarlo mas tarde";
            $error = true;
        }

        $name = isset($_POST["name-cb"]) ? $_POST["name-cb"] : "";
        $cedula = isset($_POST["ced-cb"]) ? $_POST["ced-cb"] : "";

        if(!$error){
            $sTypeInteraction = 'JIT';
            $phone = substr($_POST["number-cb"], 1, 9);
            $aux2 = 'Plan: (no definido) | Operadora: MaxiPlus | Servicio actual: Prepago';
            //var_dump($phone);
            $remoteIP = (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"]);
            $em = $this->getDoctrine()->getManager();
            $count=$em->getRepository('DayscriptTiendaClaroBundle:Compra')->filterByNumber($phone, 'Ayuda Portabilidad');
           // var_dump($count);
           if(!$count){
               //$this->get('app.services.callback_executer')->executePlain($sTypeInteraction, $sQueueName, $sQueueNameJIT, $stringData, $name, null, $cedula, null, null, $phone, null, null, $remoteIP);
               //$this->get('app.services.callback_executer')->executeJIT($sTypeInteraction, $sQueueName, $sQueueNameJIT, $stringData.' | '.$operadora.' ('.$servicio.')', $name, null, $cedula, 'CED', null, $phone, null, null, null, [], $utm_params, null, $remoteIP);
               //$productosJIT = [];
               //array_push($productosJIT, new \Dayscript\CallbackWs\Models\Product('portabilidad', '', null, $planName, '', '1'));
               $productosJIT = [new \Dayscript\CallbackWs\Models\Product("Portabilidad",'1 '.$planName, null, $planName, null)];
               $this->get('app.services.callback_executer')->executeJIT($sTypeInteraction, $sQueueName, $sQueueNameJIT, $stringData.' | '.$operadora.' | '.$planNameStringData, $name, null, $cedula, 'CED', null, $phone, null, null, null, $productosJIT, $utm_params, null, $remoteIP);
               $msg = "Nos contactaremos contigo en unos minutos.";
           }else{
               $msg = "El número ingresado tiene una solicitud pendiente. Nos contactaremos contigo en unos minutos.";
           }
        }

        $response->setData(array("error"=>$error,
            "msg"=>$msg, "count"=>$count,"stringData"=>$stringData,"planNameStringData"=>$planNameStringData,));
        return $response;

    }

}