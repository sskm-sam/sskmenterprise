# SSKM Enterprise Solutions & Media Inc. Website

## Website Ownership Details

- Website Name: SSKM Enterprise Solutions & Media Inc.
- Website URL: https://sskmenterprise.com
- Owner / Operator: SSKM Enterprise Solutions & Media Inc.
- Business Focus: Enterprise technology consulting, SAP transformation, enterprise architecture, and media services
- Business Address: 710-365 Prince of Wales Drive, Mississauga, Ontario, Canada L5B 0G6
- Primary Brand: SSKM
- Operating Region: Canada and North America

## Project Overview

This repository contains the official website for SSKM Enterprise Solutions & Media Inc. The site promotes enterprise consulting services including SAP S/4HANA, SAP BTP, SAP integration, enterprise architecture, and broader transformation advisory services. It also includes media-service content and contact functionality.

## Key Features

- Responsive marketing website built with Express and EJS
- Multi-page service and company presentation
- Contact form support with email delivery
- Independent consultant profile registration with local JSON persistence
- Protected recurring CSV import for consultant profiles
- SEO-friendly layout and metadata structure
- Static assets served from the public directory
- North America and enterprise transformation messaging

## Tech Stack

- Node.js
- Express.js
- EJS templating
- Nodemailer
- dotenv
- Static CSS/JS assets

## Local Development

1. Install dependencies:

   npm.cmd install

2. Start the server:

   npm.cmd start

3. For development with auto-reload:

   npm.cmd run dev

4. Open the site in a browser at:

   http://localhost:3000

## Environment Variables

Create a `.env` file in the project root with the required values:

```env
PORT=3000
ADSENSE_PUBLISHER_ID=
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
LINKEDIN_COMPANY_URL=https://www.linkedin.com/company/your-company-slug/
SMTP_HOST=mail.sskmenterprise.com
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
RECEIVER_EMAIL=your-receiver@example.com
```

## Project Structure

```text
.
├── app.js
├── package.json
├── server.js
├── public/
│   ├── css/
│   ├── images/
│   └── js/
├── views/
│   ├── partials/
│   └── *.ejs
├── data/
│   └── consultants.json  (private runtime data; excluded from Git)
├── .env
├── README.md
└── tmp/
```

## Contact and Business Inquiry

For engagement or business inquiries, use the website contact form or reach out through company communications linked to the SSKM website.

## Independent Consultant Profiles

The `/careers` page accepts structured consultant profiles through `POST /consultant-application`. Profiles are stored in `data/consultants.json` and an email notification is sent using the existing SMTP configuration. The data file is intentionally excluded from Git because it contains personal information. Production deployments must provide a persistent, access-controlled `data/` directory or replace this file store with a managed database such as MongoDB, PostgreSQL, or a hosted document store.

For recurring bulk entry, set `CONSULTANT_IMPORT_TOKEN` in `.env`, download `/consultant-template.csv`, and upload the completed file from the protected CSV Import section on `/careers`. Required columns are `name`, `email`, `location`, `expertise`, `experience`, `availability`, `profile`, and `consent`; consent must be `yes`. Existing email addresses are skipped.

## Ownership Statement

This website is owned and operated by SSKM Enterprise Solutions & Media Inc., with business operations based in Mississauga, Ontario, Canada.

## Notes

This repository is intended for the website codebase and marketing platform for the SSKM enterprise brand. It should be maintained by authorized company stakeholders or designated technical administrators.
