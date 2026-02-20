# Fullstack Engineer Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS to showcase your fullstack engineering skills and experience.

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
- **Deployment:** Vercel (recommended) / Netlify / Any Node.js host

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

## Customization Guide

### Styling & Branding

- **Colors:** Update the gradient colors in the hero section and throughout
- **Typography:** Modify font families in `app/globals.css`
- **Layout:** Adjust spacing, padding, and grid layouts in `app/page.tsx`


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

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click

### Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Connect your repository
4. Build command: `npm run build`
5. Publish directory: `.next`

## Adding Images

1. Place images in the `public/` folder
2. Reference them in your code:
```tsx
<img src="/your-image.jpg" alt="Description" />
```

## Next Steps

- [ ] Add your actual work experience and projects
- [ ] Include real links to your GitHub, LinkedIn, and portfolio items
- [ ] Add project screenshots to the public folder
- [ ] Customize colors to match your personal brand
- [ ] Add a blog section (optional)
- [ ] Implement a contact form with a backend service
- [ ] Add animations with Framer Motion (optional)
- [ ] Include testimonials or recommendations

## Additional Features You Can Add

- **Blog:** Create a `/blog` route for technical writing
- **Resume Download:** Add a PDF resume download button
- **Contact Form:** Integrate with services like Formspree or EmailJS
- **Analytics:** Add Google Analytics or Plausible
- **CMS:** Integrate with Sanity or Contentful for easy content updates

## License

Feel free to use this template for your personal portfolio!
