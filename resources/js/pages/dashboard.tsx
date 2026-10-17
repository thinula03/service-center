import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CarFront,
    ClipboardList,
    Package,
    ShoppingBag,
    Wrench,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

type Props = {
    organization: {
        name: string;
        slug: string;
        branches_count: number;
    };
};

const modules = [
    {
        title: 'Customers & vehicles',
        description: 'Customer records and registered vehicles',
        icon: CarFront,
        status: 'Available',
    },
    {
        title: 'Service jobs',
        description: 'Estimates, work orders, and job progress',
        icon: Wrench,
        status: 'Next',
    },
    {
        title: 'Inventory',
        description: 'Parts, stock movements, and low-stock alerts',
        icon: Package,
        status: 'Planned',
    },
    {
        title: 'Marketplace',
        description: 'Public product and item listings',
        icon: ShoppingBag,
        status: 'Planned',
    },
];

export default function Dashboard({ organization }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto flex h-full w-full max-w-[1440px] flex-1 flex-col gap-7 overflow-x-auto p-4 md:p-8 lg:p-10">
                <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#102338_0%,#15364a_62%,#0e766e_145%)] px-6 py-8 text-white shadow-xl shadow-slate-900/8 md:px-8 md:py-10">
                    <div className="absolute -top-24 -right-12 size-72 rounded-full bg-teal-300/10 blur-2xl" />
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold text-teal-200">
                                Organization overview
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">
                                {organization.name}
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                                Your service center workspace is ready. Build
                                your service catalogue and prepare the team for
                                daily operations.
                            </p>
                        </div>
                        <div className="flex w-fit items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-100">
                            <span className="size-2 rounded-full bg-emerald-300" />
                            Foundation ready
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card className="gap-4">
                        <CardHeader className="pb-2">
                            <CardDescription>Organization</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Building2 className="size-5 text-primary" />
                                {organization.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Public slug: {organization.slug}
                        </CardContent>
                    </Card>
                    <Card className="gap-4">
                        <CardHeader className="pb-2">
                            <CardDescription>Active branches</CardDescription>
                            <CardTitle className="text-3xl">
                                {organization.branches_count}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Default branch created during setup
                        </CardContent>
                    </Card>
                    <Card className="gap-4">
                        <CardHeader className="pb-2">
                            <CardDescription>Open service jobs</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-3xl">
                                <ClipboardList className="size-5 text-muted-foreground" />
                                0
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Requests and estimates are the next milestone
                        </CardContent>
                    </Card>
                </div>

                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Workspace modules
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            The platform is organized into independent business
                            domains.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {modules.map((module) => (
                            <Card
                                key={module.title}
                                className="group gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-slate-900/5"
                            >
                                <CardHeader>
                                    <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                                        <module.icon className="size-5" />
                                    </div>
                                    <CardTitle className="text-base">
                                        {module.title}
                                    </CardTitle>
                                    <CardDescription className="min-h-10">
                                        {module.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        {module.status}
                                    </Badge>
                                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
