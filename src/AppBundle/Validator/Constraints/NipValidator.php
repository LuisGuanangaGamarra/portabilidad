<?php
/**
 * Created by PhpStorm.
 * User: Link Digital
 * Date: 14/05/2019
 * Time: 11:15
 */

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class NipValidator extends ConstraintValidator
{
    /**
     * Defines alias name
     */
    public function validatedBy()
    {
        return 'nip_validator';
    }

    /**
     * Checks if the passed value is valid.
     *
     * @param mixed      $value      The value that should be validated
     * @param Constraint $constraint The constraint for the validation
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof Nip) {
            throw new UnexpectedTypeException($constraint, Nip::class);
        }

        // custom constraints should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) take care of that
        if (null === $value || '' === $value) {
            return;
        }
        //$this->addError($value, $constraint->message);
        if (!preg_match('/^\d\d\d\d$/', $value, $matches) && strlen($value) != 4) {
            $this->addError($value, $constraint->message);
            return;
        }
    }

    protected function addError($value, $message)
    {
        // If you're using the new 2.5 validation API (you probably are!)
        $this->context->buildViolation($message)
            ->setParameter('{{ string }}', $value)
            ->addViolation();

        // If you're using the old 2.4 validation API
        /*
        $this->context->addViolation(
            $constraint->message,
            array('{{ string }}' => $value)
        );
        */
    }
}