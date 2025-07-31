# 🎨 Asset Positioning Guide

## 📋 **OVERVIEW**
This guide explains how to change positions and scaling of assets in the `src/data/assets.ts` file for the wDOG PFP Generator.

---

## 🔧 **BASIC CONCEPTS**

### **Coordinate System**
- **Canvas size**: 512x512 pixels
- **Origin (0,0)**: Center of canvas
- **X-axis**: Left (-) to right (+)
- **Y-axis**: Up (-) to down (+)

### **Positioning**
```typescript
position: { x: 0, y: 0 }  // Centered
position: { x: -50, y: -100 }  // Left and up
position: { x: 50, y: 100 }   // Right and down
```

### **Scaling**
```typescript
scale: 1.0    // Normal size (100%)
scale: 0.5    // Half size (50%)
scale: 2.0    // Double size (200%)
```

---

## 📁 **ASSET CATEGORIES**

### **1. Backgrounds**
- **No positioning** - Fills entire canvas
- **No scaling** - Always 512x512

```typescript
{
  id: 'back-0',
  name: 'Background 1',
  src: back0,
  thumbnail: back0
  // No position or scale - fills entire canvas
}
```

### **2. Eyes**
- **Position**: Adjusted to fit the dog's face
- **Y values**: Usually negative (up from center)
- **X values**: Small adjustments for centering

```typescript
{
  id: 'eyes-2',
  name: 'Eyes 1',
  src: eyes2,
  thumbnail: eyes2,
  position: { x: 0, y: -200 },    // Centered, 200px up
  scale: 1.0                      // Normal size
}
```

### **3. Hats**
- **Position**: Adjusted to sit on the head
- **Y values**: Usually -100 to -140 (up)
- **X values**: Small adjustments for centering

```typescript
{
  id: 'hat-1',
  name: 'Hat 1',
  src: hat1,
  thumbnail: hat1,
  position: { x: 0, y: -100 },    // Centered, 100px up
  scale: 1.0                      // Normal size
}
```

### **4. Clothes**
- **Position**: Adjusted to fit the body
- **Y values**: Usually 0 to +50 (down)
- **X values**: Small adjustments for centering

```typescript
{
  id: 'clothes-1',
  name: 'Clothes 1',
  src: clothes1,
  thumbnail: clothes1,
  position: { x: 0, y: 20 },      // Centered, 20px down
  scale: 1.0                      // Normal size
}
```

### **5. Glasses**
- **Position**: Adjusted to fit the face
- **Y values**: Usually -180 to -220 (up)
- **X values**: Small adjustments for centering

```typescript
{
  id: 'glasses-1',
  name: 'Glasses 1',
  src: glasses1,
  thumbnail: glasses1,
  position: { x: 0, y: -200 },    // Centered, 200px up
  scale: 1.0                      // Normal size
}
```

### **6. Items**
- **Position**: Varies depending on object
- **Scaling**: Usually less than 1.0

```typescript
{
  id: 'item-1',
  name: 'Item 1',
  src: item1,
  thumbnail: item1,
  position: { x: 50, y: -50 },    // Right and up
  scale: 0.8                      // 80% size
}
```

---

## 🎯 **PRACTICAL EXAMPLES**

### **Example 1: Move eyes higher up**
```typescript
// Before
{
  id: 'eyes-2',
  name: 'Eyes 1',
  src: eyes2,
  thumbnail: eyes2,
  position: { x: 0, y: -200 },
  scale: 1.0
}

// After - moved 20px higher up
{
  id: 'eyes-2',
  name: 'Eyes 1',
  src: eyes2,
  thumbnail: eyes2,
  position: { x: 0, y: -220 },    // Changed from -200 to -220
  scale: 1.0
}
```

### **Example 2: Make hat bigger and move left**
```typescript
// Before
{
  id: 'hat-1',
  name: 'Hat 1',
  src: hat1,
  thumbnail: hat1,
  position: { x: 0, y: -100 },
  scale: 1.0
}

// After - bigger and left
{
  id: 'hat-1',
  name: 'Hat 1',
  src: hat1,
  thumbnail: hat1,
  position: { x: -20, y: -100 },  // Changed from 0 to -20 (left)
  scale: 1.2                      // Changed from 1.0 to 1.2 (20% bigger)
}
```

### **Example 3: Better center clothes**
```typescript
// Before
{
  id: 'clothes-1',
  name: 'Clothes 1',
  src: clothes1,
  thumbnail: clothes1,
  position: { x: 0, y: 20 },
  scale: 1.0
}

// After - better centering
{
  id: 'clothes-1',
  name: 'Clothes 1',
  src: clothes1,
  thumbnail: clothes1,
  position: { x: -5, y: 15 },     // Adjusted X and Y for better centering
  scale: 1.0
}
```

---

## 🔍 **TROUBLESHOOTING**

### **Common problems and solutions:**

#### **1. Asset not visible**
- **Check**: That position is not too far outside canvas
- **Solution**: Adjust X/Y values to smaller numbers

#### **2. Asset too big/small**
- **Check**: Scale value
- **Solution**: Change scale (0.5 = smaller, 2.0 = bigger)

#### **3. Asset misplaced**
- **Check**: X/Y values
- **Solution**: Adjust position gradually

#### **4. Asset conflicts with others**
- **Check**: Position of all assets in same category
- **Solution**: Adjust position or scale

---

## 📝 **WORKFLOW**

### **Step-by-step process:**

1. **Identify the problem**
   - Which asset needs adjustment?
   - What is the problem? (too big, misplaced, etc.)

2. **Make small changes**
   - Change only one value at a time
   - Test after each change

3. **Test in application**
   - Start development server: `npm run dev`
   - Navigate to PFP Generator
   - Test asset with different combinations

4. **Fine-tune**
   - Make small adjustments until it looks good
   - Test with different backgrounds and accessories

### **Recommended values:**

#### **Eyes**
- **X**: -10 to +10 (small adjustments)
- **Y**: -180 to -260 (up from center)
- **Scale**: 0.9 to 1.1

#### **Hats**
- **X**: -10 to +10 (small adjustments)
- **Y**: -80 to -150 (up from center)
- **Scale**: 0.8 to 1.2

#### **Clothes**
- **X**: -20 to +20 (small adjustments)
- **Y**: -20 to +50 (down from center)
- **Scale**: 0.9 to 1.1

#### **Glasses**
- **X**: -15 to +15 (small adjustments)
- **Y**: -160 to -240 (up from center)
- **Scale**: 0.9 to 1.1

#### **Items**
- **X**: -100 to +100 (large adjustments possible)
- **Y**: -100 to +100 (large adjustments possible)
- **Scale**: 0.5 to 1.5

---

## ⚠️ **IMPORTANT POINTS**

### **Backup**
- **Make backup** of `assets.ts` before you start changing
- **Test often** to avoid breaking the layout

### **Compatibility**
- **Test with different combinations** of assets
- **Check that nothing conflicts** with other elements

### **Performance**
- **Large scale values** can affect performance
- **Many adjustments** can make the file hard to maintain

---

## 🎨 **ADVANCED TECHNIQUES**

### **Proportional scaling**
```typescript
// If you want to maintain proportions
scale: 1.0  // Normal size
scale: 0.8  // 20% smaller
scale: 1.2  // 20% bigger
```

### **Precise centering**
```typescript
// For perfect centering
position: { x: 0, y: 0 }  // Exact center
```

### **Layering**
- **Backgrounds**: Always at the back
- **Clothes**: Under hats and glasses
- **Eyes**: On top of clothes
- **Hats/Glasses**: On top of eyes
- **Items**: On top of everything else

---

## 📚 **RESOURCES**

### **Useful tools:**
- **Browser DevTools**: To inspect canvas
- **Pixel Perfect**: For exact positioning
- **Grid Overlay**: To see coordinates

### **Testing:**
- **Different backgrounds**: Test with light and dark backgrounds
- **Different combinations**: Test with multiple assets at once
- **Different screen sizes**: Test on mobile and desktop

---

**Created: 07/31/2025**
**Last updated: 07/31/2025**
**Status: Complete** 