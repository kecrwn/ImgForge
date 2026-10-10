import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("<Route path=\"/:category\" element={<CategoryPage />} />",
"<Route path=\"/category/:id\" element={<CategoryPage />} />\n            <Route path=\"/:category\" element={<CategoryPage />} />")

with open('src/App.tsx', 'w') as f:
    f.write(content)
