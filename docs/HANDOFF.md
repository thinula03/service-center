# Service Center Platform — Development Handoff

Last updated: 17 October 2026

## 1. Purpose of this document

This is the fastest reliable entry point for a new developer or AI agent. It explains what exists now, how the application is separated, where the important code lives, how to run and verify it, what remains incomplete, and what should be built next.

Read this together with:

- [`README.md`](../README.md) for setup, commands, credentials, and the high-level product.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) for architectural rules and the full target design.
- [`PROJECT_PROGRESS.md`](PROJECT_PROGRESS.md) for the authoritative feature-by-feature status.

## 2. Product in one paragraph

Service Center is a multi-organization operations and public-discovery platform, initially for vehicle service centers. The completed product is intended to connect platform administrators, service-center owners and staff, customers, and commercial partners. It will cover organizations and branches, standardized and organization-specific services, customers and vehicles, quotation/booking intake, estimates, service work orders, inventory, procurement, invoicing/payments, HRM, marketplace listings, leasing commissions, public discovery, reviews, customer profiles, notifications, reporting, and audit/support tools.

Only the foundation, initial system-administration area, organization/branch management, platform service catalogue, organization service offerings, and initial customer/vehicle registry are currently implemented. Do not infer that the remaining target modules exist.

## 3. Current stopping point

The project has completed the initial platform-administration foundation, organization service offerings, customer/vehicle registry, and the first safety-aware service-request intake workflow.

Working now:

- Laravel authentication and account-security flows.
- Active/suspended account enforcement.
- A dedicated `/admin` area protected by system-administrator middleware.
- Separate platform system-administrator and service-center owner identities.
- Platform dashboard metrics and recent activity.
- Organization search, detail, contact update, suspension, and reactivation.
- Branch creation/editing, status, default-branch protection, and weekly service hours.
- Platform user search and status management.
- Administrator activity recording.
- Platform service categories and standardized services.
- Organization opt-in to platform services.
- Organization-specific service descriptions, four pricing modes, duration, lead time, and customer-intake mode.
- Branch-level service availability, active status, and publication readiness.
- Owner/administrator authorization and cross-organization isolation for service offerings.
- Organization-scoped individual and business customers with contact/address data, notes, status, and search by identity, contact, or vehicle registration.
- Canonical vehicle profiles plus customer-owned vehicle records with normalized unique registrations, generation/series, trim, engine code, structural segment, powertrain/fuel, brake and suspension metadata, mileage, identifiers, and detail/creation screens.
- Visible high-voltage safety warnings for HEV/PHEV/BEV records; later work-order assignment must enforce EV-certified technicians rather than relying on the warning alone.
- Inventory taxonomy persistence for hierarchical functional categories, sourcing tiers, universal/vehicle-specific fitment, vehicle-profile mappings, alternate/interchange part numbers, core charges, hazmat flags, and disposal fees.
- Owner/administrator authorization and cross-organization isolation for customer and vehicle creation and viewing.
- Organization service-request creation and searchable intake queue linking an existing customer, that customer's vehicle, an active offered service, and an available branch.
- Offering-controlled quotation/direct-booking intake and server-side rejection of customer/vehicle mismatches or unavailable branch/service combinations.
- Immutable-at-intake safety snapshots for high voltage, electronic parking-brake retraction, and air-suspension lockout requirements.
- Organization onboarding with owner membership and a default branch.
- A cohesive responsive interface across the public entry page, authentication shell, system-administrator workspace, organization dashboard, navigation, cards, forms, and data screens.

The next recommended feature is **request detail, inspection, and estimates**. Add controlled request status transitions and an inspection record, then build versioned estimate headers/items and customer approval before any work-order conversion. The current intake is deliberately a queue and creation workflow, not a booking calendar or estimate system.

## 4. Identity and access model

There are two different administration concepts and they must remain separate:

### Platform system administrator

- Identified by `users.is_system_admin = true`.
- Uses `/admin`.
- Oversees organizations, branches, platform users, and the global service taxonomy.
- Does not automatically belong to any customer organization.
- Protected by the `system-admin` middleware alias registered in `bootstrap/app.php`.

### Organization owner/administrator

- Is a normal user associated through `organization_user`.
- Uses the organization-facing `/dashboard` area.
- Has a membership role such as `owner`, `administrator`, `branch_manager`, or `staff`.
- Does not receive platform-administrator privileges from an organization role.

The local demo seeder enforces this separation and is safe to rerun outside production.

## 5. Local demo accounts

Authentication uses email as the username.

| Role                          | Email                       | Password   | Start page   |
| ----------------------------- | --------------------------- | ---------- | ------------ |
| Platform system administrator | `admin@service-center.test` | `password` | `/admin`     |
| Demo Service Center owner     | `owner@service-center.test` | `password` | `/dashboard` |

These accounts are for local development only. `DemoEnvironmentSeeder` refuses to run in production.

## 6. Architecture at a glance

The application is a Laravel modular monolith using a domain-based, layered approach:

```text
Browser
  -> Laravel route and middleware
  -> Form Request validation/authorization
  -> thin controller
  -> application action or focused query
  -> domain/infrastructure model
  -> Inertia response
  -> React TypeScript page
```

Current backend domains:

- `Administration` — platform access, overview, user/organization control, audit records.
- `Organizations` — organizations, memberships, branches, status, and service hours.
- `Services` — global service categories, standardized service definitions, and organization service offerings.
- `Customers` — organization-scoped customers, vehicle assets, canonical vehicle profiles, safety classification, normalization, and creation actions.
- `Inventory` — parts taxonomy and compliance/fitment persistence foundation; no stock workflow or UI yet.
- `ServiceRequests` — organization-scoped intake records, safety snapshots, and request creation action.

The frontend uses React through Inertia, Tailwind CSS, and source-owned Shadcn-style components built on Radix UI. Internal application flows are server-routed; a separate REST API is not currently required.

The current visual direction is a restrained professional operations system: deep navy navigation and hero surfaces, teal as the primary action/status accent, cool neutral content backgrounds, high-contrast typography, rounded but compact controls, and restrained elevation. Preserve this direction when adding screens; avoid generic starter-kit layouts, excessive empty space, arbitrary accent colors, or introducing a second component language.

## 7. Important code entry points

### Routing and middleware

- `routes/web.php` — public/authenticated tenant entry points and dashboard.
- `routes/admin.php` — all platform-administration routes.
- `routes/settings.php` — account and security settings.
- `bootstrap/app.php` — route registration and middleware aliases.
- `app/Http/Middleware/EnsureActiveUser.php` — suspended-account boundary.
- `app/Http/Middleware/EnsureSystemAdministrator.php` — platform-admin boundary.

### Domain and persistence

- `app/Domains/Administration/` — activity action/model.
- `app/Domains/Organizations/` — organization action, enums, and models.
- `app/Domains/Services/` — service catalogue models.
- `app/Domains/Customers/` — customer and vehicle models plus creation actions.
- `app/Domains/Inventory/` — category, item, alternate part-number, compliance, and vehicle-profile fitment models.
- `app/Domains/ServiceRequests/` — service-request model and transactional creation action.
- `app/Http/Controllers/Organization/ServiceOfferingController.php` — tenant-scoped offering queries and HTTP workflow.
- `app/Http/Controllers/Organization/CustomerController.php` — tenant-scoped directory, customer detail, and customer/vehicle creation.
- `resources/js/pages/organization/services/` — owner-facing offering list, creation, and editing screens.
- `resources/js/pages/organization/customers/` — searchable directory, customer creation, detail, and vehicle registration screens.
- `resources/js/pages/organization/requests/` — searchable request queue and safety-aware intake form.
- `app/Models/User.php` — identity, platform flag, status, and organization relationship.
- `database/migrations/` — authoritative schema history.
- `database/seeders/DemoEnvironmentSeeder.php` — repeatable local data and separated accounts.

### HTTP and frontend

- `app/Http/Controllers/Admin/` — platform admin controllers.
- `app/Http/Requests/Admin/` — admin validation/authorization requests.
- `resources/js/pages/admin/` — platform-administration React pages.
- `resources/js/pages/organizations/` — organization onboarding pages.
- `resources/js/components/app-sidebar.tsx` — role-sensitive navigation.
- `resources/js/components/ui/` — shared Shadcn/Radix primitives.

### Verification

- `tests/Feature/Admin/` — system-admin and catalogue behavior.
- `tests/Feature/Organizations/` — onboarding and organization behavior.
- `tests/Feature/Organization/` — organization offering and customer/vehicle behavior.
- `tests/Feature/DemoEnvironmentSeederTest.php` — account separation and repeatable seeding.

## 8. Fresh local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
nvm install
nvm use
npm install
npm run build
composer run dev
```

The normal starter URL is `http://localhost:8000`. The current developer may use another local port, such as `8091`; the port is not an architectural requirement.

## 9. Verification commands

Use Node 22.18 or newer before frontend commands.

```bash
vendor/bin/pint --test
php artisan test --compact
npm run check
npm run types:check
npm run build
vendor/bin/phpstan analyse
npm audit --omit=dev
```

Last verified locally:

- 74 tests passed.
- 261 assertions passed.
- PHP formatting passed.
- Frontend formatting/lint passed.
- TypeScript checking passed.
- Production frontend build passed with Node 22.
- Production dependency audit previously reported zero vulnerabilities.
- The public entry page, platform administrator dashboard, and organization owner dashboard were visually inspected in the local browser after the interface redesign.
- The organization service-offering list/editor, customer/vehicle screens, and service-request queue/intake/safety presentation were visually inspected on localhost.
- PHPStan completes with a larger memory allowance but currently reports 56 project-wide typing findings; static analysis is configured but not yet clean.

This is local evidence, not proof of production deployment or live external integrations.

## 10. Database state currently represented

Implemented tables cover:

- Users, authentication/security fields, and platform access/status.
- Organizations and organization-user membership roles.
- Branches and JSON service hours.
- Administrator activity logs.
- Platform service categories.
- Platform service definitions.
- Organization service offerings and branch availability assignments.
- Customers and vehicles with enforced organization ownership.
- Canonical vehicle profiles.
- Inventory category, item, part-number, and vehicle-profile fitment foundations.
- Service requests linking organization, branch, customer, vehicle, and organization service offering.
- Framework sessions, cache, queues, and passkeys.

The demo dataset contains Demo Service Center, Colombo Main Branch, Vehicle Care, Cut and Polish, a published Demo Service Center offering, customer Nimal Perera, and a Toyota Prius XW50 HEV profile registered as CAA1234. Inventory taxonomy tables exist, but no demo inventory items or usable stock workflow exists. No booking, estimate, work-order, invoice, marketplace, review, or HR data model exists yet.

## 11. Rules for the next implementation

- Every organization-owned record must carry an enforceable organization boundary, directly or through a required parent.
- Never trust an organization or branch ID from the browser without scoping the query to the authorized organization.
- Keep controllers thin; place multi-step use cases in application actions.
- Use database transactions for workflows that must succeed atomically.
- Use server-side authorization even when the UI hides an action.
- Record sensitive platform-administrator actions.
- Use the established React/Inertia/Shadcn patterns instead of introducing a second frontend architecture.
- Add tests for authorization, cross-organization access, validation, success behavior, and important state rules.
- Update all affected documentation as part of the same change.

## 12. Known limitations and unresolved decisions

- Organization staff invitation and fine-grained permissions are not built.
- The organization-facing operational dashboard is still a foundation, not a complete management portal.
- Customer and vehicle creation/search exist, but editing, merging, files, ownership changes, consent management, and service history are not built.
- High-voltage classification and warning exist, but EV certification, bay/lift capability, digital-inspection switching, and technician-assignment enforcement await the work-order/HR modules.
- Inventory taxonomy persistence exists, but item-management screens, branch balances, movements, reservations, purchasing, invoice calculations, automated disposal fees, core-return settlement, and substitution recommendations are not built.
- Request creation and queueing exist, but request detail/status transitions, inspection, estimates, booking calendar/capacity, rescheduling, and customer approval do not.
- No work-order, operational inventory, accounting, procurement, HRM, marketplace, review, or notification workflow exists.
- Production hosting and external providers are not configured.
- “Jobs,” “Carrier/Carier,” marketplace checkout depth, leasing commission rules, accounting depth, payroll scope, review policy, subscriptions, and notification channels still require stakeholder confirmation.

Do not silently decide these unresolved product rules when they materially affect the data model or workflow.

## 13. Documentation maintenance rule

Documentation is part of completion, not a later cleanup task. After every prompt that changes the application or requirements, review and update:

1. `PROJECT_PROGRESS.md` — status, limitations, verification counts, and dated change log.
2. `HANDOFF.md` — present stopping point, next step, important files, and current verification.
3. `README.md` — setup, accounts, commands, capabilities, and stack changes.
4. `ARCHITECTURE.md` — domain, data, security, workflow, and architectural decisions.

The root `AGENTS.md` makes this rule visible to future developers and AI agents.
