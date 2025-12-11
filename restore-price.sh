#!/bin/bash

# Script pour remettre le prix à 8,99€ après les tests

echo "🔄 Remise du prix à 8,99€..."

# Remettre le prix dans le fichier checkout
sed -i '' 's/unit_amount: 0, \/\/ TEST MODE: €0.00 (change back to 899 for €8.99)/unit_amount: 899, \/\/ €8.99 in cents/' app/api/checkout/create-session/route.ts

echo "✅ Prix remis à 8,99€ dans app/api/checkout/create-session/route.ts"
echo ""
echo "📝 Vérifiez le fichier pour confirmer le changement."
echo "🔄 Redémarrez le serveur si nécessaire."




























