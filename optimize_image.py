
from PIL import Image
import os

def optimize_image(image_path, quality=80, format='JPEG'):
    try:
        img = Image.open(image_path)
        
        # if image has alpha channel, convert it to RGB
        if img.mode in ('RGBA', 'LA'):
            img = img.convert('RGB')
            
        # Save the image with optimization
        if format == 'JPEG':
            img.save(image_path, format=format, quality=quality, optimize=True)
        else:
            img.save(image_path, format=format, quality=quality)
        
        print(f"Successfully optimized {image_path}")
    except Exception as e:
        print(f"Could not optimize {image_path}: {e}")

# Optimize a single image
optimize_image('local-meat-market.jpg')
