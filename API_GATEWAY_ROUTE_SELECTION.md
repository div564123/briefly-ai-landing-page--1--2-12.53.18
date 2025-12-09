# API Gateway Route Selection Expression

## For WebSocket API

If you're creating an **AWS API Gateway WebSocket API**, use this route selection expression:

```json
$request.body.action
```

### How it works:

The route selection expression tells API Gateway which route to call based on the incoming message. When a client sends a message like:

```json
{
  "action": "generateAudio",
  "text": "Hello world",
  "voiceId": "Joanna"
}
```

API Gateway will route it to the route named `generateAudio` because `$request.body.action` evaluates to `"generateAudio"`.

### Alternative Expressions:

If you prefer different routing strategies:

1. **By route field:**
   ```json
   $request.body.route
   ```

2. **By type field:**
   ```json
   $request.body.type
   ```

3. **By method:**
   ```json
   $request.body.method
   ```

### Example WebSocket API Setup:

1. **Create WebSocket API** in API Gateway Console
2. **Set Route Selection Expression** to: `$request.body.action`
3. **Create Routes:**
   - `$connect` - Handles new WebSocket connections
   - `$disconnect` - Handles WebSocket disconnections
   - `generateAudio` - Your custom route for audio generation
   - `$default` - Fallback route for unmatched actions

### Example Request Messages:

**Connection:**
```json
{
  "action": "$connect"
}
```

**Generate Audio:**
```json
{
  "action": "generateAudio",
  "text": "Your text here",
  "voiceId": "Joanna",
  "language": "en"
}
```

**Disconnection:**
```json
{
  "action": "$disconnect"
}
```

## For REST API

If you're creating a **REST API**, route selection expressions are **not needed**. REST APIs use:
- **Resource paths** (e.g., `/audio/generate`)
- **HTTP methods** (GET, POST, PUT, DELETE)
- **Query parameters** and **path parameters**

### Example REST API Setup:

```
POST /audio/generate
GET /audio/{id}
DELETE /audio/{id}
```

## Testing Route Selection

You can test your route selection expression in the API Gateway console:

1. Go to your WebSocket API
2. Click on "Route Selection Expression"
3. Test with sample request bodies
4. Verify the correct route is selected

## Common Issues

### Route not found
- Ensure the route name matches exactly (case-sensitive)
- Check that `$request.body.action` contains the route name
- Verify the route exists in your API

### Expression syntax error
- Use `$request.body.fieldName` format
- Ensure field exists in request body
- Check for typos in field names

### Default route always triggered
- Verify route selection expression is set correctly
- Check that action field is present in request
- Ensure route names match exactly

