import os
import json
import base64
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen
import cloudinary
import cloudinary.uploader

ENV_FILE = ".env"

def load_env():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()
GSHEET_URL = ENV.get("GSHEET_WEBAPP_URL", "")
cloudinary.config(
    cloud_name=ENV.get("CLOUDINARY_CLOUD_NAME"),
    api_key=ENV.get("CLOUDINARY_API_KEY"),
    api_secret=ENV.get("CLOUDINARY_API_SECRET"),
    secure=True
)

class Handler(SimpleHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self._json(200, {"ok": True, "token_set": True})
            return

        if self.path == "/get-last-invoice":
            try:
                # First try to get from sales.json
                if os.path.exists("sales.json"):
                    with open("sales.json", "r", encoding="utf-8") as f:
                        sales = json.load(f)
                    if len(sales) > 0:
                        # Return the last invoice number found
                        self._json(200, {"lastInv": sales[-1][1]})
                        return
                
                # Fallback to Google Sheet
                req = Request(GSHEET_URL + "?action=get_last_invoice")
                with urlopen(req) as r:
                    data = r.read()
                self._json(200, json.loads(data))
            except Exception as e:
                self._json(500, {"error": str(e)})
            return

        if self.path == "/get-products":
            try:
                with open("products.json", "r", encoding="utf-8") as f:
                    prods = json.load(f)
                self._json(200, prods)
            except Exception as e:
                self._json(500, {"error": str(e)})
            return

        if self.path == "/get-sales":
            try:
                with open("sales.json", "r", encoding="utf-8") as f:
                    sales = json.load(f)
                self._json(200, sales)
            except Exception as e:
                self._json(200, [])
            return

        if self.path == "/get-invoices":
            try:
                with open("sales.json", "r", encoding="utf-8") as f:
                    sales = json.load(f)
                self._json(200, sales)
            except:
                self._json(200, [])
            return
            
        return super().do_GET()

    def do_POST(self):
        if self.path == "/upload":
            try:
                content_type = self.headers.get("Content-Type", "")
                content_length = int(self.headers.get("Content-Length", 0))
                boundary = content_type.split("boundary=")[1].strip().strip('"')
                
                from multipart import MultipartParser
                import io
                body = self.rfile.read(content_length)
                parser = MultipartParser(io.BytesIO(body), boundary, charset="latin-1")
                
                uploaded = []
                for part in parser:
                    if part.name == "file":
                        raw = part.value if isinstance(part.value, bytes) else part.value.encode('latin-1')
                        fname = (part.filename or "upload.jpg").replace('\x00', '').strip()
                        if not fname: fname = "upload.jpg"
                        if '.' not in fname: fname = fname + '.jpg'
                        uploaded.append((raw, fname))
                
                if not uploaded:
                    self._json(400, {"ok": False, "error": "No files received"})
                    return

                category = "Uncategorized"
                for part in parser:
                    if part.name == "category":
                        category = (part.value or "").strip()

                urls = []
                for i, (raw, fname) in enumerate(uploaded):
                    result = cloudinary.uploader.upload(
                        raw, folder=f"moms_pick/{category}", resource_type="image"
                    )
                    urls.append(result["secure_url"])
                
                self._json(200, {"ok": True, "urls": urls, "url": urls[0]})
            except Exception as e:
                self._json(500, {"ok": False, "error": str(e)})
            return

        if self.path == "/save-products":
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8")
            prods = json.loads(raw)
            try:
                with open("products.json", "w", encoding="utf-8") as f:
                    json.dump(prods, f, indent=2, ensure_ascii=False)
                print(f"Saved {len(prods)} products to products.json")
                self._json(200, {"ok": True})
            except Exception as e:
                self._json(500, {"ok": False, "error": str(e)})
            return

        if self.path == "/save":
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8")
            data = json.loads(raw)

            try:
                # ═══════════════════════════════════════════════════════════
                # RULE: every write updates BOTH local JSON AND Google Sheet
                # ═══════════════════════════════════════════════════════════

                # ── CASE 1: INVOICE ────────────────────────────────────────
                if data.get("action") == "save_invoice":
                    # A. Append to sales.json (with real DATE as first column)
                    try:
                        with open("sales.json", "r", encoding="utf-8") as f:
                            sales = json.load(f)
                    except:
                        sales = []

                    import datetime
                    now = datetime.datetime.now()
                    dateStr = now.strftime("%d/%m/%Y, %H:%M:%S")

                    sales.append([
                        dateStr,
                        data.get("invNumber", ""),
                        data.get("invNumber", ""),
                        "Auto",
                        data.get("cName", ""),
                        data.get("cPhone", ""),
                        data.get("cAddr", ""),
                        data.get("id", ""),
                        data.get("title", ""),
                        data.get("qty", 1),
                        data.get("price", 0),
                        data.get("courier", 0),
                        data.get("grandTotal", 0)
                    ])

                    with open("sales.json", "w", encoding="utf-8") as f:
                        json.dump(sales, f, indent=2, ensure_ascii=False)

                    # B. Reduce stock or mark as SOLD in products.json
                    try:
                        with open("products.json", "r", encoding="utf-8") as f:
                            prods = json.load(f)
                        for p in prods:
                            if p.get("id") == data.get("id"):
                                # Default stock to 1 if it doesn't exist yet
                                current_stock = p.get("stock", 1)
                                qty_sold = int(data.get("qty", 1))
                                
                                new_stock = current_stock - qty_sold
                                
                                if new_stock <= 0:
                                    p["stock"] = 0
                                    p["status"] = "SOLD"
                                else:
                                    p["stock"] = new_stock
                                    p["status"] = "AVAILABLE"
                                break
                        with open("products.json", "w", encoding="utf-8") as f:
                            json.dump(prods, f, indent=2, ensure_ascii=False)
                    except Exception as e:
                        print("Warning: could not update products.json:", e)

                    print(f"Invoice {data.get('invNumber')} saved to sales.json ({len(sales)} total)")

                # ── CASE 2: PRODUCT (Add / Edit / Delete) ──────────────────
                else:
                    try:
                        with open("products.json", "r", encoding="utf-8") as f:
                            prods = json.load(f)
                    except:
                        prods = []

                    # Find existing product by id
                    existing_idx = None
                    for i, p in enumerate(prods):
                        if p.get("id") == data.get("id"):
                            existing_idx = i
                            break

                    if data.get("visible") is False and existing_idx is not None:
                        # Treat as delete → remove from local products.json
                        prods.pop(existing_idx)
                        print(f"Product {data.get('id')} deleted from products.json")
                    elif existing_idx is not None:
                        # Update
                        prods[existing_idx] = data
                        print(f"Product {data.get('id')} updated in products.json")
                    else:
                        # Add new
                        prods.append(data)
                        print(f"Product {data.get('id')} added to products.json")

                    with open("products.json", "w", encoding="utf-8") as f:
                        json.dump(prods, f, indent=2, ensure_ascii=False)

                # ── ALWAYS push to Google Sheet (both cases) ──────────────
                req = Request(GSHEET_URL, method="POST", data=json.dumps(data).encode("utf-8"),
                              headers={"Content-Type": "application/json"})
                with urlopen(req) as r:
                    pass
                self._json(200, {"ok": True})
            except Exception as e:
                print("SAVE ERROR:", e)
                self._json(500, {"ok": False, "error": str(e)})
            return

        self._json(404, {"ok": False, "error": "Not found"})

    def _json(self, code, obj):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self._cors()
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())

if __name__ == "__main__":
    print("Server running on http://localhost:5000")
    HTTPServer(("127.0.0.1", 5000), Handler).serve_forever()