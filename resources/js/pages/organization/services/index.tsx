import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Clock3,
    Eye,
    Pencil,
    Plus,
    Tag,
    Trash2,
} from 'lucide-react';
import {
    BranchOption,
    OrganizationServiceForm,
    ServiceOption,
} from '@/components/organization-service-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Offering = {
    id: number;
    service_definition_id: number;
    name: string;
    category: string;
    description: string | null;
    pricing_model: string;
    price_amount: string | null;
    currency_code: string;
    duration_minutes: number | null;
    booking_mode: string;
    lead_time_hours: number | null;
    is_active: boolean;
    is_published: boolean;
    branches: Array<{ id: number; name: string }>;
};

type Props = {
    organization: { name: string };
    branches: BranchOption[];
    availableServices: ServiceOption[];
    offerings: Offering[];
};

const pricingLabel = (offering: Offering) => {
    if (offering.pricing_model === 'quotation') return 'Quotation only';
    const amount = Number(offering.price_amount ?? 0).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
    });
    if (offering.pricing_model === 'starting_from') return `From LKR ${amount}`;
    if (offering.pricing_model === 'hourly') return `LKR ${amount} / hour`;
    return `LKR ${amount}`;
};

export default function OrganizationServicesIndex({
    organization,
    branches,
    availableServices,
    offerings,
}: Props) {
    const remove = (offering: Offering) => {
        if (
            window.confirm(
                `Remove ${offering.name} from your service offerings?`,
            )
        ) {
            router.delete(`/organization/services/${offering.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Organization services" />
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-7 p-4 md:p-8 lg:p-10">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-semibold text-primary">
                            {organization.name}
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em]">
                            Service offerings
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Turn standardized platform services into services
                            your branches can price, schedule, and publish.
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="w-fit rounded-full px-3 py-1.5"
                    >
                        {offerings.length} configured
                    </Badge>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-4">
                        {offerings.length === 0 && (
                            <Card className="border-dashed py-12 text-center">
                                <CardContent>
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Plus className="size-5" />
                                    </div>
                                    <h2 className="mt-4 font-semibold">
                                        No services configured yet
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        Choose a platform service and configure
                                        how your branches deliver it.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {offerings.map((offering) => (
                            <Card
                                key={offering.id}
                                className="gap-4 overflow-hidden"
                            >
                                <CardHeader className="flex-row items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                {offering.category}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    offering.is_active
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                className="rounded-full"
                                            >
                                                {offering.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                            {offering.is_published && (
                                                <Badge className="rounded-full bg-emerald-600 hover:bg-emerald-600">
                                                    <Eye className="mr-1 size-3" />{' '}
                                                    Published
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl">
                                            {offering.name}
                                        </CardTitle>
                                        <CardDescription className="mt-2 max-w-2xl leading-6">
                                            {offering.description ||
                                                'No customer-facing description has been added.'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/organization/services/${offering.id}/edit`}
                                            >
                                                <Pencil className="size-4" />
                                                <span className="sr-only">
                                                    Edit {offering.name}
                                                </span>
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => remove(offering)}
                                        >
                                            <Trash2 className="size-4" />
                                            <span className="sr-only">
                                                Remove {offering.name}
                                            </span>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-3 border-t border-border/70 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Tag className="size-4 text-primary" />
                                        <span>{pricingLabel(offering)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock3 className="size-4 text-primary" />
                                        <span>
                                            {offering.duration_minutes
                                                ? `${offering.duration_minutes} min`
                                                : 'Duration not set'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="size-4 text-primary" />
                                        <span>
                                            {offering.branches.length}{' '}
                                            {offering.branches.length === 1
                                                ? 'branch'
                                                : 'branches'}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground capitalize">
                                        {offering.booking_mode === 'direct'
                                            ? 'Direct booking'
                                            : 'Quotation request'}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="h-fit xl:sticky xl:top-24">
                        <CardHeader>
                            <CardTitle>Add a service</CardTitle>
                            <CardDescription>
                                Configure an active service from the platform
                                catalogue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {availableServices.length > 0 ? (
                                <OrganizationServiceForm
                                    branches={branches}
                                    services={availableServices}
                                />
                            ) : (
                                <div className="rounded-2xl border border-dashed p-6 text-center text-sm leading-6 text-muted-foreground">
                                    Every active platform service is already
                                    configured for this organization.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

OrganizationServicesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Services', href: '/organization/services' },
    ],
};
