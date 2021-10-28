<?php

namespace Dayscript\TiendaClaroBundle\Listener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;


class UtmRequestListener
{
    private $utmService;

    /**
     * @param mixed $utmService
     * Setter for $utmService
     */
    public function setUtmService($utmService)
    {
        $this->utmService = $utmService;
    }

    /**
     * @param GetResponseEvent $event
     * Calls UtmHandler service to save utm parameters
     */
    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        $this->utmService->saveUtm(
            $request->query->has('utm_source') ? $request->query->get('utm_source') : null,
            $request->query->has('utm_medium') ? $request->query->get('utm_medium') : null,
            $request->query->has('utm_campaign') ? $request->query->get('utm_campaign') : ($request->query->has('utm_campaing') ? $request->query->get('utm_campaing') : null),
            $request->query->has('utm_content') ? $request->query->get('utm_content') : null,
            $request->query->has('utm_term') ? $request->query->get('utm_term') : null
        );
        //$event->setResponse(new JsonResponse($this->utmService->getSource()));
    }
}