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
                req = Request(GSHEET_URL + "?action=get_last_invoice")
                with urlopen(req) as r:
                    data = r.read()
                self._json(200, json.loads(data))
            except Exception as e:
                self._json(500, {"error": str(e)})
            return

        if self.path.startswith("/get-products"):
            try:
                req = Request(GSHEET_URL)
                with urlopen(req) as r:
                    data = r.read()
                self._json(200, json.loads(data))
            except Exception as e:
                self._json(500, {"error": str(e)})
            return

        if self.path.startswith("/get-invoices"):
            try:
                import csv
                import io
                
                # 1. Extract the Sheet ID from your GSHEET_URL
                # Format: https://script.google.com/macros/s/AKfy.../exec
                # We need the Google Sheet ID. Get it from your .env or hardcode it here.
                SHEET_ID = "1A2b3C4d5E6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6z" # <--- PASTE YOUR SHEET ID HERE
                
                # 2. Fetch the raw CSV from Google Sheets
                csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Invoice%20Log"
                req = Request(csv_url)
                with urlopen(req) as r:
                    csv_data = r.read().decode('utf-8')
                
                # 3. Parse CSV into a list of rows
                reader = csv.reader(io.StringIO(csv_data))
                rows = list(reader)
                
                # 4. Remove the header row
                if len(rows) > 0:
                    rows = rows[1:]
                
                # 5. Send back as JSON
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(rows).encode())
            except Exception as e:
                print("INVOICE CSV FETCH ERROR:", e)
                self._json(500, {"error": str(e)})
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

        if self.path == "/save":
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8")
            data = json.loads(raw)
            
            # Push to Google Sheets
            try:
                req = Request(GSHEET_URL, method="POST", data=json.dumps(data).encode("utf-8"),
                              headers={"Content-Type": "application/json"})
                with urlopen(req) as r:
                    pass
                self._json(200, {"ok": True})
            except Exception as e:
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
    HTTPServer(("0.0.0.0", 5000), Handler).serve_forever()