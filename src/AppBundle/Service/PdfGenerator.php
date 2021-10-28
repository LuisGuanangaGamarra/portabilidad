<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 20/05/2019
 * Time: 15:23
 */

namespace AppBundle\Service;

require_once __DIR__ . '/../../../vendor/dompdf/dompdf/autoload.inc.php';

use Dayscript\TiendaClaroBundle\Entity\RegPortabilidad;
use Dompdf\Dompdf;
use Symfony\Bundle\TwigBundle\TwigEngine;

class PdfGenerator
{
    /**
     * @var string
     */
    private $targetDirectory;

    /**
     * @var TwigEngine
     */
    private $templatingService;

    /**
     * PdfGenerator constructor.
     * @param $targetDirectory
     * @param TwigEngine $templating
     */
    public function __construct($targetDirectory, TwigEngine $templating)
    {
        $this->targetDirectory = $targetDirectory;
        $this->templatingService = $templating;
    }

    public function generateSolicitudPortabilidad(RegPortabilidad $solicitud, $filename, $sub_directory = '', $nip = '')
    {
        $path = $this->targetDirectory.$sub_directory;
        $html = $this->templatingService->render('DayscriptTiendaClaroBundle:Portabilidad/Pdf:Solicitud.html.twig', ['solicitud' => $solicitud, 'nip' => $nip]);
        $dompdf = new Dompdf();
        $dompdf->loadHtml(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        file_put_contents($path.'/'.$filename, $dompdf->output());
        //$dompdf->stream($filename, array("Attachment" => false));
        return $path.'/'.$filename;
    }
}