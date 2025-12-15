# 🎯 Guide Étape par Étape : Google Search Console

## 📍 ÉTAPE 3 : Vérifier la Propriété (OÙ TROUVER "BALISAGE HTML")

### Ce que vous voyez après avoir cliqué sur "Continuer"

Après avoir entré `https://capsoai.com` et cliqué sur "Continuer", Google vous montre une page avec le titre :

**"Vérifier la propriété"** ou **"Verify ownership"**

### Où trouver "Balisage HTML" - 3 Possibilités

#### Possibilité 1 : Onglets en Haut (Le Plus Commun)

```
┌─────────────────────────────────────────────────────┐
│  Vérifier la propriété                              │
├─────────────────────────────────────────────────────┤
│  [Balisage HTML] [Fichier HTML] [DNS] [Analytics]   │ ← Onglets ici
│                                                     │
│  Copiez cette balise dans la section <head> de     │
│  votre page d'accueil :                             │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ <meta name="google-site-verification"        │ │
│  │       content="VOTRE_CODE_ICI" />            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  [Copier]                    [Vérifier]            │
└─────────────────────────────────────────────────────┘
```

**Action :** Cliquez sur l'onglet **"Balisage HTML"** (il devrait être sélectionné par défaut)

#### Possibilité 2 : Liste Déroulante

```
┌─────────────────────────────────────────────────────┐
│  Vérifier la propriété                              │
├─────────────────────────────────────────────────────┤
│  Méthode de vérification :                           │
│  ┌───────────────────────────────────────────────┐ │
│  │ ▼ Balisage HTML                    ▼          │ │ ← Menu déroulant
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Copiez cette balise...                             │
│  ┌───────────────────────────────────────────────┐ │
│  │ <meta name="google-site-verification"        │ │
│  │       content="VOTRE_CODE_ICI" />            │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Action :** Cliquez sur la flèche ▼ et choisissez **"Balisage HTML"**

#### Possibilité 3 : Cartes/Boîtes à Cliquer

```
┌─────────────────────────────────────────────────────┐
│  Vérifier la propriété                              │
├─────────────────────────────────────────────────────┤
│  Choisissez une méthode :                            │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ Balisage     │  │ Fichier      │               │
│  │ HTML         │  │ HTML         │               │
│  │              │  │              │               │
│  │ [Sélectionner]│  │ [Sélectionner]│             │
│  └──────────────┘  └──────────────┘               │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ DNS          │  │ Analytics    │               │
│  │              │  │              │               │
│  │ [Sélectionner]│  │ [Sélectionner]│             │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

**Action :** Cliquez sur la carte **"Balisage HTML"**

### Si vous ne trouvez toujours pas "Balisage HTML"

1. **Faites défiler la page vers le bas** - il peut y avoir plus d'options
2. **Cherchez les mots** : "HTML tag", "Meta tag", "Verification tag"
3. **Essayez "Fichier HTML"** à la place (je vous aiderai à l'ajouter)
4. **Prenez une capture d'écran** et dites-moi ce que vous voyez

### Une fois que vous avez trouvé "Balisage HTML"

1. **Google vous montre un code** comme :
   ```html
   <meta name="google-site-verification" content="abc123xyz789DEF456ghi012jkl345mno678pqr" />
   ```

2. **Copiez UNIQUEMENT la partie entre les guillemets après "content="**
   - Exemple : `abc123xyz789DEF456ghi012jkl345mno678pqr`
   - **Ne copiez PAS** les guillemets `"` ni le `<meta>` ni `/>`

3. **Envoyez-moi ce code** (juste la partie "content")

4. **Je l'ajouterai au site** et je vous dirai quand c'est fait

---

## 📍 ÉTAPE 4 : Soumettre le Sitemap (OÙ TROUVER "SITEMAPS")

### IMPORTANT : Vous devez d'abord vérifier votre propriété !

Si vous n'avez pas encore vérifié votre propriété (Étape 3), vous ne verrez pas "Sitemaps" dans le menu.

### Comment accéder à "Sitemaps"

#### Étape 1 : Vérifier que vous êtes sur la page principale

1. **Dans Google Search Console**, vous devriez voir en haut :
   - Le nom de votre site : `https://capsoai.com`
   - Un menu avec "Vue d'ensemble" ou "Overview"

#### Étape 2 : Trouver le menu de gauche

**Option A : Menu visible**

```
┌──────────┬──────────────────────────────────────┐
│          │  Vue d'ensemble                      │
│          │                                      │
│  Vue     │  [Contenu du tableau de bord]        │
│  d'      │                                      │
│  ensemble│                                      │
│          │                                      │
│  Perfor- │                                      │
│  mance   │                                      │
│          │                                      │
│  Couver- │                                      │
│  ture    │                                      │
│          │                                      │
│  Sitemaps│ ← Cliquez ici !                     │
│          │                                      │
│  Amélio- │                                      │
│  rations │                                      │
│          │                                      │
│  Paramè- │                                      │
│  tres    │                                      │
└──────────┴──────────────────────────────────────┘
```

**Action :** Cliquez sur **"Sitemaps"** dans le menu de gauche

**Option B : Menu caché (icône hamburger)**

```
┌──────────────────────────────────────────────────┐
│ ☰  Google Search Console    [capsoai.com]       │ ← Icône menu ici
├──────────────────────────────────────────────────┤
│                                                   │
│  Vue d'ensemble                                   │
│  [Contenu...]                                     │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Action :**
1. Cliquez sur l'**icône ☰** (trois lignes horizontales) en haut à gauche
2. Le menu devrait s'ouvrir sur le côté
3. Cliquez sur **"Sitemaps"**

#### Étape 3 : Si vous ne voyez toujours pas "Sitemaps"

**Vérifiez que :**
1. ✅ Votre propriété est **vérifiée** (vous avez fait l'Étape 3)
2. ✅ Vous êtes connecté au bon compte Google
3. ✅ Vous avez sélectionné la bonne propriété (`https://capsoai.com`)

**Si "Sitemaps" n'apparaît toujours pas :**
- Essayez de rafraîchir la page (F5)
- Déconnectez-vous et reconnectez-vous
- Attendez quelques minutes (parfois Google met du temps à mettre à jour)

### Une fois sur la page "Sitemaps"

Vous verrez quelque chose comme :

```
┌──────────────────────────────────────────────────┐
│  Sitemaps                                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  Ajouter un nouveau sitemap                     │
│  ┌──────────────────────────────────────────┐   │
│  │ sitemap.xml                    [Envoyer]  │   │ ← Entrez ici
│  └──────────────────────────────────────────┘   │
│                                                  │
│  Sitemaps soumis                                 │
│  (Cette section sera vide au début)              │
└──────────────────────────────────────────────────┘
```

**Action :**
1. **Dans le champ de texte**, entrez : `sitemap.xml`
   - **OU** si Google demande l'URL complète : `https://capsoai.com/sitemap.xml`
2. **Cliquez sur "Envoyer"** ou "Submit"
3. **Google va vérifier** et vous montrera :
   - ✅ "Sitemap soumis avec succès" si tout est bon
   - ❌ Un message d'erreur si quelque chose ne va pas

### Vérifier que le sitemap fonctionne AVANT de soumettre

**Test rapide :**
1. Ouvrez un **nouvel onglet** dans votre navigateur
2. Allez sur : **https://capsoai.com/sitemap.xml**
3. **Vous devriez voir du XML** (du code avec des balises)

**Si vous voyez une erreur 404 :**
- Attendez que Netlify redéploie le site (2-3 minutes)
- Vérifiez que le fichier `app/sitemap.ts` existe dans votre projet

---

## 🆘 AIDE : Si Vous Êtes Bloqué

### Problème : "Je ne trouve pas 'Balisage HTML'"

**Solutions :**
1. Faites défiler la page vers le bas
2. Cherchez "HTML tag" ou "Meta tag"
3. Essayez "Fichier HTML" à la place
4. **Dites-moi exactement ce que vous voyez** et je vous guiderai

### Problème : "Je ne vois pas le menu de gauche"

**Solutions :**
1. Cliquez sur l'icône ☰ (menu hamburger) en haut à gauche
2. Rafraîchissez la page (F5)
3. Vérifiez que vous êtes sur la page principale de Google Search Console

### Problème : "Je ne vois pas 'Sitemaps' dans le menu"

**Solutions :**
1. **Vérifiez d'abord votre propriété** (Étape 3) - c'est obligatoire !
2. Attendez quelques minutes après la vérification
3. Rafraîchissez la page

### Problème : "Le sitemap ne fonctionne pas"

**Solutions :**
1. Testez : https://capsoai.com/sitemap.xml dans votre navigateur
2. Si erreur 404, attendez que Netlify redéploie
3. Vérifiez que `app/sitemap.ts` existe dans votre projet

---

## ✅ Checklist Visuelle

- [ ] Je suis sur Google Search Console
- [ ] J'ai ajouté `https://capsoai.com` comme propriété
- [ ] Je vois la page "Vérifier la propriété"
- [ ] J'ai trouvé "Balisage HTML" (ou "Fichier HTML")
- [ ] J'ai copié le code de vérification
- [ ] J'ai envoyé le code à l'assistant
- [ ] Le code a été ajouté au site
- [ ] J'ai cliqué sur "Vérifier" dans Google Search Console
- [ ] La propriété est vérifiée ✅
- [ ] Je vois le menu de gauche
- [ ] J'ai trouvé "Sitemaps" dans le menu
- [ ] J'ai soumis `sitemap.xml`
- [ ] Le sitemap est accepté ✅

---

## 📞 Besoin d'Aide Immédiate ?

**Dites-moi exactement où vous êtes bloqué :**

- "Je suis sur la page de vérification mais je ne vois pas 'Balisage HTML'"
- "Je ne vois pas le menu de gauche"
- "Je ne vois pas 'Sitemaps' dans le menu"
- "Le sitemap ne fonctionne pas"

**Et je vous guiderai étape par étape !** 🚀




