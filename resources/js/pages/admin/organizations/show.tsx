import { Form, Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Clock3,
    GitBranch,
    Mail,
    MapPin,
    Phone,
    UserRoundPlus,
    Users,
} from 'lucide-react';
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
import { Label } from '@/components/ui/label';

type Hours = Record<string, { open: string; close: string; closed: boolean }>;
type Branch = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address_line_1: string | null;
    city: string | null;
    timezone: string;
    is_default: boolean;
    is_active: boolean;
    service_hours: Hours;
};
type Organization = {
    id: number;
    name: string;
    slug: string;
    email: string | null;
    phone: string | null;
    status: 'active' | 'suspended';
    branches: Branch[];
};
type Member = {
    id: number;
    name: string;
    email: string;
    status: string;
    role: string;
};

export default function OrganizationShow({
    organization,
    members,
}: {
    organization: Organization;
    members: Member[];
}) {
    const branchAction = (branch: Branch, action: 'default' | 'status') =>
        router.patch(
            `/admin/organizations/${organization.id}/branches/${branch.id}/${action}`,
            {},
            { preserveScroll: true },
        );

    return (
        <>
            <Head title={organization.name} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Organization administration
                        </p>
                        <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Building2 className="size-6" />
                            {organization.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage branches, service hours, contact details, and
                            members.
                        </p>
                    </div>
                    <Badge
                        variant={
                            organization.status === 'active'
                                ? 'secondary'
                                : 'destructive'
                        }
                        className="w-fit"
                    >
                        {organization.status}
                    </Badge>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization details</CardTitle>
                            <CardDescription>
                                Core public and operational contact information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                action={`/admin/organizations/${organization.id}`}
                                method="patch"
                                className="grid gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={organization.name}
                                                required
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.name}
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={
                                                    organization.email ?? ''
                                                }
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.email}
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                defaultValue={
                                                    organization.phone ?? ''
                                                }
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.phone}
                                            </p>
                                        </div>
                                        <Button disabled={processing}>
                                            Save organization
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add another branch</CardTitle>
                            <CardDescription>
                                Create a new operating location with standard
                                Sri Lankan service hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                action={`/admin/organizations/${organization.id}/branches`}
                                method="post"
                                resetOnSuccess
                                className="grid gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="branch_name">
                                                    Branch name
                                                </Label>
                                                <Input
                                                    id="branch_name"
                                                    name="name"
                                                    required
                                                    placeholder="Kandy Branch"
                                                />
                                                <p className="text-xs text-destructive">
                                                    {errors.name}
                                                </p>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="branch_timezone">
                                                    Timezone
                                                </Label>
                                                <Input
                                                    id="branch_timezone"
                                                    name="timezone"
                                                    defaultValue="Asia/Colombo"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="branch_email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="branch_email"
                                                    name="email"
                                                    type="email"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="branch_phone">
                                                    Phone
                                                </Label>
                                                <Input
                                                    id="branch_phone"
                                                    name="phone"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="branch_address">
                                                    Address
                                                </Label>
                                                <Input
                                                    id="branch_address"
                                                    name="address_line_1"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="branch_city">
                                                    City
                                                </Label>
                                                <Input
                                                    id="branch_city"
                                                    name="city"
                                                />
                                            </div>
                                        </div>
                                        <Button disabled={processing}>
                                            <GitBranch className="size-4" />
                                            Create branch
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Branches</CardTitle>
                        <CardDescription>
                            {organization.branches.length} operating locations
                            configured.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-2">
                        {organization.branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="rounded-xl border p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">
                                                {branch.name}
                                            </h3>
                                            {branch.is_default && (
                                                <Badge>Default</Badge>
                                            )}
                                            <Badge
                                                variant={
                                                    branch.is_active
                                                        ? 'secondary'
                                                        : 'destructive'
                                                }
                                            >
                                                {branch.is_active
                                                    ? 'active'
                                                    : 'inactive'}
                                            </Badge>
                                        </div>
                                        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                                            {(branch.address_line_1 ||
                                                branch.city) && (
                                                <p className="flex items-center gap-2">
                                                    <MapPin className="size-3.5" />
                                                    {[
                                                        branch.address_line_1,
                                                        branch.city,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </p>
                                            )}
                                            {branch.email && (
                                                <p className="flex items-center gap-2">
                                                    <Mail className="size-3.5" />
                                                    {branch.email}
                                                </p>
                                            )}
                                            {branch.phone && (
                                                <p className="flex items-center gap-2">
                                                    <Phone className="size-3.5" />
                                                    {branch.phone}
                                                </p>
                                            )}
                                            <p className="flex items-center gap-2">
                                                <Clock3 className="size-3.5" />
                                                {branch.timezone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link
                                            href={`/admin/organizations/${organization.id}/branches/${branch.id}/edit`}
                                        >
                                            Edit details & hours
                                        </Link>
                                    </Button>
                                    {!branch.is_default && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                branchAction(branch, 'default')
                                            }
                                        >
                                            Make default
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant={
                                            branch.is_active
                                                ? 'destructive'
                                                : 'outline'
                                        }
                                        disabled={
                                            branch.is_default &&
                                            branch.is_active
                                        }
                                        onClick={() =>
                                            branchAction(branch, 'status')
                                        }
                                    >
                                        {branch.is_active
                                            ? 'Deactivate'
                                            : 'Activate'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Organization members</CardTitle>
                        <CardDescription>
                            Current user access and organization-level roles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Member
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Account
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Users className="size-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 capitalize">
                                                {member.role.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant={
                                                        member.status ===
                                                        'active'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {member.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {members.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-10 text-center text-muted-foreground"
                                            >
                                                <UserRoundPlus className="mx-auto mb-2 size-5" />
                                                No members assigned.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OrganizationShow.layout = {
    breadcrumbs: [
        { title: 'System administration', href: '/admin' },
        { title: 'Organizations', href: '/admin/organizations' },
    ],
};
