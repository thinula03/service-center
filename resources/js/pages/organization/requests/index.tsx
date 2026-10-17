import { Head, router, useForm } from '@inertiajs/react';
import {
    CalendarClock,
    ClipboardPlus,
    LoaderCircle,
    Search,
    ShieldAlert,
    Wrench,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
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

type VehicleOption = {
    id: number;
    label: string;
    requires_high_voltage_safety: boolean;
};

type CustomerOption = {
    id: number;
    name: string;
    vehicles: VehicleOption[];
};

type OfferingOption = {
    id: number;
    name: string;
    booking_mode: 'quotation' | 'direct_booking';
    branch_ids: number[];
};

type ServiceRequest = {
    id: number;
    request_number: string;
    status: string;
    intake_type: string;
    customer_name: string;
    vehicle: string | null;
    service_name: string;
    branch_name: string;
    preferred_at: string | null;
    requires_high_voltage_safety: boolean;
    safety_requirements: string[];
    created_at: string;
};

type Props = {
    organization: { name: string };
    filters: { search: string };
    customers: CustomerOption[];
    branches: { id: number; name: string }[];
    offerings: OfferingOption[];
    requests: {
        data: ServiceRequest[];
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function RequestIndex({
    organization,
    filters,
    customers,
    branches,
    offerings,
    requests,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const form = useForm({
        customer_id: '',
        vehicle_id: '',
        branch_id: '',
        organization_service_offering_id: '',
        intake_type: 'quotation',
        preferred_at: '',
        customer_concern: '',
        internal_notes: '',
    });

    const selectedCustomer = customers.find(
        (customer) => String(customer.id) === form.data.customer_id,
    );
    const selectedVehicle = selectedCustomer?.vehicles.find(
        (vehicle) => String(vehicle.id) === form.data.vehicle_id,
    );
    const selectedOffering = offerings.find(
        (offering) =>
            String(offering.id) === form.data.organization_service_offering_id,
    );
    const availableBranches = useMemo(
        () =>
            selectedOffering
                ? branches.filter((branch) =>
                      selectedOffering.branch_ids.includes(branch.id),
                  )
                : branches,
        [branches, selectedOffering],
    );

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get('/organization/requests', search ? { search } : {}, {
            preserveState: true,
            replace: true,
        });
    };

    const createRequest = (event: FormEvent) => {
        event.preventDefault();
        form.post('/organization/requests', {
            preserveScroll: true,
            onSuccess: () => {
                form.setData('vehicle_id', '');
                form.setData('preferred_at', '');
                form.setData('customer_concern', '');
                form.setData('internal_notes', '');
            },
        });
    };

    return (
        <>
            <Head title="Service requests" />
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-7 p-4 md:p-8 lg:p-10">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold text-primary">
                            {organization.name}
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em]">
                            Service requests
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Capture customer concerns against the correct
                            vehicle, service, and branch with safety
                            requirements preserved.
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className="w-fit rounded-full px-3 py-1"
                    >
                        {requests.total}{' '}
                        {requests.total === 1 ? 'request' : 'requests'}
                    </Badge>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <Card className="h-fit">
                        <CardHeader className="border-b border-border/70">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <CardTitle>Intake queue</CardTitle>
                                    <CardDescription className="mt-1">
                                        New requests awaiting review and
                                        estimation.
                                    </CardDescription>
                                </div>
                                <form
                                    onSubmit={submitSearch}
                                    className="flex gap-2"
                                >
                                    <Input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Request, customer, vehicle"
                                        className="w-full sm:w-60"
                                    />
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Search className="size-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {requests.data.length === 0 && (
                                <div className="py-14 text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <ClipboardPlus className="size-5" />
                                    </div>
                                    <p className="mt-4 font-semibold">
                                        No service requests yet
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Use the intake form to record the first
                                        request.
                                    </p>
                                </div>
                            )}
                            {requests.data.map((request) => (
                                <div
                                    key={request.id}
                                    className="rounded-2xl border border-border/80 p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-xs font-semibold text-primary">
                                                    {request.request_number}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full capitalize"
                                                >
                                                    {request.status}
                                                </Badge>
                                                {request.requires_high_voltage_safety && (
                                                    <Badge className="rounded-full border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
                                                        <ShieldAlert className="size-3" />{' '}
                                                        HV safety
                                                    </Badge>
                                                )}
                                            </div>
                                            <h2 className="mt-2 font-semibold">
                                                {request.customer_name}
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {request.vehicle}
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            <p>{request.created_at}</p>
                                            <p className="mt-1 capitalize">
                                                {request.intake_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 text-sm sm:grid-cols-2">
                                        <span className="flex items-center gap-2">
                                            <Wrench className="size-4 text-primary" />
                                            {request.service_name}
                                        </span>
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <CalendarClock className="size-4" />
                                            {request.preferred_at ??
                                                request.branch_name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>New service intake</CardTitle>
                            <CardDescription>
                                Select an existing customer and registered
                                vehicle.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={createRequest}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <Select
                                        value={
                                            form.data.customer_id || undefined
                                        }
                                        onValueChange={(value) => {
                                            form.setData('customer_id', value);
                                            form.setData('vehicle_id', '');
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Select customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem
                                                    key={customer.id}
                                                    value={String(customer.id)}
                                                >
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={form.errors.customer_id}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vehicle</Label>
                                    <Select
                                        value={
                                            form.data.vehicle_id || undefined
                                        }
                                        onValueChange={(value) =>
                                            form.setData('vehicle_id', value)
                                        }
                                        disabled={!selectedCustomer}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Select registered vehicle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedCustomer?.vehicles.map(
                                                (vehicle) => (
                                                    <SelectItem
                                                        key={vehicle.id}
                                                        value={String(
                                                            vehicle.id,
                                                        )}
                                                    >
                                                        {vehicle.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={form.errors.vehicle_id}
                                    />
                                </div>
                                {selectedVehicle?.requires_high_voltage_safety && (
                                    <div className="flex gap-3 rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-100">
                                        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                                        High-voltage procedures and an
                                        EV-certified technician will be
                                        required.
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Service</Label>
                                    <Select
                                        value={
                                            form.data
                                                .organization_service_offering_id ||
                                            undefined
                                        }
                                        onValueChange={(value) => {
                                            const offering = offerings.find(
                                                (item) =>
                                                    String(item.id) === value,
                                            );
                                            form.setData(
                                                'organization_service_offering_id',
                                                value,
                                            );
                                            form.setData('branch_id', '');
                                            form.setData(
                                                'intake_type',
                                                offering?.booking_mode ===
                                                    'direct_booking'
                                                    ? 'booking'
                                                    : 'quotation',
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Select service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {offerings.map((offering) => (
                                                <SelectItem
                                                    key={offering.id}
                                                    value={String(offering.id)}
                                                >
                                                    {offering.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={
                                            form.errors
                                                .organization_service_offering_id
                                        }
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Branch</Label>
                                        <Select
                                            value={
                                                form.data.branch_id || undefined
                                            }
                                            onValueChange={(value) =>
                                                form.setData('branch_id', value)
                                            }
                                            disabled={!selectedOffering}
                                        >
                                            <SelectTrigger className="h-10 w-full">
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableBranches.map(
                                                    (branch) => (
                                                        <SelectItem
                                                            key={branch.id}
                                                            value={String(
                                                                branch.id,
                                                            )}
                                                        >
                                                            {branch.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.branch_id}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Intake type</Label>
                                        <Select
                                            value={form.data.intake_type}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'intake_type',
                                                    value,
                                                )
                                            }
                                            disabled={Boolean(selectedOffering)}
                                        >
                                            <SelectTrigger className="h-10 w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="quotation">
                                                    Quotation request
                                                </SelectItem>
                                                <SelectItem value="booking">
                                                    Booking request
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.intake_type}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_at">
                                        Preferred date and time
                                    </Label>
                                    <Input
                                        id="preferred_at"
                                        type="datetime-local"
                                        value={form.data.preferred_at}
                                        onChange={(event) =>
                                            form.setData(
                                                'preferred_at',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={form.errors.preferred_at}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="concern">
                                        Customer concern
                                    </Label>
                                    <Textarea
                                        id="concern"
                                        rows={4}
                                        value={form.data.customer_concern}
                                        onChange={(event) =>
                                            form.setData(
                                                'customer_concern',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Describe the reported symptoms or requested work."
                                    />
                                    <InputError
                                        message={form.errors.customer_concern}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="internal_notes">
                                        Internal notes
                                    </Label>
                                    <Textarea
                                        id="internal_notes"
                                        rows={2}
                                        value={form.data.internal_notes}
                                        onChange={(event) =>
                                            form.setData(
                                                'internal_notes',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={form.processing}
                                >
                                    {form.processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <ClipboardPlus className="size-4" />
                                    )}{' '}
                                    Create request
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

RequestIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Service requests', href: '/organization/requests' },
    ],
};
