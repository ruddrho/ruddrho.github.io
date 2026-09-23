# Ruddrho Mollik — Robotics Portfolio

A premium, responsive academic portfolio for robotics, control systems, autonomous navigation, and graduate research applications.

## Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion + React Icons.

## Local development
```bash
npm install
npm run dev
```

## Edit personal information
Most editable profile content is centralized in:
`src/data/portfolio.ts`

Add your CV to `public/` (for example `public/Ruddrho-Mollik-CV.pdf`) and set:
```ts
cvPath: `${import.meta.env.BASE_URL}Ruddrho-Mollik-CV.pdf`
```
If you prefer not to use `import.meta.env` inside the data file, set a relative path such as `./Ruddrho-Mollik-CV.pdf` and verify it after deployment.

## Build locally
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Create a GitHub repository for this portfolio.
2. Push this entire project to the `main` branch.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. Push to `main`. The included `.github/workflows/deploy.yml` builds and deploys automatically.
6. Vite uses relative asset paths (`base: './'`), so the same build works for both project pages and `username.github.io` repositories.

## GitHub API
The site uses GitHub's unauthenticated public REST API in the browser for profile statistics and recent repositories. No token is stored in the project.

## Content policy for this portfolio
The Projects and Activities sections intentionally use placeholders rather than invented academic achievements. Replace them only with verified work.
