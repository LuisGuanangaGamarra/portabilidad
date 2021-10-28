<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TipoStoPlan
 */
class TipoStoPlan
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
    private $displayname;

    /**
     * @var string
     */
    private $listname;

    /**
     * @var string
     */
    private $descripcion;

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
     * @var \Dayscript\TiendaClaroBundle\Entity\TipoNegocio
     */
    private $idNegocio;


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
     * @return TipoStoPlan
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
     * @return TipoStoPlan
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
     * Set displayname
     *
     * @param string $displayname
     * @return TipoStoPlan
     */
    public function setDisplayname($displayname)
    {
        $this->displayname = $displayname;

        return $this;
    }

    /**
     * Get displayname
     *
     * @return string 
     */
    public function getDisplayname()
    {
        return $this->displayname;
    }

    /**
     * Set listname
     *
     * @param string $listname
     * @return TipoStoPlan
     */
    public function setListname($listname)
    {
        $this->listname = $listname;

        return $this;
    }

    /**
     * Get listname
     *
     * @return string 
     */
    public function getListname()
    {
        return $this->listname;
    }

    /**
     * Set descripcion
     *
     * @param string $descripcion
     * @return TipoStoPlan
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
     * Set tyc
     *
     * @param string $tyc
     * @return TipoStoPlan
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
     * @return TipoStoPlan
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
     * @return TipoStoPlan
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
     * @return TipoStoPlan
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
     * @return TipoStoPlan
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
}
