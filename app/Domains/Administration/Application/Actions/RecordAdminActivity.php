<?php

namespace App\Domains\Administration\Application\Actions;

use App\Domains\Administration\Infrastructure\Models\AdminActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

final class RecordAdminActivity
{
    /** @param array<string, mixed> $metadata */
    public function handle(User $actor, string $action, Model $subject, array $metadata = [], ?string $ipAddress = null): void
    {
        $log = new AdminActivityLog([
            'actor_id' => $actor->id,
            'action' => $action,
            'metadata' => $metadata,
            'ip_address' => $ipAddress,
        ]);
        $log->subject()->associate($subject);
        $log->save();
    }
}
