<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * StoPlanDetalle
 */
class StoPlanDetalle
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var float
     */
    private $cantidad;

    /**
     * @var string
     */
    private $contenido;

    /**
     * @var string
     */
    private $vigencia;

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
     * @var \Dayscript\TiendaClaroBundle\Entity\GenPlanDetalle
     */
    private $idDetalle;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\StoPlan
     */
    private $idPlan;

    /**
     * @var interger
     */
    private $idTransaccion;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\Plan
     */
    private $plan;

    /**
     * @var integer
     */
    private $transaccion;

    /**
     * @return int
     */
    public function getTransaccion()
    {
        return $this->transaccion;
    }

    /**
     * @param int $transaccion
     */
    public function setTransaccion($transaccion)
    {
        $this->transaccion = $transaccion;
    }

    /**
     * @return Plan
     */
    public function getPlan()
    {
        return $this->plan;
    }

    /**
     * @param Plan $plan
     */
    public function setPlan($plan)
    {
        $this->plan = $plan;
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
     * Set cantidad
     *
     * @param float $cantidad
     * @return StoPlanDetalle
     */
    public function setCantidad($cantidad)
    {
        $this->cantidad = $cantidad;

        return $this;
    }

    /**
     * Get cantidad
     *
     * @return float 
     */
    public function getCantidad()
    {
        return $this->cantidad;
    }

    /**
     * Set contenido
     *
     * @param string $contenido
     * @return StoPlanDetalle
     */
    public function setContenido($contenido)
    {
        $this->contenido = $contenido;

        return $this;
    }

    /**
     * Get contenido
     *
     * @return string 
     */
    public function getContenido()
    {
        return $this->contenido;
    }

    /**
     * Set vigencia
     *
     * @param string $vigencia
     * @return StoPlanDetalle
     */
    public function setVigencia($vigencia)
    {
        $this->vigencia = $vigencia;

        return $this;
    }

    /**
     * Get vigencia
     *
     * @return string 
     */
    public function getVigencia()
    {
        return $this->vigencia;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return StoPlanDetalle
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
     * @return StoPlanDetalle
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
     * @return StoPlanDetalle
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
     * @return StoPlanDetalle
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

    /**
     * Set idDetalle
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\GenPlanDetalle $idDetalle
     * @return StoPlanDetalle
     */
    public function setIdDetalle(\Dayscript\TiendaClaroBundle\Entity\GenPlanDetalle $idDetalle = null)
    {
        $this->idDetalle = $idDetalle;

        return $this;
    }

    /**
     * Get idDetalle
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\GenPlanDetalle 
     */
    public function getIdDetalle()
    {
        return $this->idDetalle;
    }

    /**
     * Set idPlan
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\StoPlan $idPlan
     * @return StoPlanDetalle
     */
    public function setIdPlan(\Dayscript\TiendaClaroBundle\Entity\StoPlan $idPlan = null)
    {
        $this->idPlan = $idPlan;

        return $this;
    }

    /**
     * Get idPlan
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\StoPlan 
     */
    public function getIdPlan()
    {
        return $this->idPlan;
    }

    /**
     * Set idTransaccion
     *
     * @param int $idTransaccion
     * @return StoPlanDetalle
     */
    public function setIdTransaccion($idTransaccion = null)
    {
        $this->idTransaccion = $idTransaccion;
    }

    /**
     * Get idTransaccion
     *
     * @return integer
     */
    public function getIdTransaccion()
    {
        return $this->idTransaccion;
    }
}
