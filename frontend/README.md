# Remi AI - Landing Page

A modern, responsive landing page for Remi AI voice agent service, inspired by Fin.ai's design.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Scrolling**: All navigation buttons and links scroll smoothly to their respective sections
- **Interactive Phone Demo**: Animated phone mockup with live call simulation
- **Modern UI**: Clean, professional design with no purple gradients
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Next.js**: React framework with SSR capabilities

## Project Structure

```
frontend/
├── components/
│   ├── Navigation.js     # Top navigation bar with scroll buttons
│   ├── Hero.js          # Hero section with main CTA
│   ├── PhoneDemo.js     # Interactive phone demo section
│   ├── Confidence.js    # Features and testing section
│   └── Footer.js        # Footer with links and social media
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   ├── _document.js     # Custom document
│   └── index.js         # Main landing page
├── styles/
│   └── globals.css      # Global styles and animations
└── package.json         # Dependencies

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
npm start
```

## Components Overview

### Navigation
- Fixed top navigation bar
- Smooth scroll to sections
- "View demo" and "Start free trial" buttons

### Hero Section
- Large headline with tagline
- Two CTA buttons that scroll to relevant sections
- Animated scroll indicator
- Gradient background effects

### Phone Demo Section
- Interactive phone mockup
- Simulated live call with captions
- Call timer and controls
- Mute button functionality
- Animated waveform visualization

### Confidence Section
- Three key features with colored accents
- Preview/conversation mockup panels
- CTA buttons
- Dark navy background

### Footer
- Company information
- Product, Company, and Legal links
- Social media icons
- Scroll-to-top functionality on logo click

## Customization

### Colors
Main colors are defined in `tailwind.config.js`:
- Navy: #0a1628, #0f1f36, #152844
- Cream: #f5f2ed, #ebe7df
- Coral: #ff6b35, #e85a28

### Fonts
- Headings: Georgia, Cambria, Times New Roman (serif)
- Body: Inter, -apple-system, BlinkMacSystemFont (sans-serif)

### Button Behavior
All buttons scroll to specific sections:
- "Start free trial" → scrolls to #confidence section
- "View demo" → scrolls to #demo section
- Logo → scrolls to #hero section

## Notes

- No purple gradients used (as requested)
- All scroll functionality is working
- Placeholder logo included (replace with actual logo)
- Social media links are placeholders (update hrefs)
- Backend integration placeholders ready for LiveKit

## Next Steps

1. Replace placeholder logo in Navigation and Footer
2. Add actual backend integration for phone demo
3. Connect to LiveKit for real voice functionality
4. Update social media links in Footer
5. Add real content for Documentation, About, Blog, etc.
6. Set up analytics tracking
7. Add SEO meta tags
8. Configure domain and hosting

## Technologies Used

- **Next.js 14**: React framework
- **React 18**: UI library
- **Tailwind CSS 3**: Utility-first CSS
- **LiveKit Client**: Voice/video infrastructure (placeholder)
- **Axios**: HTTP client (placeholder)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved - Remi AI 2025
