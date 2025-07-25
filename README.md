# Argent - Free Financial Tools for Everyone

A free, accessible financial management platform designed to help middle-class families, people with disabilities, and those with limited income take control of their finances.

## Features

- **Simple Dashboard**: Easy-to-understand overview of your money
- **Transaction Tracking**: See where your money goes with clear categories
- **Account Management**: Connect all your bank accounts in one place
- **Basic Investing**: Learn about low-cost investment options
- **AI Helper**: Get free financial advice and budgeting help
- **Goal Setting**: Save for emergencies, education, or other important goals

## Who This Is For

- **Middle-class families** looking to stretch their budget further
- **People with disabilities** who need accessible financial tools
- **Low-income individuals** seeking free financial guidance
- **Students** learning to manage money responsibly
- **Anyone** who wants simple, honest financial tools without fees

## AI Video Chat Integration

This application integrates with [Tavus](https://tavus.io) for AI-powered video consultations. The AI advisor can:

- Provide personalized financial advice through video chat
- Analyze your spending patterns and investment portfolio
- Offer real-time recommendations and insights
- Support both text and voice interactions

### Tavus Setup

1. Sign up for a Tavus account at [https://tavus.io](https://tavus.io)
2. Create a replica (AI avatar) for your financial advisor
3. Get your API credentials from the Tavus dashboard
4. Add the credentials to your `.env` file:

```env
VITE_TAVUS_API_KEY=your_tavus_api_key
VITE_TAVUS_CONVERSATION_ID=your_tavus_conversation_id
VITE_TAVUS_REPLICA_ID=your_tavus_replica_id
```

## Demo Accounts

The application comes with pre-configured demo accounts:

- **Username**: `demo` | **Password**: `Password123!`
- **Username**: `testuser` | **Password**: `TestPass123!`
- **Username**: `johndoe` | **Password**: `Demo123!`

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI Video**: Tavus SDK for AI-powered video consultations
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your credentials
4. Start the development server: `npm run dev`

## Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Tavus Configuration (for AI video chat)
VITE_TAVUS_API_KEY=your_tavus_api_key
VITE_TAVUS_CONVERSATION_ID=your_tavus_conversation_id
VITE_TAVUS_REPLICA_ID=your_tavus_replica_id
```

## Database Schema

The application uses a comprehensive database schema with:

- **custom_users**: User authentication and profiles
- **accounts**: Bank accounts and investment portfolios
- **categories**: Transaction categorization system
- **transactions**: Financial transaction records
- **profiles**: Extended user profile information

## Deployment

The application is configured for deployment on Netlify with automatic builds from the main branch.

## License

MIT License - see LICENSE file for details.