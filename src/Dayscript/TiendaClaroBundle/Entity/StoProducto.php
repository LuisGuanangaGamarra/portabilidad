<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;

/**
 * StoProducto
 */
class StoProducto
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     */
    private $slug;

    /**
     * @var string
     */
    private $nombre;

    /**
     * @var string
     */
    private $nombreComercial;

    /**
     * @var string
     */
    private $modelo;

    /**
     * @var boolean
     */
    private $presentar;

    /**
     * @var boolean
     */
    private $checkMetodo;

    /**
     * @var boolean
     */
    private $sendCallback;

    /**
     * @var string
     */
    private $tyc;

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
    private $deletedAt;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoProducto
     */
    private $idTipo;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoMarca
     */
    private $idMarca;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoGama
     */
    private $idGama;


    private $googleProductType = null;

    /////////////////////////////
    /// CAMPOS PERSONALIZADOS ///
    /////////////////////////////

    /**
     * @var string
     */
    private $flixMedia;

    /**
     * @var ArrayCollection
     */
    private $skus;

    /**
     * @var ArrayCollection
     */
    private $financiamientos;

    /**
     * @var ArrayCollection
     */
    private $caracteristicas = [];

    /**
     * @var ArrayCollection
     */
    private $anexos;

    /**
     * @var ArrayCollection
     */
    private $especificaciones;

    /**
     * @var ArrayCollection
     */
    private $customEspecificaciones;

    /**
     * @var ArrayCollection
     */
    private $productoEspecificaciones;

    /**
     * @var array
     */
    private $caracteristicasPrincipales = [];

    /**
     * Almacenará todas las etiquetas
     * @var array
     */
    private $etiquetas = [];

    /**
     * Almacenará las etiquetas que NO pertenezcan al tipo ACCESORIOS
     * @var array
     */
    private $promociones = [];

    /**
     * Almacenará las etiquetas que SÍ pertenezcan al tipo ACCESORIOS
     * @var array
     */
    private $accesorios = [];

    /**
     * @var ArrayCollection
     */
    private $productoSolicitudes;

    /**
     * @var double
     */
    private $precio;

    /**
     * @var double
     */
    private $precioOferta;


    public function __construct()
    {
        $this->financiamientos = new ArrayCollection();
        $this->anexos = new ArrayCollection();
        $this->skus = new ArrayCollection();
        $this->especificaciones =  new ArrayCollection();
        $this->productoSolicitudes =  new ArrayCollection();
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
     * Set slug
     *
     * @param string $slug
     * @return StoProducto
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set nombre
     *
     * @param string $nombre
     * @return StoProducto
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * Get nombre
     *
     * @return string
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set nombreComercial
     *
     * @param string $nombreComercial
     * @return StoProducto
     */
    public function setNombreComercial($nombreComercial)
    {
        $this->nombreComercial = $nombreComercial;

        return $this;
    }

    /**
     * Get nombreComercial
     *
     * @return string
     */
    public function getNombreComercial()
    {
        return $this->nombreComercial;
    }

    /**
     * Set modelo
     *
     * @param string $modelo
     * @return StoProducto
     */
    public function setModelo($modelo)
    {
        $this->modelo = $modelo;

        return $this;
    }

    /**
     * Get modelo
     *
     * @return string
     */
    public function getModelo()
    {
        return $this->modelo;
    }

    /**
     * Set presentar
     *
     * @param boolean $presentar
     * @return StoProducto
     */
    public function setPresentar($presentar)
    {
        $this->presentar = $presentar;

        return $this;
    }

    /**
     * Get presentar
     *
     * @return boolean
     */
    public function getPresentar()
    {
        return $this->presentar;
    }

    /**
     * Set checkMetodo
     *
     * @param boolean $checkMetodo
     * @return StoProducto
     */
    public function setCheckMetodo($checkMetodo)
    {
        $this->checkMetodo = $checkMetodo;

        return $this;
    }

    /**
     * Get checkMetodo
     *
     * @return boolean
     */
    public function getCheckMetodo()
    {
        return $this->checkMetodo;
    }

    /**
     * Set sendCallback
     *
     * @param boolean $sendCallback
     * @return StoProducto
     */
    public function setSendCallback($sendCallback)
    {
        $this->sendCallback = $sendCallback;

        return $this;
    }

    /**
     * Get sendCallback
     *
     * @return boolean
     */
    public function getSendCallback()
    {
        return $this->sendCallback;
    }

    /**
     * Set tyc
     *
     * @param string $tyc
     * @return StoProducto
     */
    public function setTyc($tyc)
    {
        $this->tyc = $tyc;

        return $this;
    }

    /**
     * Get tyc
     *
     * @return string
     */
    public function getTyc()
    {
        return $this->tyc;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return StoProducto
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
     * @return StoProducto
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
     * Set deletedAt
     *
     * @param \DateTime $deletedAt
     * @return StoProducto
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
     * Set idTipo
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoProducto $idTipo
     * @return StoProducto
     */
    public function setIdTipo(\Dayscript\TiendaClaroBundle\Entity\TipoProducto $idTipo = null)
    {
        $this->idTipo = $idTipo;

        return $this;
    }

    /**
     * Get idTipo
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoProducto
     */
    public function getIdTipo()
    {
        return $this->idTipo;
    }

    /**
     * Set idMarca
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoMarca $idMarca
     * @return StoProducto
     */
    public function setIdMarca(\Dayscript\TiendaClaroBundle\Entity\TipoMarca $idMarca = null)
    {
        $this->idMarca = $idMarca;

        return $this;
    }

    /**
     * Get idMarca
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoMarca
     */
    public function getIdMarca()
    {
        return $this->idMarca;
    }

    /**
     * Set idGama
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoGama $idGama
     * @return StoProducto
     */
    public function setIdGama(\Dayscript\TiendaClaroBundle\Entity\TipoGama $idGama = null)
    {
        $this->idGama = $idGama;

        return $this;
    }

    /**
     * Get idGama
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoGama
     */
    public function getIdGama()
    {
        return $this->idGama;
    }


    /////////////////////////////
    /// CAMPOS PERSONALIZADOS ///
    /////////////////////////////

    /**
     * Set flixMedia
     *
     * @param string $flixMedia
     * @return StoProducto
     */
    public function setFlixMedia($flixMedia)
    {
        $this->flixMedia = $flixMedia;

        return $this;
    }

    /**
     * Get flixMedia
     *
     * @return string
     */
    public function getFlixMedia()
    {
        return $this->flixMedia;
    }

    /**
     * @param boolean $availability
     * @return ArrayCollection
     */
    public function getSkus($availability=true)
    {
        $criteria = Criteria::create();

        if($availability){
            $criteria->where(Criteria::expr()->isNull('deletedAt'))->andWhere(Criteria::expr()->gt('stock', 0));
        }
        return $this->skus->matching($criteria);
    }

    /**
     * @param ArrayCollection $skus
     * @return StoProducto
     */
    public function setSkus($skus)
    {
        $this->skus = $skus;

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getFinanciamientos()
    {
        $today = new \DateTime();
        $criteria = Criteria::create();
        $criteria->where(Criteria::expr()->isNull('deletedAt'))
            ->andWhere(Criteria::expr()->lte('beginsAt', $today))
            ->andWhere(Criteria::expr()->gte('expiresAt', $today));

        return $this->financiamientos->matching($criteria);
    }

    /**
     * @return ArrayCollection
     */
    public function getFinanciamientosByTipo($tipo)
    {
        $today = new \DateTime();
        $criteria = Criteria::create();
        $criteria->where(Criteria::expr()->isNull('deletedAt'))
            ->andWhere(Criteria::expr()->lte('beginsAt', $today))
            ->andWhere(Criteria::expr()->gte('expiresAt', $today));
        switch ($tipo) {
            case 'normales':
                $criteria->andWhere(Criteria::expr()->isNull('idPromocion'));
                break;
            case 'ofertas':
                $criteria->andWhere(Criteria::expr()->neq('idPromocion', null));
                break;
            default:
                break;
        }

        return $this->financiamientos->matching($criteria);
    }

    /**

     * @param ArrayCollection $financiamientos
     * @return StoProducto
     */
    public function setFinanciamientos($financiamientos)
    {
        $this->financiamientos = $financiamientos;

        return $this;
    }

    /**
     * @return array
     */
    public function getCaracteristicas()
    {
        return $this->caracteristicas;
    }

    /**
     * @param array $caracteristicas
     */
    public function setCaracteristicas($caracteristicas)
    {
        $this->caracteristicas = $caracteristicas;
    }

    /**
     * @return ArrayCollection
     */
    public function getAnexos()
    {
        $criteria = Criteria::create();
        $criteria->where(Criteria::expr()->isNull('deletedAt'))->orderBy(array('orden' => Criteria::ASC));
        return $this->anexos->matching($criteria);
    }

    /**

     * @param ArrayCollection $anexos
     * @return StoProducto
     */
    public function setAnexos($anexos)
    {
        $this->anexos = $anexos;

        return $this;
    }


    /**
     * @return array
     */
    public function getEtiquetas()
    {
        return $this->etiquetas;
    }

    /**
     * @param array $etiquetas
     */
    public function setEtiquetas($etiquetas)
    {
        $this->etiquetas = $etiquetas;
    }

    /**
     * @return array
     */
    public function getCaracteristicasPrincipales()
    {
        return $this->caracteristicasPrincipales;
    }

    /**
     * @param array $caracteristicasPrincipales
     */
    public function setCaracteristicasPrincipales($caracteristicasPrincipales)
    {
        $this->caracteristicasPrincipales = $caracteristicasPrincipales;
    }

    /**
     * @return ArrayCollection
     */
    public function getEspecificaciones()
    {
        $criteria = Criteria::create();
        $criteria->where(Criteria::expr()->isNull('deletedAt'));
        return $this->especificaciones->matching($criteria);
    }

    /**
     * @param array $especificaciones
     * @return StoProducto
     */
    public function setEspecificaciones($especificaciones)
    {
        $this->especificaciones = $especificaciones;

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getCustomEspecificaciones()
    {
        return $this->customEspecificaciones;
    }

    /**
     * @param ArrayCollection $customEspecificaciones
     */
    public function setCustomEspecificaciones($customEspecificaciones)
    {
        $this->customEspecificaciones = $customEspecificaciones;
    }

    /**
     * @return ArrayCollection
     */
    public function getProductoEspecificaciones()
    {
        $criteria = Criteria::create();
        $criteria->where(Criteria::expr()->isNull('deletedAt'));
        return $this->productoEspecificaciones->matching($criteria);
    }

    /**
     * @param ArrayCollection $productoEspecificaciones
     */
    public function setProductoEspecificaciones($productoEspecificaciones)
    {
        $this->productoEspecificaciones = $productoEspecificaciones;
    }

    /**
     * @return ArrayCollection
     */
    public function getProductoSolicitudes()
    {
        return $this->productoSolicitudes;
    }

    /**
     * @param ArrayCollection $productoSolicitudes
     */
    public function setProductoSolicitudes($productoSolicitudes)
    {
        $this->productoSolicitudes = $productoSolicitudes;
    }

    /**
     * @return string
     */
    public function getContentId()
    {
        return $this->getIdTipo()->getSlug().'-'.$this->getSlug();
    }

    /**
     * @return float
     */
    public function getPrecio()
    {
        return $this->precio;
    }

    /**
     * @param float $precio
     */
    public function setPrecio($precio)
    {
        $this->precio = $precio;
    }

    /**
     * @return float
     */
    public function getGoogleProductType()
    {
        if (!empty($this->googleProductType))
            return $this->googleProductType;
        return $this->googleProductType = TipoProducto::googleProductType($this->getIdTipo()->getSlug());
    }

    /**
     * @return float
     */
    public function getPrecioOferta()
    {
        return $this->precioOferta;
    }

    /**
     * @param float $precioOferta
     */
    public function setPrecioOferta($precioOferta)
    {
        $this->precioOferta = $precioOferta;
    }


}
