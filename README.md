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
personal-portfolio/
├─ .vscode/            # Editor preferences
├─ documents/          # Public resume PDF 
├─ images/             # Project images and media 
├─ public/
│ └─ css/               # output bundles (home.css, about.css…)
├─ scss/
│ ├─ abstracts/         # _variables.scss, _mixins.scss
│ ├─ base/              # _global.scss (reset + typography)
│ ├─ components/        # _buttons.scss, _theme-switch.scss
│ ├─ layout/            # _container.scss, _header.scss, _footer.scss
│ ├─ pages/             # one sub-folder per page
│ │ ├─ home/            # _index.scss → imports intro/projects… partials
│ │ ├─ about/
│ │ ├─ projects/
│ │ └─ contact/
│ └─ _core.scss         # central barrel; @use layers above
├─ *.html               # home, about, projects, contact, 404
├─ index.js             # small interactive helpers
└─ package.json         # scripts below
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

- [ ] Improve file structure for AWS deployment
- [ ] Modular Sass structure + responsive layout
- [ ] Project case studies with technical breakdowns
- [ ] GitHub Actions → auto-deploy to AWS S3
- [ ] Create layout/_gradient.scss to replace all intro.scss
- [ ] Create template.html easy page creation
