import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, ShieldCheck, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type User = {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'suspended';
    is_system_admin: boolean;
    organizations_count: number;
    email_verified_at: string | null;
};
type Props = {
    filters: { search: string };
    users: {
        data: User[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number | null;
        to: number | null;
        total: number;
    };
};

export default function UsersIndex({ filters, users }: Props) {
    const [search, setSearch] = useState(filters.search);
    const currentUserId = usePage().props.auth.user.id;
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/users',
            { search },
            { preserveState: true, replace: true },
        );
    };
    const toggle = (user: User) =>
        router.patch(
            `/admin/users/${user.id}/status`,
            { status: user.status === 'active' ? 'suspended' : 'active' },
            { preserveScroll: true },
        );

    return (
        <>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Identity oversight
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Users
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review account access, verification, and organization
                        memberships.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle>All users</CardTitle>
                                <CardDescription>
                                    {users.total} accounts registered
                                </CardDescription>
                            </div>
                            <form onSubmit={submit} className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        className="pl-9"
                                        placeholder="Search name or email"
                                    />
                                </div>
                                <Button variant="outline">Search</Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            User
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Access
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.data.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-muted p-2">
                                                        {user.is_system_admin ? (
                                                            <ShieldCheck className="size-4" />
                                                        ) : (
                                                            <UserRound className="size-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p>
                                                    {user.is_system_admin
                                                        ? 'System administrator'
                                                        : `${user.organizations_count} organization memberships`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email_verified_at
                                                        ? 'Email verified'
                                                        : 'Email not verified'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant={
                                                        user.status === 'active'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    disabled={
                                                        user.id ===
                                                        currentUserId
                                                    }
                                                    variant={
                                                        user.status === 'active'
                                                            ? 'destructive'
                                                            : 'outline'
                                                    }
                                                    onClick={() => toggle(user)}
                                                >
                                                    {user.id === currentUserId
                                                        ? 'Current user'
                                                        : user.status ===
                                                            'active'
                                                          ? 'Suspend'
                                                          : 'Reactivate'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-12 text-center text-muted-foreground"
                                            >
                                                No matching users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {users.from ?? 0}–{users.to ?? 0} of{' '}
                                {users.total}
                            </p>
                            <div className="flex gap-1">
                                {users.links.map(
                                    (link, index) =>
                                        link.url && (
                                            <Button
                                                key={index}
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={link.url}
                                                    preserveScroll
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </Button>
                                        ),
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'System administration', href: '/admin' },
        { title: 'Users', href: '/admin/users' },
    ],
};
