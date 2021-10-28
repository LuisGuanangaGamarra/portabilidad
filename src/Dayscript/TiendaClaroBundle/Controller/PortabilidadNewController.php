<?php

namespace Dayscript\TiendaClaroBundle\Controller;

use Dayscript\TiendaClaroBundle\Traits\Controllers\ManagesMailing;
use Dayscript\TiendaClaroBundle\Traits\Controllers\Movil\ManagesPortabilidad;
use Dayscript\TiendaClaroBundle\Helper\Classes\WebService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class PortabilidadNewController extends Controller
{
    use ManagesPortabilidad, ManagesMailing;

    /**
     * @Route("/", methods={"GET"}, name="TiendaClaro_portabilidad_index")
     * @Route("/cambiate-a-claro", methods={"GET"}, name="TiendaClaro_portabilidad_create")
     * @Route("/cambiate-a-claro/", methods={"GET"}, name="TiendaClaro_portabilidad_create_slash")
     * Por el momento, redirecciona a la creación de una solicitud de portabilidad.
     */
    public function indexAction(Request $request)
    {
        return $this->showIndexView($request);
    }

    /**
     * @Route("/cambiate-a-claro/postpago", methods={"GET"}, name="TiendaClaro_portabilidad_postpago_create")
     * @Route("/cambiate-a-claro/postpago/", methods={"GET"}, name="TiendaClaro_portabilidad_postpago_create_slash")
     * @Route("/cambiate-a-claro/postpago/{ahora}", methods={"GET"}, name="TiendaClaro_portabilidad_postpago_ahora_create")
     * @Route("/cambiate-a-claro/postpago/{ahora}/", methods={"GET"}, name="TiendaClaro_portabilidad_postpago_ahora_create_slash")
     * Muestra la vista del Catalogo de portabilidad.
     */
    public function ViewAction(Request $request, $ahora = null)
    {
        return $this->showIndexView($request, $ahora);
    }

    /**
     * @Route("/cambiate-a-claro/prepago", methods={"GET"}, name="TiendaClaro_portabilidad_prepago_create")
     * @Route("/cambiate-a-claro/prepago/", methods={"GET"}, name="TiendaClaro_portabilidad_prepago_create_slash")
     * @Route("/cambiate-a-claro/prepago/{ahora}", methods={"GET"}, name="TiendaClaro_portabilidad_prepago_ahora_create")
     * @Route("/cambiate-a-claro/prepago/{ahora}/", methods={"GET"}, name="TiendaClaro_portabilidad_prepago_ahora_create_slash")
     * Muestra la vista de creación de una solicitud de portabilidad a prepago.
     */
    public function createPrepagoAction(Request $request, $ahora = null)
    {
        return $this->showCreatePrepagoView($request, $ahora);
        //return $this->redirect($this->generateUrl('TiendaClaro_portabilidad_create'));
    }

    /**
     * @Route("/cambiate-a-claro/{slugPlan}", methods={"GET"}, name="TiendaClaro_portabilidad_solicitud_create")
     * @Route("/cambiate-a-claro/{slugPlan}/", methods={"GET"}, name="TiendaClaro_portabilidad_solicitud_create_slash")
     * @Route("/cambiate-a-claro/{slugPlan}/{slugEquipo}", methods={"GET"}, name="TiendaClaro_portabilidad_solicitud_equipo_create")
     * @Route("/cambiate-a-claro/{slugPlan}/{slugEquipo}/", methods={"GET"}, name="TiendaClaro_portabilidad_solicitud_equipo_create_slash")
     * Muestra la vista de creación de una solicitud de portabilidad.
     */
    public function createAction(Request $request, $slugPlan, $slugEquipo = null)
    {
        return $this->showCreateView($request, $slugPlan, $slugEquipo);
    }

    /**
     * @Route("/te-cambiaste-a-claro", methods={"POST"}, name="TiendaClaro_portabilidad_redesign_typ")
     * @Route("/te-cambiaste-a-claro/", methods={"POST"}, name="TiendaClaro_portabilidad_redesign_typ_slash")
     * Muestra el typ de la tranasaccion.
     */
    public function typAction(Request $request)
    {
        return $this->showTypView($request);
    }

    /**
     * @Route("/entregar-claro-chip/{idSolicitud}", methods={"GET"}, name="TiendaClaro_portabilidad_redesign_mapa")
     * @Route("/entregar-claro-chip/{idSolicitud}/", methods={"GET"}, name="TiendaClaro_portabilidad_redesign_mapa_slash")
     * Muestra el mapa de la tranasaccion.
     */
    public function mapaAction(Request $request, $idSolicitud)
    {
        return $this->showMapaView($request, $idSolicitud);
    }

    /**
     * @Route("/landing-cambiate-a-claro", methods={"GET"}, name="TiendaClaro_portabilidad_createLanding")
     * @Route("/landing-cambiate-a-claro/", methods={"GET"}, name="TiendaClaro_portabilidad_createLanding_slash")
     * @Route("/landing-cambiate-a-claro/{provideCb}", methods={"GET"}, name="TiendaClaro_portabilidad_createLanding_provide")
     * @Route("/landing-cambiate-a-claro/{provideCb}/", methods={"GET"}, name="TiendaClaro_portabilidad_createLanding_provide_slash")
     * 
     * Muestra la vista de creación de una solicitud de portabilidad.
     */
    public function createLandingAction(Request $request,$provideCb = 'acc')
    {
        return $this->showCreateLandingView($request,$provideCb);
    }

    /**
     * @Route("/cambiate-a-claro-paso-1", methods={"POST"}, name="TiendaClaro_portabilidad_store_paso_1")
     * @Route("/cambiate-a-claro-paso-1/", methods={"POST"}, name="TiendaClaro_portabilidad_store_paso_1_slash")
     * Guarda los datos del formulario de solicitud de portabilidad.
     */
    public function storePaso1Action(Request $request)
    {
        return $this->storePortabilidadPaso1($request);
    }

    /**
     * @Route("/cambiate-a-claro", methods={"POST"}, name="TiendaClaro_portabilidad_store")
     * @Route("/cambiate-a-claro/", methods={"POST"}, name="TiendaClaro_portabilidad_store_slash")
     * Guarda los datos del formulario de solicitud de portabilidad.
     */
    public function storeAction(Request $request)
    {
        return $this->storePortabilidadRedesignForm($request);
    }

    /**
     * @Route("/cambiate-a-claro-asesor", methods={"POST"}, name="TiendaClaro_portabilidad_asesorStore")
     * @Route("/cambiate-a-claro-asesor/", methods={"POST"}, name="TiendaClaro_portabilidad_asesorStore_slash")
     * Guarda los datos del formulario de solicitud de portabilidad.
     */
    public function storeAsesorAction(Request $request)
    {
        return $this->storePortabilidadAsesorForm($request);
    }

    /**
     * @Route("/cambiate-a-claro/prepago", methods={"POST"}, name="TiendaClaro_portabilidad_prepago_store")
     * @Route("/cambiate-a-claro/prepago/", methods={"POST"}, name="TiendaClaro_portabilidad_prepago_store_slash")
     * Guarda los datos del formulario de solicitud de portabilidad.
     */
    public function storePrepagoAction(Request $request)
    {
        return $this->storePortabilidadPrepagoForm($request);
    }

    /**
     * @Route("/landing-cambiate-a-claro", methods={"POST"}, name="TiendaClaro_portabilidad_storeLanding")
     * @Route("/landing-cambiate-a-claro/", methods={"POST"}, name="TiendaClaro_portabilidad_storeLanding_slash")
     * Guarda los datos del formulario de solicitud de portabilidad.
     */
    public function storeLandingAction(Request $request)
    {
        return $this->storePortabilidadLandingForm($request);
    }

    /**
     * @Route("/cambiate-a-claro/", methods={"DELETE"}, name="TiendaClaro_portabilidad_delete_slash")
     * @Route("/cambiate-a-claro/{code}/{step}", methods={"DELETE"}, name="TiendaClaro_portabilidad_delete")
     * Elimina lógicamente la solicitud de portabilidad.
     */
    public function deleteAction(Request $request, $code, $step)
    {
        return $this->deletePortabilidadForm($request, $code, $step);
    }

    /**
     * @Route("/cambiate-a-claro/confirmar/{form_base64}/{doc_base64}", methods={"GET"}, name="TiendaClaro_portabilidad_confirmar")
     * @Route("/cambiate-a-claro/confirmar/{form_base64}/{doc_base64}/", methods={"GET"}, name="TiendaClaro_portabilidad_confirmar_slash")
     * Muestra la vista para la insistencia de una solicitud de portabilidad.
     */
    public function confirmAction(Request $request, $form_base64, $doc_base64)
    {
        return $this->showConfirmView($request, $form_base64, $doc_base64);
    }

    /**
     * @Route("/cambiate-a-claro/confirmar/{form_base64}/{doc_base64}", methods={"POST"}, name="TiendaClaro_portabilidad_confirmado")
     * @Route("/cambiate-a-claro/confirmar/{form_base64}/{doc_base64}/", methods={"POST"}, name="TiendaClaro_portabilidad_confirmado_slash")
     * Muestra la vista para la insistencia de una solicitud de portabilidad.
     */
    public function confirmedAction(Request $request, $form_base64, $doc_base64)
    {
        return $this->helpPortabilidadForm($request, $form_base64, $doc_base64);
    }

    /**
     * Route("/test/", methods={"GET"}, name="TiendaClaro_portabilidad_test")
     * Route("/test/{mail}", methods={"GET"}, name="TiendaClaro_portabilidad_test_mail")
     * Route("/test/{mail}/", methods={"GET"}, name="TiendaClaro_portabilidad_test__mail_slash")
     * Ruta de prueba creada para el envío o visualización de mailing.
     * ONLY FOR TEST
     */
    /*public function testAction(Request $request, $mail="")
    {
        return $this->test($request);
        if(!empty($mail))
            return $this->testMail($request, $mail);
        return $this->render('DayscriptTiendaClaroBundle:Portabilidad/Mails:Received-Fixed.html.twig');
    }*/

    /**
     * @Route("/admin/mailing/{code}/{tipo_mailing}/{id_base64}", methods={"POST"}, name="TiendaClaro_mailing_store")
     * @Route("/admin/mailing/{code}/{tipo_mailing}/{id_base64}/", methods={"POST"}, name="TiendaClaro_mailing_store_slash")
     * @Route("/admin/mailing/{code}/{tipo_mailing}/{id_base64}/{token}", methods={"POST"}, name="TiendaClaro_mailing_store_token")
     * @Route("/admin/mailing/{code}/{tipo_mailing}/{id_base64}/{token}/", methods={"POST"}, name="TiendaClaro_mailing_store_token_slash")
     * Envía correos del administrador de portabilidad.
     */
    public function sendMailAction(Request $request, $code, $tipo_mailing, $id_base64, $token = null)
    {
        return $this->sendMail($request, $code, $tipo_mailing, $id_base64, $token);
    }

    /**
     * @Route("/consumir-NIP", methods={"POST"}, name="TiendaClaro_consumir_NIP")
     * @Route("/consumir-NIP/", methods={"POST"}, name="TiendaClaro_consumir_NIP_slash")
     */
    function consumoNIP(Request $request)
    {
/*        $em = $this->getDoctrine()->getManager();
        $req = $request->request;
        $number = $req->get('numero');
        return $this->tipoPlan($request, $number);*/
//        $em = $this->getDoctrine()->getManager();
//        $req = $request->request;
//        $number = $req->get('numero');
        $inputs = $request->request->all();
        $linea = $inputs['numero'];
        if(empty($linea))
            return new JsonResponse(['error' => true, 'message' => 'Celular incorrecto. Revise el número ingresado e intente nuevamente.']);
        return $this->generarNIP($request, $linea);
    }

    /**
     * @Route("/validar-codigo-NIP", methods={"GET"}, name="TiendaClaro_validar_codigo_NIP")
     * @Route("/validar-codigo-NIP/", methods={"GET"}, name="TiendaClaro_validar_codigo_NIP_slash")
     */
    function validarCodigoNIP(Request $request)
    {
        $req = $request->request;
/*        $codigoIngresado = $req->get('codigoIngresado');*/

        return $this->validarNIP($request);
    }

}
