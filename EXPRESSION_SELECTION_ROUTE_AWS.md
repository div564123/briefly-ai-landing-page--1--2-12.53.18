# Expression de Sélection de Route pour AWS API Gateway

## Expression à utiliser

Pour créer votre API WebSocket sur AWS API Gateway, utilisez cette **expression de sélection de route** :

```
$request.body.action
```

## Comment l'utiliser

1. **Créez votre API WebSocket** dans la console AWS API Gateway
2. Dans la section **"Route Selection Expression"**, entrez :
   ```
   $request.body.action
   ```
3. **Créez vos routes** avec les noms correspondants :
   - `$connect` - Pour les nouvelles connexions
   - `$disconnect` - Pour les déconnexions
   - `generateAudio` - Pour générer de l'audio
   - `$default` - Route par défaut

## Exemple de message client

Quand un client envoie ce message :

```json
{
  "action": "generateAudio",
  "text": "Bonjour, ceci est un test",
  "voiceId": "Joanna"
}
```

API Gateway utilisera l'expression `$request.body.action` qui évalue à `"generateAudio"` et appellera la route nommée `generateAudio`.

## Routes recommandées

Créez ces routes dans votre API Gateway :

| Nom de la Route | Description |
|----------------|-------------|
| `$connect` | Gère les nouvelles connexions WebSocket |
| `$disconnect` | Gère les déconnexions WebSocket |
| `generateAudio` | Génère de l'audio à partir du texte |
| `$default` | Route de secours pour les actions non reconnues |

## Exemples de messages

### Connexion
```json
{
  "action": "$connect"
}
```

### Générer de l'audio
```json
{
  "action": "generateAudio",
  "text": "Votre texte ici",
  "voiceId": "Joanna",
  "language": "en",
  "speed": 1.0
}
```

### Déconnexion
```json
{
  "action": "$disconnect"
}
```

## Alternative : Expression par champ "route"

Si vous préférez utiliser un champ `route` au lieu de `action`, utilisez :

```
$request.body.route
```

Et envoyez des messages comme :
```json
{
  "route": "generateAudio",
  "text": "Votre texte"
}
```

## Notes importantes

- L'expression est **sensible à la casse** (case-sensitive)
- Le nom de la route doit correspondre **exactement** à la valeur du champ `action`
- Si aucune route ne correspond, la route `$default` sera utilisée
- Les routes `$connect` et `$disconnect` sont des routes spéciales gérées automatiquement par API Gateway

## Configuration dans la console AWS

1. Allez dans **API Gateway** → **APIs** → **Create API**
2. Sélectionnez **WebSocket API**
3. Dans **Route Selection Expression**, entrez : `$request.body.action`
4. Cliquez sur **Create API**
5. Créez vos routes dans la section **Routes**

