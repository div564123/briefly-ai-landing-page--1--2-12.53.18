# Checklist : Le signup fonctionne-t-il ?

## ✅ Ce qui a été fait

1. ✅ Code corrigé (gestion d'erreurs améliorée)
2. ✅ NEXTAUTH_SECRET généré : `6TG7t/f20Mzo+p/RbTL1iYoldf5fKl83tk7q8x/u3vU=`
3. ✅ URL Supabase trouvée : `https://eulpiddbrbqchwrkulug.supabase.co`

## ❓ À vérifier dans Netlify

### 1. Variables d'environnement ajoutées ?

Allez dans **Netlify** → **Site settings** → **Build & deploy** → **Environment**

Vérifiez que vous avez ajouté **TOUTES** ces variables :

- [ ] `DATABASE_URL` = `postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres`
- [ ] `NEXTAUTH_SECRET` = `6TG7t/f20Mzo+p/RbTL1iYoldf5fKl83tk7q8x/u3vU=`
- [ ] `NEXTAUTH_URL` = `https://capsoai.com`
- [ ] `OPENAI_API_KEY` = `sk-...` (votre clé OpenAI)
- [ ] `LEMONFOX_API_KEY` = `...` (votre clé LemonFox)
- [ ] `LEMONFOX_API_URL` = `https://api.lemonfox.ai/v1/audio/speech`

### 2. Tables de base de données créées ?

**IMPORTANT** : Même si vous avez ajouté `DATABASE_URL`, les tables n'existent pas encore dans votre base de données PostgreSQL.

Vous devez créer les tables. Options :

#### Option A : Via Prisma (Recommandé)

Dans votre terminal local :

```bash
# Assurez-vous d'avoir DATABASE_URL dans votre .env.local
npx prisma db push
```

Cela créera toutes les tables nécessaires.

#### Option B : Via Supabase SQL Editor

1. Allez sur Supabase → **SQL Editor**
2. Créez une nouvelle requête
3. Exécutez le SQL généré par Prisma (voir `prisma/schema.prisma`)

### 3. Site redéployé ?

Après avoir ajouté les variables d'environnement :

1. Allez dans **Netlify** → **Deploys**
2. Cliquez sur **"Trigger deploy"** → **"Deploy site"**
3. Attendez la fin du déploiement

## 🔍 Comment tester

1. Allez sur `https://capsoai.com`
2. Cliquez sur **"Sign up"** ou **"Create account"**
3. Remplissez le formulaire :
   - Email
   - Password
   - Name (optionnel)
4. Cliquez sur **"Sign up"**

### ✅ Si ça fonctionne :
- Vous serez redirigé vers le dashboard
- Vous pourrez vous connecter

### ❌ Si ça ne fonctionne pas :

Vérifiez les logs Netlify :
1. Allez dans **Netlify** → **Site settings** → **Functions** → **Logs**
2. Cherchez les erreurs récentes
3. Les erreurs courantes :
   - `DATABASE_URL not configured` → Variable manquante
   - `Can't reach database server` → Problème de connexion ou tables manquantes
   - `Table "User" does not exist` → Tables non créées

## 🚨 Erreurs courantes

### Erreur : "Database configuration error"
→ `DATABASE_URL` n'est pas configuré dans Netlify

### Erreur : "Table does not exist"
→ Les tables n'ont pas été créées dans PostgreSQL
→ Solution : Exécutez `npx prisma db push`

### Erreur : "Authentication error" (500 sur /api/auth/session)
→ `NEXTAUTH_SECRET` n'est pas configuré dans Netlify

### Erreur : "Can't reach database server"
→ Vérifiez que :
- Le mot de passe dans `DATABASE_URL` est correct
- La base de données Supabase est active
- Les tables existent

## 📋 Résumé rapide

Pour que le signup fonctionne, vous devez avoir :

1. ✅ Toutes les variables d'environnement dans Netlify
2. ✅ Les tables créées dans PostgreSQL (via `npx prisma db push`)
3. ✅ Le site redéployé sur Netlify

Une fois ces 3 choses faites, le signup devrait fonctionner ! 🎉









