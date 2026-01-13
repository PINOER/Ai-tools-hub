# AI Tools Hub Web

The user web application of AI Tools Hub. A Next.js 15 application with TypeScript, Tailwind CSS, and modern React patterns for building a comprehensive AI tools platform.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-tools-hub-web
```

2. Install dependencies:
```bash
npm install
```

3. Copy env.example to .env:

```bash
cp env.example .env
```

4. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

The application uses environment variables for configuration. Copy `env.example` to `.env.local` and configure the following variables:

### Required Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL for all API calls | `https://api.getprixite.com` |
| `NEXT_PUBLIC_S3_ENDPOINT` | S3-compatible storage endpoint for file uploads | - |
| `NEXT_PUBLIC_S3_ACCESS_KEY` | S3 access key for file uploads | - |
| `NEXT_PUBLIC_S3_SECRET_KEY` | S3 secret key for file uploads | - |
| `NEXT_PUBLIC_S3_BUCKET` | S3 bucket name for file storage | `ai-tool-hub-store` |
| `NEXT_PUBLIC_S3_REGION` | S3 region for file storage | `in-maa-1` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk authentication publishable key | - |
| `CLERK_SECRET_KEY` | Clerk authentication secret key | - |

### API Configuration

The API base URL is configurable through the `NEXT_PUBLIC_API_BASE_URL` environment variable. This allows you to:

- **Development**: Point to a local backend server
- **Staging**: Use a staging API endpoint
- **Production**: Use the production API endpoint

Example configurations:
```bash
# Local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Staging environment
NEXT_PUBLIC_API_BASE_URL=https://staging-api.getprixite.com

# Production environment
NEXT_PUBLIC_API_BASE_URL=https://api.getprixite.com
```

### Image Domains

The `next.config.ts` file includes image domain configuration for Next.js image optimization. These domains are used for serving and optimizing images from external sources:

- `cdn.pixabay.com` - Stock photos from Pixabay
- `api.getprixite.com` - API-served images (tool icons, user avatars, etc.)
- `in-maa-1.linodeobjects.com` - S3-compatible storage for uploaded images

**Note**: The image domains configuration is separate from the API base URL and should not be changed unless you're using different image sources.

## Current Features

- ⚡ **Next.js 15** - Latest version with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔧 **TypeScript** - Type-safe development
- 📡 **React Query** - Powerful data fetching and caching (configured but not yet implemented)
- 🛠️ **ESLint** - Code linting and formatting
- 📝 **Formik + Yup** - Form handling and validation
- 🎯 **Custom Hooks** - Reusable modal management
- 🎨 **UI Components** - Modal, Form, Error Tooltip, and Heading components

## What's Been Built

### Core Components

#### 1. **Modal System** (`src/components/Modal.tsx`)
- Reusable modal component with backdrop
- Configurable title and content
- Close button with accessibility support
- Responsive design with Tailwind CSS

#### 2. **Form Component** (`src/components/Form.tsx`)
- Built with Formik for form state management
- Yup validation schema integration
- Real-time error tooltips
- Sample form with name, email, and password fields
- Form submission handling with reset functionality

#### 3. **Error Tooltip** (`src/components/ErrorTooltip.tsx`)
- Custom tooltip component for form validation errors
- Positioned absolutely relative to form fields
- Hover and focus state management
- Red styling for error states

#### 4. **Heading Component** (`src/components/Heading.tsx`)
- Reusable heading component for consistent typography

### Custom Hooks

#### **useModal Hook** (`src/hooks/useModal.ts`)
- Manages multiple modal states simultaneously
- Provides `open`, `close`, and `toggle` functions
- Type-safe modal index management
- Supports any number of modals

### Validation & Utilities

#### **Validation Schema** (`src/utils/validationSchema.ts`)
- Yup-based validation for form fields
- Email format validation
- Password length requirements
- Required field validation

### Demo Page

The main page (`src/app/page.tsx`) showcases all implemented features:

- **Interactive Tooltip Demo** - Hover button with tooltip
- **Multiple Modal Examples** - Four different modal types:
  - Form Modal (with validation)
  - Information Modal
  - Warning Modal
  - Success Modal
- **Responsive Design** - Mobile-friendly layout

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with QueryProvider
│   ├── page.tsx            # Demo page showcasing all components
│   └── globals.css         # Global styles
├── components/
│   ├── Modal.tsx           # Reusable modal component
│   ├── Form.tsx            # Formik-based form with validation
│   ├── ErrorTooltip.tsx    # Error tooltip component
│   └── Heading.tsx         # Heading component
├── hooks/
│   └── useModal.ts         # Custom modal management hook
├── providers/
│   └── query-provider.tsx  # React Query client configuration
└── utils/
    └── validationSchema.ts # Yup validation schemas
```

## Usage Examples

### Modal Management
```typescript
import { useModal } from '@/hooks/useModal';
import Modal from '@/components/Modal';

function MyComponent() {
  const { openModals, open, close } = useModal(2);
  
  return (
    <div>
      <button onClick={() => open(0)}>Open Modal 1</button>
      <button onClick={() => open(1)}>Open Modal 2</button>
      
      <Modal isOpen={openModals[0]} onClose={() => close(0)} title="Modal 1">
        <p>Content for modal 1</p>
      </Modal>
      
      <Modal isOpen={openModals[1]} onClose={() => close(1)} title="Modal 2">
        <p>Content for modal 2</p>
      </Modal>
    </div>
  );
}
```

### Form with Validation
```typescript
import SampleForm from '@/components/Form';
import Modal from '@/components/Modal';

function FormModal() {
  return (
    <Modal isOpen={true} onClose={() => {}} title="User Registration">
      <SampleForm />
    </Modal>
  );
}
```

## Dependencies

### Core Dependencies
- **Next.js 15.3.4** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling

### Form & Validation
- **Formik 2.4.6** - Form state management
- **Yup 1.6.1** - Schema validation

### Data Fetching (Configured)
- **@tanstack/react-query 5.81.5** - Data fetching and caching
- **@tanstack/react-query-devtools 5.81.5** - Development tools

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

The foundation is set up with:
- ✅ Modal system
- ✅ Form handling with validation
- ✅ Custom hooks
- ✅ UI components
- ✅ React Query configuration

Ready for implementing:
- 🔄 API integration with React Query
- 🔄 AI tool integrations
- 🔄 User authentication
- 🔄 Database connectivity
- 🔄 Additional AI-powered features

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Formik Documentation](https://formik.org/docs/overview)

## License

This project is open source and available under the [MIT License](LICENSE).
