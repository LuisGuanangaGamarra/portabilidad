<?php

namespace Dayscript\TiendaClaroBundle\Entity;

use Dayscript\TiendaClaroBundle\Model\opcionesSelectsNew;
use Dayscript\TiendaClaroBundle\Traits\DefinesUtils;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping;

/**
 * RegPortabilidadRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RegPortabilidadRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * Encuentra una solicitud de portabilidad según su ID, con todas sus dependencias.
     * @param $id
     * @return mixed
     * @throws \Doctrine\DBAL\DBALException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findById($id)
    {
        $solicitud = $this->getEntityManager()
            ->createQueryBuilder()
            ->select('s')
            ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
            ->where('s.id = :id')
            ->andWhere('s.deletedAt is NULL')
            ->setParameter('id', $id)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
        if($solicitud) {
            $numeros = $this->getEntityManager()
                ->createQueryBuilder()
                ->select('n')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadNumero', 'n', 'WITH', 's.id = n.idPortabilidad AND n.deletedAt IS NULL')
                ->where('s.id = :solID')
                ->setParameter('solID', $solicitud->getId())
                ->getQuery()
                ->getResult();
            $solicitud->setNumeros($numeros);
            $anexos = $this->getEntityManager()
                ->createQueryBuilder()
                ->select('a')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadAnexo', 'a', 'WITH', 's.id = a.idPortabilidad AND a.deletedAt IS NULL')
                ->where('s.id = :solID')
                ->setParameter('solID', $solicitud->getId())
                ->getQuery()
                ->getResult();
            $solicitud->setAnexos($anexos);
            if($solicitud->getIdPlan() != null) {
                $solicitud->setPlanIncluye($this->getPlanIncluye($solicitud->getIdPlan()));
                $solicitud->setPlanPromocion($this->getPlanPromocion($solicitud->getIdPlan()));
            }
        }
        return $solicitud;
    }

    /**
     * Encuentra una solicitud de portabilidad finalizada y pendiente de atender según los parámetros recibidos, con todas sus dependencias.
     * @param $id
     * @return mixed
     * @throws \Doctrine\DBAL\DBALException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findPendingByCodigoAndSecuencia($form_code, $doc_secuencia)
    {
        $solicitud = $this->getEntityManager()
            ->createQueryBuilder()
            ->select('s')
            ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
            ->where('s.formCodigo = :formCodigo')
            ->andwhere('s.docSecuencia = :docSecuencia')
            ->andwhere('s.formIsConfirmado = 1')
            ->andwhere('s.formIsAprobado IS NULL')
            ->andWhere('s.deletedAt is NULL')
            ->andWhere('s.sentNoResponse is NOT NULL')
            //->andWhere('s.sentCallme is NULL')
            ->setParameter('formCodigo', $form_code)
            ->setParameter('docSecuencia', $doc_secuencia)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
        if($solicitud) {
            $numeros = $this->getEntityManager()
                ->createQueryBuilder()
                ->select('n')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadNumero', 'n', 'WITH', 's.id = n.idPortabilidad AND n.deletedAt IS NULL')
                ->where('s.id = :solID')
                ->setParameter('solID', $solicitud->getId())
                ->getQuery()
                ->getResult();
            $solicitud->setNumeros($numeros);
            $anexos = $this->getEntityManager()
                ->createQueryBuilder()
                ->select('a')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadAnexo', 'a', 'WITH', 's.id = a.idPortabilidad AND a.deletedAt IS NULL')
                ->where('s.id = :solID')
                ->setParameter('solID', $solicitud->getId())
                ->getQuery()
                ->getResult();
            $solicitud->setAnexos($anexos);
            if($solicitud->getIdPlan() != null) {
                $solicitud->setPlanIncluye($this->getPlanIncluye($solicitud->getIdPlan()));
                $solicitud->setPlanPromocion($this->getPlanPromocion($solicitud->getIdPlan()));
            }
        }
        return $solicitud;
    }

    /**
     * Obtiene los "incluye" del plan escogido en la solicitud
     * @param $idplan
     * @return mixed
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getPlanIncluye($idplan)
    {
        $sql = 'SELECT INCLUYE.IDINCLUYE AS ID, PLANINCLUYE.DESCRIPCION AS CANTIDAD, INCLUYE.NOMBRE, INCLUYE.DESCRIPCION, INCLUYE.VIGENCIA, INCLUYE.URLIMG, INCLUYE.URIMGLANDING
            FROM PLANINCLUYE
            INNER JOIN INCLUYE ON INCLUYE.IDINCLUYE = PLANINCLUYE.IDINCLUYE
            WHERE PLANINCLUYE.IDESTADO = 1
            AND INCLUYE.IDESTADO = 1
            AND PLANINCLUYE.IDPLAN = :IDPLAN';
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $stmt->bindParam(':IDPLAN', $idplan);
        $stmt->execute();
        $arrIncluye = $stmt->fetchAll();
        return $arrIncluye;
    }

    /**
     * Obtiene las promociones del plan escogido en la solicitud
     * @param $idplan
     * @return mixed
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getPlanPromocion($idplan)
    {
        $sql = 'SELECT PROMOCION.IDPROMOCION AS ID, PLANPROMOCION.DESCRIPCION AS CANTIDAD, PROMOCION.NOMBRE, PROMOCION.DESCRIPCION, PROMOCION.VIGENCIA, PROMOCION.URLIMG, PROMOCION.URIMGLANDING FROM PLANPROMOCION INNER JOIN PROMOCION ON PROMOCION.IDPROMOCION = PLANPROMOCION.IDPROMOCION WHERE PLANPROMOCION.IDESTADO = 1 AND PROMOCION.IDESTADO = 1 AND PLANPROMOCION.IDPLAN = :IDPLAN';
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $stmt->bindParam(':IDPLAN', $idplan);
        $stmt->execute();
        $arrPromocion = $stmt->fetchAll();
        return $arrPromocion;
    }

    /**
     * Encuentra una solicitud de portabilidad según el código de la misma, con todas sus dependencias.
     * @param string $form_codigo
     * @param string $ip
     * @param boolean $avoid_expired
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findByCodeAndIp($form_codigo = 'NA', $ip = '', $avoid_expired = true)
    {
        if($form_codigo === 'new' || $form_codigo === 'NA' || empty($form_codigo) || empty($ip)) {
            throw new \Exception('Los datos de la solicitud son incorrectos. Por favor, ingréselos nuevamente.');
        }
        $query = $this->getEntityManager()
            ->createQueryBuilder()
            ->select('s')
            ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
            ->where('s.formCodigo = :codigo')
            ->andWhere('s.deletedAt is NULL')
            ->setParameter('codigo', $form_codigo);
        if($avoid_expired) {
            $query->andWhere('s.ip = :ipAdress')
                ->andWhere('s.expiresAt > :expiresDateTime')
                ->setParameter('ipAdress', $ip)
                ->setParameter('expiresDateTime', new \DateTime());
        }
         $solicitud = $query->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
        if($solicitud) {
            $numeros = $this->getEntityManager()
                ->createQueryBuilder()
                ->select('n')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadNumero', 'n', 'WITH', 's.id = n.idPortabilidad AND n.deletedAt IS NULL')
                ->where('s.id = :solID')
                ->setParameter('solID', $solicitud->getId())
                ->getQuery()
                ->getResult();
            $anexos = $this->getEntityManager()
                ->createQueryBuilder()
                ->select('a')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadAnexo', 'a', 'WITH', 's.id = a.idPortabilidad AND a.deletedAt IS NULL')
                ->where('s.id = :solID')
                ->setParameter('solID', $solicitud->getId())
                ->getQuery()
                ->getResult();
            $solicitud->setNumeros($numeros);
            $solicitud->setAnexos($anexos);
        }
        return $solicitud;
    }

    /**
     * Retorna una instancia de RegPortabilidad de base. En caso de no existir, crea una instancia vacía en base.
     * @param string $form_codigo
     * @param string $ip
     * @return RegPortabilidad|mixed|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function findOrCreateByCode($form_codigo = 'NA', $ip = '')
    {
        $solicitud = null;
        if($form_codigo === 'new') {
            do {
                $form_codigo = base64_encode(md5(random_bytes(10)));
            } while($this->findByCodeAndIp($form_codigo, $ip));
            $solicitud = new RegPortabilidad();
            $solicitud->setFormCodigo($form_codigo);
            $solicitud->setFormPaso(0);
            $solicitud->setIp($ip);
            $this->save($solicitud);
        } else {
            $solicitud = $this->findByCodeAndIp($form_codigo, $ip);
        } return $solicitud;
    }

    /**
     * Cuenta la cantidad de solicitudes confirmadas
     * @return mixed
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function countConfirmados()
    {
        return $this->getEntityManager()
                ->createQueryBuilder()
                ->select('count(s)')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->where('s.formIsConfirmado = TRUE')
                //->andWhere('s.deletedAt is NULL')
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleScalarResult();
    }


    /**
     * Define si el número celular ya existe en base para dicha solicitud.
     * @param RegPortabilidad $solicitud
     * @param string $numero
     * @return bool
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function hasNumber(RegPortabilidad $solicitud, $numero)
    {
        return $this->getEntityManager()
            ->createQueryBuilder()
            ->select('count(n.id)')
            ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
            ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadNumero', 'n', 'WITH', 's.id = n.idPortabilidad AND n.deletedAt IS NULL')
            ->where('s.id = :solicitudID')
            ->andWhere('n.numero = :numero')
            ->setParameter('solicitudID', $solicitud->getId())
            ->setParameter('numero', $numero)
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult() > 0;
    }

    /**
     * Define si la ruta de un anexo ya fue guardada como parte de la solicitud.
     * @param RegPortabilidad $solicitud
     * @param string $tipo
     * @return bool
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function hasAnexo(RegPortabilidad $solicitud, $tipo)
    {
        return $this->getEntityManager()
                ->createQueryBuilder()
                ->select('count(a.id)')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadAnexo', 'a', 'WITH', 's.id = a.idPortabilidad AND a.deletedAt IS NULL')
                ->where('s.id = :solicitudID')
                ->andWhere('a.tipo = :tipoAnexo')
                ->setParameter('solicitudID', $solicitud->getId())
                ->setParameter('tipoAnexo', $tipo)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleScalarResult() > 0;
    }

    /**
     * @param RegPortabilidad $solicitud
     * @param $tipo
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getAnexo(RegPortabilidad $solicitud, $tipo)
    {
        return $this->getEntityManager()
                ->createQueryBuilder()
                ->select('a')
                ->from('DayscriptTiendaClaroBundle:RegPortabilidad', 's')
                ->innerJoin('DayscriptTiendaClaroBundle:RegPortabilidadAnexo', 'a', 'WITH', 's.id = a.idPortabilidad AND a.deletedAt IS NULL')
                ->where('s.id = :solicitudID')
                ->andWhere('a.tipo = :tipoAnexo')
                ->setParameter('solicitudID', $solicitud->getId())
                ->setParameter('tipoAnexo', $tipo)
                ->setMaxResults(1)
                ->getQuery()
                ->getOneOrNullResult();
    }

    /**
     * Define si el número celular ya ha sido portado por otra solicitud.
     * @param string $numero
     * @return bool
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function existsAsTransferredNumber($numero = '0900000000')
    {
        return $this->getEntityManager()
            ->createQueryBuilder()
            ->select('count(n.id)')
            ->from('DayscriptTiendaClaroBundle:RegPortabilidadNumero', 'n')
            ->where('n.isConfirmado = true')
            ->andWhere('n.expiresAt < :expiredDate')
            ->setParameter('expiredDate', new \DateTime())
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult() > 0;
    }

    /**
     * Agrega en base (y lógicamente) un número celular a la solicitud de portabilidad.
     * @param RegPortabilidad $solicitud
     * @param $numero
     * @return RegPortabilidadNumero|null
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function addNumber(RegPortabilidad $solicitud, $numero) {
        $reg = null;
        $entityManager = $this->getEntityManager();
        //Primero busco que no sea un número repetido
        if(!$this->existsAsTransferredNumber($numero) && !$this->hasNumber($solicitud, $numero)) {
            $reg = new RegPortabilidadNumero();
            $reg->setNumero($numero);
            $reg->setIdPortabilidad($solicitud);
            $reg->setIsConfirmado(false);
            $reg->setCreatedAt(new \DateTime());
            $reg->setUpdatedAt(new \DateTime());
            $reg->setExpiresAt((new \DateTime())->modify('+ 60 minutes'));
            $entityManager->persist($reg);
            //Borro los numeros anteiores porque por el momento solo es un número por solicitud
            $previous_numbers = $solicitud->getNumeros();
            foreach ($previous_numbers as $s_numero) {
                $s_numero->setDeletedAt(new \DateTime());
                $s_numero->setUpdatedAt(new \DateTime());
                $s_numero->setExpiresAt(new \DateTime());
                $entityManager->persist($s_numero);
            }
            $solicitud->setNumeros([$reg]);
            //$solicitud->addNumero($reg);
        } return $reg;
    }

    /**
     * Agrega en base (y lógicamente) un número celular a la solicitud de landing de portabilidad .
     * @param RegPortabilidad $solicitud
     * @param $numero
     * @return RegPortabilidadNumero|null
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function addNumberLanding(RegPortabilidad $solicitud, $numero) {
        $reg = null;
        $entityManager = $this->getEntityManager();
        //Primero busco que no sea un número repetido
            $reg = new RegPortabilidadNumero();
            $reg->setNumero($numero);
            $reg->setIdPortabilidad($solicitud);
            $reg->setIsConfirmado(false);
            $reg->setCreatedAt(new \DateTime());
            $reg->setUpdatedAt(new \DateTime());
            $reg->setExpiresAt((new \DateTime())->modify('+ 60 minutes'));
            $entityManager->persist($reg);
            //Borro los numeros anteiores porque por el momento solo es un número por solicitud
            $previous_numbers = $solicitud->getNumeros();
            foreach ($previous_numbers as $s_numero) {
                $s_numero->setDeletedAt(new \DateTime());
                $s_numero->setUpdatedAt(new \DateTime());
                $s_numero->setExpiresAt(new \DateTime());
                $entityManager->persist($s_numero);
            }
        $entityManager->flush();
            $solicitud->setNumeros([$reg]);
            //$solicitud->addNumero($reg);
         return $reg;
    }

    /**
     * @param RegPortabilidad $solicitud
     * @param $filepath
     * @param $tipo
     * @return RegPortabilidadAnexo
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function addAnexo(RegPortabilidad $solicitud, $filepath, $filepath_real, $tipo) {
        $entityManager = $this->getEntityManager();
        $old_anexo = $this->getAnexo($solicitud, $tipo);
        if($old_anexo) {
            $old_anexo->setExpiresAt(new \DateTime());
            $old_anexo->setDeletedAt(new \DateTime());
            $entityManager->persist($old_anexo);
            $solicitud->removeAnexo($old_anexo);
        }
        $anexo = new RegPortabilidadAnexo();
        $anexo->setIdPortabilidad($solicitud);
        $anexo->setTipo($tipo);
        $anexo->setRuta($filepath);
        $anexo->setRutaReal($filepath_real);
        $anexo->setCreatedAt(new \DateTime());
        $anexo->setUpdatedAt(new \DateTime());
        $anexo->setExpiresAt((new \DateTime())->modify('+ 60 minutes'));
        $entityManager->persist($anexo);
        $solicitud->addAnexo($anexo);
        return $anexo;
    }

    /**
     * @param RegPortabilidad $solicitud
     * @param $filepath
     * @param $tipo
     * @return RegPortabilidadAnexo
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function addAnexoLanding(RegPortabilidad $solicitud, $filepath, $filepath_real, $tipo) {
        $entityManager = $this->getEntityManager();
        $old_anexo = $this->getAnexo($solicitud, $tipo);
        if($old_anexo) {
            $old_anexo->setExpiresAt(new \DateTime());
            $old_anexo->setDeletedAt(new \DateTime());
            $entityManager->persist($old_anexo);
            $solicitud->removeAnexo($old_anexo);
        }
        $anexo = new RegPortabilidadAnexo();
        $anexo->setIdPortabilidad($solicitud);
        $anexo->setTipo($tipo);
        $anexo->setRuta($filepath);
        $anexo->setRutaReal($filepath_real);
        $anexo->setCreatedAt(new \DateTime());
        $anexo->setUpdatedAt(new \DateTime());
        $anexo->setExpiresAt((new \DateTime())->modify('+ 60 minutes'));
        $entityManager->persist($anexo);
        $solicitud->addAnexo($anexo);
        $entityManager->flush();
        return $anexo;
    }

    public function removeAnexos(RegPortabilidad $solicitud)
    {
        $entityManager = $this->getEntityManager();
        foreach ($solicitud->getAnexos() as $anexo) {
            $anexo->setExpiresAt(new \DateTime());
            $anexo->setDeletedAt(new \DateTime());
            $entityManager->persist($anexo);
            $solicitud->removeAnexo($anexo);
        }
        $solicitud->setAnexos([]);
    }

    public function confirmar(RegPortabilidad $solicitud, $secuencia)
    {
        $entityManager = $this->getEntityManager();
        $solicitud->setFormIsConfirmado(true);
        $solicitud->setDocSecuencia($secuencia);
        $solicitud->setDocFechaCreacion(new \DateTime());
        $solicitud->setExpiresAt(new \DateTime());
        $entityManager->persist($solicitud);
        foreach ($solicitud->getAnexos() as $anexo) {
            $anexo->setExpiresAt((new \DateTime())->modify('+ 6 months'));
            $entityManager->persist($anexo);
        }
        foreach ($solicitud->getNumeros() as $numero) {
            $numero->setExpiresAt((new \DateTime())->modify('+ 2 weeks'));
            $entityManager->persist($numero);
        }
    }

    /**
     * Guarda en base las entidades persistidas, y agrega fechas de creación, edición a la solicitud
     * @param RegPortabilidad $solicitud
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function save(RegPortabilidad $solicitud)
    {
        if($solicitud->getCreatedAt() === null)
            $solicitud->setCreatedAt(new \DateTime());
        $solicitud->setUpdatedAt(new \DateTime());
        $solicitud->setExpiresAt((new \DateTime())->modify('+ 60 minutes'));
        $entityManager = $this->getEntityManager();
        $entityManager->persist($solicitud);
        $entityManager->flush();
        return $solicitud;
    }

    /**
     * Guarda en base las entidades persistidas, y agrega fecha de "llámame" a la solicitud
     * @param RegPortabilidad $solicitud
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function saveLlamame(RegPortabilidad $solicitud)
    {
        $solicitud->setSentCallme(new \DateTime());
        $solicitud->setUpdatedAt(new \DateTime());
        $entityManager = $this->getEntityManager();
        $entityManager->persist($solicitud);
        $entityManager->flush();
    }

    /**
     * Elimina lógicamente la solicitud recibida
     * @param RegPortabilidad $solicitud
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function delete(RegPortabilidad $solicitud)
    {
        if($solicitud) {
            $solicitud->setUpdatedAt(new \DateTime());
            $solicitud->setExpiresAt((new \DateTime()));
            $solicitud->setDeletedAt((new \DateTime()));
            $entityManager = $this->getEntityManager();
            $entityManager->persist($solicitud);
            $entityManager->flush();
        }
    }

    /**
     * Llena los campos de la solicitud según el array de inputs.
     * @param RegPortabilidad $solicitud
     * @param $step
     * @param $inputs
     * @return RegPortabilidad
     * @throws \Doctrine\ORM\Query\QueryException
     */
    public function fillByStep(RegPortabilidad $solicitud, $step, $inputs)
    {
        if(!$solicitud->getFormIsConfirmado()) { //No se puede editar si ya está confirmado
            $solicitud->setFormPaso($step);
            if(array_key_exists('portabilidad-nombres', $inputs) && array_key_exists('portabilidad-apellidos', $inputs))
                $solicitud->setClienteNombre(mb_strtoupper(trim($inputs['portabilidad-nombres']). ' '.trim($inputs['portabilidad-apellidos']), 'UTF-8'));
            if(array_key_exists('portabilidad-cedula', $inputs)) {
                $solicitud->setClienteIsNatural(true);
                $solicitud->setClienteIdentificacion(trim($inputs['portabilidad-cedula']));
            }
            if(array_key_exists('portabilidad-email', $inputs))
                $solicitud->setClienteEmail(mb_strtolower(trim($inputs['portabilidad-email']), 'UTF-8'));
            if(array_key_exists('portabilidad-tarifa-minima', $inputs))
                $solicitud->setTarifaMinima(floatval(trim($inputs['portabilidad-tarifa-minima'])));
            if(array_key_exists('portabilidad-tarifa-maxima', $inputs))
                $solicitud->setTarifaMaxima(floatval(trim($inputs['portabilidad-tarifa-maxima'])));
            if(array_key_exists('portabilidad-numero', $inputs))
                $this->addNumber($solicitud, trim($inputs['portabilidad-numero']));
            if(array_key_exists('portabilidad-servicio-actual', $inputs))
                $solicitud->setIsPrepagoBefore(mb_strtolower(trim($inputs['portabilidad-servicio-actual']), 'UTF-8') === 'prepago');
            if(array_key_exists('portabilidad-servicio-nuevo', $inputs))
                $solicitud->setIsPrepagoAfter(mb_strtolower(trim($inputs['portabilidad-servicio-nuevo']), 'UTF-8') === 'prepago');
            if(array_key_exists('portabilidad-operadora', $inputs)) {
                $operadoraDonante = $this->getEntityManager()->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('codigo' => base64_decode(trim($inputs['portabilidad-operadora'])), 'isCompetencia' => true));
                $solicitud->setIdDonante($operadoraDonante);
                $operadoraReceptor = $this->getEntityManager()->getRepository('DayscriptTiendaClaroBundle:TipoOperadora')->findOneBy(array('isNosotros' => true, 'isCompetencia' => false));
                $solicitud->setIdReceptor($operadoraReceptor);
            }
            if(array_key_exists('portabilidad-plan', $inputs)) {
                $plan = $this->getEntityManager()->getRepository('DayscriptTiendaClaroBundle:Plan')->EncontrarPlanEquipo2(base64_decode(trim($inputs['portabilidad-plan'])));
                if(sizeof($plan) > 0)
                    $solicitud->setPlan($plan[0]);
            }
            if($solicitud->getIsPrepagoAfter()) {
                $solicitud->setPlan(null);
            }
            if(array_key_exists('provincia', $inputs) && array_key_exists('ciudad', $inputs)) {
                $opcionesSelectsnew = new opcionesSelectsNew();
                $solicitud->setDireccionProvincia(mb_strtoupper($opcionesSelectsnew->get['Provincias'][trim($inputs['provincia'])], 'UTF-8'));
                $solicitud->setDireccionCiudad(mb_strtoupper($opcionesSelectsnew->get[trim($inputs['provincia'])][trim($inputs['ciudad'])], 'UTF-8'));
            }
            if(array_key_exists('tipoSolicitud', $inputs))
                $solicitud->setTipoSolicitud(mb_strtoupper(trim($inputs['tipoSolicitud']), 'UTF-8'));
            if(array_key_exists('direccion-calle', $inputs))
                $solicitud->setDireccionExacta(mb_strtoupper(trim($inputs['direccion-calle']), 'UTF-8'));
            if(array_key_exists('direccion-referencia', $inputs))
                $solicitud->setDireccionReferencia(mb_strtoupper(trim($inputs['direccion-referencia']), 'UTF-8'));
            if(array_key_exists('contacto-telefono1', $inputs))
                $solicitud->setContacto1(trim($inputs['contacto-telefono1']));
            if(array_key_exists('contacto-telefono2', $inputs))
                $solicitud->setContacto2(trim($inputs['contacto-telefono2']));
            if(array_key_exists('portabilidad-firma', $inputs))
                $solicitud->setDocFirma(base64_encode(trim($inputs['portabilidad-firma'])));
        }
        return $solicitud;
    }

    /**
     * Devuelve un usuario, en forma de array, según el ID recibido
     * @param $uuid
     * @return array|null
     * @throws \Doctrine\DBAL\DBALException
     * PARCHE, lo siento
     */
    public function getUsuario($uuid)
    {
        $sql  = "SELECT * FROM AUTH__USUARIOS U WHERE U.DELETED_AT IS NULL AND U.UUID=:UUID";
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $stmt->bindParam(':UUID', $uuid);
        $stmt->execute();
        $arrUsuarios = $stmt->fetchAll();
        if(sizeof($arrUsuarios) != 0)
            return $arrUsuarios[0];
        return null;
    }

    /**
     * Obtiene las promociones del plan escogido en la solicitud
     * @return mixed
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getNextSequence()
    {
        $sql = 'SELECT PORT_NIP_SEQ.NEXTVAL FROM DUAL';
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $id = $stmt->fetchAll();
        $sequenceNIP = $id[0]['NEXTVAL'];
        return $sequenceNIP;
    }

    /**
     * Obtiene las promociones del plan escogido en la solicitud
     * @return mixed
     * @throws \Doctrine\DBAL\DBALException
     */
    public function saveNumero(RegPortabilidadNumero $numero)
    {
        $numero->setUpdatedAt(new \DateTime());
        $entityManager = $this->getEntityManager();
        $entityManager->persist($numero);
        $entityManager->flush();
        return $numero;
    }

}
