<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Validator\Constraints as TiendaAssert;

/**
 * RegPortabilidadNumero
 */
class RegPortabilidadNumero
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
     * @TiendaAssert\Celular
     * @Assert\NotBlank
     * @Assert\NotNull
     */
    private $numero;

    /**
     * @var string
     * @TiendaAssert\Nip
     */
    private $nip;

    /**
     * @var \DateTime
     */
    private $nipRequestedAt;

    /**
     * @var \DateTime
     */
    private $nipValidatedAt;

    /**
     * @var boolean
     */
    private $isNipValidado = false;

    /**
     * @var boolean
     */
    private $isConfirmado = false;

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
     * @return RegPortabilidadNumero
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
     * Set numero
     *
     * @param string $numero
     *
     * @return RegPortabilidadNumero
     */
    public function setNumero($numero)
    {
        $this->numero = $numero;

        return $this;
    }

    /**
     * Get numero
     *
     * @return string
     */
    public function getNumero()
    {
        return $this->numero;
    }

    /**
     * Set nip
     *
     * @param string $nip
     *
     * @return RegPortabilidadNumero
     */
    public function setNip($nip)
    {
        $this->nip = $nip;

        return $this;
    }

    /**
     * Get nip
     *
     * @return string
     */
    public function getNip()
    {
        return $this->nip;
    }

    /**
     * Set nipRequestedAt
     *
     * @param \DateTime $nipRequestedAt
     *
     * @return RegPortabilidadNumero
     */
    public function setNipRequestedAt($nipRequestedAt)
    {
        $this->nipRequestedAt = $nipRequestedAt;

        return $this;
    }

    /**
     * Get nipRequestedAt
     *
     * @return \DateTime
     */
    public function getNipRequestedAt()
    {
        return $this->nipRequestedAt;
    }

    /**
     * Set nipValidatedAt
     *
     * @param \DateTime $nipValidatedAt
     *
     * @return RegPortabilidadNumero
     */
    public function setNipValidatedAt($nipValidatedAt)
    {
        $this->nipValidatedAt = $nipValidatedAt;

        return $this;
    }

    /**
     * Get nipValidatedAt
     *
     * @return \DateTime
     */
    public function getNipValidatedAt()
    {
        return $this->nipValidatedAt;
    }

    /**
     * Set isNipValidado
     *
     * @param boolean $isNipValidado
     *
     * @return RegPortabilidadNumero
     */
    public function setIsNipValidado($isNipValidado)
    {
        $this->isNipValidado = $isNipValidado;

        return $this;
    }

    /**
     * Get isNipValidado
     *
     * @return boolean
     */
    public function getIsNipValidado()
    {
        return $this->isNipValidado;
    }

    /**
     * Set isConfirmado
     *
     * @param boolean $isConfirmado
     *
     * @return RegPortabilidadNumero
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
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return RegPortabilidadNumero
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
     * @return RegPortabilidadNumero
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
     * @return RegPortabilidadNumero
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
     * @return RegPortabilidadNumero
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
     * @return RegPortabilidadNumero
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

