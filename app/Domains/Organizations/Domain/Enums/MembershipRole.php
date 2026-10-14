<?php

namespace App\Domains\Organizations\Domain\Enums;

enum MembershipRole: string
{
    case Owner = 'owner';
    case Administrator = 'administrator';
    case BranchManager = 'branch_manager';
    case Staff = 'staff';
}
