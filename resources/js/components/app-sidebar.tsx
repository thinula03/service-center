import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Gauge,
    LayoutGrid,
    ListChecks,
    ContactRound,
    ClipboardPlus,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Organization',
        href: '/organization/setup',
        icon: Building2,
    },
    {
        title: 'Services',
        href: '/organization/services',
        icon: ListChecks,
    },
    {
        title: 'Customers',
        href: '/organization/customers',
        icon: ContactRound,
    },
    {
        title: 'Requests',
        href: '/organization/requests',
        icon: ClipboardPlus,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props;
    const navItems = auth.user.is_system_admin
        ? [
              { title: 'Overview', href: '/admin', icon: Gauge },
              {
                  title: 'Organizations',
                  href: '/admin/organizations',
                  icon: Building2,
              },
              { title: 'Users', href: '/admin/users', icon: Users },
              {
                  title: 'Service catalogue',
                  href: '/admin/services',
                  icon: Wrench,
              },
          ]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-none">
            <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-5">
                <NavMain
                    items={navItems}
                    label={
                        auth.user.is_system_admin
                            ? 'Platform management'
                            : 'Service center'
                    }
                />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-3">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
