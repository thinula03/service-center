import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CarFront,
    ContactRound,
    LoaderCircle,
    Plus,
    Search,
    UserRound,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Customer = {
    id: number;
    display_name: string;
    customer_type: 'individual' | 'business';
    email: string | null;
    phone: string;
    city: string | null;
    status: string;
    vehicles_count: number;
    created_at: string;
};

type Props = {
    organization: { name: string };
    filters: { search: string };
    customers: {
        data: Customer[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number | null;
        to: number | null;
        total: number;
    };
};

export default function CustomersIndex({
    organization,
    filters,
    customers,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const form = useForm({
        customer_type: 'individual' as 'individual' | 'business',
        first_name: '',
        last_name: '',
        business_name: '',
        email: '',
        phone: '',
        secondary_phone: '',
        address_line_1: '',
        city: '',
        notes: '',
    });

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/organization/customers',
            { search },
            { preserveState: true, replace: true },
        );
    };

    const createCustomer = (event: FormEvent) => {
        event.preventDefault();
        form.post('/organization/customers');
    };

    return (
        <>
            <Head title="Customers" />
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-7 p-4 md:p-8 lg:p-10">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-semibold text-primary">
                            {organization.name}
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em]">
                            Customers & vehicles
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Keep customer contact details and every registered
                            vehicle together before service intake begins.
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="w-fit rounded-full px-3 py-1.5"
                    >
                        {customers.total}{' '}
                        {customers.total === 1 ? 'customer' : 'customers'}
                    </Badge>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card className="h-fit overflow-hidden">
                        <CardHeader className="border-b border-border/70 pb-5">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <CardTitle>Customer directory</CardTitle>
                                    <CardDescription className="mt-1">
                                        Search by name, phone, email, or vehicle
                                        registration.
                                    </CardDescription>
                                </div>
                                <form
                                    onSubmit={submitSearch}
                                    className="flex gap-2"
                                >
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            className="w-full pl-9 sm:w-64"
                                            placeholder="Search customers"
                                        />
                                    </div>
                                    <Button variant="outline">Search</Button>
                                </form>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {customers.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <ContactRound className="size-5" />
                                    </div>
                                    <p className="mt-4 font-semibold">
                                        No customers found
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Add the first customer or adjust your
                                        search.
                                    </p>
                                </div>
                            )}
                            {customers.data.map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={`/organization/customers/${customer.id}`}
                                    className="group flex items-center gap-4 rounded-2xl border border-transparent bg-muted/45 p-4 transition hover:border-primary/15 hover:bg-accent/45"
                                >
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border/70">
                                        {customer.customer_type ===
                                        'business' ? (
                                            <Building2 className="size-5" />
                                        ) : (
                                            <UserRound className="size-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate font-semibold">
                                                {customer.display_name}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="rounded-full capitalize"
                                            >
                                                {customer.customer_type}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 truncate text-sm text-muted-foreground">
                                            {customer.phone}
                                            {customer.email
                                                ? ` · ${customer.email}`
                                                : ''}
                                            {customer.city
                                                ? ` · ${customer.city}`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                                        <CarFront className="size-4 text-primary" />
                                        {customer.vehicles_count}
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                </Link>
                            ))}

                            {customers.total > customers.data.length && (
                                <div className="flex items-center justify-between border-t pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {customers.from ?? 0}–
                                        {customers.to ?? 0} of {customers.total}
                                    </p>
                                    <div className="flex gap-1">
                                        {customers.links.map((link, index) =>
                                            link.url ? (
                                                <Button
                                                    key={index}
                                                    size="sm"
                                                    variant={
                                                        link.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
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
                                            ) : null,
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="h-fit xl:sticky xl:top-24">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Plus className="size-5" />
                                </div>
                                <div>
                                    <CardTitle>Add customer</CardTitle>
                                    <CardDescription className="mt-1">
                                        Create a record before registering
                                        vehicles.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={createCustomer}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label>Customer type</Label>
                                    <Select
                                        value={form.data.customer_type}
                                        onValueChange={(value) =>
                                            form.setData(
                                                'customer_type',
                                                value as
                                                    | 'individual'
                                                    | 'business',
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-11 w-full rounded-xl bg-card">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="individual">
                                                Individual
                                            </SelectItem>
                                            <SelectItem value="business">
                                                Business
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={form.errors.customer_type}
                                    />
                                </div>

                                {form.data.customer_type === 'individual' ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">
                                                First name
                                            </Label>
                                            <Input
                                                id="first_name"
                                                value={form.data.first_name}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'first_name',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={form.errors.first_name}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">
                                                Last name
                                            </Label>
                                            <Input
                                                id="last_name"
                                                value={form.data.last_name}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'last_name',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={form.errors.last_name}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="business_name">
                                            Business name
                                        </Label>
                                        <Input
                                            id="business_name"
                                            value={form.data.business_name}
                                            onChange={(event) =>
                                                form.setData(
                                                    'business_name',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={form.errors.business_name}
                                        />
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={form.data.phone}
                                            onChange={(event) =>
                                                form.setData(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="+94 77 123 4567"
                                        />
                                        <InputError
                                            message={form.errors.phone}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.data.email}
                                            onChange={(event) =>
                                                form.setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={form.errors.email}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={form.data.address_line_1}
                                            onChange={(event) =>
                                                form.setData(
                                                    'address_line_1',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={form.errors.address_line_1}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={form.data.city}
                                            onChange={(event) =>
                                                form.setData(
                                                    'city',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={form.errors.city}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">
                                        Internal notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={form.data.notes}
                                        onChange={(event) =>
                                            form.setData(
                                                'notes',
                                                event.target.value,
                                            )
                                        }
                                        rows={3}
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={form.processing}
                                >
                                    {form.processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <Plus className="size-4" />
                                    )}
                                    Create customer
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

CustomersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customers', href: '/organization/customers' },
    ],
};
