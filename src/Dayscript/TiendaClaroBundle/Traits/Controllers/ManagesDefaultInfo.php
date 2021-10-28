<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 01/03/2019
 * Time: 16:32
 */

namespace Dayscript\TiendaClaroBundle\Traits\Controllers;

use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\PhpBridgeSessionStorage;

trait ManagesDefaultInfo
{
    public function init__constructor()
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

    //CAMBIOS HEADER Y FOOTER INTEGRACION
    public function construyeSection()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.claro.com.ec/portal/ec/tema-externo/claro2017Externo.json');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json')); // Assuming you're requesting JSON
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $json = curl_exec($ch);
        $menu = json_decode($json,true);
        return $menu;
    }

    public function construyePromo()
    {
        //$promo = file_get_contents('http://test2.claro-ec.tmx-internacional.net/portal/ec/tema-externo/claro2017HeaderExterno.html');
        $promo = "";
        return $promo;
    }
}