import { Head, useForm } from '@inertiajs/react';
import { Clock3, MapPin } from 'lucide-react';
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

type DayHours = { open: string; close: string; closed: boolean };
type Branch = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address_line_1: string | null;
    city: string | null;
    timezone: string;
    service_hours: Record<string, DayHours>;
};
const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];

export default function EditBranch({
    organization,
    branch,
}: {
    organization: { id: number; name: string };
    branch: Branch;
}) {
    const form = useForm({
        name: branch.name,
        email: branch.email ?? '',
        phone: branch.phone ?? '',
        address_line_1: branch.address_line_1 ?? '',
        city: branch.city ?? '',
        timezone: branch.timezone,
        service_hours: branch.service_hours,
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.patch(
            `/admin/organizations/${organization.id}/branches/${branch.id}`,
        );
    };
    const updateHours = (day: string, values: Partial<DayHours>) =>
        form.setData('service_hours', {
            ...form.data.service_hours,
            [day]: { ...form.data.service_hours[day], ...values },
        });

    return (
        <>
            <Head title={`Edit ${branch.name}`} />
            <form
                onSubmit={submit}
                className="flex flex-1 flex-col gap-6 p-4 md:p-6"
            >
                <div>
                    <p className="text-sm font-medium text-primary">
                        {organization.name}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Edit {branch.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Maintain branch identity, location, contact information,
                        and weekly service hours.
                    </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="size-5" />
                                Branch details
                            </CardTitle>
                            <CardDescription>
                                Information shown internally and on the service
                                directory.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
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
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData('phone', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Input
                                    value={form.data.address_line_1}
                                    onChange={(e) =>
                                        form.setData(
                                            'address_line_1',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>City</Label>
                                <Input
                                    value={form.data.city}
                                    onChange={(e) =>
                                        form.setData('city', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Timezone</Label>
                                <Input
                                    value={form.data.timezone}
                                    onChange={(e) =>
                                        form.setData('timezone', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.timezone} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock3 className="size-5" />
                                Service hours
                            </CardTitle>
                            <CardDescription>
                                Set opening and closing hours for every day.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {days.map((day) => {
                                const hours = form.data.service_hours[day];
                                return (
                                    <div
                                        key={day}
                                        className="grid items-center gap-3 rounded-xl border p-3 sm:grid-cols-[1fr_120px_120px_auto]"
                                    >
                                        <Label className="capitalize">
                                            {day}
                                        </Label>
                                        <Input
                                            type="time"
                                            value={hours.open}
                                            disabled={hours.closed}
                                            onChange={(e) =>
                                                updateHours(day, {
                                                    open: e.target.value,
                                                })
                                            }
                                        />
                                        <Input
                                            type="time"
                                            value={hours.close}
                                            disabled={hours.closed}
                                            onChange={(e) =>
                                                updateHours(day, {
                                                    close: e.target.value,
                                                })
                                            }
                                        />
                                        <label className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={hours.closed}
                                                onCheckedChange={(checked) =>
                                                    updateHours(day, {
                                                        closed:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            Closed
                                        </label>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end">
                    <Button size="lg" disabled={form.processing}>
                        Save branch and service hours
                    </Button>
                </div>
            </form>
        </>
    );
}

EditBranch.layout = {
    breadcrumbs: [
        { title: 'System administration', href: '/admin' },
        { title: 'Organizations', href: '/admin/organizations' },
    ],
};
