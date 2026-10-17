<?php

namespace App\Domains\Services\Domain\Enums;

enum BookingMode: string
{
    case Direct = 'direct';
    case Quotation = 'quotation';
}
