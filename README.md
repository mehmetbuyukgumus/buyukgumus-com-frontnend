# Buyukgumus.com Frontend

This is the frontend for **buyukgumus.com**, a professional portfolio and blog platform designed with a high-fidelity, editorial-style minimalist aesthetic known as the **"Technical Curator"**.

Built with **Next.js**, this application emphasizes clean typography, glassmorphism, and a focused reading experience for technical content.

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:1905](http://localhost:1905).

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS (Component-based CSS/Module CSS)
- **Icons**: React Icons
- **Markdown**: React Markdown with rehype-highlight for code snippets
- **Editor**: React MD Editor for content management

## 🎨 Design Philosophy: "Technical Curator"

- **Minimalism**: Editorial-style layouts with generous white space.
- **Glassmorphism**: Subtle transparency and backdrop blurs for a premium feel.
- **Typography**: Focused on readability, using **Inter** for body text and **Space Grotesk** for mono/label elements.
- **Color Palette**: Sophisticated dark theme with deep grays (`#0d1117`) and vibrant primary accents (`#58a6ff`).

## 📁 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components.
- `/context`: React context providers for state management.
- `/public`: Static assets (images, fonts, etc.).
- `/styles`: Global and shared CSS files.

## 🚢 Deployment

The project is configured for deployment via a CI/CD pipeline (GitHub Actions) as defined in `.github/workflows/deploy.yaml`. It is containerized using Docker for consistent environments.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
