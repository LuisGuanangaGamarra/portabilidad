<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Validator\Constraints as TiendaAssert;

/**
 * RegPortabilidadAnexo
 */
class RegPortabilidadAnexo
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank
     * @Assert\NotNull
     */
    private $formCodigo;

    /**
     * @var string
     * @Assert\NotBlank
     * @Assert\NotNull
     */
    private $tipo;

    /**
     * @var string
     * @Assert\NotBlank
     * @Assert\NotNull
     */
    private $ruta;

    /**
     * @var string
     * @Assert\NotBlank
     * @Assert\NotNull
     */
    private $rutaReal;

    /**
     * @var boolean
     */
    private $isConfirmado = false;

    /**
     * @var boolean
     */
    private $isEnviado = false;

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
    private $deletedAt;

    /**
     * @var \Dayscript\TiendaClaroBundle\Entity\RegPortabilidad
     */
    private $idPortabilidad;


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
     * @return RegPortabilidadAnexo
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
     * Set tipo
     *
     * @param string $tipo
     *
     * @return RegPortabilidadAnexo
     */
    public function setTipo($tipo)
    {
        $this->tipo = $tipo;

        return $this;
    }

    /**
     * Get tipo
     *
     * @return string
     */
    public function getTipo()
    {
        return $this->tipo;
    }

    /**
     * Set ruta
     *
     * @param string $ruta
     *
     * @return RegPortabilidadAnexo
     */
    public function setRuta($ruta)
    {
        $this->ruta = $ruta;

        return $this;
    }

    /**
     * Get ruta
     *
     * @return string
     */
    public function getRuta()
    {
        return $this->ruta;
    }

    /**
     * @return string
     */
    public function getRutaReal()
    {
        return $this->rutaReal;
    }

    /**
     * @param string $rutaReal
     */
    public function setRutaReal($rutaReal)
    {
        $this->rutaReal = $rutaReal;
    }

    /**
     * Set isConfirmado
     *
     * @param boolean $isConfirmado
     *
     * @return RegPortabilidadAnexo
     */
    public function setIsConfirmado($isConfirmado)
    {
        $this->isConfirmado = $isConfirmado;

        return $this;
    }

    /**
     * Get isConfirmado
     *
     * @return boolean
     */
    public function getIsConfirmado()
    {
        return $this->isConfirmado;
    }

    /**
     * Set isEnviado
     *
     * @param boolean $isEnviado
     *
     * @return RegPortabilidadAnexo
     */
    public function setIsEnviado($isEnviado)
    {
        $this->isEnviado = $isEnviado;

        return $this;
    }

    /**
     * Get isEnviado
     *
     * @return boolean
     */
    public function getIsEnviado()
    {
        return $this->isEnviado;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return RegPortabilidadAnexo
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
     * @return RegPortabilidadAnexo
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
     * @return RegPortabilidadAnexo
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
     * Set deletedAt
     *
     * @param \DateTime $deletedAt
     *
     * @return RegPortabilidadAnexo
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
     * Set idPortabilidad
     *
     * @param \Dayscript\TiendaClaroBundle\Entity\RegPortabilidad $idPortabilidad
     *
     * @return RegPortabilidadAnexo
     */
    public function setIdPortabilidad(\Dayscript\TiendaClaroBundle\Entity\RegPortabilidad $idPortabilidad = null)
    {
        $this->idPortabilidad = $idPortabilidad;
        $this->setFormCodigo($idPortabilidad->getFormCodigo());

        return $this;
    }

    /**
     * Get idPortabilidad
     *
     * @return \Dayscript\TiendaClaroBundle\Entity\RegPortabilidad
     */
    public function getIdPortabilidad()
    {
        return $this->idPortabilidad;
    }
}

