<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GenPlanDetalle
 */
class GenPlanDetalle
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     */
    private $descripcion;

    /**
     * @var string
     */
    private $rutaImg;

    /**
     * @var integer
     */
    private $orden;

    /**
     * @var boolean
     */
    private $isGb;

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
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoPlanDetalle
     */
    private $idTipo;


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
     * Set descripcion
     *
     * @param string $descripcion
     * @return GenPlanDetalle
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
     * Set rutaImg
     *
     * @param string $rutaImg
     * @return GenPlanDetalle
     */
    public function setRutaImg($rutaImg)
    {
        $this->rutaImg = $rutaImg;

        return $this;
    }

    /**
     * Get rutaImg
     *
     * @return string 
     */
    public function getRutaImg()
    {
        return $this->rutaImg;
    }

    /**
     * Set orden
     *
     * @param integer $orden
     * @return GenPlanDetalle
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;

        return $this;
    }

    /**
     * Get orden
     *
     * @return integer 
     */
    public function getOrden()
    {
        return $this->orden;
    }

    /**
     * Set isGb
     *
     * @param boolean $isGb
     * @return GenPlanDetalle
     */
    public function setIsGb($isGb)
    {
        $this->isGb = $isGb;

        return $this;
    }

    /**
     * Get isGb
     *
     * @return boolean 
     */
    public function getIsGb()
    {
        return $this->isGb;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return GenPlanDetalle
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
     * @return GenPlanDetalle
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
     * @return GenPlanDetalle
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
     * @param \Dayscript\TiendaClaroBundle\Entity\TipoPlanDetalle $idTipo
     * @return GenPlanDetalle
     */
    public function setIdTipo(\Dayscript\TiendaClaroBundle\Entity\TipoPlanDetalle $idTipo = null)
    {
        $this->idTipo = $idTipo;

        return $this;
    }

    /**
     * Get idTipo
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\TipoPlanDetalle 
     */
    public function getIdTipo()
    {
        return $this->idTipo;
    }
}
