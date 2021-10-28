<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * StoPlan
 */
class StoPlan
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
     * @var float
     */
    private $cuotaSinImp;

    /**
     * @var float
     */
    private $cuotaConImp;

    /**
     * @var boolean
     */
    private $showCatalogo;

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
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoStoPlan
     */
    private $idTipo;

    /**
     * @var ArrayCollection
     */
    private $planDetalles;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\CustomPlanMovil
     */
    private $customPlan;

    

    /**
     * StoPlan constructor.
     * @param int $id
     */
    public function __construct()
    {
       
    }

    /**
     * @return CustomPlanMovil
     */
    public function getCustomPlan()
    {
        return $this->customPlan;
    }

    /**
     * @param CustomPlanMovil $customPlan
     */
    public function setCustomPlan($customPlan)
    {
        $this->customPlan = $customPlan;
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
     * @return StoPlan
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
     * @return StoPlan
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
     * @return StoPlan
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
     * Set cuotaSinImp
     *
     * @param float $cuotaSinImp
     * @return StoPlan
     */
    public function setCuotaSinImp($cuotaSinImp)
    {
        $this->cuotaSinImp = $cuotaSinImp;

        return $this;
    }

    /**
     * Get cuotaSinImp
     *
     * @return float 
     */
    public function getCuotaSinImp()
    {
        return $this->cuotaSinImp;
    }

    /**
     * Set cuotaConImp
     *
     * @param float $cuotaConImp
     * @return StoPlan
     */
    public function setCuotaConImp($cuotaConImp)
    {
        $this->cuotaConImp = $cuotaConImp;

        return $this;
    }

    /**
     * Get cuotaConImp
     *
     * @return float 
     */
    public function getCuotaConImp()
    {
        return $this->cuotaConImp;
    }

    /**
     * Set showCatalogo
     *
     * @param boolean $showCatalogo
     * @return StoPlan
     */
    public function setShowCatalogo($showCatalogo)
    {
        $this->showCatalogo = $showCatalogo;

        return $this;
    }

    /**
     * Get showCatalogo
     *
     * @return boolean 
     */
    public function getShowCatalogo()
    {
        return $this->showCatalogo;
    }

    /**
     * Set tyc
     *
     * @param string $tyc
     * @return StoPlan
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
     * @return StoPlan
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
     * @return StoPlan
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
     * @return StoPlan
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


}
