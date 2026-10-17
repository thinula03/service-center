import { Head, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CarFront,
    Fuel,
    Gauge,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    Plus,
    ShieldAlert,
    UserRound,
} from 'lucide-react';
import { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

type Vehicle = {
    id: number;
    registration_number: string;
    make: string;
    model: string;
    generation: string | null;
    variant: string | null;
    trim: string | null;
    year: number | null;
    engine_code: string | null;
    structural_segment: string | null;
    powertrain_type: string | null;
    fuel_type: string | null;
    transmission: string | null;
    brake_configuration: string | null;
    has_electronic_parking_brake: boolean;
    suspension_type: string | null;
    requires_high_voltage_safety: boolean;
    color: string | null;
    mileage: number | null;
    vin: string | null;
    status: string;
};

type Props = {
    organization: { name: string };
    customer: {
        id: number;
        display_name: string;
        customer_type: string;
        email: string | null;
        phone: string;
        secondary_phone: string | null;
        address_line_1: string | null;
        city: string | null;
        notes: string | null;
        status: string;
        created_at: string;
        vehicles: Vehicle[];
    };
};

export default function CustomerShow({ organization, customer }: Props) {
    const form = useForm({
        registration_number: '',
        make: '',
        model: '',
        generation: '',
        variant: '',
        trim: '',
        year: '',
        engine_code: '',
        structural_segment: '',
        powertrain_type: '',
        fuel_type: '',
        transmission: '',
        brake_configuration: '',
        has_electronic_parking_brake: false,
        suspension_type: '',
        color: '',
        mileage: '',
        vin: '',
        chassis_number: '',
        engine_number: '',
        notes: '',
    });

    const addVehicle = (event: FormEvent) => {
        event.preventDefault();
        form.post(`/organization/customers/${customer.id}/vehicles`, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <>
            <Head title={customer.display_name} />
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-7 p-4 md:p-8 lg:p-10">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="mb-4 -ml-3"
                    >
                        <a href="/organization/customers">
                            <ArrowLeft className="size-4" /> Customers
                        </a>
                    </Button>
                    <p className="text-sm font-semibold text-primary">
                        {organization.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-[-0.025em]">
                            {customer.display_name}
                        </h1>
                        <Badge
                            variant="secondary"
                            className="rounded-full capitalize"
                        >
                            {customer.customer_type}
                        </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Customer since {customer.created_at}
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserRound className="size-5 text-primary" />{' '}
                                    Customer details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <Phone className="mt-0.5 size-4 text-primary" />
                                    <div>
                                        <p className="font-medium">
                                            {customer.phone}
                                        </p>
                                        {customer.secondary_phone && (
                                            <p className="text-muted-foreground">
                                                {customer.secondary_phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {customer.email && (
                                    <div className="flex gap-3">
                                        <Mail className="mt-0.5 size-4 text-primary" />
                                        <span>{customer.email}</span>
                                    </div>
                                )}
                                {(customer.address_line_1 || customer.city) && (
                                    <div className="flex gap-3">
                                        <MapPin className="mt-0.5 size-4 text-primary" />
                                        <span>
                                            {[
                                                customer.address_line_1,
                                                customer.city,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    </div>
                                )}
                                {customer.notes && (
                                    <div className="rounded-xl bg-muted/60 p-4 leading-6 text-muted-foreground">
                                        {customer.notes}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Add vehicle</CardTitle>
                                <CardDescription>
                                    Registration is normalized for duplicate
                                    prevention.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={addVehicle}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="registration">
                                            Registration number
                                        </Label>
                                        <Input
                                            id="registration"
                                            value={
                                                form.data.registration_number
                                            }
                                            onChange={(event) =>
                                                form.setData(
                                                    'registration_number',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="CAA-1234"
                                        />
                                        <InputError
                                            message={
                                                form.errors.registration_number
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="make">Make</Label>
                                            <Input
                                                id="make"
                                                value={form.data.make}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'make',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Toyota"
                                            />
                                            <InputError
                                                message={form.errors.make}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="model">Model</Label>
                                            <Input
                                                id="model"
                                                value={form.data.model}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'model',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Prius"
                                            />
                                            <InputError
                                                message={form.errors.model}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="variant">
                                                Variant
                                            </Label>
                                            <Input
                                                id="variant"
                                                value={form.data.variant}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'variant',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="generation">
                                                Generation / series
                                            </Label>
                                            <Input
                                                id="generation"
                                                value={form.data.generation}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'generation',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="XW50, E90, F30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="trim">Trim</Label>
                                            <Input
                                                id="trim"
                                                value={form.data.trim}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'trim',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year</Label>
                                            <Input
                                                id="year"
                                                type="number"
                                                value={form.data.year}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'year',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="engine_code">
                                                Engine code
                                            </Label>
                                            <Input
                                                id="engine_code"
                                                value={form.data.engine_code}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'engine_code',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="2GR-FE"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Structural segment</Label>
                                            <Select
                                                value={
                                                    form.data
                                                        .structural_segment ||
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'structural_segment',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-10 w-full">
                                                    <SelectValue placeholder="Select segment" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="micro">
                                                        Micro
                                                    </SelectItem>
                                                    <SelectItem value="compact">
                                                        Compact
                                                    </SelectItem>
                                                    <SelectItem value="mid_size">
                                                        Mid-size
                                                    </SelectItem>
                                                    <SelectItem value="full_size_suv_pickup">
                                                        Full-size SUV / pickup
                                                    </SelectItem>
                                                    <SelectItem value="light_truck_van">
                                                        Light truck / van
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    form.errors
                                                        .structural_segment
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Powertrain</Label>
                                            <Select
                                                value={
                                                    form.data.powertrain_type ||
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'powertrain_type',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-10 w-full">
                                                    <SelectValue placeholder="Select powertrain" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ice">
                                                        ICE
                                                    </SelectItem>
                                                    <SelectItem value="hev">
                                                        Hybrid (HEV)
                                                    </SelectItem>
                                                    <SelectItem value="phev">
                                                        Plug-in hybrid (PHEV)
                                                    </SelectItem>
                                                    <SelectItem value="bev">
                                                        Battery electric (BEV)
                                                    </SelectItem>
                                                    <SelectItem value="alternative">
                                                        Alternative fuel
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    form.errors.powertrain_type
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Fuel type</Label>
                                            <Select
                                                value={
                                                    form.data.fuel_type ||
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'fuel_type',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-10 w-full">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="petrol">
                                                        Petrol
                                                    </SelectItem>
                                                    <SelectItem value="diesel">
                                                        Diesel
                                                    </SelectItem>
                                                    <SelectItem value="cng">
                                                        CNG
                                                    </SelectItem>
                                                    <SelectItem value="lpg">
                                                        LPG
                                                    </SelectItem>
                                                    <SelectItem value="hydrogen">
                                                        Hydrogen
                                                    </SelectItem>
                                                    <SelectItem value="electric">
                                                        Electric
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Transmission</Label>
                                            <Select
                                                value={
                                                    form.data.transmission ||
                                                    undefined
                                                }
                                                onValueChange={(value) =>
                                                    form.setData(
                                                        'transmission',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-10 w-full">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="automatic">
                                                        Automatic
                                                    </SelectItem>
                                                    <SelectItem value="manual">
                                                        Manual
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="color">Color</Label>
                                            <Input
                                                id="color"
                                                value={form.data.color}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'color',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mileage">
                                                Mileage (km)
                                            </Label>
                                            <Input
                                                id="mileage"
                                                type="number"
                                                min="0"
                                                value={form.data.mileage}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'mileage',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="brake_configuration">
                                                Brake configuration
                                            </Label>
                                            <Input
                                                id="brake_configuration"
                                                value={
                                                    form.data
                                                        .brake_configuration
                                                }
                                                onChange={(event) =>
                                                    form.setData(
                                                        'brake_configuration',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Four-wheel disc"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="suspension_type">
                                                Suspension type
                                            </Label>
                                            <Input
                                                id="suspension_type"
                                                value={
                                                    form.data.suspension_type
                                                }
                                                onChange={(event) =>
                                                    form.setData(
                                                        'suspension_type',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Air suspension"
                                            />
                                        </div>
                                    </div>
                                    <label className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/30 p-4">
                                        <Checkbox
                                            checked={
                                                form.data
                                                    .has_electronic_parking_brake
                                            }
                                            onCheckedChange={(checked) =>
                                                form.setData(
                                                    'has_electronic_parking_brake',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <span>
                                            <span className="block text-sm font-medium">
                                                Electronic parking brake
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                Requires diagnostic retraction
                                                procedures during brake work.
                                            </span>
                                        </span>
                                    </label>
                                    <div className="space-y-2">
                                        <Label htmlFor="vin">
                                            VIN / chassis identifier
                                        </Label>
                                        <Input
                                            id="vin"
                                            value={form.data.vin}
                                            onChange={(event) =>
                                                form.setData(
                                                    'vin',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={form.errors.vin} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_notes">
                                            Internal notes
                                        </Label>
                                        <Textarea
                                            id="vehicle_notes"
                                            rows={2}
                                            value={form.data.notes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'notes',
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
                                            <Plus className="size-4" />
                                        )}{' '}
                                        Add vehicle
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-fit">
                        <CardHeader className="border-b border-border/70 pb-5">
                            <CardTitle>Registered vehicles</CardTitle>
                            <CardDescription>
                                {customer.vehicles.length} linked to this
                                customer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {customer.vehicles.length === 0 && (
                                <div className="col-span-full py-12 text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <CarFront className="size-5" />
                                    </div>
                                    <p className="mt-4 font-semibold">
                                        No vehicles registered
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Add the customer's first vehicle using
                                        the form.
                                    </p>
                                </div>
                            )}
                            {customer.vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="rounded-2xl border border-border/80 bg-muted/30 p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border/70">
                                            <CarFront className="size-5" />
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            {vehicle.registration_number}
                                        </Badge>
                                    </div>
                                    <h2 className="mt-4 text-lg font-semibold">
                                        {vehicle.make} {vehicle.model}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {[
                                            vehicle.generation,
                                            vehicle.trim,
                                            vehicle.variant,
                                            vehicle.year,
                                            vehicle.color,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ') ||
                                            'Vehicle details pending'}
                                    </p>
                                    {vehicle.requires_high_voltage_safety && (
                                        <div className="mt-4 flex gap-2 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-100">
                                            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                                            <span>
                                                High-voltage safety procedures
                                                and an EV-certified technician
                                                are required.
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        {vehicle.structural_segment && (
                                            <span className="capitalize">
                                                {vehicle.structural_segment.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </span>
                                        )}
                                        {vehicle.powertrain_type && (
                                            <span className="font-medium text-primary uppercase">
                                                {vehicle.powertrain_type}
                                            </span>
                                        )}
                                        {vehicle.fuel_type && (
                                            <span className="flex items-center gap-1.5 capitalize">
                                                <Fuel className="size-3.5 text-primary" />
                                                {vehicle.fuel_type}
                                            </span>
                                        )}
                                        {vehicle.mileage !== null && (
                                            <span className="flex items-center gap-1.5">
                                                <Gauge className="size-3.5 text-primary" />
                                                {vehicle.mileage.toLocaleString()}{' '}
                                                km
                                            </span>
                                        )}
                                    </div>
                                    {(vehicle.engine_code ||
                                        vehicle.brake_configuration ||
                                        vehicle.suspension_type ||
                                        vehicle.has_electronic_parking_brake) && (
                                        <div className="mt-4 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">
                                            {vehicle.engine_code && (
                                                <p>
                                                    Engine:{' '}
                                                    {vehicle.engine_code}
                                                </p>
                                            )}
                                            {vehicle.brake_configuration && (
                                                <p>
                                                    Brakes:{' '}
                                                    {
                                                        vehicle.brake_configuration
                                                    }
                                                </p>
                                            )}
                                            {vehicle.has_electronic_parking_brake && (
                                                <p>Electronic parking brake</p>
                                            )}
                                            {vehicle.suspension_type && (
                                                <p>
                                                    Suspension:{' '}
                                                    {vehicle.suspension_type}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

CustomerShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customers', href: '/organization/customers' },
        { title: 'Customer record', href: '#' },
    ],
};
