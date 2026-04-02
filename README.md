# kreshrts — Portfolio Site

> Personal portfolio of **Kreshant Kumar**, graphic designer from Himachal Pradesh, India.  
> Live at [kreshrts-portfolio.vercel.app](https://kreshrts-portfolio.vercel.app)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion (motion/react) |
| Routing | React Router v6 |
| Forms | Formspree |
| Deployment | GitHub → Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx           # Responsive nav — desktop + right-side drawer
│   ├── Logo.tsx             # Space Grotesk wordmark + violet outline mark
│   ├── Hero.tsx             # Full-viewport hero — design tool badges, scramble effect
│   ├── Projects.tsx         # Project gallery — 3D tilt cards, HUD overlays
│   ├── About.tsx            # Bio, profile card, skill pills, stats
│   ├── InstagramCarousel.tsx # Dual-direction poster marquee
│   ├── Contact.tsx          # Formspree form + social links
│   ├── Footer.tsx           # Logo, social, legal modal
│   ├── BackToTop.tsx        # SVG scroll-progress ring button
│   ├── ScrollToTop.tsx      # Route-change scroll reset
│   └── LoadingScreen.tsx    # Intro animation
├── pages/
│   ├── HomePage.tsx         # All sections assembled
│   ├── ProjectsPage.tsx     # Full project archive
│   └── ProjectDetailPage.tsx # Individual project view + SEO
├── providers/
│   └── MotionProvider.tsx   # MotionConfig wrapper (reducedMotion: user)
├── App.tsx                  # Router + providers
├── main.tsx                 # Entry point
└── index.css                # Design tokens, Tailwind theme, utilities
```

---

## Design System

| Token | Value |
|---|---|
| Background | `#faf7f2` (warm cream) |
| Primary text | `#111111` |
| Accent | `#7c3aed` (violet) |
| Gradient | `#7c3aed → #a855f7 → #c084fc` |
| Display font | Space Grotesk (700–900) |
| Mono font | JetBrains Mono |
| Grid | 60px purple at 2.5% opacity |

---

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone
git clone https://github.com/your-username/kreshrts-portfolio.git
cd kreshrts-portfolio

# 2. Install
npm install

# 3. Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy

Push to `main` — Vercel auto-deploys on every commit.

```bash
git add .
git commit -m "update"
git push origin main
```

---

## Environment

No API keys required. Formspree endpoint is hardcoded in `Contact.tsx`.  
If you fork this, replace `https://formspree.io/f/xpqorqgw` with your own.

---

## Adding a Project

1. Add entry to `projectDetails` in `ProjectDetailPage.tsx`
2. Add matching entry to `projects` array in `Projects.tsx`
3. Drop project images in `/public/images/projects/`

---

## Folder: `/public`

```
public/
├── images/
│   ├── me/
│   │   └── kresh.webp        # Profile photo
│   └── insta/
│       ├── Rebirth.webp
│       ├── Ahinsa.webp
│       └── ...               # Antaryatra poster series
├── doc/
│   └── Kreshant_Fresher_Designer_CV.pdf
└── og-image.jpg              # 1200×630 Open Graph preview image
```

---

<div align="center">
  <sub>Handcrafted with ✦ by Kreshant Kumar &nbsp;·&nbsp; <a href="https://instagram.com/kreshrts">@kreshrts</a></sub>
</div>