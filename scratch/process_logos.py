from PIL import Image
import os

img_dir = r"D:\Yash Sarawgi\RCNM\RCNM Website\public\images"

# Load page 2 extracted image (Magnum Opus Keychain Design)
p2_img = Image.open(os.path.join(img_dir, "pdf-extracted-img-p2-1.png"))

# Save a copy as magnum-opus-logo.png
p2_img.save(os.path.join(img_dir, "magnum-opus-logo.png"))

# Load page 1 extracted image
p1_img = Image.open(os.path.join(img_dir, "pdf-extracted-img-p1-1.png"))
p1_img.save(os.path.join(img_dir, "rcnm-keychain-logo.png"))

# Create a transparent version of Magnum Opus logo if background is dark/solid
rgba_p2 = p2_img.convert("RGBA")
datas = rgba_p2.getdata()

# Check if corners are black or white
corner_pixel = datas[0]
print("Corner pixel:", corner_pixel)

print("Saved magnum-opus-logo.png and rcnm-keychain-logo.png successfully!")
