#!/usr/bin/env python3
"""
Download logos and convert them to white/light versions for dark backgrounds.
"""

import os
import urllib.request
from PIL import Image, ImageOps
import io

S3_BASE = "https://efg-final.s3.eu-north-1.amazonaws.com/logos%20-%20govt%20-%20homepage"

LOGOS = [
    ("cyber-security-council", f"{S3_BASE}/CYBER-SECURITY-COUNCIL-LOGO-1-1-1024x274.png"),
    ("ncsc-kuwait", f"{S3_BASE}/ncsc-kuwait.png"),
    ("central-agency-kuwait", f"{S3_BASE}/central-agency-kuwait.png"),
    ("ministry-national-guard", f"{S3_BASE}/ministry%20of%20national%20guard.png"),
    ("cyber-71", f"{S3_BASE}/cyber-71-logo.png"),
    ("cafa", f"{S3_BASE}/cafa.png"),
    ("women-cybersecurity", f"{S3_BASE}/woman-cybersecurity.png"),
    ("icp", f"{S3_BASE}/icp.jpeg"),
]

OUTPUT_DIR = "processed"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def make_white_version(img):
    """Convert image to white silhouette on transparent background."""
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get data
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If pixel is not fully transparent
        if item[3] > 30:  # Has some opacity
            # Make it white with original alpha
            new_data.append((255, 255, 255, item[3]))
        else:
            # Keep transparent
            new_data.append((0, 0, 0, 0))
    
    img.putdata(new_data)
    return img

def make_grayscale_light(img):
    """Convert to grayscale and brighten for dark backgrounds."""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Split channels
    r, g, b, a = img.split()
    
    # Convert RGB to grayscale
    gray = Image.merge('RGB', (r, g, b)).convert('L')
    
    # Invert the grayscale (dark becomes light)
    inverted = ImageOps.invert(gray)
    
    # Merge back with alpha
    result = Image.merge('RGBA', (inverted, inverted, inverted, a))
    return result

def process_logo(name, url):
    """Download and process a single logo."""
    print(f"Processing {name}...")
    
    try:
        # Download
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        img_data = response.read()
        
        # Open image
        img = Image.open(io.BytesIO(img_data))
        
        # Convert to white version
        white_img = make_white_version(img.copy())
        white_path = os.path.join(OUTPUT_DIR, f"{name}-white.png")
        white_img.save(white_path, "PNG")
        print(f"  Saved: {white_path}")
        
        # Also save grayscale inverted version
        gray_img = make_grayscale_light(img.copy())
        gray_path = os.path.join(OUTPUT_DIR, f"{name}-gray.png")
        gray_img.save(gray_path, "PNG")
        print(f"  Saved: {gray_path}")
        
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

if __name__ == "__main__":
    print("Processing government logos...\n")
    
    success = 0
    for name, url in LOGOS:
        if process_logo(name, url):
            success += 1
    
    print(f"\nDone! Processed {success}/{len(LOGOS)} logos.")
    print(f"Output in: {OUTPUT_DIR}/")
