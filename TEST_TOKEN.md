# اختبار الـ Token

## 🔍 **خطوات التشخيص:**

### 1. **افتح Developer Tools:**
- اضغط `F12` أو `Ctrl+Shift+I`
- اذهب لتبويب `Console`

### 2. **اختبر الـ Token:**
```javascript
// تحقق من الـ token في localStorage
const token = localStorage.getItem('token');
console.log('Token:', token);

// فك تشفير الـ token لرؤية المحتوى
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Token expires at:', new Date(payload.exp * 1000));
  console.log('Current time:', new Date());
  console.log('Token expired:', payload.exp < Math.floor(Date.now() / 1000));
}
```

### 3. **اختبر الـ API مباشرة:**
```javascript
// اختبر إضافة منتج للسلة مباشرة
fetch('https://ecommerce.routemisr.com/api/v1/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ productId: '6428ead5dc1175abc65ca0ad' })
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  return response.json();
})
.then(data => console.log('Response data:', data))
.catch(error => console.error('Error:', error));
```

## 🐛 **المشاكل المحتملة:**

### **المشكلة 1: Token منتهي الصلاحية**
- **الأعراض:** `Token expired, clearing localStorage`
- **السبب:** الـ token انتهت صلاحيته
- **الحل:** سجل دخول مرة أخرى

### **المشكلة 2: Token غير صحيح**
- **الأعراض:** `Invalid token format, clearing localStorage`
- **السبب:** الـ token تالف
- **الحل:** امسح localStorage وسجل دخول مرة أخرى

### **المشكلة 3: API يرفض الـ Token**
- **الأعراض:** `401 Unauthorized` رغم أن الـ token صحيح
- **السبب:** مشكلة في الـ API أو الـ token
- **الحل:** تحقق من الـ API endpoint

## 📝 **Console Logs المتوقعة:**

### **عند إضافة منتج للسلة:**
```
Making API request to: https://ecommerce.routemisr.com/api/v1/cart
Request config: {method: 'POST', headers: {...}, body: '...'}
Token from localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Headers being sent: {Content-Type: 'application/json', Authorization: 'Bearer ...'}
Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **إذا كان الـ token منتهي الصلاحية:**
```
Token expired, clearing localStorage
```

### **إذا كان الـ token غير صحيح:**
```
Invalid token format, clearing localStorage
```

## ✅ **النتيجة المتوقعة:**

بعد إصلاح المشكلة، يجب أن:
- يتم إرسال الـ token في header الـ Authorization
- لا يحدث خطأ 401 Unauthorized
- يتم إضافة المنتج للسلة بنجاح
- تظهر رسالة "Product added to cart successfully!"
