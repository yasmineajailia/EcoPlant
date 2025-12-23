# Configuration Email pour Gmail

## 🔐 Obtenir un mot de passe d'application Gmail

Pour envoyer des emails depuis votre application, vous devez créer un **mot de passe d'application** Gmail :

### Étape 1 : Activer la validation en 2 étapes
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur **Sécurité** dans le menu de gauche
3. Activez la **Validation en deux étapes**

### Étape 2 : Créer un mot de passe d'application
1. Retournez dans **Sécurité**
2. Cherchez **Mots de passe des applications**
3. Sélectionnez "Autre (nom personnalisé)"
4. Tapez "Pépinière" et cliquez sur **Générer**
5. Copiez le mot de passe généré (16 caractères)

### Étape 3 : Configurer le fichier .env
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application_16_caracteres
CLIENT_URL=http://localhost:3000
```

## 📧 Alternative : Autres services email

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre_email@outlook.com
EMAIL_PASS=votre_mot_de_passe
```

### Mailtrap (Pour tests)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=votre_username_mailtrap
EMAIL_PASS=votre_password_mailtrap
```

## ✅ Tester l'envoi d'email

Après configuration, redémarrez le serveur :
```bash
cd server
npm run dev
```

Puis testez en créant un nouveau compte !

## 🚨 Important
- Ne partagez JAMAIS votre mot de passe d'application
- Ajoutez `.env` au `.gitignore`
- En production, utilisez des variables d'environnement sécurisées
