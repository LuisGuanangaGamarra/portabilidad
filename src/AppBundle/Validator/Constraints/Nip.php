<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 14/05/2019
 * Time: 11:14
 */

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class Nip extends Constraint
{
    /**
     * @var string
     * Mensaje de error a mostrarse.
     */
    public $message = "El código NIP {{ string }} es incorrecto.";

    /* public function getTargets()
     {
         return self::CLASS_CONSTRAINT;
     }*/

    /**
     * Returns the name of the class that validates this constraint.
     *
     * By default, this is the fully qualified name of the constraint class
     * suffixed with "Validator". You can override this method to change that
     * behaviour.
     *
     * @return string
     */
    public function validatedBy()
    {
        return get_class($this).'Validator';
    }
}