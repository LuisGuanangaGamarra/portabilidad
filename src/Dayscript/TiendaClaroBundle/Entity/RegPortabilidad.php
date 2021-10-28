<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Validator\Constraints as TiendaAssert;

/**
 * RegPortabilidad
 */
class RegPortabilidad
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     */
    private $formCodigo;

    /**
     * @var integer
     */
    private $formPaso;

    /**
     * @var boolean
     */
    private $formIsConfirmado = false;

    /**
     * @var boolean
     */
    private $formIsAprobado;

    /**
     * @var string
     * @1Assert\NotBlank
     * @TiendaAssert\Cedula
     */
    private $clienteIdentificacion;

    /**
     * @var string
     */
    private $clienteNombre;

    /**
     * @var string
     */
    private $clienteRazon;

    /**
     * @var string
     */
    private $clienteOtros;

    /**
     * @var boolean
     */
    private $clienteIsNatural = true;

    /**
     * @var string
     */
    private $operadoraDonante;

    /**
     * @var string
     */
    private $operadoraReceptor;

    /**
     * @var float
     * @Assert\GreaterThan(value = 0)
     */
    private $tarifaMinima;

    /**
     * @var float
     * @Assert\GreaterThan(value = 0)
     */
    private $tarifaMaxima;

    /**
     * @var boolean
     */
    private $isPrepagoBefore = true;

    /**
     * @var boolean
     */
    private $isPrepagoAfter = true;

    /**
     * @var integer
     */
    private $idPlan;

    /**
     * @var string
     */
    private $planNombre;

    /**
     * @var string
     */
    private $planCodigo;

    /**
     * @var float
     */
    private $planTarifa;

    /**
     * @var string
     */
    private $direccionProvincia;

    /**
     * @var string
     */
    private $direccionCiudad;

    /**
     * @var string
     */
    private $direccionExacta;

    /**
     * @var string
     */
    private $direccionReferencia;

    /**
     * @var string
     */
    private $contacto1;

    /**
     * @var string
     */
    private $contacto2;

    /**
     * @var string
     */
    private $docSecuencia;

    /**
     * @var \DateTime
     */
    private $docFechaCreacion;

    /**
     * @var string
     */
    private $docFirma;

    /**
     * @var string
     * @Assert\Ip
     */
    protected $ip;

    /**
     * @var string
     */
    protected $observaciones;

    /**
     * @var \DateTime
     */
    private $createdAt;

    /**
     * @var \DateTime
     */
    private $updatedAt;

    /**
     * @var \DateTime
     */
    private $expiresAt;

    /**
     * @var \DateTime
     */
    private $sentToClientAt;

    /**
     * @var \DateTime
     */
    private $sentToClaroAt;

    /**
     * @var \DateTime
     */
    private $deletedAt;

    /**
     * @var \DateTime
     */
    private $sentNoResponse;

    /**
     * @var \DateTime
     */
    private $sentCallme;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoOperadora
     * @Assert\NotNull
     */
    private $idDonante;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoOperadora
     * @Assert\NotNull
     */
    private $idReceptor;

    /**
     * @var integer
     */

    private $idStoPlan;

    /**
     * @var string
     */
    private $providerCb;

    /**
     * @var string
     */
    private $agencia;

    /**
     * @var string
     */
    private $lugar;
    /**
     * @var string
     */
    private $tipoSolicitud;
    /**
     * @var string
     */
    private $obtenerSim;
    /**
     * @return int
     */
    public function getIdStoPlan()
    {
        return $this->idStoPlan;
    }

    /**
     * @param int $idStoPlan
     */
    public function setIdStoPlan($idStoPlan)
    {
        $this->idStoPlan = $idStoPlan;
    }

    /**
     * @var integer
     */
    private $idProducto;

    /**
     * @return int
     */
    public function getIdProducto()
    {
        return $this->idProducto;
    }

    /**
     * @param int $idProducto
     */
    public function setIdProducto($idProducto)
    {
        $this->idProducto = $idProducto;
    }


    /**
     * @return string
     */
    public function getNombreProducto()
    {
        return $this->nombreProducto;
    }

    /**
     * @param string $nombreProducto
     */
    public function setNombreProducto($nombreProducto)
    {
        $this->nombreProducto = $nombreProducto;
    }

    /**
     * @var string
     */
    private $nombreProducto;


    /**
     * @return StoProducto
     */
    public function getProducto()
    {
        return $this->producto;
    }

    /**
     * @param StoProducto $producto
     */
    public function setProducto($producto)
    {
        $this->producto = $producto;
    }

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\StoProducto
     */
    private $producto;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\StoPlan
     */
    private $stoPlan;

    /**
     * @return StoPlan
     */
    public function getStoPlan()
    {
        return $this->stoPlan;
    }

    /**
     * @param StoPlan $stoPlan
     */
    public function setStoPlan($stoPlan)
    {
        $this->stoPlan = $stoPlan;
    }

    /**
     * @var RegPortabilidadNumero[]
     * @Assert\Count(
     *      min = 1,
     *      max = 10,
     *      minMessage = "La solicitud de portabilidad debe contener al menos un número a portar.",
     *      maxMessage = "La solicitud de portabilidad no puede contener más de {{ limit }} números."
     * )
     */
    private $numeros = [];

    /**
     * @var RegPortabilidadAnexo[]
     * @Assert\Count(
     *      min = 0,
     *      max = 3,
     *      minMessage = "La solicitud de portabilidad debe contener al menos {{ limit }} anexos.",
     *      maxMessage = "La solicitud de portabilidad no puede contener más de {{ limit }} anexos."
     * )
     */
    private $anexos = [];

    private $planIncluye = [];

    private $planPromocion = [];

    /**
     * @var boolean
     */
    private $isLanding = false;

    /**
     * @var boolean
     */
    private $suscripcion = false;

    /**
     * @return bool
     */
    public function isSuscripcion()
    {
        return $this->suscripcion;
    }

    /**
     * @param bool $suscripcion
     */
    public function setSuscripcion($suscripcion)
    {
        $this->suscripcion = $suscripcion;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set formCodigo
     *
     * @param string $formCodigo
     *
     * @return RegPortabilidad
     */
    public function setFormCodigo($formCodigo)
    {
        $this->formCodigo = $formCodigo;

        return $this;
    }

    /**
     * Get formCodigo
     *
     * @return string
     */
    public function getFormCodigo()
    {
        return $this->formCodigo;
    }

    /**
     * Set formPaso
     *
     * @param integer $formPaso
     *
     * @return RegPortabilidad
     */
    public function setFormPaso($formPaso)
    {
        $this->formPaso = $formPaso;

        return $this;
    }

    /**
     * Get formPaso
     *
     * @return integer
     */
    public function getFormPaso()
    {
        return $this->formPaso;
    }

    /**
     * Set formIsConfirmado
     *
     * @param boolean $formIsConfirmado
     *
     * @return RegPortabilidad
     */
    public function setFormIsConfirmado($formIsConfirmado)
    {
        $this->formIsConfirmado = $formIsConfirmado;

        return $this;
    }

    /**
     * Get formIsConfirmado
     *
     * @return boolean
     */
    public function getFormIsConfirmado()
    {
        return $this->formIsConfirmado;
    }

    /**
     * @return bool
     */
    public function isFormIsAprobado()
    {
        return $this->formIsAprobado;
    }

    /**
     * @param bool $formIsAprobado
     */
    public function setFormIsAprobado($formIsAprobado)
    {
        $this->formIsAprobado = $formIsAprobado;
    }

    /**
     * Set clienteIdentificacion
     *
     * @param string $clienteIdentificacion
     *
     * @return RegPortabilidad
     */
    public function setClienteIdentificacion($clienteIdentificacion)
    {
        $this->clienteIdentificacion = $clienteIdentificacion;

        return $this;
    }

    /**
     * Get clienteIdentificacion
     *
     * @return string
     */
    public function getClienteIdentificacion()
    {
        return $this->clienteIdentificacion;
    }

    /**
     * Set clienteNombre
     *
     * @param string $clienteNombre
     *
     * @return RegPortabilidad
     */
    public function setClienteNombre($clienteNombre)
    {
        $this->clienteNombre = $clienteNombre;

        return $this;
    }

    /**
     * Get clienteNombre
     *
     * @return string
     */
    public function getClienteNombre()
    {
        return $this->clienteNombre;
    }

    /**
     * Set clienteRazon
     *
     * @param string $clienteRazon
     *
     * @return RegPortabilidad
     */
    public function setClienteRazon($clienteRazon)
    {
        $this->clienteRazon = $clienteRazon;

        return $this;
    }

    /**
     * Get clienteRazon
     *
     * @return string
     */
    public function getClienteRazon()
    {
        return $this->clienteRazon;
    }

    /**
     * Set clienteOtros
     *
     * @param string $clienteOtros
     *
     * @return RegPortabilidad
     */
    public function setClienteOtros($clienteOtros)
    {
        $this->clienteOtros = $clienteOtros;

        return $this;
    }

    /**
     * Get clienteOtros
     *
     * @return string
     */
    public function getClienteOtros()
    {
        return $this->clienteOtros;
    }

    /**
     * Set clienteIsNatural
     *
     * @param boolean $clienteIsNatural
     *
     * @return RegPortabilidad
     */
    public function setClienteIsNatural($clienteIsNatural)
    {
        $this->clienteIsNatural = $clienteIsNatural;

        return $this;
    }

    /**
     * Get clienteIsNatural
     *
     * @return boolean
     */
    public function getClienteIsNatural()
    {
        return $this->clienteIsNatural;
    }

    /**
     * Set operadoraDonante
     *
     * @param string $operadoraDonante
     *
     * @return RegPortabilidad
     */
    public function setOperadoraDonante($operadoraDonante)
    {
        $this->operadoraDonante = $operadoraDonante;

        return $this;
    }

    /**
     * Get operadoraDonante
     *
     * @return string
     */
    public function getOperadoraDonante()
    {
        return $this->operadoraDonante;
    }

    /**
     * Set operadoraReceptor
     *
     * @param string $operadoraReceptor
     *
     * @return RegPortabilidad
     */
    public function setOperadoraReceptor($operadoraReceptor)
    {
        $this->operadoraReceptor = $operadoraReceptor;

        return $this;
    }

    /**
     * Get operadoraReceptor
     *
     * @return string
     */
    public function getOperadoraReceptor()
    {
        return $this->operadoraReceptor;
    }

    /**
     * Set tarifaMinima
     *
     * @param float $tarifaMinima
     *
     * @return RegPortabilidad
     */
    public function setTarifaMinima($tarifaMinima)
    {
        $this->tarifaMinima = $tarifaMinima;

        return $this;
    }

    /**
     * Get tarifaMinima
     *
     * @return float
     */
    public function getTarifaMinima()
    {
        return $this->tarifaMinima;
    }

    /**
     * Set tarifaMaxima
     *
     * @param float $tarifaMaxima
     *
     * @return RegPortabilidad
     */
    public function setTarifaMaxima($tarifaMaxima)
    {
        $this->tarifaMaxima = $tarifaMaxima;

        return $this;
    }

    /**
     * Get tarifaMaxima
     *
     * @return float
     */
    public function getTarifaMaxima()
    {
        return $this->tarifaMaxima;
    }

    /**
     * Set isPrepagoBefore
     *
     * @param boolean $isPrepagoBefore
     *
     * @return RegPortabilidad
     */
    public function setIsPrepagoBefore($isPrepagoBefore)
    {
        $this->isPrepagoBefore = $isPrepagoBefore;

        return $this;
    }

    /**
     * Get isPrepagoBefore
     *
     * @return boolean
     */
    public function getIsPrepagoBefore()
    {
        return $this->isPrepagoBefore;
    }

    /**
     * Set isPrepagoAfter
     *
     * @param boolean $isPrepagoAfter
     *
     * @return RegPortabilidad
     */
    public function setIsPrepagoAfter($isPrepagoAfter)
    {
        $this->isPrepagoAfter = $isPrepagoAfter;

        return $this;
    }

    /**
     * Get isPrepagoAfter
     *
     * @return boolean
     */
    public function getIsPrepagoAfter()
    {
        return $this->isPrepagoAfter;
    }

    /**
     * Set idPlan
     *
     * @param array $plan
     *
     * @return RegPortabilidad
     */
    public function setPlan($plan)
    {
        if($plan === null) {
            $this->idPlan = null;
            $this->planNombre = null;
            $this->planCodigo = null;
            $this->planTarifa = null;
        } else {
            $this->idPlan = $plan['IDPLAN'];
            $this->planNombre = $plan['NOMBREPLAN'];
            $this->planCodigo = $plan['CODIGOCLARO'];
            $this->planTarifa = $plan['TARIFABASICAMENSUAL'];
        }

        return $this;
    }

    /**
     * Set idPlan
     *
     * @param integer $idPlan
     *
     * @return RegPortabilidad
     */
    public function setIdPlan($idPlan)
    {
        $this->idPlan = $idPlan;

        return $this;
    }

    /**
     * Get idPlan
     *
     * @return integer
     */
    public function getIdPlan()
    {
        return $this->idPlan;
    }

    /**
     * Set planNombre
     *
     * @param string $planNombre
     *
     * @return RegPortabilidad
     */
    public function setPlanNombre($planNombre)
    {
        $this->planNombre = $planNombre;

        return $this;
    }

    /**
     * Get planNombre
     *
     * @return string
     */
    public function getPlanNombre()
    {
        return $this->planNombre;
    }

    /**
     * Set planCodigo
     *
     * @param string $planCodigo
     *
     * @return RegPortabilidad
     */
    public function setPlanCodigo($planCodigo)
    {
        $this->planCodigo = $planCodigo;

        return $this;
    }

    /**
     * Get planCodigo
     *
     * @return string
     */
    public function getPlanCodigo()
    {
        return $this->planCodigo;
    }

    /**
     * Set planTarifa
     *
     * @param float $planTarifa
     *
     * @return RegPortabilidad
     */
    public function setPlanTarifa($planTarifa)
    {
        $this->planTarifa = $planTarifa;

        return $this;
    }

    /**
     * Get planTarifa
     *
     * @return float
     */
    public function getPlanTarifa()
    {
        return $this->planTarifa;
    }

    /**
     * Set direccionProvincia
     *
     * @param string $direccionProvincia
     *
     * @return RegPortabilidad
     */
    public function setDireccionProvincia($direccionProvincia)
    {
        $this->direccionProvincia = $direccionProvincia;

        return $this;
    }

    /**
     * Get direccionProvincia
     *
     * @return string
     */
    public function getDireccionProvincia()
    {
        return $this->direccionProvincia;
    }

    /**
     * Set direccionCiudad
     *
     * @param string $direccionCiudad
     *
     * @return RegPortabilidad
     */
    public function setDireccionCiudad($direccionCiudad)
    {
        $this->direccionCiudad = $direccionCiudad;

        return $this;
    }

    /**
     * Get direccionCiudad
     *
     * @return string
     */
    public function getDireccionCiudad()
    {
        return $this->direccionCiudad;
    }

    /**
     * Set direccionExacta
     *
     * @param string $direccionExacta
     *
     * @return RegPortabilidad
     */
    public function setDireccionExacta($direccionExacta)
    {
        $this->direccionExacta = $direccionExacta;

        return $this;
    }

    /**
     * Get direccionExacta
     *
     * @return string
     */
    public function getDireccionExacta()
    {
        return $this->direccionExacta;
    }

    /**
     * Set direccionReferencia
     *
     * @param string $direccionReferencia
     *
     * @return RegPortabilidad
     */
    public function setDireccionReferencia($direccionReferencia)
    {
        $this->direccionReferencia = $direccionReferencia;

        return $this;
    }

    /**
     * Get direccionReferencia
     *
     * @return string
     */
    public function getDireccionReferencia()
    {
        return $this->direccionReferencia;
    }

    /**
     * Set contacto1
     *
     * @param string $contacto1
     *
     * @return RegPortabilidad
     */
    public function setContacto1($contacto1)
    {
        $this->contacto1 = $contacto1;

        return $this;
    }

    /**
     * Get contacto1
     *
     * @return string
     */
    public function getContacto1()
    {
        return $this->contacto1;
    }

    /**
     * Set contacto2
     *
     * @param string $contacto2
     *
     * @return RegPortabilidad
     */
    public function setContacto2($contacto2)
    {
        $this->contacto2 = $contacto2;

        return $this;
    }

    /**
     * Get contacto2
     *
     * @return string
     */
    public function getContacto2()
    {
        return $this->contacto2;
    }

    /**
     * Set docSecuencia
     *
     * @param string $docSecuencia
     *
     * @return RegPortabilidad
     */
    public function setDocSecuencia($docSecuencia)
    {
        $this->docSecuencia = $docSecuencia;

        return $this;
    }

    /**
     * Get docSecuencia
     *
     * @return string
     */
    public function getDocSecuencia()
    {
        return $this->docSecuencia;
    }

    /**
     * Set docFechaCreacion
     *
     * @param \DateTime $docFechaCreacion
     *
     * @return RegPortabilidad
     */
    public function setDocFechaCreacion($docFechaCreacion)
    {
        $this->docFechaCreacion = $docFechaCreacion;

        return $this;
    }

    /**
     * Get docFechaCreacion
     *
     * @return \DateTime
     */
    public function getDocFechaCreacion()
    {
        return $this->docFechaCreacion;
    }

    /**
     * Set docFirma
     *
     * @param string $docFirma
     *
     * @return RegPortabilidad
     */
    public function setDocFirma($docFirma)
    {
        $this->docFirma = $docFirma;

        return $this;
    }

    /**
     * Get docFirma
     *
     * @return string
     */
    public function getDocFirma()
    {
        return base64_decode($this->docFirma);
    }

    /**
     * Get ip
     *
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * Set ip
     *
     * @param string $ip
     *
     * @return RegPortabilidad
     */
    public function setIp($ip)
    {
        $this->ip = $ip;

        return $this;
    }

    /**
     * @return string
     */
    public function getObservaciones()
    {
        return $this->observaciones;
    }

    /**
     * @param string $observaciones
     */
    public function setObservaciones($observaciones)
    {
        $this->observaciones = $observaciones;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return RegPortabilidad
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return RegPortabilidad
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set expiresAt
     *
     * @param \DateTime $expiresAt
     *
     * @return RegPortabilidad
     */
    public function setExpiresAt($expiresAt)
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }

    /**
     * Get expiresAt
     *
     * @return \DateTime
     */
    public function getExpiresAt()
    {
        return $this->expiresAt;
    }

    /**
     * Set sentToClientAt
     *
     * @param \DateTime $sentToClientAt
     *
     * @return RegPortabilidad
     */
    public function setSentToClientAt($sentToClientAt)
    {
        $this->sentToClientAt = $sentToClientAt;

        return $this;
    }

    /**
     * Get sentToClientAt
     *
     * @return \DateTime
     */
    public function getSentToClientAt()
    {
        return $this->sentToClientAt;
    }

    /**
     * Set sentToClaroAt
     *
     * @param \DateTime $sentToClaroAt
     *
     * @return RegPortabilidad
     */
    public function setSentToClaroAt($sentToClaroAt)
    {
        $this->sentToClaroAt = $sentToClaroAt;

        return $this;
    }

    /**
     * Get sentToClaroAt
     *
     * @return \DateTime
     */
    public function getSentToClaroAt()
    {
        return $this->sentToClaroAt;
    }

    /**
     * Set deletedAt
     *
     * @param \DateTime $deletedAt
     *
     * @return RegPortabilidad
     */
    public function setDeletedAt($deletedAt)
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    /**
     * Get deletedAt
     *
     * @return \DateTime
     */
    public function getDeletedAt()
    {
        return $this->deletedAt;
    }

    /**
     * @return \DateTime
     */
    public function getSentNoResponse()
    {
        return $this->sentNoResponse;
    }

    /**
     * @param \DateTime $sentNoResponse
     */
    public function setSentNoResponse($sentNoResponse)
    {
        $this->sentNoResponse = $sentNoResponse;
    }

    /**
     * @return \DateTime
     */
    public function getSentCallme()
    {
        return $this->sentCallme;
    }

    /**
     * @param \DateTime $sentCallme
     */
    public function setSentCallme($sentCallme)
    {
        $this->sentCallme = $sentCallme;
    }

    /**
     * Set idDonante
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoOperadora $idDonante
     *
     * @return RegPortabilidad
     */
    public function setIdDonante(\Dayscript\TiendaClaroBundle\Entity\TipoOperadora $idDonante = null)
    {
        $this->idDonante = $idDonante;
        $this->operadoraDonante = mb_strtoupper($idDonante->getNombreLegal(), 'UTF-8');
        return $this;
    }

    /**
     * Get idDonante
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoOperadora
     */
    public function getIdDonante()
    {
        return $this->idDonante;
    }

    /**
     * Set idReceptor
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoOperadora $idReceptor
     *
     * @return RegPortabilidad
     */
    public function setIdReceptor(\Dayscript\TiendaClaroBundle\Entity\TipoOperadora $idReceptor = null)
    {
        $this->idReceptor = $idReceptor;
        $this->operadoraReceptor = mb_strtoupper($idReceptor->getNombreLegal(), 'UTF-8');
        return $this;
    }

    /**
     * Get idReceptor
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoOperadora
     */
    public function getIdReceptor()
    {
        return $this->idReceptor;
    }
    /**
     * @var string
     * @1Assert\NotBlank
     * @Assert\Email
     */
    private $clienteEmail;


    /**
     * Set clienteEmail
     *
     * @param string $clienteEmail
     *
     * @return RegPortabilidad
     */
    public function setClienteEmail($clienteEmail)
    {
        $this->clienteEmail = $clienteEmail;

        return $this;
    }

    /**
     * Get clienteEmail
     *
     * @return string
     */
    public function getClienteEmail()
    {
        return $this->clienteEmail;
    }

    /**
     * @return RegPortabilidadNumero[]
     */
    public function getNumeros()
    {
        return $this->numeros;
    }

    /**
     * @param RegPortabilidadNumero[] $numeros
     */
    public function setNumeros($numeros)
    {
        $this->numeros = $numeros;
    }

    /**
     * @param RegPortabilidadNumero $numero
     */
    public function addNumero(RegPortabilidadNumero $numero)
    {
        array_push($this->numeros, $numero);
    }

    /**
     * @return RegPortabilidadAnexo[]
     */
    public function getAnexos()
    {
        return $this->anexos;
    }

    /**
     * @param RegPortabilidadAnexo[] $anexos
     */
    public function setAnexos($anexos)
    {
        $this->anexos = $anexos;
    }

    /**
     * @param RegPortabilidadAnexo $anexo
     */
    public function addAnexo(RegPortabilidadAnexo $anexo)
    {
        array_push($this->anexos, $anexo);
    }

    /**
     * @param RegPortabilidadAnexo $anexo
     * @return int|string|null
     */
    public function removeAnexo(RegPortabilidadAnexo $anexo)
    {
        $index = null;
        foreach ($this->anexos as $i => $m_anexo) {
            if($m_anexo->getId() == $anexo->getId()) {
                $index = $i;
            }
        }
        if($index)
            array_splice($this->anexos, 1, $index);
        return $index;
    }

    public function jsonSerialize($asset_component)
    {
        $anexos_j = [];
        foreach ($this->anexos as $anexo) {
            array_push($anexos_j, ['tipo' => mb_strtolower($anexo->getTipo(), 'UTF-8'), 'url' => $asset_component->getUrl($anexo->getRuta())]);
        }
        return [
            'cliente' => [
                'nombres' => $this->getClienteNombre(),
                'identificacion' => $this->getClienteIdentificacion(),
                'email' => $this->getClienteEmail(),
            ],
            'numero' => sizeof($this->numeros) ? [
                'numero' => $this->numeros[0]->getNumero(),
                'operador_donante' => $this->getIdDonante()->getNombreComercial(),
                'modalidad' => $this->getIsPrepagoBefore() ? 'Prepago' : 'Postpago',
            ] : null,
            'entrega' => [
                'provincia' => $this->getDireccionProvincia(),
                'ciudad' => $this->getDireccionCiudad(),
                'direccion' => $this->getDireccionExacta(),
                'referencia' => $this->getDireccionReferencia()
            ],
            'anexos' => $anexos_j,
        ];
    }

    /**
     * @return array
     */
    public function getPlanIncluye()
    {
        return $this->planIncluye;
    }

    /**
     * @param array $planIncluye
     */
    public function setPlanIncluye($planIncluye)
    {
        $this->planIncluye = $planIncluye;
    }

    /**
     * @return array
     */
    public function getPlanPromocion()
    {
        return $this->planPromocion;
    }

    /**
     * @param array $planPromocion
     */
    public function setPlanPromocion($planPromocion)
    {
        $this->planPromocion = $planPromocion;
    }

    /**
     * @return bool
     */
    public function isLanding()
    {
        return $this->isLanding;
    }

    /**
     * @param bool $isLanding
     */
    public function setIsLanding($isLanding)
    {
        $this->isLanding = $isLanding;
    }

    /**
     * @return string
     */
    public function getProviderCb()
    {
        return $this->providerCb;
    }

    /**
     * @param string $providerCb
     */
    public function setProviderCb($providerCb)
    {
        $this->providerCb = $providerCb;
    }
    /**
     * @return string
     */
    public function getTipoSolicitud()
    {
        return $this->tipoSolicitud;
    }

    /**
     * @param string $tipoSolicitud
     */
    public function setTipoSolicitud($tipoSolicitud)
    {
        $this->tipoSolicitud = $tipoSolicitud;
    }

    /**
     * @return string
     */
    public function getAgencia()
    {
        return $this->agencia;
    }

    /**
     * @param string $agencia
     */
    public function setAgencia($agencia)
    {
        $this->agencia = $agencia;
    }

    /**
     * @return string
     */
    public function getLugar()
    {
        return $this->lugar;
    }

    /**
     * @param string $lugar
     */
    public function setLugar($lugar)
    {
        $this->lugar = $lugar;
    }


    /**
     * @return string
     */ 
    public function getObtenerSim()
    {
        return $this->obtenerSim;
    }

    /**
     * @param string $obtenerSim
     */
    public function setObtenerSim($obtenerSim)
    {
        $this->ObtenerSim = $obtenerSim;
    }
}
