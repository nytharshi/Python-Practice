from http.server import BaseHTTPRequestHandler
import json
import subprocess
import tempfile
import os


class handler(BaseHTTPRequestHandler):

    def do_POST(self):

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        data = json.loads(body)

        code = data.get("code", "")
        user_input = data.get("input", "")

        try:

            with tempfile.NamedTemporaryFile(
                mode="w",
                suffix=".py",
                delete=False,
                encoding="utf-8"
            ) as file:

                file.write(code)
                filename = file.name

            result = subprocess.run(
                ["python", filename],
                input=user_input,
                text=True,
                capture_output=True,
                timeout=10
            )

            output = result.stdout

            if result.stderr:
                output += result.stderr

            os.remove(filename)

            response = {
                "output": output
            }

        except Exception as e:

            response = {
                "output": str(e)
            }

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        self.wfile.write(
            json.dumps(response).encode()
        )