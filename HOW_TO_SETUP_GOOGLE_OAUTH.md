# 🔐 Guide Complet : Configuration Google Sign Up et Login

## 📋 Vue d'Ensemble

Ce guide explique **toutes les étapes** pour configurer Google OAuth (Sign Up et Login avec Google) sur votre application. **Aucune modification de code n'est nécessaire pour l'instant** - ce guide vous montre ce qu'il faut faire.

---

## 🎯 Étapes Principales

1. **Créer un projet Google Cloud**
2. **Configurer l'écran de consentement OAuth**
3. **Créer les identifiants OAuth 2.0**
4. **Configurer les URLs autorisées**
5. **Obtenir Client ID et Client Secret**
6. **Ajouter les variables d'environnement**
7. **Modifier le code NextAuth** (à faire plus tard)
8. **Tester la connexion Google**

---

## 📝 ÉTAPE 1 : Créer un Projet Google Cloud

### 1.1 Accéder à Google Cloud Console

1. **Allez sur** : https://console.cloud.google.com/
2. **Connectez-vous** avec votre compte Google
3. Si c'est votre première fois, acceptez les conditions d'utilisation

### 1.2 Créer un Nouveau Projet

1. **En haut de la page**, cliquez sur le **sélecteur de projet** (à côté de "Google Cloud")
2. **Cliquez sur "Nouveau projet"** ou "New Project"
3. **Remplissez le formulaire** :
   - **Nom du projet** : `Capso AI` (ou n'importe quel nom)
   - **Organisation** : Laissez par défaut
   - **Emplacement** : Laissez par défaut
4. **Cliquez sur "Créer"** ou "Create"
5. **Attendez** que le projet soit créé (quelques secondes)

### 1.3 Sélectionner le Projet

1. **En haut de la page**, cliquez à nouveau sur le **sélecteur de projet**
2. **Sélectionnez** le projet que vous venez de créer (`Capso AI`)

---

## 📝 ÉTAPE 2 : Activer les APIs Nécessaires

### 2.1 Accéder à la Bibliothèque d'APIs

1. **Dans le menu de gauche**, cliquez sur **"APIs et services"** ou "APIs & Services"
2. **Cliquez sur "Bibliothèque"** ou "Library"

### 2.2 Activer Google Identity API

1. **Dans la barre de recherche**, tapez : `Google Identity`
2. **Cliquez sur "Google Identity"** ou "Google Identity Services API"
3. **Cliquez sur "Activer"** ou "Enable"
4. **Attendez** que l'API soit activée

**Alternative :** Vous pouvez aussi activer "Google+ API" (ancienne méthode, mais fonctionne toujours)

---

## 📝 ÉTAPE 3 : Configurer l'Écran de Consentement OAuth

### 3.1 Accéder à l'Écran de Consentement

1. **Dans le menu de gauche**, allez dans **"APIs et services"** → **"Écran de consentement OAuth"** ou "OAuth consent screen"
2. Si c'est la première fois, Google vous demandera de configurer l'écran

### 3.2 Choisir le Type d'Utilisateur

1. **Sélectionnez "Externe"** (External) - sauf si vous avez Google Workspace
2. **Cliquez sur "Créer"** ou "Create"

### 3.3 Remplir les Informations de l'Application

**Onglet "Informations sur l'application"** :

1. **Nom de l'application** : `Capso AI`
2. **Adresse e-mail du support utilisateur** : Votre email (ex: `votre-email@gmail.com`)
3. **Logo de l'application** : (Optionnel) Téléchargez votre logo
4. **Domaine de l'application** : `capsoai.com` (si vous avez un domaine)
5. **Adresse e-mail du développeur** : Votre email
6. **Cliquez sur "Enregistrer et continuer"** ou "Save and Continue"

### 3.4 Configurer les Scopes (Portées)

1. **Laissez les scopes par défaut** (email, profile, openid)
2. **Cliquez sur "Enregistrer et continuer"** ou "Save and Continue"

### 3.5 Ajouter des Utilisateurs de Test (Si en Mode Test)

1. **Si vous êtes en mode "Test"** :
   - **Cliquez sur "+ Ajouter des utilisateurs"** ou "+ Add users"
   - **Ajoutez votre email** et les emails des utilisateurs de test
   - **Cliquez sur "Ajouter"** ou "Add"
2. **Cliquez sur "Enregistrer et continuer"** ou "Save and Continue"

### 3.6 Résumé

1. **Vérifiez** toutes les informations
2. **Cliquez sur "Retour au tableau de bord"** ou "Back to Dashboard"

**⚠️ Important :** Si vous êtes en mode "Test", seuls les utilisateurs de test pourront se connecter. Pour permettre à tous les utilisateurs de se connecter, vous devrez publier l'application plus tard.

---

## 📝 ÉTAPE 4 : Créer les Identifiants OAuth 2.0

### 4.1 Accéder aux Identifiants

1. **Dans le menu de gauche**, allez dans **"APIs et services"** → **"Identifiants"** ou "Credentials"
2. **En haut de la page**, cliquez sur **"+ CRÉER DES IDENTIFIANTS"** ou "+ CREATE CREDENTIALS"
3. **Sélectionnez "ID client OAuth"** ou "OAuth client ID"

### 4.2 Configurer l'ID Client OAuth

**Si c'est la première fois**, Google vous demandera peut-être de configurer l'écran de consentement (vous l'avez déjà fait à l'Étape 3).

1. **Type d'application** : Sélectionnez **"Application Web"** ou "Web application"

2. **Nom** : `Capso AI Web Client` (ou n'importe quel nom)

3. **Origines JavaScript autorisées** (Authorized JavaScript origins) :
   - **Cliquez sur "+ AJOUTER UN URI"** ou "+ ADD URI"
   - **Pour le développement local** : `http://localhost:3000`
     - **OU** `http://127.0.0.1:3000` (si localhost ne fonctionne pas)
   - **Pour la production** : `https://capsoai.com`
   - **Cliquez sur "+ AJOUTER UN URI"** à nouveau pour ajouter les deux
   
   **⚠️ Important :**
   - Incluez le protocole (`http://` ou `https://`)
   - Pas de slash à la fin (`/`)
   - Pas de chemin (juste le domaine et le port)

4. **URI de redirection autorisés** (Authorized redirect URIs) :
   - **Cliquez sur "+ AJOUTER UN URI"** ou "+ ADD URI"
   - **Pour le développement local** : `http://localhost:3000/api/auth/callback/google`
     - **OU** `http://127.0.0.1:3000/api/auth/callback/google`
   - **Pour la production** : `https://capsoai.com/api/auth/callback/google`
   - **Cliquez sur "+ AJOUTER UN URI"** à nouveau pour ajouter les deux
   
   **⚠️ Important :**
   - Doit correspondre exactement (y compris `/api/auth/callback/google`)
   - Incluez le protocole
   - Pas de slash à la fin

5. **Cliquez sur "CRÉER"** ou "Create"

### 4.3 Copier les Identifiants

**⚠️ TRÈS IMPORTANT : Copiez ces informations IMMÉDIATEMENT - vous ne pourrez plus voir le secret après !**

Après avoir cliqué sur "Créer", Google vous montre une popup avec :

1. **Votre ID client** (Client ID) :
   - Format : `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Cliquez sur l'icône de copie** ou sélectionnez et copiez (Cmd+C / Ctrl+C)
   - **Notez-le quelque part** (dans un fichier texte sécurisé)

2. **Votre Secret client** (Client Secret) :
   - Format : `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **⚠️ COPIEZ-LE MAINTENANT** - vous ne pourrez plus le voir après !
   - **Notez-le quelque part** (dans un fichier texte sécurisé)

3. **Cliquez sur "OK"** pour fermer la popup

**💡 Astuce :** Si vous perdez le secret, vous devrez créer de nouveaux identifiants.

---

## 📝 ÉTAPE 5 : Ajouter les Variables d'Environnement

### 5.1 Pour le Développement Local (.env.local)

1. **Ouvrez le fichier** `.env.local` dans votre projet
   - Chemin : `/Users/owensolano/Desktop/Briefly AI/briefly-ai-landing-page (1) 2 12.53.18/.env.local`

2. **Ajoutez ces lignes** :

```bash
# Google OAuth
GOOGLE_CLIENT_ID=votre-client-id-ici.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret-ici

# NextAuth (pour le développement)
NEXTAUTH_URL=http://localhost:3000
# OU si vous utilisez 127.0.0.1 :
# NEXTAUTH_URL=http://127.0.0.1:3000
```

3. **Remplacez** :
   - `votre-client-id-ici.apps.googleusercontent.com` par votre **Client ID** réel
   - `votre-client-secret-ici` par votre **Client Secret** réel

4. **Sauvegardez** le fichier

### 5.2 Pour la Production (Netlify)

1. **Allez sur votre dashboard Netlify** : https://app.netlify.com
2. **Sélectionnez votre site** (`capsoai.com`)
3. **Allez dans** : **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
4. **Ajoutez ces variables** :

```
GOOGLE_CLIENT_ID=votre-client-id-ici.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret-ici
NEXTAUTH_URL=https://capsoai.com
```

5. **Remplacez** avec vos vraies valeurs
6. **Cliquez sur "Save"**

**⚠️ Important :** 
- Utilisez les **mêmes identifiants** que ceux créés dans Google Cloud Console
- Assurez-vous que `https://capsoai.com` est dans les "Origines JavaScript autorisées" dans Google Console

---

## 📝 ÉTAPE 6 : Modifier le Code NextAuth (À Faire Plus Tard)

**⚠️ Note :** Cette étape nécessite de modifier le code. Pour l'instant, voici ce qu'il faudra faire :

### 6.1 Modifier `app/api/auth/[...nextauth]/route.ts`

Il faudra ajouter le `GoogleProvider` dans la liste des providers :

```typescript
import GoogleProvider from "next-auth/providers/google"

// Dans authOptions, ajouter dans providers :
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... autres providers existants
]
```

### 6.2 Vérifier que les Packages sont Installés

Il faudra vérifier que `next-auth` est installé (il devrait déjà l'être).

---

## 📝 ÉTAPE 7 : Tester la Connexion Google

### 7.1 Redémarrer le Serveur de Développement

1. **Arrêtez** le serveur actuel (Ctrl+C)
2. **Redémarrez** :
   ```bash
   npm run dev
   ```

### 7.2 Tester la Connexion

1. **Allez sur** : `http://localhost:3000/signup` (ou `/login`)
2. **Cherchez le bouton** "Sign up with Google" ou "Sign in with Google"
3. **Cliquez dessus**
4. **Vous devriez être redirigé** vers la page de connexion Google
5. **Connectez-vous** avec votre compte Google
6. **Vous devriez être redirigé** vers votre application

---

## 🚨 Dépannage

### Erreur : "redirect_uri_mismatch"

**Problème :** L'URI de redirection dans Google Console ne correspond pas à votre app.

**Solution :**
1. Vérifiez votre `.env.local` pour `NEXTAUTH_URL`
2. Assurez-vous que l'URI de redirection dans Google Console correspond exactement :
   - Développement : `http://localhost:3000/api/auth/callback/google`
   - Production : `https://capsoai.com/api/auth/callback/google`
3. Vérifiez qu'il n'y a pas de slash à la fin

### Erreur : "invalid_client"

**Problème :** Client ID ou Client Secret incorrect.

**Solution :**
1. Vérifiez votre `.env.local` (ou variables Netlify)
2. Assurez-vous qu'il n'y a pas d'espaces supplémentaires
3. Vérifiez que vous avez copié les valeurs complètes
4. Redémarrez votre serveur après les modifications

### Erreur : "access_denied"

**Problème :** Écran de consentement OAuth non configuré ou application en mode test.

**Solution :**
1. Retournez dans Google Cloud Console
2. Complétez la configuration de l'écran de consentement OAuth
3. Ajoutez votre email comme utilisateur de test (si en mode test)
4. Ou publiez l'application pour permettre à tous les utilisateurs de se connecter

### Le Bouton Google N'Apparaît Pas

**Problème :** Variables d'environnement manquantes.

**Solution :**
1. Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont dans `.env.local`
2. Redémarrez votre serveur
3. Vérifiez que les variables sont bien chargées (pas d'erreurs dans la console)

---

## 📋 Checklist Complète

### Configuration Google Cloud
- [ ] Projet Google Cloud créé
- [ ] Google Identity API activée
- [ ] Écran de consentement OAuth configuré
- [ ] ID client OAuth créé (Application Web)
- [ ] Origines JavaScript autorisées ajoutées :
  - [ ] `http://localhost:3000` (développement)
  - [ ] `https://capsoai.com` (production)
- [ ] URI de redirection autorisés ajoutés :
  - [ ] `http://localhost:3000/api/auth/callback/google` (développement)
  - [ ] `https://capsoai.com/api/auth/callback/google` (production)
- [ ] Client ID copié et sauvegardé
- [ ] Client Secret copié et sauvegardé

### Configuration Application
- [ ] Variables d'environnement ajoutées dans `.env.local` :
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXTAUTH_URL`
- [ ] Variables d'environnement ajoutées dans Netlify :
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXTAUTH_URL=https://capsoai.com`

### Code (À Faire Plus Tard)
- [ ] `GoogleProvider` ajouté dans `app/api/auth/[...nextauth]/route.ts`
- [ ] Packages vérifiés (`next-auth` installé)
- [ ] Serveur redémarré
- [ ] Connexion Google testée en développement
- [ ] Connexion Google testée en production

---

## 🎯 Résumé des URLs à Configurer dans Google Console

### Origines JavaScript Autorisées :
```
http://localhost:3000
https://capsoai.com
```

### URI de Redirection Autorisés :
```
http://localhost:3000/api/auth/callback/google
https://capsoai.com/api/auth/callback/google
```

---

## 📚 Ressources Utiles

- **Google Cloud Console** : https://console.cloud.google.com/
- **Documentation NextAuth Google Provider** : https://next-auth.js.org/providers/google
- **Documentation Google OAuth** : https://developers.google.com/identity/protocols/oauth2

---

## ⚠️ Notes Importantes

1. **Ne partagez JAMAIS** votre Client Secret publiquement
2. **Gardez une copie** de votre Client Secret dans un endroit sûr
3. **Utilisez des identifiants différents** pour le développement et la production (recommandé)
4. **Publiez l'application** dans Google Console quand vous êtes prêt à permettre à tous les utilisateurs de se connecter
5. **Testez toujours** en développement avant de déployer en production

---

## 🆘 Besoin d'Aide ?

Si vous êtes bloqué à une étape :
1. Vérifiez la checklist ci-dessus
2. Consultez la section Dépannage
3. Vérifiez que toutes les URLs correspondent exactement
4. Assurez-vous que les variables d'environnement sont bien définies

**Une fois que vous avez terminé toutes ces étapes, vous pourrez modifier le code pour activer Google OAuth !**




