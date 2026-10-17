<?php

namespace App\Domains\Services\Domain\Enums;

enum PricingModel: string
{
    case Fixed = 'fixed';
    case StartingFrom = 'starting_from';
    case Hourly = 'hourly';
    case Quotation = 'quotation';
}
