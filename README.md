# Cosmic CRM

A powerful Customer Relationship Management (CRM) web application built with Next.js 16 and Cosmic CMS. Features a modern dashboard with pipeline overview, contact management, company directory, Kanban-style deal pipeline, and activity tracking.

## Features

- 📊 **Dashboard** — Key metrics (total contacts, deals, revenue), pipeline overview, recent activities
- 👥 **Contacts** — Browse, search, and filter contacts by status and source
- 🏢 **Companies** — Manage organizations with industry, size, and website details
- 💰 **Deals Pipeline** — Kanban board with drag-and-drop visual across 6 stages
- 📋 **Activities** — Log and view interactions linked to contacts and deals
- 🔗 **Relationships** — Connected objects show related data across all content types
- 📱 **Responsive** — Works beautifully on desktop, tablet, and mobile
- 🎨 **Modern UI** — Clean sidebar navigation, card-based layouts, subtle animations

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=69c4b35a84c416b848b4d935&clone_repository=69c87caec6634141354a7c36)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> A CRM (Customer Relationship Management) web application with a clean, modern UI. It should have: a dashboard with pipeline overview and key metrics (total contacts, deals, revenue), a contacts page to browse/search/filter contacts by status and source, a companies page to manage organizations, a deals page with a Kanban-style pipeline view showing deals by stage (Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost), and an activities page to log and view interactions. Navigation should be clean with a sidebar. Use the existing CRM content types: contacts, companies, deals, and activities which are all linked via relationships.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Cosmic CMS](https://www.cosmicjs.com/docs) — Headless content management
- [@cosmicjs/sdk](https://www.npmjs.com/package/@cosmicjs/sdk) — Cosmic JavaScript SDK

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime installed
- A [Cosmic](https://www.cosmicjs.com) account with a bucket containing contacts, companies, deals, and activities object types

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cosmic-crm

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Run development server
bun dev
```

## Cosmic SDK Examples

### Fetching Contacts with Related Company Data
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: contacts } = await cosmic.objects
  .find({ type: 'contacts' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Deals with Pipeline Stage
```typescript
const { objects: deals } = await cosmic.objects
  .find({ type: 'deals' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application integrates with [Cosmic CMS](https://www.cosmicjs.com) using the following object types:

| Object Type | Description |
|------------|-------------|
| `contacts` | Customer contacts with name, email, phone, company, status, source |
| `companies` | Organizations with industry, website, size, address |
| `deals` | Sales opportunities with value, stage, contact, company, close date |
| `activities` | Interactions with type, date, linked contact and deal |

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables: `COSMIC_BUCKET_SLUG`, `COSMIC_READ_KEY`, `COSMIC_WRITE_KEY`
4. Deploy

### Netlify
1. Push your code to GitHub
2. Import the project on [Netlify](https://netlify.com)
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy
<!-- README_END -->