# Argent - AI-Powered Financial Management Platform

![Argent Logo](https://img.shields.io/badge/Argent-Financial%20Platform-007AFF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

A modern, AI-powered financial management application that provides comprehensive financial oversight with intelligent insights, secure banking integration, and personalized financial advisory services.

## 🌟 Overview

Argent is a sophisticated financial management platform that combines traditional banking features with cutting-edge AI technology. Built with React, TypeScript, and Supabase, it offers users a complete financial ecosystem including transaction tracking, investment monitoring, AI-powered insights, and video consultation capabilities.

### Key Features

- **🤖 AI Financial Advisor**: Three-tier AI assistance system (Analyst, Strategist, Advisor)
- **📊 Comprehensive Dashboard**: Real-time financial overview with interactive charts
- **💳 Account Management**: Multi-bank account integration and monitoring
- **📈 Investment Tracking**: Portfolio management with real-time market data
- **💬 AI Chat Interface**: Text-based financial consultation
- **🎥 Video Consultation**: AI-powered video meetings via Tavus integration
- **🎙️ Voice Assistant**: ElevenLabs-powered voice interactions
- **🔒 Bank-Level Security**: End-to-end encryption and secure authentication
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI Integration**: OpenAI GPT-4, Pica AI Framework
- **Video Chat**: Tavus SDK for AI avatars
- **Voice Assistant**: ElevenLabs Convai Widget
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── charts/          # Chart components
│   └── layout/          # Layout components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # CSS and styling
```

## 🧩 Component Architecture

### Core Components

#### 1. **App.tsx**
- **Purpose**: Main application router and entry point
- **Functionality**: Handles routing between public pages and authenticated app
- **Routes**: Home, Login, About, Contact, App Layout

#### 2. **AppLayout.tsx**
- **Purpose**: Main authenticated application shell
- **Features**:
  - Responsive sidebar navigation
  - Mobile header and sidebar
  - AI assistant integration
  - Route protection and authentication checks
  - Modal management for video/chat assistants

### Page Components

#### 3. **HomePage.tsx**
- **Purpose**: Landing page with marketing content
- **Features**:
  - Hero section with geometric animations
  - Feature showcase
  - Responsive navigation
  - User authentication state handling
  - Smooth scroll integration

#### 4. **LoginPage.tsx**
- **Purpose**: Authentication interface
- **Features**:
  - Sign in/sign up forms
  - Demo account access
  - Form validation
  - Responsive design
  - Error handling

#### 5. **Dashboard.tsx**
- **Purpose**: Main financial overview interface
- **Features**:
  - Account summary cards
  - Interactive charts (cash flow, trends, expenses)
  - Recent transactions
  - Quick actions
  - Real-time data updates
  - Export functionality

#### 6. **Transactions.tsx**
- **Purpose**: Transaction management interface
- **Features**:
  - Searchable transaction list
  - Filtering and sorting
  - Real-time updates
  - CSV export
  - Mobile-optimized table view
  - Pagination and performance optimization

#### 7. **Accounts.tsx**
- **Purpose**: Account management interface
- **Features**:
  - Account balance overview
  - Account type categorization
  - Connection management
  - Balance distribution charts
  - Export functionality

#### 8. **Investments.tsx**
- **Purpose**: Investment portfolio management
- **Features**:
  - Portfolio overview
  - Investment performance tracking
  - Watchlist management
  - Market news integration
  - Risk analysis
  - Sector allocation charts

#### 9. **Profile.tsx**
- **Purpose**: User profile and settings management
- **Features**:
  - Personal information editing
  - Achievement system
  - Financial goals tracking
  - Account settings
  - Progress visualization

#### 10. **Settings.tsx**
- **Purpose**: Application configuration
- **Features**:
  - Notification preferences
  - Privacy settings
  - Security configuration
  - Data export options
  - Theme customization

### AI Integration Components

#### 11. **Chat.tsx & ChatContainer.tsx**
- **Purpose**: AI-powered text chat interface
- **Features**:
  - Real-time AI conversations
  - Message history
  - Quick prompts
  - Markdown rendering
  - Scroll management
  - Error handling

#### 12. **VideoChat.tsx**
- **Purpose**: AI video consultation interface
- **Features**:
  - Tavus SDK integration
  - Video controls
  - Connection management
  - Error handling

#### 13. **AIAssistantHub.tsx**
- **Purpose**: Central AI assistant access point
- **Features**:
  - Three-tier AI system (Analyst, Strategist, Advisor)
  - Modal management
  - Responsive design
  - Animation system

### UI Components

#### 14. **InteractiveHoverButton.tsx**
- **Purpose**: Enhanced button component with animations
- **Features**:
  - Multiple variants (black, white, blue)
  - Hover animations
  - Icon support
  - Accessibility features

#### 15. **GradientMenu.tsx**
- **Purpose**: Animated navigation menu
- **Features**:
  - Gradient backgrounds
  - Hover expansions
  - Icon integration
  - Responsive design

#### 16. **AnimatedSection.tsx**
- **Purpose**: Scroll-triggered animations
- **Features**:
  - Intersection Observer integration
  - Staggered animations
  - Performance optimization

### Chart Components

#### 17. **CashFlowChart.tsx**
- **Purpose**: Monthly cash flow visualization
- **Features**:
  - Income vs expenses comparison
  - Interactive tooltips
  - Responsive design
  - Real data integration

#### 18. **ExpenseBreakdownChart.tsx**
- **Purpose**: Expense categorization visualization
- **Features**:
  - Pie chart representation
  - Category-based breakdown
  - Interactive legends

#### 19. **AccountBalanceChart.tsx**
- **Purpose**: Account balance distribution
- **Features**:
  - Bar chart visualization
  - Account type color coding
  - Balance comparison

#### 20. **InvestmentPerformanceChart.tsx**
- **Purpose**: Investment portfolio performance
- **Features**:
  - Sector-based analysis
  - Performance metrics
  - Dual-axis charts

### Utility Components

#### 21. **MobileHeader.tsx & MobileSidebar.tsx**
- **Purpose**: Mobile navigation components
- **Features**:
  - Responsive design
  - Gesture support
  - Animation system
  - User context display

#### 22. **LoadingDots.tsx**
- **Purpose**: Loading state indicator
- **Features**:
  - Animated dots
  - Smooth transitions
  - Accessibility support

#### 23. **ChatMessage.tsx**
- **Purpose**: Chat message rendering
- **Features**:
  - Markdown support
  - Syntax highlighting
  - Copy functionality
  - User/AI differentiation

## 🔧 Custom Hooks

### Data Management Hooks

#### 24. **useAuth.ts**
- **Purpose**: Authentication state management
- **Features**:
  - Custom user authentication
  - Session management
  - Login/logout functionality
  - User state persistence

#### 25. **useAccounts.ts**
- **Purpose**: Account data management
- **Features**:
  - Account fetching and caching
  - Balance calculations
  - Account type filtering
  - Real-time updates

#### 26. **useTransactions.ts**
- **Purpose**: Transaction data management
- **Features**:
  - Transaction fetching
  - Income/expense calculations
  - Cash flow analysis
  - Search and filtering

#### 27. **useInvestments.ts**
- **Purpose**: Investment data management
- **Features**:
  - Portfolio tracking
  - Performance calculations
  - Market data integration

#### 28. **useUserProfile.ts**
- **Purpose**: User profile management
- **Features**:
  - Profile CRUD operations
  - Financial metrics calculation
  - Goal tracking

### Utility Hooks

#### 29. **useSmoothScroll.ts**
- **Purpose**: Smooth scrolling behavior
- **Features**:
  - CSS scroll behavior management
  - Performance optimization

#### 30. **useLeads.ts**
- **Purpose**: Lead management for contact forms
- **Features**:
  - Lead creation
  - Supabase integration
  - Error handling

## 🗄️ Database Schema

### Core Tables

#### **custom_users**
- User authentication and basic information
- Fields: id, username, password, full_name, email, created_at

#### **user_profiles**
- Extended user profile information
- Fields: personal details, financial metrics, preferences

#### **accounts**
- Bank account information
- Fields: account_name, account_type, current_balance

#### **transactions**
- Financial transaction records
- Fields: description, amount, type, transaction_date, category

#### **investments**
- Investment portfolio data
- Fields: symbol, shares, current_price, total_value, performance metrics

#### **categories**
- Transaction categorization system
- Fields: name, icon_name, user associations

#### **leads**
- Contact form submissions and lead management
- Fields: contact information, inquiry details, status tracking

### Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Data segregated by user ID
- **Authentication Policies**: Secure access control
- **Data Encryption**: Sensitive information protection

## 🎨 Design System

### Typography
- **Font Family**: Inter (400, 500, 700, 900 weights)
- **Hierarchy**: Consistent sizing with responsive scaling
- **Letter Spacing**: Optimized for readability

### Color Palette
- **Primary**: #007AFF (Accent Blue)
- **Background**: #EAEAEA (Light Gray)
- **Text**: #000000 (Black)
- **Success**: Green variants
- **Warning**: Orange variants
- **Error**: Red variants

### Spacing System
- **Base Unit**: 8px grid system
- **Responsive**: Clamp functions for fluid scaling
- **Consistency**: Standardized spacing throughout

### Animation System
- **Micro-interactions**: Hover states and transitions
- **Page Transitions**: Smooth route changes
- **Loading States**: Skeleton screens and spinners
- **Scroll Animations**: Intersection Observer triggers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Environment variables configured

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd argent-financial
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Configure your environment variables
```

4. **Start development server**
```bash
npm run dev
```

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Tavus Configuration (Video Chat)
VITE_TAVUS_API_KEY=your_tavus_api_key
VITE_TAVUS_CONVERSATION_ID=your_tavus_conversation_id
VITE_TAVUS_REPLICA_ID=your_tavus_replica_id

# OpenAI Configuration (AI Chat)
OPENAI_API_KEY=your_openai_api_key

# Pica AI Configuration
PICA_SECRET_KEY=your_pica_secret_key
```

## 🧪 Demo Accounts

The application includes pre-configured demo accounts for testing:

- **Username**: `johndoe` | **Password**: `Demo123!`
- **Username**: `demo` | **Password**: `Password123!`
- **Username**: `testuser` | **Password**: `TestPass123!`

## 🔌 API Integration

### Supabase Functions

#### **chat/index.ts**
- **Purpose**: AI chat endpoint
- **Features**:
  - OpenAI GPT-4 integration
  - Pica AI framework
  - Streaming responses
  - Error handling

### External APIs

#### **Tavus SDK**
- Video chat functionality
- AI avatar integration
- Real-time communication

#### **ElevenLabs**
- Voice assistant capabilities
- Speech synthesis
- Natural language processing

## 📊 Data Flow

### Authentication Flow
1. User login → Custom authentication
2. Session storage → localStorage
3. Route protection → useAuth hook
4. Data fetching → User-specific queries

### Data Management
1. **Supabase Client**: Centralized database connection
2. **Custom Hooks**: Data fetching and state management
3. **Real-time Updates**: Subscription-based updates
4. **Caching Strategy**: Optimized data retrieval

### AI Integration Flow
1. **User Input** → Chat interface
2. **API Call** → Supabase Edge Function
3. **AI Processing** → OpenAI + Pica AI
4. **Response Stream** → Real-time UI updates

## 🔒 Security Features

### Authentication
- Custom user authentication system
- Session management
- Password encryption
- User isolation

### Data Protection
- Row Level Security (RLS)
- User-specific data access
- Encrypted connections
- Secure API endpoints

### Privacy
- No data sharing without consent
- User-controlled data export
- Secure deletion options
- GDPR compliance considerations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly interfaces
- Optimized navigation
- Compressed layouts
- Performance considerations

### Accessibility
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Netlify Deployment
- Automatic builds from main branch
- Environment variable configuration
- Custom domain support
- CDN optimization

### Performance Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

## 🧪 Testing Strategy

### Component Testing
- Unit tests for hooks
- Component integration tests
- Mock data strategies

### User Experience Testing
- Responsive design validation
- Cross-browser compatibility
- Performance benchmarking
- Accessibility auditing

## 📈 Performance Metrics

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Techniques
- React.memo for expensive components
- useMemo for complex calculations
- useCallback for stable references
- Virtual scrolling for large lists

## 🔄 State Management

### Local State
- React useState for component state
- useReducer for complex state logic

### Server State
- Custom hooks for data fetching
- Supabase real-time subscriptions
- Optimistic updates

### Global State
- Context API for user authentication
- Props drilling minimization
- State colocation principles

## 🛠️ Development Tools

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Prettier formatting
- Husky git hooks

### Development Experience
- Hot module replacement
- Fast refresh
- Source maps
- Development server

## 📚 Additional Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

### AI Integration
- [OpenAI API](https://platform.openai.com/docs)
- [Tavus SDK](https://docs.tavus.io)
- [ElevenLabs](https://elevenlabs.io/docs)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Code Standards
- TypeScript strict mode
- Component composition patterns
- Accessibility best practices
- Performance considerations

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the Argent Team**

*Empowering financial clarity through intelligent technology*