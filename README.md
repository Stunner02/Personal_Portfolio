# Gavin Glynn – Personal Portfolio

This repository contains the source code for my personal portfolio website:  
👉 [gavglynn.com](https://gavglynn.com)

---

## 🔭 About

Hi! I'm Gavin — a mechanical engineer specializing in:

- Finite Element Analysis (FEA)
- CAD and 3D modeling
- Robotics and automation
- Aerospace systems (satellites, CubeSats, rockets)

This site showcases selected projects, technical experience, and a bit about me.

---

## 🧰 Tech Stack

- HTML5 / CSS3 (one‑bundle‑per‑page architecture)
- JavaScript (vanilla)
- Git / GitHub
- [Hosted via AWS S3](#hosting--security) (static website)

---

## 📁 Project Structure

For notes on how the HTML and sections are laid out:  
👉 [HTML Structure Notes](documents/html-home-layout.md)

```bash
PERSONAL_PORTFOLIO/
├── .vscode/                # 🛠️  Editor/project settings (not deployed)
├── documents/              # 📑  Working docs (private, not deployed)
├── images/                 # 🖼️  Private/source/unused images (not deployed)
│
├── public/                 # 🌐 Only Public/ is deployed to AWS S3!
│   ├── 01_images/          # Public project images and media
│   ├── 02_documents/       # Public resume PDF
│   ├── 03_css/             # 🎨 CSS, compiled from SCSS
│   │   ├── about.css
│   │   ├── home.css
│   │   ├── projects.css
│   │   ├── contact.css
│   │   └── 404.css
│   ├── 04_js/              # ✨ Javascript folder
│   │   ├── home.js
│   │   ├── projects.js
│   │   ├── about.js
│   │   └── contact.js
│   ├── about/              # ℹ️ About page
│   │   └── index.html
│   ├── contact/            # 📫 Contact page
│   │   └── index.html 
│   ├── projects/           # 🛠️ Projects page 
│   │   └── index.html
│   │
│   ├── 404.html            # 🚫 Error/Not Found page (for S3 error document)
│   └── index.html          # 🏠 Home page
│
├─ scss/                    # 💅  Sass/SCSS source files (not deployed)
│   ├── abstracts/          #    ▸ Variables, mixins, functions
│   ├── base/               #    ▸ Global resets, typography
│   ├── components/         #    ▸ Reusable widgets/components
│   ├── layout/             #    ▸ Shared layout/structure styles
│   └── pages/              #    ▸ Page-specific partials (one folder per page)
│
├── .gitignore              # Files/folders ignored by git
├── package.json            # Project dependencies and scripts
└── README.md               # Project overview/documentation
```
---

## ⚙️ Local Development

### Prerequisites
* [Node ≥ 20](https://nodejs.org/)  
* `npm i -g sass npm-run-all`  (install once)

### 1 · Clone & install

```bash
git clone https://github.com/Stunner02/Personal_Portfolio.git
cd Personal_Portfolio
npm install       # installs only dev-deps (Prettier etc.)
```

### 2 · Dev server / live-compile
```bash
npm run dev       # runs all `sass:*` watchers in parallel
```

Each page has its own watcher:<br>
• sass:home → scss/pages/home/_index.scss → public/css/home.css (and so on).

Open index.html (or any page) with Live Server/VS Code or a simple HTTP server.

---

## 🌐 Hosting & Security

The live site **gavglynn.com** is served from an **AWS S3 static‑site bucket** fronted by **CloudFront**.

| Layer | What it does |
|-------|--------------|
| **S3 (origin)** | Stores compiled assets (`public/`) with public access **blocked**. Only CloudFront’s Origin Access Control can read objects. |
| **CloudFront (CDN)** | Global edge caching, automatic GZIP/Brotli, and enforced HTTPS. |
| **Route 53 (DNS)** | Domain registered + authoritative DNS. `A`/`AAAA` & `CNAME` records point to the CloudFront distribution. |
| **TLS** | AWS Certificate Manager issues a free certificate; all traffic is forced to **TLS 1.2+**. |

_No AWS secrets or account IDs are stored in the repo—deployment creds live in encrypted GitHub Secrets._

---

## 🚫 Licensing & Use

This portfolio is for **view-only purposes**.  
All content, designs, and code are © Gavin Glynn.  

Do not copy, modify, or reuse without written permission.

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

---

## 🛠️ In Progress

- [x] Improve file structure for AWS deployment
- [x] Modular Sass structure + responsive layout
- [ ] Set up Figma for quick iteration
- [ ] Project case studies with technical breakdowns
- [ ] GitHub Actions → auto-deploy to AWS S3
- [ ] Create layout/_gradient.scss to replace all intro.scss
- [ ] Create template.html easy page creation

## 🧠 Design Philosophy & Scratch Notes

- [ ] `Figma` layout/flow → `Vscode` implementation → `AWS` Deploy
- [ ] Lead eyes with image first. Keep supporting text concise
- [ ] Add logos to university/companies
- [ ] Mobile readability first
- [ ] **Design–Implement–Test Workflow:**  
  - Figma _user flow_ → Figma _UI design_ → VSCode _code & live preview_
  - ⟳ Iterate between Figma & VS Code
  - ⟳ Final test on AWS (staging)
