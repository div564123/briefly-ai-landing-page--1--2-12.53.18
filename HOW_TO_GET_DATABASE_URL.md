# Comment obtenir DATABASE_URL depuis Supabase

## Étape 1 : Créer un compte Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"** ou **"Sign in"**
3. Connectez-vous avec GitHub (recommandé) ou créez un compte

## Étape 2 : Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"** (bouton vert en haut à droite)
2. Remplissez les informations :
   - **Name** : `capso-ai` (ou le nom que vous voulez)
   - **Database Password** : Créez un mot de passe fort (⚠️ **SAVEZ-LE**, vous en aurez besoin)
   - **Region** : Choisissez la région la plus proche (ex: `West US (N. California)`)
   - **Pricing Plan** : Sélectionnez **Free**
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes que le projet soit créé

## Étape 3 : Trouver la Connection String (URI)

### Méthode 1 : Via Settings (Recommandé)

1. Dans votre projet Supabase, regardez la **barre latérale gauche**
2. Cliquez sur l'icône **⚙️ Settings** (en bas de la barre latérale)
3. Dans le menu qui s'ouvre, cliquez sur **"Database"**
4. Vous verrez une section **"Connection string"**
5. Il y a plusieurs onglets : **URI**, **JDBC**, **Golang**, etc.
6. Cliquez sur l'onglet **"URI"**
7. Vous verrez quelque chose comme :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
8. ⚠️ **IMPORTANT** : Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez créé à l'étape 2
9. Exemple final :
   ```
   postgresql://postgres:MonMotDePasse123@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

### Méthode 2 : Via Project Settings

1. Cliquez sur l'icône **⚙️ Settings** (en bas de la barre latérale)
2. Cliquez sur **"Project Settings"** (tout en haut)
3. Dans le menu de gauche, cliquez sur **"Database"**
4. Faites défiler jusqu'à la section **"Connection string"**
5. Cliquez sur l'onglet **"URI"**
6. Copiez la chaîne et remplacez `[YOUR-PASSWORD]` par votre mot de passe

### Méthode 3 : Via l'onglet SQL Editor (Alternative)

1. Dans la barre latérale, cliquez sur **"SQL Editor"** (icône avec `</>`)
2. En haut à droite, vous verrez **"Connection info"** ou un bouton avec une icône de base de données
3. Cliquez dessus pour voir les informations de connexion

## Étape 4 : Format de la Connection String

La connection string doit ressembler à ceci :

```
postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres
```

**Composants :**
- `postgresql://` - Protocole
- `postgres` - Nom d'utilisateur (toujours "postgres" sur Supabase)
- `:VOTRE_MOT_DE_PASSE` - Votre mot de passe (celui créé lors de la création du projet)
- `@db.xxxxx.supabase.co` - L'adresse du serveur (unique pour votre projet)
- `:5432` - Le port (toujours 5432 pour PostgreSQL)
- `/postgres` - Le nom de la base de données (toujours "postgres" sur Supabase)

## Étape 5 : Si vous avez oublié votre mot de passe

1. Allez dans **Settings** → **Database**
2. Faites défiler jusqu'à **"Database password"**
3. Cliquez sur **"Reset database password"**
4. Créez un nouveau mot de passe
5. ⚠️ Mettez à jour votre connection string avec le nouveau mot de passe

## Étape 6 : Tester la connection

Une fois que vous avez votre connection string, vous pouvez la tester :

1. Copiez la connection string complète
2. Elle devrait ressembler à :
   ```
   postgresql://postgres:MonMotDePasse123@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```
3. Cette chaîne complète est votre `DATABASE_URL`

## ⚠️ Important

- **Ne partagez JAMAIS** votre connection string publiquement
- **Ne commitez JAMAIS** votre connection string dans Git
- Le mot de passe est sensible à la casse (majuscules/minuscules)
- Si votre mot de passe contient des caractères spéciaux, ils doivent être encodés en URL (ex: `@` devient `%40`)

## Prochaine étape

Une fois que vous avez votre `DATABASE_URL`, ajoutez-la dans Netlify :
1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site
3. **Site settings** → **Build & deploy** → **Environment**
4. Cliquez sur **"Add variable"**
5. **Key** : `DATABASE_URL`
6. **Value** : Collez votre connection string complète
7. Cliquez sur **"Save"**






