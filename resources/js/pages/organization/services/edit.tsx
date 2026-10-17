import { Head } from '@inertiajs/react';
import {
    BranchOption,
    OfferingFormValue,
    OrganizationServiceForm,
} from '@/components/organization-service-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Offering = Omit<
    OfferingFormValue,
    | 'description'
    | 'price_amount'
    | 'duration_minutes'
    | 'lead_time_hours'
    | 'branch_ids'
> & {
    description: string | null;
    price_amount: string | null;
    duration_minutes: number | null;
    lead_time_hours: number | null;
    branches: Array<{ id: number; name: string }>;
};

type Props = {
    organization: { name: string };
    branches: BranchOption[];
    offering: Offering;
};

export default function EditOrganizationService({
    organization,
    branches,
    offering,
}: Props) {
    const formValue: OfferingFormValue = {
        ...offering,
        description: offering.description ?? '',
        price_amount: offering.price_amount ?? '',
        duration_minutes: offering.duration_minutes?.toString() ?? '',
        lead_time_hours: offering.lead_time_hours?.toString() ?? '',
        branch_ids: offering.branches.map((branch) => branch.id),
    };

    return (
        <>
            <Head title={`Edit ${offering.name}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-7 p-4 md:p-8 lg:p-10">
                <div>
                    <p className="text-sm font-semibold text-primary">
                        {organization.name}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em]">
                        Edit service offering
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Update pricing, customer intake, branch availability,
                        and publication readiness.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Offering configuration</CardTitle>
                        <CardDescription>
                            Changes apply only to this organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrganizationServiceForm
                            branches={branches}
                            offering={formValue}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditOrganizationService.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Services', href: '/organization/services' },
        { title: 'Edit', href: '#' },
    ],
};
