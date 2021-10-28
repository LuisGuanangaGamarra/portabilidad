<?php

namespace Dayscript\TiendaClaroBundle\Entity;

/**
 * TipoOperadora
 */
class TipoOperadora
{
    /**
     * @var string
     */
    private $codigo;

    /**
     * @var string
     */
    private $nombreComercial;

    /**
     * @var string
     */
    private $nombreLegal;

    /**
     * @var string
     */
    private $rutaImg;

    /**
     * @var string
     */
    private $rutaThumb;

    /**
     * @var boolean
     */
    private $isNosotros = '';

    /**
     * @var boolean
     */
    private $isCompetencia = '1';

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
     * @var integer
     */
    private $id;


    /**
     * Set codigo
     *
     * @param string $codigo
     *
     * @return TipoOperadora
     */
    public function setCodigo($codigo)
    {
        $this->codigo = $codigo;

        return $this;
    }

    /**
     * Get codigo
     *
     * @return string
     */
    public function getCodigo()
    {
        return $this->codigo;
    }

    /**
     * Set nombreComercial
     *
     * @param string $nombreComercial
     *
     * @return TipoOperadora
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
     * Set nombreLegal
     *
     * @param string $nombreLegal
     *
     * @return TipoOperadora
     */
    public function setNombreLegal($nombreLegal)
    {
        $this->nombreLegal = $nombreLegal;

        return $this;
    }

    /**
     * Get nombreLegal
     *
     * @return string
     */
    public function getNombreLegal()
    {
        return $this->nombreLegal;
    }

    /**
     * Set rutaImg
     *
     * @param string $rutaImg
     *
     * @return TipoOperadora
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
     * Set rutaThumb
     *
     * @param string $rutaThumb
     *
     * @return TipoOperadora
     */
    public function setRutaThumb($rutaThumb)
    {
        $this->rutaThumb = $rutaThumb;

        return $this;
    }

    /**
     * Get rutaThumb
     *
     * @return string
     */
    public function getRutaThumb()
    {
        return $this->rutaThumb;
    }

    /**
     * Set isNosotros
     *
     * @param boolean $isNosotros
     *
     * @return TipoOperadora
     */
    public function setIsNosotros($isNosotros)
    {
        $this->isNosotros = $isNosotros;

        return $this;
    }

    /**
     * Get isNosotros
     *
     * @return boolean
     */
    public function getIsNosotros()
    {
        return $this->isNosotros;
    }

    /**
     * Set isCompetencia
     *
     * @param boolean $isCompetencia
     *
     * @return TipoOperadora
     */
    public function setIsCompetencia($isCompetencia)
    {
        $this->isCompetencia = $isCompetencia;

        return $this;
    }

    /**
     * Get isCompetencia
     *
     * @return boolean
     */
    public function getIsCompetencia()
    {
        return $this->isCompetencia;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return TipoOperadora
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
     * @return TipoOperadora
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
     *
     * @return TipoOperadora
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
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }
}

