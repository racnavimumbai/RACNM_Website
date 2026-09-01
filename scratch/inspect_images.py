from PIL import Image
import os

img_dir = r"D:\Yash Sarawgi\RCNM\RCNM Website\public\images"

for fname in os.listdir(img_dir):
    if fname.endswith(".png") or fname.endswith(".jpg"):
        fpath = os.path.join(img_dir, fname)
        with Image.open(fpath) as img:
            print(f"{fname}: mode={img.mode}, size={img.size}")
