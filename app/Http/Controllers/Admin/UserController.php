<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Administration\Application\Actions\RecordAdminActivity;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        return Inertia::render('admin/users/index', [
            'filters' => ['search' => $search],
            'users' => User::query()
                ->when($search, fn ($query) => $query->where(fn ($inner) => $inner
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")))
                ->withCount('organizations')
                ->latest()
                ->paginate(15)
                ->withQueryString(),
        ]);
    }

    public function updateStatus(Request $request, User $user, RecordAdminActivity $record): RedirectResponse
    {
        abort_if($request->user()->is($user), 422, 'You cannot suspend your own account.');
        $data = $request->validate(['status' => ['required', 'in:active,suspended']]);
        $previous = $user->status;
        $user->update(['status' => $data['status']]);

        $record->handle($request->user(), 'user.status_changed', $user, [
            'from' => $previous,
            'to' => $data['status'],
        ], $request->ip());

        return back()->with('success', "{$user->name} is now {$data['status']}.");
    }
}
