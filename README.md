# Organizational Assistant

A comprehensive task management and note-taking application with AI-powered features, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📋 **Task Management**: Create, organize, and track tasks with due dates, categories, and priorities
- 📅 **Calendar View**: Visual calendar interface to view tasks and deadlines
- 📝 **Note Taking**: Rich note-taking system with tags and search functionality
- 🔍 **Advanced Search**: Unified search across tasks and notes with AI-powered suggestions
- 🤖 **AI Features**: Smart task categorization, note summarization, and intelligent search suggestions
- 🌙 **Dark Mode**: Seamless light/dark theme switching
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Google AI (Gemini) API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd organizational-assistant
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   
   Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` and add your API keys:
   \`\`\`env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

4. **Get your Gemini API Key**
   
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key
   - Paste it in your `.env.local` file

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini API key for AI features | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Base URL for your application | Yes |
| `DATABASE_URL` | Prisma database URL (e.g. `file:./dev.db` for SQLite) | Yes |
| `NEXT_PUBLIC_EMAIL_SERVER` | SMTP connection string for NextAuth email provider | Optional |
| `NEXT_PUBLIC_EMAIL_FROM` | Email "from" address for NextAuth email provider | Optional |

### Getting API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

## AI Features

The application includes several AI-powered features:

### Smart Task Categorization
- Automatically suggests categories based on task title and description
- Uses Gemini AI to analyze context and content
- Supports categories: Work, Personal, Health, Learning, Finance

### Note Summarization
- Generates concise summaries of long notes
- Helps quickly understand note content
- Powered by Gemini AI for accurate summarization

### Intelligent Search Suggestions
- Provides contextual search suggestions
- Analyzes existing tasks and notes for relevant suggestions
- Helps discover content you might have missed

## Project Structure

\`\`\`
organizational-assistant/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── ai/           # AI-powered endpoints
│   ├── tasks/            # Task management pages
│   ├── notes/            # Note-taking pages
│   ├── calendar/         # Calendar view pages
│   └── search/           # Search functionality
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx
├── lib/                  # Utility functions
└── public/               # Static assets
\`\`\`

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: Google Gemini AI via AI SDK
- **Theme**: next-themes for dark mode
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **API Routes**: Add new AI endpoints in `app/api/ai/`
2. **Components**: Create reusable components in `components/`
3. **Pages**: Add new pages in the `app/` directory
4. **Styling**: Use Tailwind CSS classes and CSS variables for theming

## Troubleshooting

### AI Features Not Working

1. **Check API Key**: Ensure `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env.local`
2. **Verify API Key**: Test your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Check Console**: Look for error messages in the browser console
4. **API Status**: The app includes an AI status indicator to show service availability

### Common Issues

- **Environment Variables**: Make sure `.env.local` is in the root directory
- **API Key Format**: Ensure there are no extra spaces or characters in your API key
- **Network Issues**: Check your internet connection for AI API calls

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Look for existing issues in the repository
3. Create a new issue with detailed information about the problem

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Google AI](https://ai.google.dev/) for the Gemini API
- [Vercel](https://vercel.com/) for hosting and deployment platform
