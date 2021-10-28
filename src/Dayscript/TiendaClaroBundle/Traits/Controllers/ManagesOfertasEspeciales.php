<?php


namespace Dayscript\TiendaClaroBundle\Traits\Controllers;

use Dayscript\TiendaClaroBundle\Entity\TipoNegocio;
use Dayscript\TiendaClaroBundle\Entity\TipoProducto;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait ManagesOfertasEspeciales
{
    protected $sectionName = 'Ofertas';

    /**
     * Muestra el catálogo de productos con precios especiales
     * @param Request $request
     * @param string $promocion_slug
     * @return mixed
     */
    public function showOferta(Request $request)
    {
        $this->sectionName = 'PreciosDeLocura';
        $em = $this->getDoctrine()->getManager();
        $negocio_movil  = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:TipoNegocio')->findOneBy(['codigo' => 'MOVIL']);
        $negocio_fijo  = $this->getDoctrine()->getManager()->getRepository('DayscriptTiendaClaroBundle:TipoNegocio')->findOneBy(['codigo' => 'FIJO']);
        $transaccionMovil = $em->getRepository('DayscriptTiendaClaroBundle:TipoTransaccion')->first($negocio_movil->getId());
        $transaccionFijo = $em->getRepository('DayscriptTiendaClaroBundle:TipoTransaccion')->first($negocio_fijo->getId());
        if($transaccionMovil && $transaccionFijo) {
            $productosREP = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto');
            $productos = $productosREP->findProductosAllByTransaccionSlug($transaccionMovil, $transaccionFijo, true);
            if(sizeof($productos)) {
                return $this->render('DayscriptTiendaClaroBundle:Ofertas:Index.html.twig', [
                    'productos' => $productos,
                    'seccionWS'  => $this->seccionWS,
                    'configuration' => $this->__getSectionConfiguration($this->sectionName),
                    'tipoPago' => 'contado'
                ]);
            }
        }
        return $this->redirect($this->generateUrl('TiendaClaro_postpago_catalogo_marca_index'));
        //throw new HttpException(Response::HTTP_NOT_FOUND, 'Catálogo no encontrado.');
    }

    /**
     * Muestra el catálogo de productos con precios especiales
     * @param Request $request
     * @param string $catalogo_name
     * @param string $gaCategoryExtra
     * @param string $sectionExtra
     * @param string $tipo_pago
     * @param string $twigName
     * @return mixed
     */
    public function showCatalogo(Request $request, $catalogo_name, $gaCategoryExtra = null, $sectionExtra = null, $tipo_pago = 'tarjeta_credito', $twigName='DayscriptTiendaClaroBundle:Ofertas:Index.html.twig')
    {
        $this->sectionName = $catalogo_name;
        $configuration = $this->__getSectionConfiguration($this->sectionName);
        $em = $this->getDoctrine()->getManager();
        if(!empty($configuration)) {
            $tipoPagoSlug = $request->query->has('financiamiento') ? $request->query->get('financiamiento') : 'contado';
            $riesgoSlug = $request->query->has('riesgo') ? $request->query->get('riesgo') : null;
            $cuotasSlug = $request->query->has('cuotas') ? $request->query->get('cuotas') : 24;
            $entradaSlug = $request->query->has('cuotas') ? $request->query->get('entrada') : null;
            $productos = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findAllByParameters(TipoProducto::allSlugs(), TipoProducto::mobileParameters(['lista' => $configuration['lista'], 'transacciones' => ['renovacion', 'venta'], 'tipo_pago' => $tipoPagoSlug, 'riesgo' => $riesgoSlug, 'cuotas' => $cuotasSlug, 'entrada' => $entradaSlug]));
            //return new JsonResponse($productos);
            if(sizeof($productos)) {
                return $this->render($twigName, [
                    'productos' => $productos,
                    'configuration' => $configuration,
                    'seccionWS'  => $this->seccionWS.': '.$catalogo_name,
                    'gaCategoryExtra' => $gaCategoryExtra,
                    'sectionExtra' => $sectionExtra,
                    'riesgo' => $riesgoSlug,
                    'tipoPago' => $tipoPagoSlug,
                ]);
            }
        }
        return $this->redirect($this->generateUrl('TiendaClaro_postpago_catalogo_marca_index'));
    }

    /**
     * Muestra el catálogo de productos con precios especiales
     * @param Request $request
     * @param string $catalogo_name
     * @param string $gaCategoryExtra
     * @param string $sectionExtra
     * @param string $tipo_pago
     * @return mixed
     */
    public function showCatalogoFuntastic(Request $request, $catalogo_name, $gaCategoryExtra = null, $sectionExtra = null, $tipo_pago = 'tarjeta_credito')
    {
        $this->sectionName = $catalogo_name;
        $configuration = $this->__getSectionConfiguration($this->sectionName);
        $em = $this->getDoctrine()->getManager();
        if(!empty($configuration)) {
            $riesgoSlug = $request->query->has('riesgo') ? $request->query->get('riesgo') : null;
            $tipoPagoSlug = $request->query->has('financiamiento') ? $request->query->get('financiamiento') : 'contado';
            $productos = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findAllByParameters(TipoProducto::allSlugs(), TipoProducto::mobileParameters(['lista' => $configuration['lista'], 'transacciones' => ['renovacion', 'venta'], 'tipo_pago' => $tipoPagoSlug, 'riesgo' => $riesgoSlug]));
            //return new JsonResponse($productos);
            if(sizeof($productos)) {
                return $this->render('DayscriptTiendaClaroBundle:Ofertas:Funtastic.html.twig', [
                    'productos' => $productos,
                    'configuration' => $configuration,
                    'seccionWS'  => $this->seccionWS.': '.$catalogo_name,
                    'gaCategoryExtra' => $gaCategoryExtra,
                    'sectionExtra' => $sectionExtra,
                    'riesgo' => $riesgoSlug,
                    'tipoPago' => $tipoPagoSlug,
                ]);
            }
        }
        return $this->redirect($this->generateUrl('TiendaClaro_postpago_catalogo_marca_index'));
    }

    public function showCatalogoPacificard(Request $request)
    {
        $configuration = $this->container->getParameter('Landing__PreciosEspeciales');
        if(isset($configuration['tarjetas'])) {
            foreach ($configuration['tarjetas'] as $tarjeta => $content) {
                if($tarjeta == 'pacificard') {
                    return $this->render($content['view'], [
                        'banners' => isset($content['banners']) ? $content['banners'] : (isset($configuration['banners']) ? $configuration['banners'] : []),
                        'titulo' => $content['titulo'],
                        'seccionWS'  => $this->seccionWS,
                        'gaCategory' => $content['event_category'],
                        'equiposHtml' => $content['html'],
                        'marca' => $tarjeta,
                        'metadata' => isset($content['metadata']) ? $content['metadata'] : (isset($configuration['metadata']) ? $configuration['metadata'] : ''),
                    ]);
                }
            }
        }
    }

    /**
     * Muestra el catálogo de productos con precios especiales
     * @param Request $request
     * @param string $catalogo_name
     * @param string $gaCategoryExtra
     * @param string $sectionExtra
     * @param string $tipo_pago
     * @return mixed
     */
    public function showCatalogoByCuotas(Request $request, $catalogo_name, $gaCategoryExtra = null, $sectionExtra = null, $tipo_pago = 'tarjeta_credito', $riesgo = 'aaa', $cuotas = 18)
    {
        $this->sectionName = $catalogo_name;
        $configuration = $this->__getSectionConfiguration($this->sectionName);
        $em = $this->getDoctrine()->getManager();
        if(!empty($configuration)) {
            $productos = $em->getRepository('DayscriptTiendaClaroBundle:StoProducto')->findAllByParameters(TipoProducto::allSlugs(), TipoProducto::mobileParameters(['lista' => $configuration['lista'], 'transacciones' => ['renovacion', 'venta'], 'tipo_pago' => $tipo_pago, 'riesgo' => $riesgo, 'cuotas' => $cuotas]));
            //return new JsonResponse($productos);
            if(sizeof($productos)) {
                return $this->render('DayscriptTiendaClaroBundle:Ofertas:Index.html.twig', [
                    'productos' => $productos,
                    'configuration' => $configuration,
                    'gaCategoryExtra' => $gaCategoryExtra,
                    'seccionWS'  => $this->seccionWS.': '.$catalogo_name,
                    'sectionExtra' => $sectionExtra,
                    'tipoPago' => $tipo_pago,
                    'riesgo' => $riesgo
                ]);
            }
        }
        return $this->redirect($this->generateUrl('TiendaClaro_postpago_catalogo_marca_index'));
    }

    /**
     * Helper para definir la configuración básica de la sección
     * @param string $promocion_slug
     * @return mixed
     */
    protected function __getSectionConfiguration($promocion_slug = null)
    {
        try {
            $configuration =  $this->container->getParameter('Oferta__'.$this->sectionName);
            $configuration['gaCategory'] = $configuration['gaCategory'].($promocion_slug ? '_'.$promocion_slug : '');
            $configuration['seccion'] =  $promocion_slug ? 'CyberMonday' : 'Equipos';
            $configuration['financiados'] = $this->container->getParameter('Sticker__Promocion');
            $configuration['preventa'] = $this->container->getParameter('Sticker__Preventa');
            return $configuration;
        } catch (\Exception $e) { }
        return [];
    }
}