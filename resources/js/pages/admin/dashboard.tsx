import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    Building2,
    CircleCheck,
    GitBranch,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Props = {
    metrics: {
        organizations: number;
        activeOrganizations: number;
        branches: number;
        users: number;
    };
    recentOrganizations: Array<{
        id: number;
        name: string;
        slug: string;
        status: string;
        branches_count: number;
        users_count: number;
        created_at: string;
    }>;
    recentActivity: Array<{
        id: number;
        action: string;
        actor: string | null;
        created_at: string | null;
    }>;
};

export default function AdminDashboard({
    metrics,
    recentOrganizations,
    recentActivity,
}: Props) {
    const cards = [
        {
            label: 'Organizations',
            value: metrics.organizations,
            note: `${metrics.activeOrganizations} active`,
            icon: Building2,
            tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        },
        {
            label: 'Branches',
            value: metrics.branches,
            note: 'Across the platform',
            icon: GitBranch,
            tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        },
        {
            label: 'Registered users',
            value: metrics.users,
            note: 'All account types',
            icon: Users,
            tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Platform health',
            value: 'Operational',
            note: 'Foundation services online',
            icon: ShieldCheck,
            tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
    ];

    return (
        <>
            <Head title="System administration" />
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-7 p-4 md:p-8 lg:p-10">
                <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#102338_0%,#15364a_58%,#0e766e_140%)] px-6 py-7 text-white shadow-xl shadow-slate-900/8 md:px-8 md:py-9">
                    <div className="absolute -top-24 -right-16 size-72 rounded-full bg-teal-300/10 blur-2xl" />
                    <div className="absolute -bottom-36 left-1/3 size-72 rounded-full bg-blue-300/8 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-semibold text-teal-100">
                                <ShieldCheck className="size-3.5" />
                                Secure platform control
                            </div>
                            <p className="text-sm font-medium text-teal-200">
                                System administration workspace
                            </p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">
                                Platform overview
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                                A clear view of every organization, user
                                account, and important platform-level change.
                            </p>
                        </div>
                        <div className="flex w-fit items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-100 backdrop-blur-sm">
                            <span className="relative flex size-2.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-50" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-300" />
                            </span>
                            Platform operational
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <Card
                            key={card.label}
                            className="group gap-4 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-900/5"
                        >
                            <CardHeader className="flex flex-row items-start justify-between pb-0">
                                <div>
                                    <CardDescription className="font-medium">
                                        {card.label}
                                    </CardDescription>
                                    <CardTitle className="mt-2.5 text-3xl tracking-[-0.03em]">
                                        {card.value}
                                    </CardTitle>
                                </div>
                                <div
                                    className={`rounded-2xl p-3 transition-transform duration-200 group-hover:scale-105 ${card.tone}`}
                                >
                                    <card.icon className="size-5" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CircleCheck className="size-3.5 text-primary" />
                                <span>{card.note}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex-row items-center justify-between border-b border-border/70 pb-5">
                            <div>
                                <CardTitle className="text-lg">
                                    Recent organizations
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Latest businesses joining the platform.
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="rounded-lg"
                            >
                                <Link href="/admin/organizations">
                                    View all{' '}
                                    <ArrowUpRight className="size-3.5" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recentOrganizations.length === 0 && (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No organizations yet.
                                </p>
                            )}
                            {recentOrganizations.map((organization) => (
                                <div
                                    key={organization.id}
                                    className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent bg-muted/45 p-4 transition-colors hover:border-primary/15 hover:bg-accent/45"
                                >
                                    <div className="flex min-w-0 items-center gap-3.5">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border/70">
                                            <Building2 className="size-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold">
                                                {organization.name}
                                            </p>
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                {organization.branches_count}{' '}
                                                branches ·{' '}
                                                {organization.users_count}{' '}
                                                members
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            organization.status === 'active'
                                                ? 'secondary'
                                                : 'destructive'
                                        }
                                    >
                                        {organization.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/70 pb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                    <Activity className="size-4" />
                                </div>
                                <CardTitle className="text-lg">
                                    Activity
                                </CardTitle>
                            </div>
                            <CardDescription className="mt-1">
                                Recent platform-level changes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.length === 0 && (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No administrative changes recorded.
                                </p>
                            )}
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="relative border-l border-border pl-5 before:absolute before:top-1 before:-left-[4.5px] before:size-2 before:rounded-full before:bg-primary before:ring-4 before:ring-primary/10"
                                >
                                    <p className="text-sm font-semibold capitalize">
                                        {activity.action.replaceAll('.', ' ')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.actor ?? 'System'} ·{' '}
                                        {activity.created_at}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'System administration', href: '/admin' }],
};
