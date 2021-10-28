<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 21/05/2019
 * Time: 9:37
 */

namespace AppBundle\Service;


use Dayscript\TiendaClaroBundle\Entity\RegPortabilidad;
use Dayscript\TiendaClaroBundle\Helper\Classes\ConfigClaro;
use Symfony\Bundle\TwigBundle\TwigEngine;

class Mailer
{
    /**
     * @var \Swift_Mailer
     */
    private $mailerService;

    /**
     * @var TwigEngine
     */
    private $templatingService;

    /**
     * @var string
     */
    private $imagesDirectory;
    /**
     * @var string
     */
    private $uploadsDirectory;

    /**
     * @var array
     */
    private $fromAdress;

    /**
     * @var array
     */
    private $bccAdress;

    /**
     * Mailer constructor.
     * @param \Swift_Mailer $mailerService
     * @param TwigEngine $templating
     * @param $images_directory
     * @param $uploads_directory
     */
    public function __construct(\Swift_Mailer $mailerService, TwigEngine $templating, $images_directory, $uploads_directory)
    {
        $this->mailerService = $mailerService;
        $this->templatingService = $templating;
        $this->imagesDirectory = $images_directory;
        $this->uploadsDirectory = $uploads_directory;
        $config = new ConfigClaro();
        $this->fromAdress = [$config->getNO_REPLY() => 'CLARO'/*$config->getSITE_NAME()*/];//['miclaro@miclaro.com.ec' => 'MI CLARO'];
        $this->bccAdress = [/*'ffarfan@grupo-link.com' => 'GL Frederick Farfán'*/];
    }

    public function sendEmail($subject, $view_name, $view_params, $imagenes, $to, $cc = [], $cco = [], $attachment_paths = [], $fromAdress = [])
    {
        $msg = \Swift_Message::newInstance();
        foreach ($imagenes as $nombre => $imagen) {
            if(is_array($imagenes[$nombre])){
                foreach ($imagenes[$nombre] as $accesorio => $value){
                    $imagenes[$nombre][$accesorio]["url"] = $msg->embed(\Swift_Image::fromPath($imagenes[$nombre][$accesorio]["url"]));
                }
            }else{
                $imagenes[$nombre] = $msg->embed(\Swift_Image::fromPath($imagenes[$nombre]));
            }
        }
        $body = $this->templatingService->render($view_name, array_merge($view_params, ['imagenes' => $imagenes]));
        $msg->setSubject($subject);
        $msg->setTo($to);
        if(sizeof($cc))
            $msg->setCc($cc);
        if(sizeof($cco))
            $msg->setBcc($cco);
        $msg->setBody($body);
        $msg->setContentType('text/html');
        $msg->setCharset('utf-8');
        $msg->setFrom(sizeof($fromAdress) ? $fromAdress : $this->fromAdress);
        foreach ($attachment_paths as $path) {
            $msg->attach(\Swift_Attachment::fromPath($path));
        }
        return $this->mailerService->send($msg);
    }

    public function sendSolicitudRecibidaToClient(RegPortabilidad $solicitud)
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro.png',
            'banner' => $this->imagesDirectory.'mailing/banners/portabilidad.png',
            'content-01' => $this->imagesDirectory.'mailing/portabilidad/01-llamada.png',
            'content-02' => $this->imagesDirectory.'mailing/portabilidad/02-entrega.png',
            'content-03' => $this->imagesDirectory.'mailing/portabilidad/03-cambiochip.png',
            'content-04' => $this->imagesDirectory.'mailing/portabilidad/04-eresclaro.png',
            'content-05' => $this->imagesDirectory.'mailing/portabilidad/05-dudas.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fa-facebook-official.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/fa-twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/fa-youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/fa-instagram.png',

        ];
        $anexos = [];
        //Cambio solicitado por Adriana (2019-06-07): Los clientes no deben recibir anexos
        /*foreach ($solicitud->getAnexos() as $anexo)
            array_push($anexos, $anexo->getRutaReal());*/
        //Cambio solicitado por Adriana (2019-06-10): Diseño de correo al solicitante
        return $this->sendEmail('Prepárate para ser parte de la familia Claro', 'DayscriptTiendaClaroBundle:Portabilidad/Mails:Received.html.twig', ['solicitud' => $solicitud], $imagenes, [$solicitud->getClienteEmail() => $solicitud->getClienteNombre()], [], $this->bccAdress, $anexos);
    }

    public function sendSolicitudRecibidaToAsesores(RegPortabilidad $solicitud, $asesores_to, $cc = [], $cco = [])
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro-blanco.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header-blanco.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fb.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/instagram.png',
        ];
        $anexos = [];
        foreach ($solicitud->getAnexos() as $anexo)
            array_push($anexos, $anexo->getRutaReal());
        return $this->sendEmail('Hemos recibido una nueva solicitud de Portabilidad', 'DayscriptTiendaClaroBundle:Portabilidad/Mails:New.html.twig', ['solicitud' => $solicitud, "mes"=> date("m")], $imagenes, $asesores_to, $cc, $cco, $anexos);
    }

    public function sendNewUserNotification($usuario)
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro-blanco.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header-blanco.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fb.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/instagram.png',
        ];
        return $this->sendEmail('Su cuenta de usuario ha sido creada', 'DayscriptTiendaClaroBundle:Portabilidad/Mails/Users:New-User.html.twig', ['usuario' => $usuario, 'route' => 'https://tienda.claro.com.ec/admin/public/index.php/auth/login'], $imagenes, [$usuario['EMAIL'] => $usuario['NICKNAME']], [], $this->bccAdress, []);
    }

    public function sendPwdUserNotification($usuario)
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro-blanco.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header-blanco.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fb.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/instagram.png',
        ];
        return $this->sendEmail('Has cambiado tu contraseña correctamente', 'DayscriptTiendaClaroBundle:Portabilidad/Mails/Users:Pwd-User.html.twig', ['usuario' => $usuario, 'route' => 'https://tienda.claro.com.ec/admin/public/index.php/auth/login'], $imagenes, [$usuario['EMAIL'] => $usuario['NICKNAME']], [], $this->bccAdress, []);
    }

    public function sendTokenUserNotification($usuario, $token)
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro-blanco.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header-blanco.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fb.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/instagram.png',
        ];
        return $this->sendEmail('Restablece tu contraseña', 'DayscriptTiendaClaroBundle:Portabilidad/Mails/Users:Token-User.html.twig', ['usuario' => $usuario, 'route_home' => 'https://tienda.claro.com.ec/admin/public/index.php/auth/login', 'route' => 'https://tienda.claro.com.ec/admin/public/index.php/password/reset/'.$token], $imagenes, [$usuario['EMAIL'] => $usuario['NICKNAME']], [], $this->bccAdress, []);
    }

    public function sendPortabilidadApprovedNotification($solicitud)
    {
        $imagenes = [
            'servicios' => $this->imagesDirectory.'mailing/iconos-header.png',
            'claro-large' => $this->imagesDirectory.'mailing/banners/claro-large.png',
            'personas' => $this->imagesDirectory.'mailing/banners/Model.png',
            'emoji-wink' => $this->imagesDirectory.'mailing/emoji.png',
            'emoji-check' => $this->imagesDirectory.'mailing/check.png',
            'plan' => $this->imagesDirectory.'mailing/plan/Plan-icon.png',
            'mi-claro-banner' => $this->imagesDirectory.'mailing/banners/banner-miclaro.jpg',
            'mi-claro-logo' => $this->imagesDirectory.'mailing/MiClaro.png',
            'store-apple' => $this->imagesDirectory.'mailing/btn-appstore.png',
            'store-google' => $this->imagesDirectory.'mailing/btn-google_play.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fa-facebook-official.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/fa-twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/fa-youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/fa-instagram.png',
        ];
        return $this->sendEmail('Tu solicitud de portabilidad ha sido aprobada', 'DayscriptTiendaClaroBundle:Portabilidad/Mails:Approved.html.twig', ['solicitud' => $solicitud, 'precio' => number_format($solicitud->getPlanTarifa()*1.12, 2, ',', ' ')], $imagenes, [$solicitud->getClienteEmail() => $solicitud->getClienteNombre()], [], $this->bccAdress, []);
    }

    public function sendPortabilidadDeniedNotification($solicitud)
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fa-facebook-official.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/fa-twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/fa-youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/fa-instagram.png',
        ];
        return $this->sendEmail('Tu solicitud de portabilidad no fue aprobada', 'DayscriptTiendaClaroBundle:Portabilidad/Mails:Denied.html.twig', [], $imagenes, [$solicitud->getClienteEmail() => $solicitud->getClienteNombre()], [], $this->bccAdress, []);
    }

    public function sendPortabilidadRememberNotification(RegPortabilidad $solicitud, $url)
    {
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header.png',
            'asesora' => $this->imagesDirectory.'mailing/banners/asesora.png',
            'btn-llamame' => $this->imagesDirectory.'mailing/buttons/btn-llamame.png',
            'content-05' => $this->imagesDirectory.'mailing/portabilidad/05-dudas.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fa-facebook-official.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/fa-twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/fa-youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/fa-instagram.png',
        ];
        $nombre = ucfirst(mb_strtolower(explode(' ', trim($solicitud->getClienteNombre()))[0], 'UTF-8'));
        return $this->sendEmail('Necesitamos hablar contigo para concretar tu solicitud de cambio', 'DayscriptTiendaClaroBundle:Portabilidad/Mails:Remember.html.twig', ['solicitud' => $solicitud, 'nombre' => $nombre, 'url_action' => $url], $imagenes, [$solicitud->getClienteEmail() => $solicitud->getClienteNombre()], [], $this->bccAdress, []);
    }

    public function sendProductoCompradoToAsesor($datos, $monito_to, $cc = [], $cco = [])
    {
        $config = new ConfigClaro();
        $imagenes = [
            'claro' => $this->imagesDirectory.'mailing/Claro-blanco.png',
            'servicios' => $this->imagesDirectory.'mailing/iconos-header-blanco.png',
            'rrss-facebook' => $this->imagesDirectory.'mailing/rrss/fb.png',
            'rrss-twitter' => $this->imagesDirectory.'mailing/rrss/twitter.png',
            'rrss-youtube' => $this->imagesDirectory.'mailing/rrss/youtube.png',
            'rrss-instagram' => $this->imagesDirectory.'mailing/rrss/instagram.png',
        ];
        return $this->sendEmail('TC - Hemos recibido una nueva compra con tarjeta de crédito', 'DayscriptTiendaClaroBundle:Carrito/Mails:CompraAsesor.html.twig', ['datos' => $datos], $imagenes, $monito_to, $cc, $cco, [], [$config->getNO_REPLY() => 'TIENDA VIRTUAL | CLARO']);
    }


    public function sendProductoCompradoToClient($datos, $monito_to, $cc = [], $cco = [])
    {
        $config = new ConfigClaro();
        $imagenes = array_merge([
            'icon-compra-email' => $this->imagesDirectory.'mailing/ico-compra-email-56x57.jpg',
            'icon-claro-red' => $this->imagesDirectory.'mailing/red-icon-claro-159x57.png',
            'icon-claro-gray' => $this->imagesDirectory.'mailing/gray-icon-claro-148x54.png',
            'icon-facebook' => $this->imagesDirectory.'mailing/rrss/gray-icon-fb.png',
            'icon-twitter' => $this->imagesDirectory.'mailing/rrss/gray-icon-twitter.png',
            'icon-youtube' => $this->imagesDirectory.'mailing/rrss/gray-icon-youtube.png',
            'icon-instagram' => $this->imagesDirectory.'mailing/rrss/gray-icon-instagram.png',
            'icon-linkedin' => $this->imagesDirectory.'mailing/rrss/gray-icon-linkedin.png' ,
        ], $datos['imagenes']);
        return $this->sendEmail('Confirmación de Compra', 'DayscriptTiendaClaroBundle:Carrito/Mails:CompraCliente.html.twig', ['data' => $datos], $imagenes, $monito_to, $cc, $cco, [], [$config->getNO_REPLY() => 'Tienda Virtual Claro']);
    }



    
}