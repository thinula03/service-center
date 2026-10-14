import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-black/15">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold tracking-tight text-white">
                    {name}
                </span>
                <span className="truncate text-[0.65rem] font-medium tracking-[0.12em] text-sidebar-foreground/45 uppercase">
                    Operations suite
                </span>
            </div>
        </>
    );
}
