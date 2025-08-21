
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const { name, email, message, subject } = JSON.parse(event.body);
    
    // Validation des données
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Champs requis manquants' })
      };
    }

    // Envoi à Formspree ou autre service
    const response = await fetch(process.env.FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
        subject: subject || 'Nouveau message du site',
        _replyto: email
      })
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message envoyé avec succès' })
      };
    } else {
      throw new Error('Erreur lors de l\'envoi du formulaire');
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erreur serveur',
        message: error.message 
      })
    };
  }
};