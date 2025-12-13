# Comment ajouter les variables d'environnement dans Netlify

## ⚠️ IMPORTANT : Ne pas importer de fichier .env

**Ne cliquez PAS sur "Import variables"** - c'est moins sécurisé. Ajoutez les variables **une par une** manuellement.

## Méthode recommandée : Ajouter manuellement

### Étape 1 : Accéder à la page des variables

1. Vous êtes déjà sur la bonne page : **"Import environment variables"**
2. Cliquez sur **"Cancel"** (en bas à droite)
3. Vous serez redirigé vers la page principale des variables d'environnement

### Étape 2 : Ajouter chaque variable une par une

Pour chaque variable ci-dessous, suivez ces étapes :

1. Cliquez sur le bouton **"Add variable"** ou **"Add a variable"**
2. Remplissez :
   - **Key** : Le nom de la variable (ex: `DATABASE_URL`)
   - **Value** : La valeur (ex: votre connection string)
   - **Scopes** : Laissez "All scopes" (par défaut)
   - **Deploy contexts** : Laissez "All deploy contexts" (par défaut)
3. Cliquez sur **"Save"** ou **"Add variable"**

### Étape 3 : Liste des variables à ajouter

Ajoutez ces variables **dans cet ordre** :

#### 1. DATABASE_URL
- **Key** : `DATABASE_URL`
- **Value** : `postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres`
  (Remplacez `VOTRE_MOT_DE_PASSE` par votre vrai mot de passe)

#### 2. NEXTAUTH_SECRET
- **Key** : `NEXTAUTH_SECRET`
- **Value** : Générez avec : `openssl rand -base64 32`
  Ou utilisez : https://generate-secret.vercel.app/32

#### 3. NEXTAUTH_URL
- **Key** : `NEXTAUTH_URL`
- **Value** : `https://capsoai.com`

#### 4. OPENAI_API_KEY
- **Key** : `OPENAI_API_KEY`
- **Value** : `sk-...` (votre clé OpenAI)

#### 5. LEMONFOX_API_KEY
- **Key** : `LEMONFOX_API_KEY`
- **Value** : Votre clé LemonFox

#### 6. LEMONFOX_API_URL
- **Key** : `LEMONFOX_API_URL`
- **Value** : `https://api.lemonfox.ai/v1/audio/speech`

#### 7. STRIPE_SECRET_KEY (Optionnel - pour les paiements)
- **Key** : `STRIPE_SECRET_KEY`
- **Value** : `sk_test_...` (votre clé Stripe)

#### 8. STRIPE_WEBHOOK_SECRET (Optionnel - pour les paiements)
- **Key** : `STRIPE_WEBHOOK_SECRET`
- **Value** : `whsec_...` (votre secret webhook Stripe)

## Alternative : Si vous voulez vraiment importer

Si vous voulez absolument importer un fichier .env, voici le format :

### Créer un fichier .env (localement, pas sur Netlify)

Créez un fichier `.env` sur votre ordinateur avec ce contenu :

```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
NEXTAUTH_SECRET=votre-secret-genere-ici
NEXTAUTH_URL=https://capsoai.com
OPENAI_API_KEY=sk-votre-cle-openai
LEMONFOX_API_KEY=votre-cle-lemonfox
LEMONFOX_API_URL=https://api.lemonfox.ai/v1/audio/speech
STRIPE_SECRET_KEY=sk_test_votre-cle-stripe
STRIPE_WEBHOOK_SECRET=whsec_votre-secret-webhook
```

**⚠️ IMPORTANT :**
- Remplacez toutes les valeurs par vos vraies valeurs
- Ne commitez JAMAIS ce fichier dans Git
- Ne le partagez JAMAIS publiquement

### Puis importer dans Netlify

1. Cliquez sur **"Import variables"**
2. Sélectionnez votre fichier `.env`
3. Netlify détectera automatiquement les variables
4. Vérifiez que toutes les variables sont correctes
5. Cliquez sur **"Import"** ou **"Save"**

## ⚠️ Sécurité

- **Méthode manuelle = Plus sécurisée** (recommandée)
- **Import de fichier = Moins sécurisée** (risque d'exposer des secrets)

## Après avoir ajouté les variables

1. **Redéployez** votre site :
   - Allez dans **"Deploys"** (dans le menu de gauche)
   - Cliquez sur **"Trigger deploy"** → **"Deploy site"**

2. **Testez** :
   - Essayez de créer un compte
   - Les erreurs devraient disparaître








