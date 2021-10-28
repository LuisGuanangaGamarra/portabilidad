<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TipoTransaccion
 */
class TipoTransaccion
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
    private $descripcion;

    /**
     * @var boolean
     */
    private $checkMetodo;

    /**
     * @var boolean
     */
    private $isVenta;

    /**
     * @var boolean
     */
    private $hasPlan;

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
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoNegocio
     */
    private $idNegocio;

    /**
     * @var ArrayCollection
     */
    private $planDetalles;


    public function __construct()
    {
        $this->planDetalles = new ArrayCollection();
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
     * @return TipoTransaccion
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
     * @return TipoTransaccion
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
     * Set descripcion
     *
     * @param string $descripcion
     * @return TipoTransaccion
     */
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    /**
     * Get descripcion
     *
     * @return string 
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * Set checkMetodo
     *
     * @param boolean $checkMetodo
     * @return TipoTransaccion
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
     * Set isVenta
     *
     * @param boolean $isVenta
     * @return TipoTransaccion
     */
    public function setIsVenta($isVenta)
    {
        $this->isVenta = $isVenta;

        return $this;
    }

    /**
     * Get isVenta
     *
     * @return boolean 
     */
    public function getIsVenta()
    {
        return $this->isVenta;
    }

    /**
     * Set hasPlan
     *
     * @param boolean $hasPlan
     * @return TipoTransaccion
     */
    public function setHasPlan($hasPlan)
    {
        $this->hasPlan = $hasPlan;

        return $this;
    }

    /**
     * Get hasPlan
     *
     * @return boolean 
     */
    public function getHasPlan()
    {
        return $this->hasPlan;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return TipoTransaccion
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
     * @return TipoTransaccion
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
     * @return TipoTransaccion
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
     * Set idNegocio
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoNegocio $idNegocio
     * @return TipoTransaccion
     */
    public function setIdNegocio(\Dayscript\TiendaClaroBundle\Entity\TipoNegocio $idNegocio = null)
    {
        $this->idNegocio = $idNegocio;

        return $this;
    }

    /**
     * Get idNegocio
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoNegocio 
     */
    public function getIdNegocio()
    {
        return $this->idNegocio;
    }

    /**
     * @return ArrayCollection
     */
    public function getPlanDetalles()
    {
        return $this->planDetalles;
    }

    /**
     * @param ArrayCollection $planDetalles
     */
    public function setPlanDetalles($planDetalles)
    {
        $this->planDetalles = $planDetalles;
    }

}
