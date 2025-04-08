# Site web Soniferba

Ce dépôt contient le site web de Soniferba, entreprise spécialisée en serrurerie et automatismes à Nîmes.

## Déploiement sur Netlify

### Configuration pour le formulaire Formspree

Pour que le formulaire Formspree fonctionne correctement sur Netlify, suivez ces étapes :

1. **Créez un fichier `_redirects` à la racine du projet**

   Ce fichier doit contenir la règle suivante :

   ```
   /* /index.html 200
   ```

   Cela permet de gérer la navigation SPA (Single Page Application) si nécessaire.

2. **Ajoutez un fichier `netlify.toml` à la racine du projet**

   ```toml
   [build]
     publish = "."

   [[headers]]
     for = "/*"
     [headers.values]
       Access-Control-Allow-Origin = "*"
       Access-Control-Allow-Methods = "GET, POST, OPTIONS"
       Access-Control-Allow-Headers = "Content-Type"
   ```

   Cette configuration permet les requêtes CORS nécessaires pour Formspree.

3. **Configuration sur le tableau de bord Netlify**

   - Allez dans `Site settings` > `Build & deploy` > `Environment`
   - Ajoutez la variable d'environnement suivante :
     - Clé : `FORMSPREE_ENDPOINT`
     - Valeur : `https://formspree.io/f/mldjlvoo`

### Formulaire HTML

Le formulaire dans `sav-automatismes.html` est déjà correctement configuré avec l'attribut `action` pointant vers l'endpoint Formspree :

```html
<form action="https://formspree.io/f/mldjlvoo" method="POST" class="contact-form" id="sav-form">
```

### Gestion des soumissions de formulaire

Le JavaScript intégré gère déjà la soumission du formulaire vers Formspree :

```javascript
fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: {
        'Accept': 'application/json'
    }
})
```

## Maintenance

Pour mettre à jour le formulaire ou changer l'endpoint Formspree :

1. Créez un nouveau formulaire sur [Formspree](https://formspree.io/)
2. Remplacez l'URL dans l'attribut `action` du formulaire
3. Mettez à jour la variable d'environnement `FORMSPREE_ENDPOINT` sur Netlify

## Remarques importantes

- Assurez-vous que le domaine de votre site est autorisé dans les paramètres de votre formulaire Formspree
- Testez le formulaire après chaque déploiement pour vérifier que les soumissions fonctionnent correctement
- Les emails sont envoyés à l'adresse associée au compte Formspree 