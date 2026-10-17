import { useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

export type BranchOption = {
    id: number;
    name: string;
    is_default?: boolean;
};

export type ServiceOption = {
    id: number;
    name: string;
    category: string;
    description: string | null;
    booking_mode: 'direct' | 'quotation';
    vehicle_required: boolean;
};

export type OfferingFormValue = {
    id?: number;
    service_definition_id: number;
    name?: string;
    category?: string;
    description: string;
    pricing_model: 'fixed' | 'starting_from' | 'hourly' | 'quotation';
    price_amount: string;
    duration_minutes: string;
    booking_mode: 'direct' | 'quotation';
    lead_time_hours: string;
    branch_ids: number[];
    is_active: boolean;
    is_published: boolean;
};

type Props = {
    branches: BranchOption[];
    services?: ServiceOption[];
    offering?: OfferingFormValue;
    onSuccess?: () => void;
};

const pricingModels = [
    { value: 'quotation', label: 'Quotation only' },
    { value: 'fixed', label: 'Fixed price' },
    { value: 'starting_from', label: 'Starting from' },
    { value: 'hourly', label: 'Hourly rate' },
] as const;

export function OrganizationServiceForm({
    branches,
    services = [],
    offering,
    onSuccess,
}: Props) {
    const isEditing = Boolean(offering?.id);
    const form = useForm<OfferingFormValue>({
        service_definition_id: offering?.service_definition_id ?? 0,
        description: offering?.description ?? '',
        pricing_model: offering?.pricing_model ?? 'quotation',
        price_amount: offering?.price_amount ?? '',
        duration_minutes: offering?.duration_minutes ?? '',
        booking_mode: offering?.booking_mode ?? 'quotation',
        lead_time_hours: offering?.lead_time_hours ?? '',
        branch_ids: offering?.branch_ids ?? branches.map((branch) => branch.id),
        is_active: offering?.is_active ?? true,
        is_published: offering?.is_published ?? false,
    });

    const selectedService = services.find(
        (service) => service.id === form.data.service_definition_id,
    );

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEditing) {
                    form.reset();
                }
                onSuccess?.();
            },
        };

        if (isEditing && offering?.id) {
            form.patch(`/organization/services/${offering.id}`, options);
            return;
        }

        form.post('/organization/services', options);
    };

    const toggleBranch = (branchId: number, checked: boolean) => {
        form.setData(
            'branch_ids',
            checked
                ? [...form.data.branch_ids, branchId]
                : form.data.branch_ids.filter((id) => id !== branchId),
        );
    };

    return (
        <form onSubmit={submit} className="space-y-7">
            {!isEditing && (
                <div className="space-y-2">
                    <Label>Platform service</Label>
                    <Select
                        value={
                            form.data.service_definition_id
                                ? String(form.data.service_definition_id)
                                : undefined
                        }
                        onValueChange={(value) => {
                            const service = services.find(
                                (item) => item.id === Number(value),
                            );
                            form.setData((data) => ({
                                ...data,
                                service_definition_id: Number(value),
                                booking_mode:
                                    service?.booking_mode ?? 'quotation',
                            }));
                        }}
                    >
                        <SelectTrigger className="h-11 w-full rounded-xl bg-card">
                            <SelectValue placeholder="Choose a standardized service" />
                        </SelectTrigger>
                        <SelectContent align="start">
                            {services.map((service) => (
                                <SelectItem
                                    key={service.id}
                                    value={String(service.id)}
                                >
                                    {service.name} · {service.category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.service_definition_id} />
                    {selectedService?.description && (
                        <p className="text-sm leading-6 text-muted-foreground">
                            {selectedService.description}
                        </p>
                    )}
                </div>
            )}

            {isEditing && (
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                    <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                        {offering?.category}
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                        {offering?.name}
                    </p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="description">Customer-facing description</Label>
                <Textarea
                    id="description"
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.target.value)
                    }
                    rows={4}
                    placeholder="Explain what is included in this service at your center."
                />
                <InputError message={form.errors.description} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Pricing model</Label>
                    <Select
                        value={form.data.pricing_model}
                        onValueChange={(value) =>
                            form.setData(
                                'pricing_model',
                                value as OfferingFormValue['pricing_model'],
                            )
                        }
                    >
                        <SelectTrigger className="h-11 w-full rounded-xl bg-card">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pricingModels.map((model) => (
                                <SelectItem
                                    key={model.value}
                                    value={model.value}
                                >
                                    {model.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.pricing_model} />
                </div>

                {form.data.pricing_model !== 'quotation' && (
                    <div className="space-y-2">
                        <Label htmlFor="price_amount">Price (LKR)</Label>
                        <Input
                            id="price_amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.data.price_amount}
                            onChange={(event) =>
                                form.setData('price_amount', event.target.value)
                            }
                            placeholder="0.00"
                        />
                        <InputError message={form.errors.price_amount} />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="duration_minutes">
                        Estimated duration (minutes)
                    </Label>
                    <Input
                        id="duration_minutes"
                        type="number"
                        min="5"
                        value={form.data.duration_minutes}
                        onChange={(event) =>
                            form.setData('duration_minutes', event.target.value)
                        }
                        placeholder="e.g. 90"
                    />
                    <InputError message={form.errors.duration_minutes} />
                </div>

                <div className="space-y-2">
                    <Label>Customer intake</Label>
                    <Select
                        value={form.data.booking_mode}
                        onValueChange={(value) =>
                            form.setData(
                                'booking_mode',
                                value as OfferingFormValue['booking_mode'],
                            )
                        }
                    >
                        <SelectTrigger className="h-11 w-full rounded-xl bg-card">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="quotation">
                                Request a quotation
                            </SelectItem>
                            <SelectItem value="direct">
                                Direct booking
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.booking_mode} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lead_time_hours">
                        Minimum lead time (hours)
                    </Label>
                    <Input
                        id="lead_time_hours"
                        type="number"
                        min="0"
                        value={form.data.lead_time_hours}
                        onChange={(event) =>
                            form.setData('lead_time_hours', event.target.value)
                        }
                        placeholder="e.g. 24"
                    />
                    <InputError message={form.errors.lead_time_hours} />
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <Label>Available branches</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select every branch where customers can receive this
                        service.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {branches.map((branch) => (
                        <label
                            key={branch.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/80 bg-card p-4 transition hover:border-primary/30"
                        >
                            <Checkbox
                                checked={form.data.branch_ids.includes(
                                    branch.id,
                                )}
                                onCheckedChange={(checked) =>
                                    toggleBranch(branch.id, checked === true)
                                }
                            />
                            <span className="text-sm font-medium">
                                {branch.name}
                            </span>
                            {branch.is_default && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                    Default
                                </span>
                            )}
                        </label>
                    ))}
                </div>
                <InputError message={form.errors.branch_ids} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer gap-3 rounded-xl border border-border/80 bg-card p-4">
                    <Checkbox
                        checked={form.data.is_active}
                        onCheckedChange={(checked) =>
                            form.setData('is_active', checked === true)
                        }
                    />
                    <span>
                        <span className="block text-sm font-semibold">
                            Active service
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            Available for internal workflows and customer
                            intake.
                        </span>
                    </span>
                </label>
                <label className="flex cursor-pointer gap-3 rounded-xl border border-border/80 bg-card p-4">
                    <Checkbox
                        checked={form.data.is_published}
                        onCheckedChange={(checked) =>
                            form.setData('is_published', checked === true)
                        }
                    />
                    <span>
                        <span className="block text-sm font-semibold">
                            Publish publicly
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            Ready for the future public service directory.
                        </span>
                    </span>
                </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                {isEditing && (
                    <Button type="button" variant="outline" asChild>
                        <a href="/organization/services">
                            <ArrowLeft className="size-4" /> Back
                        </a>
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={
                        form.processing || (!isEditing && services.length === 0)
                    }
                >
                    {form.processing ? (
                        <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4" />
                    )}
                    {isEditing ? 'Save changes' : 'Add service offering'}
                </Button>
            </div>
        </form>
    );
}
