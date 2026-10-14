import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    ClipboardCheck,
    Gauge,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';

const features = [
    {
        icon: Building2,
        title: 'Multi-branch operations',
        description: 'Keep every branch, service hour, and team accountable.',
    },
    {
        icon: ClipboardCheck,
        title: 'Structured service work',
        description: 'Move from customer intake to completion with clarity.',
    },
    {
        icon: Gauge,
        title: 'One operating view',
        description:
            'See the work, people, and performance that need attention.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Service Center Operations" />
            <div className="min-h-screen overflow-hidden bg-[#0c1a29] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(20,184,166,0.14),transparent_35%),radial-gradient(circle_at_10%_85%,rgba(59,130,246,0.09),transparent_30%)]" />
                <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
                    <header className="flex h-20 items-center justify-between border-b border-white/8">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-600 shadow-lg shadow-teal-950/40">
                                <AppLogoIcon className="size-6 fill-current" />
                            </div>
                            <div>
                                <p className="font-semibold tracking-tight">
                                    Service Center
                                </p>
                                <p className="text-[0.65rem] tracking-[0.14em] text-slate-400 uppercase">
                                    Operations suite
                                </p>
                            </div>
                        </div>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold transition hover:bg-teal-500"
                                >
                                    Open workspace{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-teal-950/30 transition hover:bg-teal-500"
                                    >
                                        Create account
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="grid flex-1 items-center gap-16 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                        <section>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/8 px-3 py-1.5 text-xs font-semibold text-teal-200">
                                <ShieldCheck className="size-3.5" />
                                Built for modern service businesses
                            </div>
                            <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
                                Run every service center with{' '}
                                <span className="text-teal-300">
                                    confidence.
                                </span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                                One professional workspace for branches, service
                                operations, customers, inventory, teams, and
                                business performance.
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-500 px-6 text-sm font-semibold text-slate-950 shadow-xl shadow-teal-950/30 transition hover:-translate-y-0.5 hover:bg-teal-400"
                                >
                                    {auth.user
                                        ? 'Open workspace'
                                        : 'Access your workspace'}
                                    <ArrowRight className="size-4" />
                                </Link>
                                <span className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-slate-300">
                                    <Wrench className="size-4 text-teal-300" />
                                    Designed for daily operations
                                </span>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                            <div className="rounded-2xl border border-white/8 bg-[#122538] p-6 md:p-8">
                                <div className="mb-7 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Operations overview
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Everything important, in one place
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                        <span className="size-1.5 rounded-full bg-emerald-300" />{' '}
                                        Live
                                    </span>
                                </div>
                                <div className="grid gap-3">
                                    {features.map((feature) => (
                                        <div
                                            key={feature.title}
                                            className="flex gap-4 rounded-2xl border border-white/7 bg-white/[0.035] p-4"
                                        >
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                                                <feature.icon className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {feature.title}
                                                </p>
                                                <p className="mt-1 text-sm leading-5 text-slate-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
