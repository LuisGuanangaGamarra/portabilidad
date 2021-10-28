<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CustomPlanMovil
 */
class CustomPlanMovil
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     */
    private $bp;

    /**
     * @var string
     */
    private $bpWeb;

    /**
     * @var string
     */
    private $oneId;

    /**
     * @var boolean
     */
    private $isForPpaPost;

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
     * @return StoPlan
     */
    public function getPlan()
    {
        return $this->plan;
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
     * @param StoPlan $plan
     */
    public function setPlan($plan)
    {
        $this->plan = $plan;
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
     * Set orden
     *
     * @param integer $orden
     * @return CustomPlanMovil
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;

        return $this;
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
     * Set bp
     *
     * @param string $bp
     * @return CustomPlanMovil
     */
    public function setBp($bp)
    {
        $this->bp = $bp;

        return $this;
    }

    /**
     * Get bp
     *
     * @return string 
     */
    public function getBp()
    {
        return $this->bp;
    }

    /**
     * Set bpWeb
     *
     * @param string $bpWeb
     * @return CustomPlanMovil
     */
    public function setBpWeb($bpWeb)
    {
        $this->bpWeb = $bpWeb;

        return $this;
    }

    /**
     * Get bpWeb
     *
     * @return string 
     */
    public function getBpWeb()
    {
        return $this->bpWeb;
    }

    /**
     * Set isForPpaPost
     *
     * @param boolean $isForPpaPost
     * @return CustomPlanMovil
     */
    public function setIsForPpaPost($isForPpaPost)
    {
        $this->isForPpaPost = $isForPpaPost;

        return $this;
    }

    /**
     * Get isForPpaPost
     *
     * @return boolean 
     */
    public function getIsForPpaPost()
    {
        return $this->isForPpaPost;
    }

    /**
     * Set oneId
     *
     * @param string $oneId
     * @return CustomPlanMovil
     */
    public function setOneId($oneId)
    {
        $this->oneId = $oneId;

        return $this;
    }

    /**
     * Get oneId
     *
     * @return string
     */
    public function getOneId()
    {
        return $this->oneId;
    }

    /**
     * Set idPlan
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\StoPlan $idPlan
     * @return CustomPlanMovil
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
}
