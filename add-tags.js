import fs from 'fs';

let content = fs.readFileSync('src/config/tools.ts', 'utf8');

const tagsStr = "tags: ['shrink', 'kb', 'mb', 'passport', 'visa', 'photo chota karo', 'size reduce', 'image size', 'make smaller', 'compress', 'resize', 'convert', 'crop'],";

content = content.replace(/id: '([^']+)',/g, `id: '$1', ${tagsStr}`);

fs.writeFileSync('src/config/tools.ts', content);

