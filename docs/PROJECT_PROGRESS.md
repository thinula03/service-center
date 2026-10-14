# Service Center Platform Progress

Last updated: 14 October 2026

This document tracks the entire intended platform—not only the current development phase. It distinguishes working software from partial foundations, plans, and unresolved requirements.

For the exact current development handoff and code entry points, read [HANDOFF.md](HANDOFF.md). This file is the authoritative implementation-status record and must be updated after every prompt that changes application behavior, configuration, dependencies, requirements, or scope.

## Status definitions

| Status              | Meaning                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| Implemented         | Working code, route/UI, persistence where applicable, and automated verification exist. |
| Partial             | Some foundation or screens exist, but the end-to-end business workflow is incomplete.   |
| Not implemented     | No usable implementation exists yet.                                                    |
| Needs clarification | Stakeholder decisions are required before implementation can be considered complete.    |

## Executive progress summary

| Area                                | Status              | Summary                                                                                                                                                                       |
| ----------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Technical foundation                | Implemented         | Laravel/Inertia/React/Shadcn application, database, authentication, builds, tests, and domain structure are operational.                                                      |
| System administration               | Partial             | Dashboard, access boundary, organizations, users, branches, statuses, and service taxonomy exist. Administrator creation UI, full logs, settings, and support tooling remain. |
| Organizations and branches          | Partial             | Onboarding, membership foundation, branches, default branch, service hours, contact data, and admin oversight exist. Tenant self-management and invitation workflows remain.  |
| Service catalogue                   | Partial             | Platform taxonomy is implemented. Organization offerings, pricing, duration, availability, and public publication remain.                                                     |
| Customers and vehicles              | Not implemented     | Planned after organization offerings.                                                                                                                                         |
| Quotations, bookings, and estimates | Not implemented     | No intake or approval workflow exists.                                                                                                                                        |
| Service jobs/work orders            | Not implemented     | No operational job workflow exists.                                                                                                                                           |
| Inventory                           | Not implemented     | No catalogue, branch stock, or movements exist.                                                                                                                               |
| Procurement                         | Not implemented     | No supplier or purchasing workflow exists.                                                                                                                                    |
| Accounting and payments             | Not implemented     | No estimates, invoices, payments, expenses, or reports exist.                                                                                                                 |
| HRM                                 | Not implemented     | No employee, attendance, leave, or payroll workflows exist.                                                                                                                   |
| Marketplace                         | Not implemented     | No product listing or transaction workflow exists.                                                                                                                            |
| Leasing companies and commission    | Needs clarification | Mentioned requirement; commercial and settlement rules are undefined.                                                                                                         |
| Public service directory            | Not implemented     | Public organization/service discovery is planned.                                                                                                                             |
| Reviews                             | Not implemented     | Review eligibility and moderation require decisions.                                                                                                                          |
| Customer profile                    | Not implemented     | Saved vehicles, service history, bookings, reviews, and favorites are planned.                                                                                                |
| Notifications and integrations      | Not implemented     | Infrastructure supports queues, but product notifications/providers are not built.                                                                                            |
| Production deployment               | Not implemented     | Local development is verified; production hosting is not configured or verified.                                                                                              |

## 1. Foundation and developer experience

### Implemented

- Laravel 13 application foundation
- PHP 8.3+ project requirement
- React 19 and TypeScript
- Inertia.js 3
- Tailwind CSS 4
- Shadcn-style/Radix UI components
- Lucide icon system
- Vite Plus/Vite production build
- Laravel Wayfinder route generation
- SQLite local database configuration
- Database-backed sessions, cache, and queues
- Environment template
- Node 22 requirement through `package.json` and `.nvmrc`
- PHPUnit feature-test foundation
- Larastan/PHPStan configuration through Composer scripts
- Laravel Pint formatting
- Frontend formatting/lint checking
- Frontend type checking
- Professional navy/teal design system with semantic light/dark tokens
- Role-aware polished sidebar and application header
- Redesigned public product entry page
- Redesigned platform and organization dashboard presentation
- Refined shared cards, buttons, inputs, navigation, spacing, hierarchy, and responsive behavior
- Production dependency audit process
- Local combined development command
- Health endpoint supplied by Laravel

### Partial

- Domain-based structure exists for Administration, Organizations, and Services only.
- CI workflows originate from the starter kit, but repository-specific remote CI execution has not been verified.
- Local database setup is complete; production database configuration is documented but not deployed.

### Not implemented

- Docker/Sail project-specific environment validation
- Production infrastructure as code
- Deployment pipeline
- Staging environment
- Error-monitoring provider
- Centralized production logging
- Automated database backup and restoration drills
- Performance/load testing
- Browser end-to-end test suite
- Automated accessibility test suite

## 2. Authentication, account security, and settings

### Implemented

- Registration
- Login and logout
- Email verification workflow
- Password reset
- Password confirmation for sensitive settings
- Profile name/email update
- Password update
- Account deletion from profile settings
- Passkey registration and authentication support
- Two-factor authentication and recovery codes
- Light/dark/system appearance preference
- Active and suspended account status
- Middleware blocking suspended accounts from authenticated tenant routes

### Partial

- Email defaults to log delivery locally; real SMTP/provider delivery is not configured.
- System administrator promotion is available through an operational database procedure, not an application UI.
- Organization roles exist in the data model, but fine-grained permissions are not implemented.

### Not implemented

- User invitation workflow
- Organization invitation acceptance
- Administrator creation/promotion UI
- Account unlock/support workflow
- Login/device/session management screen
- Central permission editor
- Role-specific policy coverage for future modules
- Social login provider configuration
- Customer-versus-staff account separation rules

## 3. System administration

### Implemented

- Dedicated `/admin` access boundary
- System-administrator middleware
- Platform overview dashboard
- Organization, active-organization, branch, and user metrics
- Recent organization list
- Recent administrator activity preview
- Organization search and pagination
- Organization detail page
- Organization contact update
- Organization suspension/reactivation
- Branch creation and update
- Branch location, contact, and timezone management
- Default-branch management
- Default-branch deactivation protection
- Branch activation/deactivation
- Cross-organization branch protection
- Organization member/role visibility
- User search and pagination
- User suspension/reactivation
- Self-suspension protection for administrators
- Service-category management
- Standardized-service management
- Quotation/direct-booking mode
- Vehicle-required service rule
- Category/service activation and deactivation
- Administrator action recording with actor, subject, metadata, IP, and timestamp

### Partial

- Activity records are stored and previewed, but there is no full searchable activity-log screen.
- Organization members are visible, but system administrators cannot yet add/remove members or change roles through the UI.
- Organization and user detail views are limited.
- Platform health is currently a dashboard indicator, not a real multi-service health monitor.

### Not implemented

- Full activity-log explorer, export, and before/after comparison
- Administrator management UI and privilege changes
- Role/permission administration
- User detail page and support notes
- Controlled tenant impersonation/support access
- Platform feature flags
- Global settings UI
- Moderation queue
- Public-content approval workflow
- Data export/retention administration
- Notification-provider administration
- Subscription, plan, billing, and quota administration

## 4. Organizations, branches, and membership

### Implemented

- Organization creation during onboarding
- Unique organization slug
- Organization name, email, phone, status, and timestamps
- Atomic owner membership assignment
- Membership roles: owner, administrator, branch manager, staff
- Automatic first/default branch
- Multiple branches
- Unique branch slug inside each organization
- Branch name, email, phone, address, city, country, and timezone
- Sri Lankan default country/timezone
- Seven-day service-hour data
- Default service-hour template
- Branch active/inactive status
- Exactly protected default branch behavior in current UI/workflow
- Organization-aware dashboard foundation

### Partial

- Normal users can onboard the first organization, but full organization self-management screens are not implemented.
- Membership roles are stored but not enforced across a complete permission matrix.
- Branch addresses are basic text fields; geocoding, coordinates, maps, and service radius are absent.
- Service hours support one interval per day; breaks, holidays, special hours, and multiple shifts are absent.

### Not implemented

- Invite team member
- Accept/decline invitation
- Change member role
- Remove/suspend membership
- Branch-specific staff assignment
- Department/team structure
- Organization logo, gallery, and rich public profile
- Registration/company identifiers
- Tax and billing profile
- Public/private organization publication status
- Holiday and exceptional opening hours
- Branch facilities, service bays, and capacity
- Organization subscription/plan
- Ownership transfer

## 5. Platform service catalogue

### Implemented

- Service categories
- Category name, slug, description, status, ordering field, and timestamps
- Standardized service definitions
- Service name, slug, description, and category
- Quotation or direct-booking customer flow
- Vehicle-required flag
- Active/inactive lifecycle
- Search
- Edit workflow
- Administrator audit records
- Initial confirmed example: Vehicle Care / Cut and Polish

### Partial

- Category sort order exists in the database but has no reorder UI.
- Categories can be activated/deactivated but not edited through the UI.
- Vehicle requirement is a simple boolean; compatibility taxonomy does not exist.

### Not implemented

- Organization opt-in to standardized services
- Organization-specific description
- Branch availability
- Fixed, starting-from, hourly, or quotation-only pricing
- Estimated duration
- Tax behavior
- Staff/skill requirements
- Service add-ons and packages
- Vehicle make/model/type compatibility
- Booking capacity and lead time
- Public publication and search indexing
- Service images
- Service approval/moderation

## 6. Customers and vehicles

### Implemented

- Nothing beyond the shared user-account foundation.

### Not implemented

- Customer records independent of login accounts
- Customer registration and profile
- Customer contact preferences
- Customer addresses
- Individual/business customer types
- Vehicle registration number
- Make, model, variant, year, fuel type, transmission, and mileage
- VIN/chassis/engine numbers
- Vehicle images and documents
- Vehicle ownership history
- Customer-to-vehicle relationship
- Multiple vehicles per customer
- Service history
- Customer notes and consent
- Duplicate detection and merge

## 7. Enquiries, quotations, bookings, and estimates

### Implemented

- Service definitions can declare quotation or direct-booking mode only.

### Not implemented

- Public/private service enquiry
- Quotation request
- Booking calendar and slots
- Branch capacity
- Appointment rescheduling/cancellation
- Vehicle intake
- Inspection checklist
- Damage photos and customer acknowledgment
- Estimate header and line items
- Labour, parts, discounts, taxes, and totals
- Estimate versioning
- Estimate expiry
- Customer approval/rejection
- Approval evidence and timestamps
- Deposit request
- Conversion to work order

## 8. Service jobs/work orders

### Implemented

- No operational work-order implementation exists.

### Planned workflow

- Intake/received
- Inspection
- Awaiting estimate approval
- Approved
- In progress
- Quality check
- Ready for delivery
- Completed/delivered
- Cancelled

### Not implemented

- Work-order numbering
- Customer, vehicle, branch, and service links
- Status transitions and history
- Service-advisor ownership
- Technician assignment
- Work bays
- Tasks/checklists
- Labour time tracking
- Part reservation and consumption
- Internal/customer notes
- Images and attachments
- Additional-work approval
- Quality-control checklist
- Delivery checklist
- Customer signature/acknowledgment
- Warranty/return job relationship
- Turnaround-time and productivity reporting

### Needs clarification

- Whether “Jobs” also means public recruitment vacancies. The current product interpretation is service work orders.

## 9. Inventory

### Implemented

- No inventory domain exists.

### Not implemented

- Item/part master
- Categories, brands, units, SKUs, and barcodes
- Branch stock balances
- Stock receipts, issues, transfers, returns, and adjustments
- Batch/serial tracking where required
- Reorder levels
- Low-stock alerts
- Costing method
- Stocktake/counting
- Job-part reservations and consumption
- Supplier links
- Inventory valuation and movement reports
- Import/export

## 10. Procurement and suppliers

### Implemented

- No procurement domain exists.

### Not implemented

- Supplier records
- Supplier contacts and terms
- Purchase requests
- Approval workflow
- Request for quotation
- Purchase orders
- Purchase-order status/history
- Goods receipt
- Quantity/price variance
- Supplier invoices
- Purchase returns
- Inventory update after receipt
- Supplier performance and spend reports

## 11. Accounting, invoicing, and payments

### Implemented

- No business accounting records exist.

### Not implemented

- Estimate financial totals
- Customer invoices and credit notes
- Invoice numbering
- Taxes and discounts
- Cash, card, transfer, online, or split payments
- Receipts
- Outstanding balances
- Deposits and refunds
- Expenses
- Cash register/day close
- Branch revenue reports
- Accounts receivable aging
- Export/integration to accounting software

### Needs clarification

- Whether the platform must provide full double-entry accounting or only operational estimates, invoices, payments, expenses, and reports
- Currency and multi-currency rules
- Tax requirements
- Payment providers

## 12. Human-resource management

### Implemented

- Organization membership provides only a basic user/role foundation.

### Not implemented

- Employee records
- Employee number and employment status
- Branch/department assignment
- Skills and technician certifications
- Work schedules/rosters
- Attendance
- Leave requests and approvals
- Documents
- Performance records
- Recruitment
- Payroll
- EPF/ETF or other statutory processing

### Needs clarification

- Required HRM depth
- Whether payroll/statutory calculations are in scope
- Whether “Jobs” includes recruitment listings

## 13. Marketplace

### Implemented

- No marketplace domain or public screen exists.

### Not implemented

- Product/item listings
- Categories and brands
- Listing images
- Description, condition, price, and quantity
- Branch availability
- Draft/review/published lifecycle
- Search and filters
- Favorites
- Seller/organization contact
- Enquiry
- Reservation/cart/checkout
- Orders and fulfillment
- Moderation and reporting

### Needs clarification

- “Item List down” is interpreted as item listing but requires confirmation.
- Whether marketplace transactions end at enquiry/reservation or include checkout and payment
- Shipping/delivery requirements
- Returns/refunds policy

## 14. Leasing companies and commission

### Implemented

- Nothing implemented.

### Needs clarification before implementation

- Leasing-company onboarding and approval
- Eligible items/services
- Application/referral workflow
- Commission formula
- Percentage versus fixed commission
- Commission payer
- Accrual trigger
- Cancellation/reversal rules
- Invoicing and settlement
- Tax treatment
- Partner access and reporting

## 15. Public views and discovery

### Implemented

- Public landing/authentication foundation only.

### Not implemented

- Public organization profile
- Branch pages
- Branch hours and current open/closed state
- Public marketplace
- Public service directory
- Location search
- Category/service filters
- Vehicle compatibility filters
- Price/quotation filters
- Rating filters
- Public service detail
- Public product detail
- SEO metadata, sitemap, and structured data
- Organization contact or enquiry actions

## 16. Reviews and reputation

### Implemented

- Nothing implemented.

### Not implemented

- Ratings and written reviews
- Verified transaction/service marker
- Organization/branch/service review targets
- Organization response
- Report/flag workflow
- Moderation
- Aggregate ratings
- Review notifications
- Review history on customer profiles

### Needs clarification

- Whether reviews require a completed verified transaction
- Moderation policy
- Editing/deletion window
- Organization dispute process

## 17. Customer-facing profile

### Implemented

- Shared authenticated account/profile settings only.

### Not implemented

- Customer dashboard
- Saved vehicles
- Enquiries and quotations
- Booking calendar/history
- Service-job tracking
- Estimates awaiting approval
- Invoices, receipts, and payments
- Service history
- Reviews
- Saved organizations/services/listings
- Notification preferences

## 18. Notifications and communications

### Implemented

- Laravel notification/queue-capable foundation only.

### Not implemented

- Transactional email templates
- SMS provider
- WhatsApp provider
- In-app notifications
- Notification center
- Customer channel preferences and consent
- Booking reminders
- Estimate approval notifications
- Job status notifications
- Vehicle-ready notification
- Invoice/payment notifications
- Low-stock alerts
- Procurement approval notifications
- Review alerts
- Retry/idempotency monitoring

## 19. Files, media, and documents

### Implemented

- Laravel filesystem configuration only.

### Not implemented

- Organization logos and galleries
- Listing/service images
- Vehicle photos/documents
- Inspection and job attachments
- Generated estimates/invoices/receipts
- Private signed downloads
- Upload validation policy
- Malware-scanning strategy
- Image resizing/optimization
- Retention and deletion rules

## 20. Reporting and analytics

### Implemented

- Basic administrator counts only.

### Not implemented

- Organization dashboards
- Branch comparisons
- Job pipeline and turnaround time
- Technician productivity
- Revenue and outstanding balances
- Inventory movement and valuation
- Procurement spend
- Customer retention
- Service popularity
- Marketplace performance
- Review trends
- Leasing commissions
- CSV/XLSX/PDF exports

## 21. Audit, compliance, and support

### Implemented

- Administrator mutation log storage
- Dashboard preview of recent activity

### Partial

- Metadata is recorded, but complete before/after snapshots are not consistently stored.

### Not implemented

- Searchable audit screen
- Actor/action/subject/date filters
- Audit export
- Work-order and financial audit trails
- Sensitive document access audit
- Support-case management
- Privacy requests
- Retention policies
- Terms/privacy consent versioning

## 22. Current data and demonstrations

The local development database currently contains demonstration data used to verify the UI:

- A separate platform system-administrator account with no organization membership
- A Demo Service Center owner account with no platform-administrator privileges
- Demo Service Center organization
- Colombo Main Branch
- Vehicle Care service category
- Cut and Polish service definition

The repeatable demo seeder and credentials are documented in the README. This is local demonstration data, not a production seed contract. The seeder refuses to run in production; production administrator and organization creation must follow controlled operational procedures.

## 23. Verification snapshot

At the time of this update:

- 57 automated tests pass
- 194 assertions pass
- PHP formatting passes
- TypeScript checking passes
- Frontend formatting/lint checking passes
- Production frontend build passes
- Production dependency audit reports zero vulnerabilities
- Registration, organization onboarding, administrator dashboard, organization/branch management, service hours, user oversight, and service-catalogue screens have been visually inspected on localhost

These are current local-development results, not proof of production deployment or live integration behavior.

## 24. Recommended next milestones

### Milestone 1 — Organization service offerings

- Select standardized services
- Branch availability
- Pricing model and amount
- Duration
- Quotation/direct booking override rules if permitted
- Publication readiness
- Tests and authorization

### Milestone 2 — Customers and vehicles

- Customer records
- Vehicle ownership and specifications
- Search and duplicate prevention
- Organization-scoped history

### Milestone 3 — Requests, bookings, and estimates

- Intake form
- Inspection
- Estimate items/totals
- Customer approval
- Conversion to work order

### Milestone 4 — Work orders

- State machine
- Assignment
- Labour and task tracking
- Additional-work approval
- Quality check and delivery

### Milestone 5 — Inventory and financial completion

- Parts/stock
- Job consumption
- Invoices/payments
- Suppliers/procurement
- Operational reports

### Milestone 6 — Public platform

- Organization profiles
- Service directory
- Marketplace
- Reviews
- Customer profile

## 25. Requirement questions to resolve

1. Does “Jobs” mean service work orders only, recruitment vacancies, or both?
2. What does “Carrier/Carier” mean in the original notes?
3. Does “Item List down” mean marketplace item listing?
4. Are public services directly bookable, quotation-only, or configurable per offering?
5. Does marketplace scope include checkout and payment?
6. How are leasing commissions calculated, invoiced, reversed, and settled?
7. Is full accounting required?
8. Is payroll within HRM scope?
9. Which online-payment provider and currencies are required?
10. Which notification channels are mandatory?
11. Must reviews be limited to verified completed work?
12. What subscription/plans model applies to organizations?

## 26. Development change log

### 14 October 2026 — Professional interface redesign

- Replaced the generic grayscale starter appearance with a cohesive navy, teal, and cool-neutral operations design system.
- Redesigned the shared sidebar, brand treatment, active navigation, administrator identity indicator, application header, cards, buttons, inputs, spacing, borders, shadows, and responsive content shell.
- Redesigned the platform-administrator dashboard with a secure workspace hero, clearer system status, stronger metrics, improved organization rows, and a structured activity timeline.
- Redesigned the organization-owner dashboard with clearer hierarchy, status presentation, metrics, and module cards.
- Replaced the Laravel starter welcome screen with a product-specific Service Center entry experience.
- Redesigned the authentication shell to match the product identity.
- Preserved routes, authorization, server behavior, data operations, and domain logic.
- Visually inspected the public entry page, platform administrator dashboard, and organization owner dashboard on localhost.
- Verified frontend formatting/lint, TypeScript checking, production build, PHP formatting, and all 57 tests with 194 assertions.

### 14 October 2026 — Documentation and continuation protocol

- Added a complete development handoff for new developers and AI agents.
- Documented the current stopping point, next recommended milestone, code entry points, local setup, verification commands, database scope, and known limitations.
- Added the repository working agreement in `AGENTS.md`.
- Made documentation synchronization part of the definition of done after every application or requirement change.
- Reviewed the product scope, technology stack, architecture, demo credentials, implementation statuses, and unresolved decisions against the current repository.

### 14 October 2026 — Separate platform and organization administrators

- Created distinct demo identities for the platform system administrator and Demo Service Center owner.
- Ensured the platform administrator has no organization membership.
- Ensured the organization owner has no platform-administrator privileges.
- Added an idempotent, production-protected demo seeder.
- Added automated tests for role separation and repeatable seeding.
- Updated the documented verification snapshot to 57 tests and 194 assertions.
