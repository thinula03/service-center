# Service Center Platform Architecture

## 1. Purpose

Service Center is designed as a multi-organization operating platform and public discovery ecosystem for service businesses, initially vehicle service centers. It must support both internal business operations and public customer experiences without allowing one organization's data to cross into another organization's boundary.

The platform is intended to unify workflows that are often spread across spreadsheets, written books, messaging applications, and separate accounting or inventory tools.

## 2. Product scope

The complete product is expected to cover:

- Platform governance and system administration
- Organizations, branches, service hours, and membership
- Standardized platform service taxonomy
- Organization-specific service offerings and pricing
- Customers and vehicles
- Enquiries, bookings, quotation requests, and estimates
- Service jobs/work orders
- Technician assignment, labour, parts, progress, and quality checks
- Inventory and stock by branch
- Suppliers and procurement
- Invoicing, payments, expenses, and operational reporting
- Human-resource records and branch assignment
- Marketplace listings for physical items/products
- Leasing-company eligibility and commission tracking
- Public organization profiles, marketplace, and service directory
- Verified customer reviews and responses
- Customer profiles, saved vehicles, history, and saved listings
- Notifications and integrations

This is the target product architecture, not a statement that every module is currently implemented. Current status is maintained in [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md).

## 3. Architectural style

The system is a **modular monolith** using a **domain-based, layered architecture**.

A modular monolith is appropriate because:

- The workflows are highly transactional and share core concepts such as organizations, branches, users, customers, vehicles, jobs, invoices, and stock.
- A single deployable application is operationally simpler during early product growth.
- Laravel transactions can protect workflows that span several tables.
- Domain boundaries can remain explicit without premature distributed-system complexity.
- Individual domains can later be extracted behind stable contracts if scale or organizational ownership requires it.

The application must not become an unstructured monolith. Domain ownership, use-case actions, server-side authorization, and dependency direction remain mandatory.

## 4. Technology decisions

### Server

- **Laravel 13** provides routing, middleware, validation, authorization, ORM, queues, cache, notifications, filesystem abstraction, migrations, scheduling, and testing infrastructure.
- **PHP 8.3+** enables enums, typed properties, attributes, and modern language features.
- **Laravel Fortify** supplies authentication workflows without imposing a separate frontend.
- **Laravel Wayfinder** generates typed frontend route definitions.

### Web client

- **React 19** provides component-driven interactive interfaces.
- **TypeScript** protects page contracts and shared component APIs.
- **Inertia.js 3** connects Laravel routes/controllers directly to React pages. Internal screens remain server-routed and do not require a parallel REST API.
- **Tailwind CSS 4** provides design tokens and utility styling.
- **Shadcn-style components with Radix UI** provide accessible default interaction primitives while leaving source code fully owned by the project.
- **Lucide React** supplies a consistent icon system.

### Interface design system

- The product uses a professional operations-oriented visual language rather than the unmodified Laravel starter appearance.
- Deep navy identifies navigation and high-level workspace surfaces; teal identifies primary actions, active navigation, healthy status, and key emphasis.
- Cool neutral backgrounds separate working surfaces without relying on heavy borders.
- Cards use restrained radius and elevation, compact information hierarchy, and semantic icon treatments.
- Platform-administrator and organization-owner experiences share one component system while remaining clearly identified through labels, navigation, and content.
- Responsive behavior must account for the reduced content width created by the desktop sidebar; grid breakpoints should be chosen using available content width rather than viewport width alone.
- Light, dark, and system preferences remain supported through semantic color tokens.
- New screens should compose existing Shadcn/Radix primitives and semantic tokens instead of adding isolated visual conventions.

### Data and operations

- **SQLite** is the default local-development database.
- **PostgreSQL** is the recommended production relational database; MySQL is an acceptable alternative.
- **Database queues/cache/sessions** minimize local dependencies.
- **Redis** can replace database cache and queues in production when throughput warrants it.
- **Private object storage** is planned for listing images, job evidence, invoices, and organization documents.

## 5. Layer model

Each business domain may contain the following layers:

```text
app/Domains/<Domain>/
├── Domain/
│   ├── Entities/
│   ├── Enums/
│   ├── Events/
│   ├── Policies/
│   ├── Services/
│   └── ValueObjects/
├── Application/
│   ├── Actions/
│   ├── Commands/
│   ├── DTOs/
│   ├── Listeners/
│   └── Queries/
└── Infrastructure/
    ├── Integrations/
    ├── Models/
    └── Repositories/
```

Not every domain needs every folder. Empty architectural ceremony should not be created before behavior exists.

### Domain layer

Owns business language and rules that should remain meaningful without HTTP, React, or a particular database.

Examples:

- Organization status
- Membership role
- Work-order state transitions
- Estimate approval rules
- Stock movement types
- Invoice/payment state

### Application layer

Owns use cases and transaction coordination.

Examples:

- Create an organization and default branch atomically
- Convert an approved estimate into a work order
- Reserve or consume inventory for a job
- Complete a job and issue an invoice
- Record a platform administrator action

An application action may depend on domain contracts and infrastructure implementations. React components and controllers must not contain core business workflows.

### Infrastructure layer

Owns technical persistence and external integrations.

Examples:

- Eloquent models
- Repository implementations where abstraction provides value
- Email, SMS, WhatsApp, payment, storage, and accounting integrations

### Presentation layer

Consists of:

- Laravel routes
- Middleware
- Form requests
- Thin controllers
- Inertia responses
- React pages and components

Controllers should validate/authorize the request, invoke an application action or focused query, and return a response. React pages should manage presentation and interaction state—not authoritative business rules.

## 6. Current domain organization

### Administration

Implemented responsibilities:

- System-administrator access boundary
- Platform overview metrics
- User and organization status control
- Administrator activity recording

### Organizations

Implemented responsibilities:

- Organization creation
- Owner membership
- Branches and default branch
- Contact/location information
- Service hours
- Organization and branch status

### Services

Implemented responsibilities:

- Platform service categories
- Standardized service definitions
- Booking/quotation intake mode
- Vehicle-required rule
- Activation status

### Future domains

- Identity and access expansion
- Organization service offerings
- Customers
- Vehicles
- Enquiries and bookings
- Estimates
- Work orders/jobs
- Inventory
- Procurement
- Human resources
- Accounting and payments
- Marketplace
- Leasing partnerships
- Reviews
- Notifications
- Reporting

## 7. Multi-organization data ownership

The primary isolation boundary is `organization_id`.

Rules:

1. Every operational record must belong directly or transitively to an organization.
2. Branch-specific records must also carry or resolve a `branch_id`.
3. A user may belong to multiple organizations, with a role per membership.
4. A user's membership in organization A never grants access to organization B.
5. Route-model binding alone is insufficient for nested resources. The application must verify that the nested resource belongs to the parent organization.
6. Frontend visibility is not authorization. All sensitive actions require server-side policy or middleware enforcement.
7. System administrators are platform operators, not automatic business staff. Any future tenant impersonation must be explicit, time-limited, visible, and audited.

The existing branch administrator flow explicitly rejects attempts to manage a branch through another organization.

## 8. Identity and roles

### Platform role

- System administrator

This role can access platform-wide routes and currently manage organizations, branches, users, and the standardized service catalogue.

### Organization membership roles

Existing role vocabulary:

- Owner
- Administrator
- Branch manager
- Staff

Planned specialized permissions may cover:

- Service advisor
- Technician
- Inventory officer
- Procurement officer
- Accountant
- HR manager
- Leasing partner representative

Role names alone should not become authorization logic scattered throughout controllers. As operational modules are added, permissions should be centralized through Laravel policies or a dedicated permission model.

## 9. Principal data model

### Implemented tables

- `users`
- `passkeys`
- `organizations`
- `organization_user`
- `branches`
- `admin_activity_logs`
- `service_categories`
- `service_definitions`
- Laravel session, cache, job, and password-reset tables

### Planned core tables

The final names may change as workflows are modeled.

- `organization_service_offerings`
- `branch_service_offering`
- `customers`
- `customer_addresses`
- `vehicles`
- `service_requests`
- `bookings`
- `inspections`
- `estimates`
- `estimate_items`
- `work_orders`
- `work_order_status_history`
- `work_order_assignments`
- `work_order_labour`
- `work_order_parts`
- `quality_checks`
- `inventory_items`
- `branch_stock`
- `stock_movements`
- `suppliers`
- `purchase_requests`
- `purchase_orders`
- `goods_receipts`
- `invoices`
- `invoice_items`
- `payments`
- `expenses`
- `employees`
- `attendance_records`
- `leave_requests`
- `marketplace_listings`
- `listing_images`
- `leasing_companies`
- `commission_rules`
- `commission_entries`
- `reviews`
- `review_responses`
- `notifications`

## 10. Target workflows

### Organization onboarding

```text
Register and verify user
    -> create organization
    -> assign owner membership
    -> create default branch
    -> configure branch details and hours
    -> choose standardized services
    -> configure branch prices and availability
    -> publish organization profile
```

The first four steps are implemented. Service selection, pricing, availability, and public publication are not implemented.

### Service catalogue and organization offering

```text
System administrator defines category and service
    -> organization opts into service
    -> organization defines description and pricing policy
    -> branches enable availability, duration, staff, and schedule
    -> offering becomes discoverable publicly
```

Only the platform definition stage is implemented.

### Service request to completion

```text
Customer selects service and vehicle
    -> request quotation or direct booking
    -> branch reviews intake
    -> inspection and estimate
    -> customer approval/rejection
    -> work order creation
    -> technician and bay assignment
    -> labour and parts tracking
    -> quality check
    -> invoice and payment
    -> vehicle delivery
    -> verified review
```

This workflow is planned and not currently implemented.

### Procurement and stock

```text
Low stock or manual need
    -> purchase request
    -> approval
    -> purchase order
    -> goods receipt
    -> branch stock increase
    -> supplier invoice/payment tracking
```

This workflow is planned and not currently implemented.

### Marketplace

```text
Organization creates product listing
    -> approval/publication rules
    -> customer discovery
    -> enquiry, reservation, or checkout
    -> optional leasing eligibility
    -> commission calculation and settlement
```

Checkout, payment, leasing, and commission rules require product clarification.

## 11. State and transaction rules

State-changing workflows should be explicit and append history where traceability matters.

Examples:

- Organization: `active`, `suspended`
- Account: `active`, `suspended`
- Branch: active/inactive plus exactly one default branch per active organization
- Service definition: active/inactive
- Future estimate: `draft`, `sent`, `approved`, `rejected`, `expired`
- Future work order: `received`, `inspecting`, `awaiting_approval`, `approved`, `in_progress`, `quality_check`, `ready_for_delivery`, `completed`, `cancelled`
- Future invoice: `draft`, `issued`, `partially_paid`, `paid`, `void`

Important multi-write workflows must use database transactions. Existing organization onboarding creates the organization, owner membership, and default branch atomically.

## 12. Auditability

The current `admin_activity_logs` table records:

- Actor
- Action name
- Polymorphic subject
- Structured metadata
- IP address
- Timestamp

Current audited actions include organization, branch, user, service-category, and service-definition changes.

Future audit requirements:

- Human-readable activity-log screen and filters
- Before/after values for critical fields
- Estimate approvals and overrides
- Work-order state changes
- Stock adjustments
- Purchase approvals
- Invoice/payment reversals
- Permission changes
- Export and sensitive-document access where appropriate

Audit records should be immutable to ordinary application users.

## 13. Security model

Current controls:

- Email verification
- Password hashing
- Password confirmation for sensitive settings
- Two-factor authentication
- Passkeys
- Active-account enforcement
- Dedicated system-administrator middleware
- Organization/branch relationship validation
- Form-request validation
- CSRF protection through Laravel web middleware
- Audit records for administrator mutations

Required future controls:

- Central policies for every operational domain
- Fine-grained organization permissions
- Rate limiting for public search, reviews, booking, and authentication endpoints
- Private signed downloads for confidential files
- Upload MIME/type/size validation and malware-scanning strategy
- Content security policy and production security headers
- Secret-management procedure
- Backup restoration testing
- Retention and privacy rules
- Payment-provider tokenization; raw card data must never be stored
- Security review before public release

## 14. Inertia and API strategy

Internal web pages use Laravel routes and Inertia responses. This keeps authorization, validation, and routing in one server application.

A versioned JSON API should be introduced only for concrete consumers such as:

- A future mobile application
- Partner/leasing integrations
- Public read-only search endpoints where JSON is operationally useful
- Webhooks

The API must reuse application actions and policies rather than reimplement business rules.

## 15. Frontend organization

```text
resources/js/
├── components/
│   ├── ui/              # reusable design primitives
│   └── *.tsx            # shared application components
├── hooks/
├── layouts/
├── lib/
├── pages/               # route-level Inertia pages
├── routes/              # generated Wayfinder resources
└── types/
```

Guidelines:

- Default to established Shadcn/Radix components.
- Keep forms accessible with explicit labels and server validation feedback.
- Do not embed authoritative permissions only in React.
- Keep page props focused and serializable.
- Extract repeated feature behavior when repetition appears; do not create speculative abstraction.
- Treat mobile usability as a core requirement for customer and field-staff flows.

## 16. Background work and integrations

Queues should handle operations that should not delay a request:

- Email/SMS/WhatsApp notifications
- Invoice and report generation
- Image processing
- Search indexing
- Imports and exports
- Integration synchronization

External providers should be placed behind replaceable application contracts. Credentials belong in server environment configuration, never source code or frontend bundles.

## 17. Search and public discovery

The public service directory and marketplace are planned to support filters such as:

- Location
- Service category
- Service
- Vehicle compatibility
- Opening status/hours
- Price or quotation requirement
- Rating
- Availability

Initial search can use relational database indexes and full-text capabilities. A separate search engine should be adopted only after real relevance or scale requirements are measured.

## 18. Notifications

The target event model includes:

- New quotation/booking request
- Estimate ready for approval
- Appointment reminder
- Job status change
- Vehicle ready for delivery
- Invoice issued or payment received
- Low stock
- Purchase approval required
- Review received

Channel preferences and consent must be respected. Notifications should be idempotent and retry-safe.

## 19. Reporting

Planned reports include:

- Jobs by status, branch, service, and technician
- Revenue and outstanding balances
- Labour and parts per work order
- Inventory valuation and movement
- Low stock and reorder needs
- Supplier purchasing
- Branch utilization and turnaround time
- Marketplace listing performance
- Leasing commission accrual and settlement
- Customer retention and review trends

Reports must be scoped to the viewer's organization and branch permissions.

## 20. Testing strategy

### Existing

- Feature tests for authentication and settings
- Organization onboarding tests
- System-administrator authorization tests
- Organization, user, and branch status tests
- Default-branch and cross-organization protection tests
- Audit-log assertions
- Service-catalogue validation and lifecycle tests
- TypeScript checking
- Frontend format/lint checking
- PHP formatting and static analysis
- Production asset build

### Required as modules grow

- Unit tests for domain state transitions and calculations
- Policy matrix tests for every role
- Transaction rollback tests
- Inventory concurrency tests
- Money/currency rounding tests
- Browser tests for critical journeys
- Accessibility checks
- Upload security tests
- Queue retry/idempotency tests
- Performance tests for search and reporting

## 21. Development sequence

Recommended order:

1. Foundation and identity — substantially implemented
2. System administration — initial implementation complete
3. Organizations, branches, and hours — initial implementation complete
4. Platform service catalogue — initial implementation complete
5. Organization service offerings, branch pricing, duration, and availability
6. Customers and vehicles
7. Enquiries, quotation requests, bookings, and estimates
8. Work orders, assignments, status history, labour, and quality checks
9. Inventory and job-part consumption
10. Invoicing, payments, expenses, and operational accounting
11. Procurement and suppliers
12. HRM
13. Public profiles and service directory
14. Reviews
15. Marketplace and leasing commission workflows
16. Notifications, integrations, reporting, and production hardening

## 22. Confirmations still required

- Whether “Jobs” includes recruitment vacancies or only service work orders
- Meaning of “Carrier/Carier” in the supplied notes
- Whether marketplace transactions stop at enquiry/reservation or include full checkout
- Online payment providers and supported payment methods
- Leasing-company commission formula, eligibility, invoicing, and settlement
- Full accounting versus operational invoicing/payments/expenses only
- HRM depth, especially payroll and statutory requirements
- Review eligibility and moderation policy
- Subscription/billing model for organizations
- Required notification channels
- Data-retention and privacy policies

These items must remain explicit questions until stakeholders confirm them.

## 23. Documentation as an architectural control

The documentation set is the durable project handoff and must evolve with the application:

- `README.md` owns product orientation, prerequisites, setup, demo access, commands, and the public summary of the current stack.
- `docs/HANDOFF.md` owns the exact current stopping point, code entry points, next recommended work, known limitations, and latest local verification.
- `docs/ARCHITECTURE.md` owns domain boundaries, dependency direction, data ownership, security rules, target workflows, and architectural decisions.
- `docs/PROJECT_PROGRESS.md` is the authoritative implementation-status matrix and dated development record.
- `AGENTS.md` defines the working agreement for developers and AI agents.

Every code, configuration, dependency, schema, UI, requirement, or scope change must include a documentation-impact review. The progress file must receive a dated change-log entry even when the other documents remain accurate. This prevents future contributors from confusing product intent with working software or continuing from a stale milestone.
