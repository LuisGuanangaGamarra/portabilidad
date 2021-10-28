<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 30/07/2019
 * Time: 15:46
 */

namespace Dayscript\TiendaClaroBundle\Traits\Controllers;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

trait ManagesDefault
{
    /**
     * Renderiza el Header de Tienda
     * @return mixed
     */
    public function showHeader()
    {
        return $this->showMenu('header');
    }

    /**
     * Renderiza el Footer de Tienda
     * @return mixed
     */
    public function showFooter()
    {
        return $this->showMenu('footer');
    }

    /**
     * Renderiza el menú del header o el footer de Tienda
     * @param $type {'header', 'footer'}
     * @return mixed
     */
    protected function showMenu($type)
    {
        $config = $this->get('app.services.menu')->getConfig();
        if(empty($this->get('app.services.menu')->getMenu()))
            return $this->render($config['twig']['compiled'][$type]);
        return $this->render($config['twig']['to-compile'][$type], [
            'menu' => $this->get('app.services.menu')->getMenu(),
        ]);
    }

    /**
     * @deprecated
     * @param string $section
     * @return mixed
     */
    public function showBanners($section = "")
    {
        $em = $this->getDoctrine()->getManager();
        $banners = $em->getRepository('DayscriptTiendaClaroBundle:ConfigBanner')->findAllOrderedBySection($section);
        return $this->render('DayscriptTiendaClaroBundle:Default\Include:banners.html.twig',
            compact('banners')
        );
    }

    /**
     * Renderiza el cronómetro de la promoción que se encuentre activa
     * @param string $customClass
     * @return Response
     * @throws \Exception
     */
    public function showCronometro($customClass = "desktop")
    {
        $em = $this->getDoctrine()->getManager();
        $promocion = $em->getRepository('DayscriptTiendaClaroBundle:StoPromocion')->first();
        $today = new \DateTime("now", new \DateTimeZone('America/Guayaquil'));
        if($promocion && $promocion->getExpiresAt() > $today) {
            $time = $promocion->getExpiresAt()->getTimestamp() - $today->getTimestamp();
            return $this->render('DayscriptTiendaClaroBundle:Default\Include:cronometro.html.twig', [
                'timer'         => $time,
                'promoName'    => $promocion->getNombre(),
                'promoSlug'    => $promocion->getSlug(),
                'promoIcon'    => $promocion->getRutaIcon(),
                'customClass'       => $customClass,
            ]);
        }
        return new Response('');
    }

}