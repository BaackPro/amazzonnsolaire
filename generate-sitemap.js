
const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// URLs du site
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/services', changefreq: 'weekly', priority: 0.8 },
  { url: '/produits', changefreq: 'weekly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 }
];

// Créer le sitemap
async function generateSitemap() {
  try {
    const stream = new SitemapStream({ hostname: 'https://amazzonnsolaire.netlify.app' });
    
    const data = await streamToPromise(
      Readable.from(links).pipe(stream)
    );
    
    fs.writeFileSync('dist/sitemap.xml', data.toString());
    console.log('Sitemap généré avec succès!');
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
  }
}

generateSitemap();