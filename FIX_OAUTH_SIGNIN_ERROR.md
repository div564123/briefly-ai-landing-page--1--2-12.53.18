# 🔧 Fix: OAuthSignin Error

## ❌ Erreur Actuelle

Vous voyez cette erreur :
```
https://capsoai.com/api/auth/signin?error=OAuthSignin
```

Cela signifie que la connexion Google OAuth échoue.

---

## 🔍 Causes Possibles

### 1. Client ID ou Client Secret Incorrect
- Les valeurs dans Netlify ne correspondent pas à celles de Google Console
- Il y a des espaces ou des caractères incorrects

### 2. URLs de Redirection Non Correspondantes
- L'URL dans Google Console ne correspond pas exactement à celle utilisée
- Format incorrect (slash manquant ou en trop)

### 3. Variables d'Environnement Manquantes
- `GOOGLE_CLIENT_ID` ou `GOOGLE_CLIENT_SECRET` non définis dans Netlify
- `NEXTAUTH_URL` incorrect

### 4. Application Google en Mode "Test"
- Si l'application est en mode test, seuls les utilisateurs de test peuvent se connecter

---

## ✅ Solutions Étape par Étape

### Solution 1 : Vérifier les Variables d'Environnement dans Netlify

1. **Allez sur Netlify Dashboard** : https://app.netlify.com
2. **Sélectionnez votre site** (`capsoai.com`)
3. **Allez dans** : **Site settings** → **Build & deploy** → **Environment** → **Environment variables**
4. **Vérifiez que ces variables existent** :
   ```
   GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=votre-client-secret
   NEXTAUTH_URL=https://capsoai.com
   ```
5. **Vérifiez qu'il n'y a pas d'espaces** avant ou après les valeurs
6. **Redéployez** le site après modification

### Solution 2 : Vérifier la Configuration Google Console

1. **Allez sur Google Cloud Console** : https://console.cloud.google.com
2. **Sélectionnez votre projet**
3. **Allez dans** : **APIs & Services** → **Credentials**
4. **Cliquez sur votre OAuth 2.0 Client ID**

5. **Vérifiez "Authorized JavaScript origins"** :
   ```
   https://capsoai.com
   ```
   - ✅ Doit commencer par `https://`
   - ✅ Pas de slash à la fin
   - ✅ Pas de chemin (juste le domaine)

6. **Vérifiez "Authorized redirect URIs"** :
   ```
   https://capsoai.com/api/auth/callback/google
   ```
   - ✅ Doit correspondre EXACTEMENT
   - ✅ Inclut `/api/auth/callback/google`
   - ✅ Pas de slash à la fin

7. **Cliquez sur "Save"**

### Solution 3 : Vérifier que les Identifiants Correspondent

1. **Dans Google Console**, copiez votre **Client ID** et **Client Secret**
2. **Dans Netlify**, vérifiez que les valeurs correspondent **exactement**
3. **Attention** :
   - Pas d'espaces
   - Pas de guillemets
   - Copier-coller exact

### Solution 4 : Vérifier le Mode de l'Application

1. **Dans Google Console**, allez dans **APIs & Services** → **OAuth consent screen**
2. **Vérifiez le statut** :
   - Si "Testing" : Seuls les utilisateurs de test peuvent se connecter
   - Si "In production" : Tous les utilisateurs peuvent se connecter

3. **Si en mode "Testing"** :
   - Ajoutez votre email dans "Test users"
   - Ou publiez l'application (changez à "In production")

### Solution 5 : Vérifier les Logs Netlify

1. **Dans Netlify Dashboard**, allez dans **Functions** → **View logs**
2. **Cherchez les erreurs** liées à OAuth
3. **Les logs vous diront** exactement quel est le problème

---

## 🔍 Checklist de Vérification

- [ ] `GOOGLE_CLIENT_ID` est défini dans Netlify
- [ ] `GOOGLE_CLIENT_SECRET` est défini dans Netlify
- [ ] `NEXTAUTH_URL=https://capsoai.com` est défini dans Netlify
- [ ] Les valeurs dans Netlify correspondent à celles de Google Console
- [ ] `https://capsoai.com` est dans "Authorized JavaScript origins"
- [ ] `https://capsoai.com/api/auth/callback/google` est dans "Authorized redirect URIs"
- [ ] Pas d'espaces dans les valeurs
- [ ] Pas de slash à la fin des URLs
- [ ] Application Google publiée (ou votre email est dans les test users)
- [ ] Site redéployé après modifications

---

## 🚨 Erreurs Communes

### Erreur : "redirect_uri_mismatch"
**Cause** : L'URL de redirection ne correspond pas exactement  
**Solution** : Vérifiez que `https://capsoai.com/api/auth/callback/google` est exactement dans Google Console

### Erreur : "invalid_client"
**Cause** : Client ID ou Secret incorrect  
**Solution** : Vérifiez que les valeurs dans Netlify correspondent exactement à Google Console

### Erreur : "access_denied"
**Cause** : Application en mode test et vous n'êtes pas dans les test users  
**Solution** : Ajoutez votre email dans les test users ou publiez l'application

---

## 📝 Configuration Correcte

### Dans Netlify (Environment Variables) :
```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
NEXTAUTH_URL=https://capsoai.com
```

### Dans Google Console (OAuth 2.0 Client ID) :

**Authorized JavaScript origins:**
```
https://capsoai.com
```

**Authorized redirect URIs:**
```
https://capsoai.com/api/auth/callback/google
```

---

## 🔄 Après Avoir Corrigé

1. **Sauvegardez** toutes les modifications
2. **Redéployez** le site sur Netlify (ou attendez le redéploiement automatique)
3. **Attendez 2-3 minutes** pour que les changements prennent effet
4. **Testez à nouveau** la connexion Google

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

1. **Vérifiez les logs Netlify** pour voir l'erreur exacte
2. **Testez avec un autre navigateur** (ou mode incognito)
3. **Vérifiez que le certificat SSL** est actif sur `capsoai.com`
4. **Assurez-vous que** `https://capsoai.com` fonctionne (pas d'erreur SSL)

---

## 💡 Note Importante

L'erreur `OAuthSignin` est générique. Pour trouver la cause exacte, vérifiez :
- Les logs Netlify (Functions → View logs)
- La console du navigateur (F12 → Console)
- Les erreurs dans Google Console (si disponibles)




