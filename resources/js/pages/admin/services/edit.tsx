import { Head, useForm } from '@inertiajs/react';
import { CarFront, Wrench } from 'lucide-react';
import { FormEvent } from 'react';
import InputError from '@/components/input-error';
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

type Category = { id: number; name: string; is_active: boolean };
type Service = {
    id: number;
    service_category_id: number;
    name: string;
    description: string | null;
    booking_mode: string;
    vehicle_required: boolean;
};

export default function EditService({
    service,
    categories,
}: {
    service: Service;
    categories: Category[];
}) {
    const form = useForm({
        service_category_id: service.service_category_id.toString(),
        name: service.name,
        description: service.description ?? '',
        booking_mode: service.booking_mode,
        vehicle_required: service.vehicle_required,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.patch(`/admin/services/${service.id}`);
    };

    return (
        <>
            <Head title={`Edit ${service.name}`} />
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Service catalogue
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Edit {service.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Changes apply to the platform definition; organization
                        pricing remains independent.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="size-5" />
                            Service definition
                        </CardTitle>
                        <CardDescription>
                            Maintain the standardized identity and customer
                            intake rules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <select
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                    value={form.data.service_category_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'service_category_id',
                                            e.target.value,
                                        )
                                    }
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                            {category.is_active
                                                ? ''
                                                : ' (inactive)'}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={form.errors.service_category_id}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Customer action</Label>
                                <select
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                    value={form.data.booking_mode}
                                    onChange={(e) =>
                                        form.setData(
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
                            <label className="flex items-center gap-2 rounded-xl border p-4 text-sm">
                                <Checkbox
                                    checked={form.data.vehicle_required}
                                    onCheckedChange={(value) =>
                                        form.setData(
                                            'vehicle_required',
                                            value === true,
                                        )
                                    }
                                />
                                <CarFront className="size-4" />
                                <span>
                                    <strong className="font-medium">
                                        Vehicle details required
                                    </strong>
                                    <span className="block text-muted-foreground">
                                        Customers must select or enter a vehicle
                                        for this service.
                                    </span>
                                </span>
                            </label>
                            <Button size="lg" disabled={form.processing}>
                                Save service definition
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditService.layout = {
    breadcrumbs: [
        { title: 'System administration', href: '/admin' },
        { title: 'Service catalogue', href: '/admin/services' },
    ],
};
