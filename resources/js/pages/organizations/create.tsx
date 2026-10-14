import { Form, Head } from '@inertiajs/react';
import { Building2, Clock3, MapPin } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function CreateOrganization() {
    return (
        <>
            <Head title="Set up your organization" />
            <div className="mx-auto flex min-h-full w-full max-w-5xl items-center px-4 py-10">
                <div className="grid w-full gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <section className="flex flex-col justify-center">
                        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                            <Building2 className="size-6" />
                        </div>
                        <p className="mb-2 text-sm font-medium text-primary">
                            Getting started
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Create your service organization
                        </h1>
                        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                            Add the business and its first branch. You can
                            configure detailed service hours, staff, inventory,
                            and services next.
                        </p>
                        <div className="mt-8 space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <MapPin className="size-4 text-primary" />{' '}
                                Multi-branch ready from day one
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock3 className="size-4 text-primary" /> Sri
                                Lanka timezone and service-hour defaults
                            </div>
                        </div>
                    </section>

                    <Card className="border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Organization details</CardTitle>
                            <CardDescription>
                                Required fields are marked with an asterisk.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                action="/organizations"
                                method="post"
                                disableWhileProcessing
                                className="grid gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Organization name *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                autoFocus
                                                placeholder="e.g. Metro Auto Care"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Business email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">
                                                    Phone number
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+94 77 123 4567"
                                                />
                                                <InputError
                                                    message={errors.phone}
                                                />
                                            </div>
                                        </div>
                                        <div className="border-t pt-6">
                                            <h2 className="font-medium">
                                                First branch
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                This will be your default
                                                operating branch.
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="branch_name">
                                                Branch name *
                                            </Label>
                                            <Input
                                                id="branch_name"
                                                name="branch_name"
                                                required
                                                placeholder="Main branch"
                                            />
                                            <InputError
                                                message={errors.branch_name}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address_line_1">
                                                Address
                                            </Label>
                                            <Input
                                                id="address_line_1"
                                                name="address_line_1"
                                                placeholder="Street address"
                                            />
                                            <InputError
                                                message={errors.address_line_1}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                placeholder="Colombo"
                                            />
                                            <InputError message={errors.city} />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="mt-2 w-full"
                                        >
                                            {processing && <Spinner />}
                                            Create organization
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
