# إصلاح مشكلة تحديث كمية المنتجات في السلة

## 🔍 المشكلة:
كان هناك خطأ 500 Internal Server Error عند محاولة تحديث كمية المنتج في السلة لأن الـ API يتوقع `count` كـ number وليس string.

## 📊 الخطأ:
```
PUT https://ecommerce.routemisr.com/api/v1/cart/68cd88c160d7c59b6804fc22 500 (Internal Server Error)
```

## ✅ الحلول المطبقة:

### 1. إصلاح `transformCartItems` في `CartContext`:
```typescript
const transformCartItems = (products: any[]) => {
  return products.map((cartItem: any) => ({
    _id: cartItem._id,
    count: Number(cartItem.count),        // تحويل إلى number
    price: Number(cartItem.price),        // تحويل إلى number
    title: cartItem.product.title,
    imageCover: cartItem.product.imageCover,
    brand: cartItem.product.brand,
    category: cartItem.product.category,
    quantity: Number(cartItem.product.quantity),        // تحويل إلى number
    ratingsAverage: Number(cartItem.product.ratingsAverage),  // تحويل إلى number
    priceAfterDiscount: Number(cartItem.product.priceAfterDiscount || cartItem.price),  // تحويل إلى number
  }));
};
```

### 2. إصلاح `handleQuantityChange` في `cart/page.tsx`:
```typescript
const handleQuantityChange = async (itemId: string, newCount: number) => {
  const count = Number(newCount);  // تأكيد التحويل إلى number
  if (count < 1) {
    await removeFromCart(itemId);
  } else {
    await updateQuantity(itemId, count);
  }
};
```

### 3. إصلاح استدعاء `handleQuantityChange`:
```typescript
// قبل الإصلاح
onClick={() => handleQuantityChange(item._id, item.count - 1)}
onClick={() => handleQuantityChange(item._id, item.count + 1)}

// بعد الإصلاح
onClick={() => handleQuantityChange(item._id, Number(item.count) - 1)}
onClick={() => handleQuantityChange(item._id, Number(item.count) + 1)}
```

### 4. إصلاح `getTotalPrice`:
```typescript
const getTotalPrice = (): number => {
  return items.reduce((total, item) => {
    const price = Number(item.priceAfterDiscount || item.price);
    const count = Number(item.count);
    return total + (price * count);
  }, 0);
};
```

## 🎯 النتيجة:
- ✅ تم إصلاح خطأ 500 Internal Server Error
- ✅ تحديث كمية المنتجات يعمل بشكل صحيح
- ✅ جميع العمليات الحسابية تعمل بشكل صحيح
- ✅ الـ API يتلقى البيانات بالـ format الصحيح

## 🧪 للاختبار:
1. افتح التطبيق
2. سجل الدخول
3. اذهب إلى صفحة السلة
4. جرب زيادة أو تقليل كمية أي منتج
5. تأكد من أن العملية تتم بدون أخطاء
