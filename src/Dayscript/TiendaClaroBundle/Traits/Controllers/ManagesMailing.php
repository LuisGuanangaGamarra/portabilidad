<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 09/07/2019
 * Time: 13:26
 */

namespace Dayscript\TiendaClaroBundle\Traits\Controllers;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

trait ManagesMailing
{
    public function sendMail(Request $request, $code, $tipo_mailing, $id_base64, $token = null)
    {
        if($code === 'o3s2lAdczPU5c0L1GEK4Mj7tTMgQawEv')
        {
            $em = $this->getDoctrine()->getManager();
            $portabilidadREP = $em->getRepository('DayscriptTiendaClaroBundle:RegPortabilidad');
            if($tipo_mailing === 'new_user') {
                $params = explode('__', base64_decode($token));
                $usuario = [
                    'NICKNAME' => base64_decode($id_base64),
                    'EMAIL' => base64_decode($params[0]),
                    'password' => base64_decode($params[1])
                ];
                $sent = $this->get('app.services.mailer')->sendNewUserNotification($usuario);
            } else if($tipo_mailing === 'pwd_user') {
                $usuario = $portabilidadREP->getUsuario(base64_decode($id_base64));
                $sent = $this->get('app.services.mailer')->sendPwdUserNotification($usuario);
            } else if($tipo_mailing === 'reset_user') {
                $usuario = $portabilidadREP->getUsuario(base64_decode($id_base64));
                $sent = $this->get('app.services.mailer')->sendTokenUserNotification($usuario, $token);
            }
            // Cambio solicitado por Adriana Espinosa (2019-07-18)
            /*else if($tipo_mailing === 'portabilidad_approved') {
                $solicitud = $portabilidadREP->findById(base64_decode($id_base64));
                $sent = $this->get('app.services.mailer')->sendPortabilidadApprovedNotification($solicitud);
            } else if($tipo_mailing === 'portabilidad_denied') {
                $solicitud = $portabilidadREP->findById(base64_decode($id_base64));
                $sent = $this->get('app.services.mailer')->sendPortabilidadDeniedNotification($solicitud);
            }*/ else if($tipo_mailing === 'portabilidad_remember') {
                $solicitud = $portabilidadREP->findById(base64_decode($id_base64));
                $redirect = 'https://tienda.claro.com.ec'.$this->generateUrl('TiendaClaro_portabilidad_confirmar', [
                    'form_base64' => base64_encode($solicitud->getFormCodigo()),
                    'doc_base64' => base64_encode($solicitud->getDocSecuencia()),
                ]);
                $sent = $this->get('app.services.mailer')->sendPortabilidadRememberNotification($solicitud, $redirect);
            }
        }
        return new Response('ok');
    }
}