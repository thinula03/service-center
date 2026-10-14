# Service Center Platform

Service Center is a multi-organization platform for service businesses, initially focused on vehicle service centers. It combines organization and branch management, service operations, a public service directory, a marketplace, and back-office capabilities in one system.

The application is being developed as a modular Laravel monolith using a domain-based, layered architecture. Laravel owns routing, authentication, authorization, validation, persistence, queues, and server-side workflows. React is delivered through Inertia.js, avoiding a separate API for the main web application while retaining a modern single-page experience.

> Development status: foundation, system administration, organization/branch administration, and the platform service catalogue are implemented. Operational and public modules are planned. See [PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) for the complete status matrix.

## Product vision

The completed platform is intended to serve four connected audiences:

1. **System administrators** govern the platform, organizations, users, service taxonomy, safety, and auditability.
2. **Organization owners and staff** operate one or more service-center branches, employees, services, jobs, inventory, procurement, and finances.
3. **Customers** maintain profiles and vehicles, discover services, request quotations or bookings, follow jobs, and submit reviews.
4. **Partners** such as leasing companies participate in eligible marketplace or service transactions with commission tracking.

The planned end-to-end service journey is:

```text
Customer discovery
    -> service or quotation request
    -> vehicle and customer intake
    -> inspection and estimate
    -> customer approval
    -> work order and assignment
    -> parts and labour consumption
    -> quality check
    -> invoice and payment
    -> delivery and verified review
```

## Current capabilities

- Secure account registration, authentication, email verification, password recovery, passkeys, and two-factor authentication.
- Active/suspended account enforcement.
- Protected system-administrator area.
- Platform dashboard with organization, branch, and user counts.
- Organization search, detail management, suspension, and reactivation.
- Multi-branch organization model with one protected default branch.
- Branch contact details, location, timezone, activation, and seven-day service hours.
- Organization membership roles at the data-model level.
- User directory with status management and self-suspension protection.
- Audited administrator actions.
- Standardized service categories and service definitions.
- Quotation or direct-booking intake modes and vehicle-required rules.
- Responsive professional operations interface with a navy/teal visual system, role-aware navigation, polished Shadcn/Radix components, and light, dark, and system appearance modes.

## Technology stack

### Backend

- PHP 8.3 or newer
- Laravel 13
- Laravel Fortify for authentication features
- Inertia Laravel 3
- Eloquent ORM
- Laravel database queues, cache, and sessions in the default local configuration
- PHPUnit 12
- Larastan/PHPStan and Laravel Pint

### Frontend

- Node.js 22.18 or newer
- React 19
- TypeScript 5
- Inertia.js 3
- Tailwind CSS 4
- Shadcn-style components using Radix UI primitives
- Lucide icons
- Vite Plus/Vite 8 build tooling
- Laravel Wayfinder for typed route resources

### Persistence and infrastructure

- SQLite is configured for zero-dependency local development.
- PostgreSQL is recommended for production; MySQL is also supported by Laravel.
- Database-backed sessions, cache, and queues work locally without Redis.
- Redis is recommended when production scale justifies dedicated cache and queue infrastructure.
- Local private file storage is the default. Production object storage can be configured through Laravel's filesystem abstraction.

## Repository structure

```text
app/
├── Domains/
│   ├── Administration/
│   ├── Organizations/
│   └── Services/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
└── Models/

resources/js/
├── components/
│   └── ui/
├── layouts/
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── organizations/
│   └── settings/
└── types/

database/
├── factories/
├── migrations/
└── seeders/

docs/
├── ARCHITECTURE.md
├── HANDOFF.md
└── PROJECT_PROGRESS.md
```

New contributors and AI agents should begin with [HANDOFF.md](docs/HANDOFF.md), then read [ARCHITECTURE.md](docs/ARCHITECTURE.md) and [PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md). Repository-wide working and documentation rules are in [AGENTS.md](AGENTS.md).

## Prerequisites

Install the following before setting up the project:

- PHP 8.3+
- Composer 2
- Node.js 22.18+
- npm 10+
- SQLite for the default setup, or PostgreSQL/MySQL for an alternative database

Useful version checks:

```bash
php --version
composer --version
node --version
npm --version
```

The repository includes `.nvmrc`, so users of `nvm` can activate the expected Node major version with:

```bash
nvm install
nvm use
```

## Setup from scratch

### 1. Get the source

```bash
git clone <repository-url> service-center
cd service-center
```

If the source already exists locally, open a terminal in the project directory instead.

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Create the environment file

```bash
cp .env.example .env
php artisan key:generate
```

Keep `APP_ENV=local` and `APP_DEBUG=true` only on a development machine.

### 4. Configure the database

#### SQLite—the simplest local option

The example environment already uses SQLite:

```dotenv
DB_CONNECTION=sqlite
```

Create the database file:

```bash
touch database/database.sqlite
```

#### PostgreSQL option

Create a database and update `.env`:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=service_center
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

#### MySQL option

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=service_center
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Run migrations

```bash
php artisan migrate
```

This creates authentication, sessions, queues, organizations, branches, administrator activity logs, and service-catalogue tables.

### 6. Install frontend dependencies

```bash
npm install
```

### 7. Build frontend assets

```bash
npm run build
```

### 8. Start development services

The combined development command runs the Laravel server, queue worker, log viewer, and frontend development server:

```bash
composer run dev
```

Open [http://localhost:8000](http://localhost:8000).

Alternatively, run individual processes:

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

## Development demo accounts

The local demo seeder creates two deliberately separate identities. Authentication uses the email address as the username.

| Role                              | Email / username            | Password   | Default area |
| --------------------------------- | --------------------------- | ---------- | ------------ |
| Platform system administrator     | `admin@service-center.test` | `password` | `/admin`     |
| Service-center organization owner | `owner@service-center.test` | `password` | `/dashboard` |

Create or refresh the demo environment with:

```bash
php artisan db:seed --class=Database\Seeders\DemoEnvironmentSeeder
```

The platform administrator is not a member of the demo service center. The organization owner belongs to Demo Service Center with the `owner` role and is not a system administrator. The seeder is idempotent and refuses to run in production.

These credentials are intentionally documented for local development and demonstrations only. Never use these passwords or seed these accounts in a shared, staging, or production environment.

## Creating the first system administrator

Public registration creates a normal verified user, not a system administrator. Promote the first trusted user locally after registration:

```bash
php artisan tinker
```

Then run inside Tinker:

```php
$user = App\Models\User::where('email', 'admin@example.com')->firstOrFail();
$user->forceFill([
    'is_system_admin' => true,
    'status' => 'active',
    'email_verified_at' => now(),
])->save();
```

Exit Tinker and sign in. Visiting `/dashboard` redirects system administrators to `/admin`.

For non-demo environments, do not expose an unauthenticated “make me an administrator” endpoint. Create named accounts through a controlled operational process and use unique, securely delivered passwords.

## Email in local development

The default mailer is `log`. Verification and password-reset messages are written to:

```text
storage/logs/laravel.log
```

Configure SMTP or another Laravel-supported mail provider in `.env` when real delivery is required.

## Common commands

```bash
# Database
php artisan migrate
php artisan migrate:status

# Application
php artisan route:list --except-vendor
php artisan optimize:clear

# Frontend
npm run dev
npm run build
npm run check
npm run check:fix
npm run types:check

# Backend quality
composer test
vendor/bin/pint --test
vendor/bin/phpstan analyse

# Full relevant verification
npm run check
npm run types:check
npm run build
php artisan test --compact
npm audit --omit=dev
```

## Testing

The current suite covers authentication, profile/security settings, organization onboarding, tenant access boundaries, administrator authorization, organization and branch management, default-branch protection, audit logging, and service-catalogue management.

Run it with:

```bash
php artisan test
```

At the time this document was updated, the complete suite contained 57 passing tests and 194 assertions. Treat that count as a snapshot; the authoritative result is always the current test run.

## Production preparation

Before production deployment:

1. Set `APP_ENV=production`, `APP_DEBUG=false`, and the correct HTTPS `APP_URL`.
2. Generate and securely retain a unique `APP_KEY`.
3. Use PostgreSQL or MySQL with automated backups.
4. Configure a real mail provider.
5. Configure private object storage for confidential documents and job attachments.
6. Run queue workers under a process supervisor.
7. Set secure session cookies and trusted proxy/host rules.
8. Configure logging, monitoring, exception reporting, and backup alerts.
9. Run `php artisan migrate --force` through a controlled deployment process.
10. Build immutable frontend assets with `npm ci && npm run build`.
11. Run the complete test, static-analysis, lint, and security checks.
12. Create the first system administrator through a secure operational procedure.

Production deployment has not yet been configured or verified.

## Documentation

- [HANDOFF.md](docs/HANDOFF.md): exact current stopping point, access model, important code entry points, verification state, known limitations, and where to continue.
- [ARCHITECTURE.md](docs/ARCHITECTURE.md): product model, domains, technical boundaries, data ownership, security, and target workflows.
- [PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md): implemented, partial, planned, and clarification-required capabilities across the full platform.
- [AGENTS.md](AGENTS.md): mandatory working agreement, including documentation synchronization after every application or requirement change.

Documentation is part of the definition of done. Every change must review and update the progress record and any affected setup, handoff, architecture, or technology documentation. Planned functionality must never be described as implemented.

## Important requirement boundaries

- “Jobs” is currently interpreted as service work orders. Recruitment vacancies are not confirmed.
- “Carrier/Carier” from the supplied notes remains unclear and has not been implemented.
- Marketplace checkout, online payments, full double-entry accounting, payroll, and leasing commission rules require further product decisions.
- Planned capabilities in the documentation are not claims that working software already exists.
