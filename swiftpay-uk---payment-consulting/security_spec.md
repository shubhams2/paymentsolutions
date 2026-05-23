# Security Specification - SwiftPay UK

## Data Invariants
- A lead must have a valid name and email.
- A lead must have a sector (businessType) and volume estimate.
- A lead's `createdAt` must be the server time.
- Leads can only be created. No public read/update/delete.

## The Dirty Dozen Payloads (Target: /leads/{leadId})

1. **Anonymous Read Attempt**: Try to list all leads. (Expect: DENY)
2. **Unauthorized Update**: Try to modify a lead's email. (Expect: DENY)
3. **Unauthorized Delete**: Try to delete a lead. (Expect: DENY)
4. **Missing Required Field**: Create lead without `email`. (Expect: DENY)
5. **Invalid Email Format**: Create lead with `email: "not-an-email"`. (Expect: DENY)
6. **Shadow Field Injection**: Create lead with `isAdmin: true`. (Expect: DENY)
7. **Invalid Enum Value**: Create lead with `businessType: "illegal-sector"`. (Expect: DENY)
8. **Client Timestamp Forgery**: Create lead with `createdAt: "2010-01-01"`. (Expect: DENY)
9. **Identity Spoofing**: Attempt to create a lead with an ID that already exists. (Expect: DENY via create-only rule)
10. **Huge Document Attack**: Attempt to send a 1MB message string. (Expect: DENY via size limit)
11. **Malicious ID**: Attempt to use `../poison` as a document ID. (Expect: DENY via isValidId)
12. **Public Get**: Attempt to fetch a specific lead by its ID. (Expect: DENY)

## Implementation Plan
1. Helper `isValidLead` to check schema.
2. `allow create` if valid lead.
3. `allow read, update, delete: if false` (Default deny).
