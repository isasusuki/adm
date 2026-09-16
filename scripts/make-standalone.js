import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('1. Building Vite CSS...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('2. Finding compiled CSS...');
const distAssets = fs.readdirSync('dist/assets');
const cssFile = distAssets.find(f => f.endsWith('.css'));
if (!cssFile) {
  throw new Error('No CSS file found in dist/assets!');
}
const cssContent = fs.readFileSync(path.join('dist/assets', cssFile), 'utf8');

console.log('3. Building IIFE JavaScript bundle with esbuild...');
execSync('npx esbuild src/main.tsx --bundle --minify --format=iife --outfile=dist/bundle.iife.js --external:*.css --loader:.png=dataurl --loader:.svg=dataurl --define:process.env.NODE_ENV=\\"production\\"', { stdio: 'inherit' });
const jsContent = fs.readFileSync('dist/bundle.iife.js', 'utf8');

console.log('4. Generating standalone index.html...');
const standaloneHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema Pré-Conselho Escolar | Frei Graciano Droessler</title>
  <meta name="description" content="Plataforma de avaliação escolar para Pré-Conselho com painéis de Administrador e Professor, login seguro com código, cadastro de perguntas e visualização de respostas sem edição." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* CSS Compilado do Tailwind e estilos da aplicação */
    ${cssContent}
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
  <div id="root"></div>
  <script>
    /* JavaScript Compilado em IIFE - Execução autônoma imediata sem necessidade de servidor ou módulos */
    ${jsContent}
  </script>
</body>
</html>`;

// Salva em public/pre-conselho.html e public/standalone.html
fs.writeFileSync('public/pre-conselho.html', standaloneHtml, 'utf8');
fs.writeFileSync('public/standalone.html', standaloneHtml, 'utf8');
fs.writeFileSync('dist/standalone.html', standaloneHtml, 'utf8');
console.log('Done! Standalone file created at public/pre-conselho.html and dist/standalone.html');
console.log('File size:', (standaloneHtml.length / 1024).toFixed(1), 'KB');
