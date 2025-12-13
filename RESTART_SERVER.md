# 🔄 Comment Redémarrer le Serveur

## Étapes pour Redémarrer le Serveur Next.js

### Option 1 : Si le serveur tourne dans le terminal actuel

1. **Arrêter le serveur** :
   - Appuyez sur `Ctrl + C` dans le terminal où le serveur tourne
   - Ou fermez le terminal

2. **Redémarrer le serveur** :
   ```bash
   npm run dev
   ```

---

### Option 2 : Si le serveur tourne en arrière-plan

1. **Trouver le processus** :
   ```bash
   ps aux | grep "next dev"
   ```
   Vous verrez quelque chose comme :
   ```
   owensolano  12345  ... node .../next dev
   ```

2. **Arrêter le processus** :
   ```bash
   kill 12345
   ```
   (Remplacez `12345` par le numéro de processus que vous avez vu)

   Ou pour forcer l'arrêt :
   ```bash
   kill -9 12345
   ```

3. **Redémarrer le serveur** :
   ```bash
   npm run dev
   ```

---

### Option 3 : Arrêter tous les processus Next.js

```bash
pkill -f "next dev"
```

Puis redémarrer :
```bash
npm run dev
```

---

## 📝 Commandes Complètes (Copier-Coller)

### Arrêter et Redémarrer en une fois :

```bash
# Arrêter tous les processus Next.js
pkill -f "next dev"

# Attendre 2 secondes
sleep 2

# Redémarrer le serveur
npm run dev
```

---

## ✅ Vérifier que le Serveur est Redémarré

Après avoir redémarré, vous devriez voir :
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Ready in X.XXs
```

---

## 🎯 Après Redémarrage

1. **Ouvrez votre navigateur** : http://localhost:3000
2. **Testez le paiement** : Le prix devrait être à 0€ maintenant
3. **Vérifiez les fonctionnalités Pro** après le paiement

---

**Note** : Le serveur doit être redémarré pour que les changements de prix (0€ → 8,99€) prennent effet.

































