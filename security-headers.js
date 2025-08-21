
// Script pour vérifier les headers de sécurité
const https = require('https');
const url = require('url');

const siteUrl = 'https://votre-site.netlify.app';

const checkHeaders = (targetUrl) => {
  const parsedUrl = url.parse(targetUrl);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: 'GET',
    headers: {
      'User-Agent': 'Security Header Checker'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('\nHeaders de sécurité:');
    
    const securityHeaders = [
      'x-frame-options',
      'x-xss-protection',
      'x-content-type-options',
      'strict-transport-security',
      'content-security-policy',
      'referrer-policy',
      'permissions-policy'
    ];

    securityHeaders.forEach(header => {
      const value = res.headers[header] || res.headers[header.toLowerCase()];
      console.log(`${header}: ${value || 'NON DÉFINI'}`);
    });
  });

  req.on('error', (error) => {
    console.error('Erreur:', error);
  });

  req.end();
};

checkHeaders(siteUrl);