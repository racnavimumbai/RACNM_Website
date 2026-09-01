from PIL import Image
import os

img_dir = r"D:\Yash Sarawgi\RCNM\RCNM Website\public\images"
temp_dir = r"D:\Yash Sarawgi\RCNM\RCNM Website\Temp"

rcnm_path = os.path.join(temp_dir, "RCNM.png")
mo_path = os.path.join(temp_dir, "MO.png")

print("Processing RCNM.png...")
if os.path.exists(rcnm_path):
    img = Image.open(rcnm_path).convert("RGBA")
    print(f"RCNM size: {img.size}")
    # Trim transparent or black borders
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(os.path.join(img_dir, "RCNM.png"))
        print(f"RCNM cropped size: {img_cropped.size}")

print("Processing MO.png...")
if os.path.exists(mo_path):
    img = Image.open(mo_path).convert("RGBA")
    print(f"MO size: {img.size}")
    
    # Make black background transparent if it has black pixels
    datas = img.getdata()
    new_data = []
    for item in datas:
        # If color is close to black (r < 20, g < 20, b < 20), make transparent
        if item[0] < 20 and item[1] < 20 and item[2] < 20:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Crop bounding box of non-transparent region
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(os.path.join(img_dir, "MO.png"))
        print(f"MO transparent & cropped size: {img_cropped.size}")
    else:
        img.save(os.path.join(img_dir, "MO.png"))

print("Finished logo processing!")
