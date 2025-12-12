# Comment trouver la Connection String dans Supabase

## Méthode 1 : Via Project Settings (Recommandé)

1. **Dans la page où vous êtes** (Database Settings), regardez en **haut de la page**
2. Vous devriez voir un onglet ou un lien **"Project Settings"** (à côté de "Database")
3. Cliquez sur **"Project Settings"**
4. Dans le menu de gauche, cliquez sur **"Database"**
5. Faites défiler jusqu'à la section **"Connection string"** ou **"Connection info"**
6. Cliquez sur l'onglet **"URI"**

## Méthode 2 : Construire la Connection String manuellement

Si vous ne trouvez pas la section "Connection string", vous pouvez la construire avec les informations disponibles :

### Étape 1 : Trouver l'URL de votre base de données

1. Dans la page **Database Settings** où vous êtes, regardez en **haut de la page**
2. Vous devriez voir quelque chose comme **"Project URL"** ou **"API URL"**
3. Ou allez dans **Settings** → **API** (dans le menu de gauche)
4. Vous verrez **"Project URL"** qui ressemble à : `https://xxxxx.supabase.co`
5. L'URL de la base de données est : `db.xxxxx.supabase.co` (remplacez `https://` par `db.` et enlevez le `/` à la fin)

### Étape 2 : Construire la Connection String

Format de la connection string :
```
postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres
```

**Exemple :**
- Si votre Project URL est : `https://abcdefghijklmnop.supabase.co`
- Votre mot de passe est : `MonMotDePasse123`
- Alors votre connection string sera :
```
postgresql://postgres:MonMotDePasse123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Méthode 3 : Via l'onglet "Connection string" (si visible)

1. Dans la page **Database Settings**, faites défiler **tout en bas**
2. Cherchez une section **"Connection string"** ou **"Connection info"**
3. Si vous la voyez, cliquez sur l'onglet **"URI"**
4. Vous verrez quelque chose comme :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

## Méthode 4 : Via SQL Editor

1. Dans la barre latérale gauche, cliquez sur **"SQL Editor"** (icône avec `</>`)
2. En haut à droite de l'éditeur SQL, cherchez un bouton **"Connection info"** ou une icône de base de données
3. Cliquez dessus pour voir les informations de connexion

## Méthode 5 : Trouver l'URL du projet

1. Dans la barre latérale gauche, cliquez sur **"Settings"** (⚙️)
2. Cliquez sur **"API"** (pas "Database")
3. Vous verrez **"Project URL"** qui ressemble à : `https://xxxxx.supabase.co`
4. Notez cette URL
5. L'URL de la base de données sera : `db.xxxxx.supabase.co` (remplacez `https://` par `db.`)

## Exemple complet

Si vous voyez dans Settings → API :
- **Project URL** : `https://abcdefghijklmnop.supabase.co`

Et que votre mot de passe de base de données est : `MonMotDePasse123`

Alors votre `DATABASE_URL` complète sera :
```
postgresql://postgres:MonMotDePasse123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## ⚠️ Important

- Le mot de passe est celui que vous avez créé lors de la création du projet
- Si vous ne vous en souvenez pas, utilisez **"Reset database password"** dans Database Settings
- L'URL de la base de données commence toujours par `db.` (pas `https://`)
- Le port est toujours `5432`
- Le nom de la base de données est toujours `postgres`






