import fitz # PyMuPDF
import os

pdf_path = r"D:\Yash Sarawgi\RCNM\RCNM Website\Temp\RCNM MO KEYCHAIN Design.pdf"
output_dir = r"D:\Yash Sarawgi\RCNM\RCNM Website\public\images"

os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages in PDF: {len(doc)}")

# Render each page at high resolution (300 DPI zoom 4x)
for page_num in range(len(doc)):
    page = doc[page_num]
    zoom = 4.0 # 4x zoom for high quality
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=True)
    out_file = os.path.join(output_dir, f"magnum-opus-keychain-page-{page_num+1}.png")
    pix.save(out_file)
    print(f"Saved high-res page {page_num+1} to {out_file}")

    # Extract all embedded images on page
    image_list = page.get_images(full=True)
    print(f"Page {page_num+1} has {len(image_list)} embedded images.")
    for img_index, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        img_out = os.path.join(output_dir, f"pdf-extracted-img-p{page_num+1}-{img_index+1}.{image_ext}")
        with open(img_out, "wb") as f:
            f.write(image_bytes)
        print(f"Saved extracted image to {img_out}")

print("Extraction finished!")
