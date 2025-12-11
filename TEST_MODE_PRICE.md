# ⚠️ TEST MODE - Prix à 0€

## Statut actuel : PRIX À 0€ POUR TEST

Le prix est actuellement défini à **0€** pour permettre les tests sans carte de crédit.

### Fichier modifié :
- `app/api/checkout/create-session/route.ts`
- Ligne 78 : `unit_amount: 0`

---

## 🧪 Comment tester

1. **Allez sur** `/pricing`
2. **Cliquez sur** "Upgrade to Pro Action"
3. **Complétez le paiement** (sera à 0€)
4. **Vérifiez** que vous avez accès aux fonctionnalités Pro :
   - Voice Speed slider activé
   - Uploads illimités
   - Toutes les fonctionnalités Pro

---

## ✅ Après le test - Remettre le prix à 8,99€

**IMPORTANT** : Une fois les tests terminés, remettre le prix à **8,99€** :

1. Ouvrir `app/api/checkout/create-session/route.ts`
2. Ligne 78, changer :
   ```typescript
   unit_amount: 0, // TEST MODE: €0.00 (change back to 899 for €8.99)
   ```
   En :
   ```typescript
   unit_amount: 899, // €8.99 in cents
   ```
3. Sauvegarder le fichier
4. Redémarrer le serveur si nécessaire

---

**Date de modification** : Décembre 2024  
**Raison** : Test du système de paiement Stripe














