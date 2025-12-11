# How to Handle Special Characters in Database Password

## ⚠️ If Your Password Contains "?"

The `?` character must be URL-encoded as `%3F` in the DATABASE_URL.

## ✅ Example

**If your password is:** `MyPass?123`

**Your DATABASE_URL should be:**
```
DATABASE_URL=postgresql://postgres:MyPass%3F123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
```

Notice: `?` becomes `%3F`

## 📋 Complete List of Special Characters

If your password contains any of these characters, encode them:

| Character | URL Encoded | Example |
|-----------|-------------|---------|
| `?` | `%3F` | `MyPass?123` → `MyPass%3F123` |
| `@` | `%40` | `MyPass@123` → `MyPass%40123` |
| `#` | `%23` | `MyPass#123` → `MyPass%23123` |
| `%` | `%25` | `MyPass%123` → `MyPass%25123` |
| `&` | `%26` | `MyPass&123` → `MyPass%26123` |
| `+` | `%2B` | `MyPass+123` → `MyPass%2B123` |
| `=` | `%3D` | `MyPass=123` → `MyPass%3D123` |
| ` ` (space) | `%20` | `My Pass 123` → `My%20Pass%20123` |
| `/` | `%2F` | `MyPass/123` → `MyPass%2F123` |
| `:` | `%3A` | `MyPass:123` → `MyPass%3A123` |

## 🔧 Quick Encoding Tool

You can use an online URL encoder:
- https://www.urlencoder.org/
- Just paste your password, encode it, then use the encoded version in DATABASE_URL

## ✅ Step-by-Step

1. **Get your password from Supabase**
   - Example: `MyPass?123`

2. **Encode special characters:**
   - `?` → `%3F`
   - Result: `MyPass%3F123`

3. **Build DATABASE_URL:**
   ```
   DATABASE_URL=postgresql://postgres:MyPass%3F123@db.eulpiddbrbqchwrkulug.supabase.co:5432/postgres
   ```

4. **Add to `.env.local`** (no quotes needed)

5. **Run `npx prisma db push`**

## 💡 Alternative: Reset Password

If encoding is too complicated, you can:
1. Go to Supabase → Settings → Database
2. Click **"Reset database password"**
3. Choose a password WITHOUT special characters (only letters, numbers, and maybe `-` or `_`)
4. Use the new password directly in DATABASE_URL (no encoding needed)

**Example of safe password:** `MySecurePass123` or `My-Secure_Pass123`

