# API Testing Scenarios

Base URL: `http://localhost:3001/api`
**Important**:
1.  **Cookies**: You must use `-c cookies.txt` to SAVE cookies on login, and `-b cookies.txt` to SEND cookies on protected requests.
2.  **PowerShell**: Use `curl.exe` instead of `curl`.

---

## 1. Setup (Login Scenarios)

### A. Login as Admin
*Saves token to `admin_cookies.txt`*
```bash
curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"admin123$\"}" -c admin_cookies.txt
```

### B. Login as User (Hasan)
*Saves token to `user_cookies.txt`*
```bash
curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d "{\"username\": \"hasan\", \"password\": \"hasan123$\"}" -c user_cookies.txt
```

### C. Logout
```bash
curl -X POST http://localhost:3001/api/logout -b admin_cookies.txt
```

---

## 2. Protected Routes (Admin Only)

**Goal**: Verify that Admin can Create, Update, Delete.

### Create User (As Admin) -> SUCCESS
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"username\": \"testadmin\", \"password\": \"pass\", \"nama\": \"Test Admin\", \"hakakses\": \"user\"}" -b admin_cookies.txt
```

### Update User (As Admin) -> SUCCESS
*(Target ID 2 = Hasan)*
```bash
curl -X PUT http://localhost:3001/api/users/2 -H "Content-Type: application/json" -d "{\"nama\": \"Hasan Updated\"}" -b admin_cookies.txt
```

### Delete User (As Admin) -> SUCCESS
*(Target ID: check your DB first, e.g., newly created one)*
```bash
curl -X DELETE http://localhost:3001/api/users/8 -b admin_cookies.txt
```

---

## 3. Protected Routes (User / Non-Admin)

**Goal**: Verify that Normal User receives **403 Forbidden**.

### Create User (As Hasan) -> FAIL (403)
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"username\": \"failprop\", \"password\": \"pass\", \"nama\": \"Fail\", \"hakakses\": \"user\"}" -b user_cookies.txt
```

### Delete User (As Hasan) -> FAIL (403)
```bash
curl -X DELETE http://localhost:3001/api/users/1 -b user_cookies.txt
```

---

## 4. Protected Routes (Public / Guest)

**Goal**: Verify that Guest receives **401 Unauthorized**.

### Create User (No Cookie) -> FAIL (401)
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"username\": \"ghost\", \"password\": \"pass\", \"nama\": \"Ghost\", \"hakakses\": \"user\"}"
```

---

## 5. Public Routes

**Goal**: Accessible by anyone.

### List Users
```bash
curl -X GET http://localhost:3001/api/users
```

### Logic: Array
```bash
curl -X GET http://localhost:3001/api/logic/array
```

### Logic: String
```bash
curl -X GET "http://localhost:3001/api/logic/string?input=PT.AbadI*perKASa@BeRsAmA-DIGItAL%23SolUTiONs"
```

### Logic: Terbilang
```bash
curl -X GET "http://localhost:3001/api/logic/terbilang?nominal=50000"
```