import json
import os

BASE_URL = "https://momschoiceoffl.github.io/MOMSCHOICE/"
PRODUCTS_FILE = "products.json"

def generate_sitemap():
    if not os.path.exists(PRODUCTS_FILE):
        print("No products.json found.")
        return

    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        products = json.load(f)

    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Main Pages
    xml.append(f'  <url><loc>{BASE_URL}</loc><priority>1.0</priority></url>')
    xml.append(f'  <url><loc>{BASE_URL}pages/policies.html</loc><priority>0.5</priority></url>')
    
    # Categories
    categories = set(p.get("category") for p in products if p.get("category"))
    for cat in categories:
        xml.append(f'  <url><loc>{BASE_URL}category.html?cat={cat}</loc><priority>0.8</priority></url>')

    # Individual Products
    for p in products:
        if p.get("visible") is not False:
            xml.append(f'  <url><loc>{BASE_URL}product.html?id={p.get("id")}</loc><priority>0.9</priority></url>')

    xml.append('</urlset>')
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(xml))
    
    print("✅ sitemap.xml generated successfully!")

if __name__ == "__main__":
    generate_sitemap()
