import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl transition-[width,height] ease-linear md:px-8">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 rounded-lg border border-border/70 bg-card shadow-xs" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {auth.user.is_system_admin && (
                <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary sm:flex">
                    <ShieldCheck className="size-3.5" />
                    System administrator
                </div>
            )}
        </header>
    );
}
import { usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
