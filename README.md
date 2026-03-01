# Fullstack Engineer Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Editing is easy if you would like to use this for your own project!

## Features

- ⚡ **Next.js 15** with App Router for optimal performance
- 🎨 **Tailwind CSS** for beautiful, responsive design
- 🌙 **Dark mode** support (automatically adapts to system preferences)
- 📱 **Fully responsive** design that works on all devices
- ⚛️ **TypeScript** for type safety
- 🎯 **SEO optimized** with proper meta tags
- 🚀 **Production ready** with optimized builds

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (recommended) / Netlify

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
portfolio-site/
├── app/
│   ├── globals.css      # Global styles and Tailwind directives
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main portfolio page
├── public/              # Static assets (add images here)
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click

### Netlify

1. Push to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Connect your repository
4. Build command: `npm run build`
5. Publish directory: `.next`

## Adding Images

1. Place images in the `public/` folder
2. Reference them in code:
```tsx
<img src="/your-image.jpg" alt="Description" />
```

## Next Steps

- Add Chatroom functionality, using Docker and PostgreSQL with Prisma for deployment
- Maybe add a blog?
