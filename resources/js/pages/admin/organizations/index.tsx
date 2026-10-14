import { Head, Link, router } from '@inertiajs/react';
import { Building2, Search } from 'lucide-react';
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

type Organization = {
    id: number;
    name: string;
    slug: string;
    email: string | null;
    status: 'active' | 'suspended';
    branches_count: number;
    users_count: number;
    created_at: string;
};
type Props = {
    filters: { search: string };
    organizations: {
        data: Organization[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number | null;
        to: number | null;
        total: number;
    };
};

export default function OrganizationsIndex({ filters, organizations }: Props) {
    const [search, setSearch] = useState(filters.search);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/organizations',
            { search },
            { preserveState: true, replace: true },
        );
    };
    const toggle = (organization: Organization) =>
        router.patch(
            `/admin/organizations/${organization.id}/status`,
            {
                status:
                    organization.status === 'active' ? 'suspended' : 'active',
            },
            { preserveScroll: true },
        );

    return (
        <>
            <Head title="Organizations" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Platform directory
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Organizations
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review every tenant, its branches, membership, and
                        platform status.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle>All organizations</CardTitle>
                                <CardDescription>
                                    {organizations.total} organizations
                                    registered
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
                                        placeholder="Search organizations"
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
                                            Organization
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Usage
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
                                    {organizations.data.map((organization) => (
                                        <tr key={organization.id}>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-muted p-2">
                                                        <Building2 className="size-4" />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/admin/organizations/${organization.id}`}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {organization.name}
                                                        </Link>
                                                        <p className="text-xs text-muted-foreground">
                                                            {organization.email ??
                                                                organization.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {organization.branches_count}{' '}
                                                branches ·{' '}
                                                {organization.users_count} users
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant={
                                                        organization.status ===
                                                        'active'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {organization.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        organization.status ===
                                                        'active'
                                                            ? 'destructive'
                                                            : 'outline'
                                                    }
                                                    onClick={() =>
                                                        toggle(organization)
                                                    }
                                                >
                                                    {organization.status ===
                                                    'active'
                                                        ? 'Suspend'
                                                        : 'Reactivate'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {organizations.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-12 text-center text-muted-foreground"
                                            >
                                                No matching organizations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {organizations.from ?? 0}–
                                {organizations.to ?? 0} of {organizations.total}
                            </p>
                            <div className="flex gap-1">
                                {organizations.links.map(
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

OrganizationsIndex.layout = {
    breadcrumbs: [
        { title: 'System administration', href: '/admin' },
        { title: 'Organizations', href: '/admin/organizations' },
    ],
};
