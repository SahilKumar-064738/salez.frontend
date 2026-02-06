# WhatsApp CRM Frontend

A modern, responsive React frontend for the WhatsApp CRM application built with Vite, TypeScript, and Tailwind CSS.

## Features

- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 📊 Real-time analytics dashboard
- 💬 Inbox with conversation management
- 👥 Contact management system
- 🎯 Sales pipeline visualization
- 🤖 Automation rule builder
- 📧 Broadcast campaigns
- 📝 Message templates
- 🌙 Dark/Light theme support

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

**Important**: Make sure the `VITE_API_URL` points to your backend API server.

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
whatsapp-crm-frontend/
├── public/
│   └── favicon.png           # App favicon
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── AppSidebar.tsx    # Main navigation sidebar
│   │   ├── Brand.tsx         # Logo and branding
│   │   ├── Navbar.tsx        # Public page navigation
│   │   └── ...               # Other shared components
│   ├── hooks/
│   │   ├── use-analytics.ts  # Analytics data hooks
│   │   ├── use-contacts.ts   # Contact management hooks
│   │   ├── use-inbox.ts      # Inbox/messages hooks
│   │   └── ...               # Other custom hooks
│   ├── lib/
│   │   ├── api.ts            # API client utilities
│   │   ├── queryClient.ts    # React Query configuration
│   │   └── utils.ts          # Helper utilities
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx     # Login page
│   │   │   └── Signup.tsx    # Signup page
│   │   ├── public/
│   │   │   ├── Landing.tsx   # Landing page
│   │   │   ├── Pricing.tsx   # Pricing page
│   │   │   └── Demo.tsx      # Demo page
│   │   ├── InboxPage.tsx     # Inbox/messages
│   │   ├── ContactsPage.tsx  # Contact management
│   │   ├── PipelinePage.tsx  # Sales pipeline
│   │   ├── AutomationPage.tsx # Automation rules
│   │   ├── BroadcastPage.tsx # Broadcast campaigns
│   │   ├── TemplatesPage.tsx # Message templates
│   │   ├── AnalyticsPage.tsx # Analytics dashboard
│   │   └── BillingPage.tsx   # Billing information
│   ├── services/
│   │   ├── auth.ts           # Authentication API calls
│   │   ├── automation.ts     # Automation API calls
│   │   ├── conversations.ts  # Inbox/messages API calls
│   │   ├── leads.ts          # Contacts/leads API calls
│   │   └── templates.ts      # Templates API calls
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── index.html                # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind configuration
└── README.md
```

## Key Features

### Authentication
- Login and signup forms with validation
- JWT-based authentication
- Protected routes for authenticated users
- Session persistence

### Inbox
- Real-time message viewing
- Conversation threads
- Message sending
- Unread message indicators
- Contact information sidebar

### Contacts
- Contact list with search and filters
- Add/edit/delete contacts
- Contact details with conversation history
- Tag management
- Pipeline stage assignment

### Sales Pipeline
- Kanban-style pipeline visualization
- Drag-and-drop stage movement
- Contact cards with key information
- Pipeline stage customization

### Automation
- Visual automation rule builder
- Trigger and action configuration
- Rule enable/disable toggle
- Activity monitoring

### Broadcast Campaigns
- Create and manage broadcast campaigns
- Template selection
- Contact targeting
- Campaign scheduling
- Performance tracking

### Templates
- Pre-built message templates
- Template categories
- Variable placeholders
- Quick insertion

### Analytics
- Dashboard with key metrics
- Message volume charts
- Campaign performance
- Response rate analytics
- Customizable date ranges

## Connecting to Backend

The frontend connects to the backend API using the `VITE_API_URL` environment variable. 

### API Client

All API calls go through the centralized `apiFetch` function in `src/lib/api.ts`:

```typescript
import { apiFetch } from '@/lib/api';

// Example usage
const contacts = await apiFetch('/contacts');
```

### Service Layer

API calls are organized in service files under `src/services/`:

```typescript
// src/services/auth.ts
export async function loginUser(email: string, password: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
```

### React Query Integration

Data fetching uses TanStack Query for caching and state management:

```typescript
// In a custom hook
export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => apiFetch('/contacts'),
  });
}
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables for Production

Set these environment variables in your production environment:

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_NODE_ENV=production
```

### Deployment Platforms

This frontend can be deployed to:

- **Vercel**: Automatic deployment from Git
  ```bash
  vercel --prod
  ```

- **Netlify**: Drag & drop `dist/` folder or connect Git
  - Build command: `npm run build`
  - Publish directory: `dist`

- **AWS S3 + CloudFront**: Upload `dist/` folder to S3
  ```bash
  aws s3 sync dist/ s3://your-bucket-name
  ```

- **GitHub Pages**: Use `gh-pages` package
  ```bash
  npm install --save-dev gh-pages
  npm run build
  npx gh-pages -d dist
  ```

- **DigitalOcean App Platform**: Connect Git repository
  - Build command: `npm run build`
  - Output directory: `dist`

- **Render**: Static site deployment
  - Build command: `npm install && npm run build`
  - Publish directory: `dist`

### CORS Configuration

Make sure your backend's CORS settings allow requests from your frontend domain:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## Theme

The application supports both light and dark themes. Users can toggle between themes using the theme switcher in the navigation.

Theme persistence is handled automatically using `next-themes`.

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      }
    }
  }
}
```

### Components

All UI components are in `src/components/ui/` and can be customized as needed.

## Performance Optimization

- ⚡ Vite for ultra-fast HMR
- 🎯 Code splitting with React.lazy
- 📦 Tree shaking for smaller bundles
- 🖼️ Image optimization
- 💾 React Query for efficient data caching
- 🔄 Optimistic UI updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
