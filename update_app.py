import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));",
"const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));\nconst CategoryPage = React.lazy(() => import('./pages/CategoryPage'));")

content = content.replace("<Route path=\"/:slug\" element={<ToolPage />} />",
"<Route path=\"/tool/:slug\" element={<ToolPage />} />\n            <Route path=\"/:category\" element={<CategoryPage />} />")

with open('src/App.tsx', 'w') as f:
    f.write(content)
