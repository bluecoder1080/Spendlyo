<div align="center">

# 💰 SpendlyoAI

### Your AI-Powered Personal Finance Companion

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-spendlyo.vercel.app-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://spendlyo.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br/>

*Take control of your finances with intelligent expense tracking, beautiful visualizations, and AI-powered insights.*

<br/>

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Smart Dashboard
Real-time overview of your financial health with beautiful charts and metrics

### 🤖 AI-Powered Insights
Get intelligent categorization and spending suggestions powered by Gemini AI

### 🎤 Voice Input
Add expenses hands-free using speech recognition

</td>
<td width="50%">

### 📈 Analytics & Charts
Visualize spending patterns with interactive pie charts and trend graphs

### 💳 Transaction Management
Full CRUD operations with drag-and-drop organization

### 🌙 Dark Mode
Stunning dark theme for comfortable usage day or night

</td>
</tr>
</table>

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Radix UI, Lucide Icons |
| **Backend** | Supabase (Auth + Database) |
| **AI** | Google Gemini AI, OpenRouter |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **Deployment** | Vercel |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/spendlyoai.git

# Navigate to project directory
cd spendlyoai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── chat/             # AI Chat interface
│   ├── profile/          # User profile
│   └── transactions/     # Transaction management
├── components/           # React components
│   ├── analytics/        # Charts & visualizations
│   ├── dashboard/        # Dashboard widgets
│   ├── layout/           # Header, Sidebar
│   ├── transactions/     # Transaction components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities & configurations
│   ├── supabase/         # Supabase client
│   └── hooks/            # Custom React hooks
├── store/                # Zustand state management
└── utils/                # Helper functions
```

## 🎯 Key Features Explained

### 💡 AI-Powered Categorization
SpendlyoAI automatically categorizes your expenses using advanced AI, making it effortless to track where your money goes.

### 📊 Beautiful Visualizations
- **Spending Chart**: Track daily, weekly, or monthly spending trends
- **Category Pie Chart**: See expense distribution at a glance
- **Category Breakdown**: Detailed analysis of each spending category

### 🔐 Secure Authentication
Built-in Google OAuth via Supabase ensures your financial data stays private and secure.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Star this repo if you found it helpful!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/spendlyoai)

**Made with ❤️ by [Bluecoder1080](https://github.com/bluecoder1080)**

</div>
