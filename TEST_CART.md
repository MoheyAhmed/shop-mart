# اختبار وظائف السلة

## 1. اختبار الحصول على سلة المستخدم المسجل

### API Endpoint
```
GET https://ecommerce.routemisr.com/api/v1/cart
```

### Headers
```
token: <JWT_TOKEN>
Content-Type: application/json
```

### الخطوات:
1. تأكد من تسجيل الدخول أولاً
2. احصل على الـ token من localStorage
3. استخدم الـ token في header باسم `token`
4. استدعي API للحصول على السلة

### مثال على الاستخدام في الكود:
```typescript
// في CartContext.tsx
const loadCart = async () => {
  try {
    const response = await api.getCart(); // يستخدم token تلقائياً
    if (response.status === 'success') {
      dispatch({ type: 'LOAD_CART_SUCCESS', payload: response.data.products });
    }
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
};
```

## 2. اختبار إضافة منتج للسلة

### API Endpoint
```
POST https://ecommerce.routemisr.com/api/v1/cart
```

### Headers
```
token: <JWT_TOKEN>
Content-Type: application/json
```

### Body
```json
{
  "productId": "PRODUCT_ID"
}
```

## 3. اختبار تحديث كمية منتج في السلة

### API Endpoint
```
PUT https://ecommerce.routemisr.com/api/v1/cart/ITEM_ID
```

### Headers
```
token: <JWT_TOKEN>
Content-Type: application/json
```

### Body
```json
{
  "count": 5
}
```

## 4. اختبار حذف منتج من السلة

### API Endpoint
```
DELETE https://ecommerce.routemisr.com/api/v1/cart/ITEM_ID
```

### Headers
```
token: <JWT_TOKEN>
```

## 5. اختبار مسح السلة بالكامل

### API Endpoint
```
DELETE https://ecommerce.routemisr.com/api/v1/cart
```

### Headers
```
token: <JWT_TOKEN>
```

## 6. اختبار في المتصفح

### الخطوات:
1. افتح التطبيق في المتصفح
2. سجل الدخول
3. اذهب إلى صفحة المنتجات
4. اضغط "Add to Cart" على أي منتج
5. اذهب إلى صفحة السلة `/cart`
6. تأكد من ظهور المنتج في السلة
7. جرب تعديل الكمية
8. جرب حذف منتج
9. جرب مسح السلة بالكامل

### ما يجب مراقبته:
- عدم وجود أخطاء 401 Unauthorized
- ظهور المنتجات في السلة بشكل صحيح
- تحديث الكمية يعمل
- الحذف يعمل
- مسح السلة يعمل

## 7. اختبار الحالات الخاصة

### حالة عدم وجود token:
- يجب إعادة التوجيه إلى صفحة تسجيل الدخول
- يجب عدم إظهار أخطاء 401

### حالة انتهاء صلاحية token:
- يجب مسح localStorage تلقائياً
- يجب إعادة التوجيه إلى صفحة تسجيل الدخول

### حالة السلة الفارغة:
- يجب إظهار رسالة "Your cart is empty"
- يجب إظهار رابط "Browse Products"
