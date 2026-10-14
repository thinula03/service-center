<?php

namespace App\Domains\Organizations\Domain\Enums;

enum OrganizationStatus: string
{
    case Active = 'active';
    case Suspended = 'suspended';
}
