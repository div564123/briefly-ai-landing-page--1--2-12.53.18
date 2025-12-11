# 🔧 Fix: "Cannot connect to database server" sur Netlify

## 🎯 Problème

Quand vous essayez de créer un compte sur votre site Netlify, vous voyez : "Cannot connect to database server"

## ✅ Solution en 4 étapes

### Étape 1: Ajouter DATABASE_URL dans Netlify Dashboard

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Connectez-vous à votre compte
3. Cliquez sur votre site (capsoai.com ou votre nom de site)
4. Cliquez sur **"Site settings"** (en haut)
5. Dans le menu de gauche, cliquez sur **"Build & deploy"**
6. Cliquez sur **"Environment"** (dans le menu de gauche)
7. Cliquez sur **"Environment variables"** (ou faites défiler)
8. Cherchez `DATABASE_URL` dans la liste

**Si DATABASE_URL n'existe PAS :**
- Cliquez sur **"Add variable"** (ou **"Add a variable"**)
- **Key:** `DATABASE_URL`
- **Value:** `postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres`
  - Remplacez `VOTRE_MOT_DE_PASSE` par votre vrai mot de passe Supabase
- **Scopes:** Laissez "All scopes" (par défaut)
- **Deploy contexts:** Laissez "All deploy contexts" (par défaut)
- Cliquez sur **"Save"** ou **"Add variable"**

**Si DATABASE_URL existe DÉJÀ :**
- Cliquez dessus pour l'éditer
- Vérifiez que la valeur commence par `postgresql://postgres:` (pas `postgresql://build:build@build:5432/build`)
- Vérifiez que le mot de passe est le vrai (pas `[PASSWORD]` ou placeholder)
- Si c'est incorrect, mettez à jour avec le bon mot de passe
- Cliquez sur **"Save"**

### Étape 2: Obtenir votre mot de passe Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous et sélectionnez votre projet
3. Cliquez sur **"Settings"** (icône engrenage) dans le menu de gauche
4. Cliquez sur **"Database"** (pas "Project Settings")
5. Faites défiler jusqu'à **"Database password"**
6. Copiez le mot de passe affiché
7. **Si vous ne voyez pas le mot de passe:**
   - Cliquez sur **"Reset database password"**
   - Copiez le nouveau mot de passe
   - **⚠️ Sauvegardez-le quelque part !**

### Étape 3: Construire votre DATABASE_URL

Format:
```
postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

**Exemple:**
Si votre mot de passe est `abc123`, votre DATABASE_URL sera:
```
postgresql://postgres:abc123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

**Si votre mot de passe contient des caractères spéciaux:**
- `?` → `%3F`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- Espace → `%20`

**Exemple avec caractère spécial:**
Si votre mot de passe est `MyPass?123`, utilisez:
```
postgresql://postgres:MyPass%3F123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

### Étape 4: Créer les tables dans la base de données

**⚠️ IMPORTANT: Même si DATABASE_URL est correct, les tables doivent exister !**

1. Ouvrez votre terminal
2. Assurez-vous d'être dans le dossier du projet
3. Vérifiez que `.env.local` contient DATABASE_URL:
   ```
   DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```
4. Exécutez:
   ```bash
   npx prisma db push
   ```
5. Vous devriez voir:
   ```
   ✔ Generated Prisma Client
   ✔ The database is now in sync with your schema.
   ```

### Étape 5: Redéployer sur Netlify

**⚠️ CRITICAL: Vous DEVEZ redéployer après avoir ajouté DATABASE_URL !**

1. Dans Netlify, allez dans l'onglet **"Deploys"**
2. Cliquez sur **"Trigger deploy"** → **"Deploy site"**
3. Attendez 2-3 minutes que le build se termine
4. Le site utilisera maintenant le nouveau DATABASE_URL

### Étape 6: Vérifier que les tables existent

1. Allez sur [supabase.com](https://supabase.com)
2. Votre projet → **"Table Editor"** (dans le menu de gauche)
3. Vous devriez voir les tables:
   - `User`
   - `AudioGeneration`
4. **Si les tables n'existent pas:** Exécutez `npx prisma db push` à nouveau

### Étape 7: Tester

1. Allez sur votre site Netlify
2. Essayez de créer un compte
3. L'erreur devrait être partie !

## 🔍 Vérification

### Vérifier que DATABASE_URL est correct dans Netlify:

1. Netlify → Site settings → Environment variables
2. Cliquez sur `DATABASE_URL`
3. Vérifiez:
   - ✅ Commence par `postgresql://postgres:`
   - ✅ Contient `db.eulpiddbrbqchwrkulug.supabase.co`
   - ✅ Contient votre vrai mot de passe (pas `[PASSWORD]` ou placeholder)
   - ✅ Ne contient PAS `build:build@build:5432`

### Vérifier les logs Netlify pour l'erreur exacte:

1. Netlify → Site settings → **Functions** → **Logs**
2. Cherchez les erreurs récentes (quand vous avez essayé de créer un compte)
3. L'erreur vous dira exactement ce qui ne va pas

## ❌ Erreurs courantes

### Erreur: "P1001: Can't reach database server"
**Cause:** DATABASE_URL pas configuré ou mot de passe incorrect
**Fix:** Vérifiez DATABASE_URL dans Netlify dashboard

### Erreur: "Table 'User' does not exist"
**Cause:** Tables non créées
**Fix:** Exécutez `npx prisma db push`

### Erreur: "Authentication failed"
**Cause:** Mot de passe incorrect dans DATABASE_URL
**Fix:** Réinitialisez le mot de passe dans Supabase et mettez à jour DATABASE_URL

## 📋 Checklist finale

- [ ] DATABASE_URL ajouté dans Netlify dashboard
- [ ] Mot de passe correct dans DATABASE_URL (pas de placeholder)
- [ ] Tables créées (`npx prisma db push` réussi)
- [ ] Tables visibles dans Supabase Table Editor
- [ ] Site redéployé sur Netlify après avoir ajouté DATABASE_URL
- [ ] Testé la création de compte - ça fonctionne !

## 🆘 Si ça ne fonctionne toujours pas

Partagez avec moi:
1. L'erreur exacte des logs Netlify (Functions → Logs)
2. Si DATABASE_URL est dans Netlify dashboard
3. Si les tables existent dans Supabase Table Editor
4. Si vous avez redéployé après avoir ajouté DATABASE_URL

