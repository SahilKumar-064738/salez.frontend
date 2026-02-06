## Packages
(none needed)

## Notes
Uses existing shadcn/ui primitives already in repo (Sidebar, Dialog, Drawer, Table, Tabs, Toast, Tooltip, etc.)
Uses framer-motion for page + list animations (already installed)
Uses recharts for Analytics charts (already installed)
All fetches use @shared/routes api + buildUrl and validate responses with Zod safeParse logging helper
Dark mode is class-based; theme toggle uses document.documentElement.classList
