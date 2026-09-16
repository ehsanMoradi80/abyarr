import fs from 'fs';
import path from 'path';

function buildInline() {
  const distDir = path.resolve('dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html does not exist. Run npm run build first.');
    process.exit(1);
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // Find script and css files
  const scriptRegex = /<script\s+type="module"\s+crossorigin\s+src="\.?\/?assets\/([^"]+)"><\/script>/;
  const cssRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="\.?\/?assets\/([^"]+)">/;

  const scriptMatch = html.match(scriptRegex);
  const cssMatch = html.match(cssRegex);

  if (cssMatch && cssMatch[1]) {
    const cssPath = path.join(distDir, 'assets', cssMatch[1]);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
      console.log('Inlined CSS:', cssMatch[1]);
    }
  }

  if (scriptMatch && scriptMatch[1]) {
    const jsPath = path.join(distDir, 'assets', scriptMatch[1]);
    if (fs.existsSync(jsPath)) {
      let jsContent = fs.readFileSync(jsPath, 'utf8');
      // Escape </script> if any
      jsContent = jsContent.replace(/<\/script>/gi, '<\\/script>');
      html = html.replace(scriptMatch[0], `<script type="module">\n${jsContent}\n</script>`);
      console.log('Inlined JS:', scriptMatch[1]);
    }
  }

  // Save to dist/inline.html
  const distInlinePath = path.join(distDir, 'inline.html');
  fs.writeFileSync(distInlinePath, html, 'utf8');
  console.log('Generated:', distInlinePath);

  // Copy to android assets
  const androidWebDir = path.resolve('android/app/src/main/assets/web');
  if (fs.existsSync(androidWebDir)) {
    fs.writeFileSync(path.join(androidWebDir, 'inline.html'), html, 'utf8');
    fs.writeFileSync(path.join(androidWebDir, 'index.html'), html, 'utf8');
    // Ensure fonts are copied
    const fontsDir = path.resolve('public/fonts');
    const androidFontsDir = path.join(androidWebDir, 'fonts');
    if (fs.existsSync(fontsDir)) {
      if (!fs.existsSync(androidFontsDir)) {
        fs.mkdirSync(androidFontsDir, { recursive: true });
      }
      for (const fontFile of fs.readdirSync(fontsDir)) {
        fs.copyFileSync(path.join(fontsDir, fontFile), path.join(androidFontsDir, fontFile));
      }
    }
    console.log('Updated android assets index.html, inline.html & fonts');
  }
}

buildInline();
