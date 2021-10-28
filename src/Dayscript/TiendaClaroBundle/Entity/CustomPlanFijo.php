<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CustomPlanFijo
 */
class CustomPlanFijo
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\StoPlan
     */
    private $idPlan;
    /**
     * @var integer
     */
    private $orden;

    /**
     * @var string
     */
    private $subtipo;

    /**
     * @var string
     */
    private $incluye;

    /**
     * @var string
     */
    private $promocion;
    /**
     * @var string
     */
    private $imgDetalle;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\StoPlan
     */
    private $plan;

    /**
     * @var string
     */
    private $descripcion;

    /**
     * @return StoPlan
     */
    public function getPlan()
    {
        return $this->plan;
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
     * Set idPlan
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\StoPlan $idPlan
     * @return CustomPlanFijo
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
     * @return int
     */
    public function getOrden()
    {
        return $this->orden;
    }

    /**
     * @param int $orden
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;
    }

    /**
     * @return string
     */
    public function getSubtipo()
    {
        return $this->subtipo;
    }

    /**
     * @param string $subtipo
     */
    public function setSubtipo($subtipo)
    {
        $this->subtipo = $subtipo;
    }

    /**
     * @return string
     */
    public function getIncluye()
    {
        try {
            return json_decode($this->incluye, true);
        } catch(\Exception $e) {
            return $this->incluye;
        }
    }

    /**
     * @param string $incluye
     */
    public function setIncluye($incluye)
    {
        $this->incluye = $incluye;
    }

    /**
     * @return string
     */
    public function getPromocion()
    {
        try {
            return json_decode($this->promocion, true);
        } catch(\Exception $e) {
            return $this->promocion;
        }
    }

    /**
     * @param string $promocion
     */
    public function setPromocion($promocion)
    {
        $this->promocion = $promocion;
    }

    /**
     * @return string
     */
    public function getImgDetalle()
    {
        try {
            return json_decode($this->imgDetalle, true);
        } catch(\Exception $e) {
            return $this->imgDetalle;
        }
    }

    /**
     * @param string $imgDetalle
     */
    public function setImgDetalle($imgDetalle)
    {
        $this->imgDetalle = $imgDetalle;
    }

    /**
     * @return string
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * @param string $descripcion
     */
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }


}
