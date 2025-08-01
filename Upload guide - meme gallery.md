## 🖼️ Adding New Images

### **Step 1: Find the Next Number**

1. **Go to:** `public/memes/images/` folder
2. **Look for the highest number** in existing files
3. **Add 1** to that number for your new image
4. **Example:** If highest is `729.jpg`, use `730.png` for your new image

### **Step 2: Upload Your Image**

1. **Navigate to:** `public/memes/images/` folder in github
2. **Click "Add file" → "Upload files"** with the next number + supported extension
3. **Drag & drop your numbered image**
4. **Click "Commit changes**

 **Supported formats:** JPG, PNG, GIF, WebP, JPEG (all case variations)

### **File Naming Examples**

```
✅ Correct naming:
- 730.png
- 731.jpg  
- 732.gif
- 733.webp
- 734.PNG
- 735.JPG

❌ Wrong naming:
- wdog-pfp(1).png  (not numbered)
- meme.jpg        (not numbered)
- 730            (no extension)
```

---------------------------------------------------------------------------

## 🎥 Adding New Videos (Auto-Discovery!)

1. **Navigate to:** `public/memes/videos/` folder
2. **Upload MP4 files** with any descriptive name
3. **Keep file sizes** under 50MB for best performance
4. **Automatic Discovery:** Videos are automatically detected during build!

## **Supported Formats:** MP4


## 📁 Folder Structure

```
public/
└── memes/
    ├── images/     ← Put your images here
    │   ├── 1.jpg
    │   ├── 2.png
    │   ├── 729.jpg
    │   └── 730.png  ← Your new image
    └── videos/     ← Put your videos here
        ├── xxxxyyyzzz.mp4
        └── xxxyyy.mp4

```

## ❓ Troubleshooting

### **Image Not Showing Up?**
- ✅ Check the numbering is correct
- ✅ Verify the file format is supported
- ✅ Ensure file is in the right folder
- ✅ Wait for deployment to complete

### **Wrong Number?**
- Look at existing files in the folder
- Find the highest number
- Use that number + 1

### **Format Not Supported?**
- Convert to JPG, PNG, GIF, or WebP
- Make sure the extension is included
- Check for typos in the filename

