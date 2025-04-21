# Factly Verify

A modern fact-checking application that leverages AI to verify claims and provide accurate information.

## Features

- Real-time claim verification using AI
- User authentication and profile management
- History tracking of fact-checks
- Admin dashboard for user management
- Responsive design with modern UI components
- Free fact-check with login requirement for continued use

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: React Query
- **Authentication**: Supabase
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (Recommended: use nvm to install)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd factly-verify
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
factly-verify/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   └── App.tsx        # Main application component
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Screenshots
![CleanShot 2025-04-21 at 11 50 10@2x](https://github.com/user-attachments/assets/ed8a53cc-8615-44a9-a014-59fa5edb8765)


## Support

For support, please open an issue in the GitHub repository.

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [React Query](https://tanstack.com/query/v5) for efficient data fetching
