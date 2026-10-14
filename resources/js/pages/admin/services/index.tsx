import { Head, Link, router, useForm } from '@inertiajs/react';
import { CarFront, Search, Tags, Wrench } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Category = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    services_count: number;
};
type Service = {
    id: number;
    name: string;
    description: string | null;
    booking_mode: 'quotation' | 'direct_booking';
    vehicle_required: boolean;
    is_active: boolean;
    category: { id: number; name: string };
};
type Props = {
    filters: { search: string };
    categories: Category[];
    services: {
        data: Service[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
};

export default function ServiceCatalogue({
    filters,
    categories,
    services,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const categoryForm = useForm({ name: '', description: '' });
    const serviceForm = useForm({
        service_category_id:
            categories.find((category) => category.is_active)?.id.toString() ??
            '',
        name: '',
        description: '',
        booking_mode: 'quotation',
        vehicle_required: true,
    });
    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            '/admin/services',
            { search },
            { preserveState: true, replace: true },
        );
    };
    const submitCategory = (event: FormEvent) => {
        event.preventDefault();
        categoryForm.post('/admin/service-categories', {
            preserveScroll: true,
            onSuccess: () => categoryForm.reset(),
        });
    };
    const submitService = (event: FormEvent) => {
        event.preventDefault();
        serviceForm.post('/admin/services', {
            preserveScroll: true,
            onSuccess: () => serviceForm.reset('name', 'description'),
        });
    };

    return (
        <>
            <Head title="Service catalogue" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Service governance
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Service catalogue
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Define the standardized services organizations can offer
                        to customers.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tags className="size-5" />
                                Add service category
                            </CardTitle>
                            <CardDescription>
                                Group related services for operations and public
                                discovery.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={submitCategory}
                                className="grid gap-4"
                            >
                                <div className="grid gap-2">
                                    <Label>Category name</Label>
                                    <Input
                                        value={categoryForm.data.name}
                                        onChange={(e) =>
                                            categoryForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="Vehicle care"
                                    />
                                    <InputError
                                        message={categoryForm.errors.name}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={categoryForm.data.description}
                                        onChange={(e) =>
                                            categoryForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Services included in this category"
                                    />
                                </div>
                                <Button disabled={categoryForm.processing}>
                                    Create category
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="size-5" />
                                Add standardized service
                            </CardTitle>
                            <CardDescription>
                                Organizations will later configure branch
                                pricing and availability.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={submitService}
                                className="grid gap-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <select
                                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={
                                                serviceForm.data
                                                    .service_category_id
                                            }
                                            onChange={(e) =>
                                                serviceForm.setData(
                                                    'service_category_id',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select category
                                            </option>
                                            {categories
                                                .filter(
                                                    (category) =>
                                                        category.is_active,
                                                )
                                                .map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <InputError
                                            message={
                                                serviceForm.errors
                                                    .service_category_id
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Service name</Label>
                                        <Input
                                            value={serviceForm.data.name}
                                            onChange={(e) =>
                                                serviceForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="Cut and polish"
                                        />
                                        <InputError
                                            message={serviceForm.errors.name}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={serviceForm.data.description}
                                        onChange={(e) =>
                                            serviceForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Customer action</Label>
                                        <select
                                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={
                                                serviceForm.data.booking_mode
                                            }
                                            onChange={(e) =>
                                                serviceForm.setData(
                                                    'booking_mode',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="quotation">
                                                Request quotation
                                            </option>
                                            <option value="direct_booking">
                                                Direct booking
                                            </option>
                                        </select>
                                    </div>
                                    <label className="mt-7 flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={
                                                serviceForm.data
                                                    .vehicle_required
                                            }
                                            onCheckedChange={(value) =>
                                                serviceForm.setData(
                                                    'vehicle_required',
                                                    value === true,
                                                )
                                            }
                                        />
                                        <CarFront className="size-4" />
                                        Vehicle details required
                                    </label>
                                </div>
                                <Button
                                    disabled={
                                        serviceForm.processing ||
                                        categories.filter(
                                            (category) => category.is_active,
                                        ).length === 0
                                    }
                                >
                                    Create service
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                            Control which service groups are available for new
                            listings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-xl border p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">
                                            {category.name}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {category.description ||
                                                'No description'}{' '}
                                            · {category.services_count} services
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            category.is_active
                                                ? 'secondary'
                                                : 'destructive'
                                        }
                                    >
                                        {category.is_active
                                            ? 'active'
                                            : 'inactive'}
                                    </Badge>
                                </div>
                                <Button
                                    className="mt-4"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        router.patch(
                                            `/admin/service-categories/${category.id}/status`,
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    {category.is_active
                                        ? 'Deactivate'
                                        : 'Reactivate'}
                                </Button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="py-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                                Create the first category to begin the
                                catalogue.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle>Standardized services</CardTitle>
                                <CardDescription>
                                    {services.total} services in the platform
                                    catalogue.
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
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                        placeholder="Search services"
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
                                            Service
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Customer flow
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {services.data.map((service) => (
                                        <tr key={service.id}>
                                            <td className="px-4 py-4">
                                                <p className="font-medium">
                                                    {service.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {service.category.name}
                                                    {service.vehicle_required
                                                        ? ' · Vehicle required'
                                                        : ''}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 capitalize">
                                                {service.booking_mode.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant={
                                                        service.is_active
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {service.is_active
                                                        ? 'active'
                                                        : 'inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/services/${service.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            service.is_active
                                                                ? 'destructive'
                                                                : 'outline'
                                                        }
                                                        onClick={() =>
                                                            router.patch(
                                                                `/admin/services/${service.id}/status`,
                                                                {},
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        {service.is_active
                                                            ? 'Deactivate'
                                                            : 'Reactivate'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {services.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-12 text-center text-muted-foreground"
                                            >
                                                No services found.
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

ServiceCatalogue.layout = {
    breadcrumbs: [
        { title: 'System administration', href: '/admin' },
        { title: 'Service catalogue', href: '/admin/services' },
    ],
};
