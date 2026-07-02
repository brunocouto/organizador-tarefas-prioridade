import socket
import sys
from pathlib import Path

import uvicorn

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))


def find_available_port(start_port: int = 8000) -> int:
    port = start_port

    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port

        port += 1


if __name__ == "__main__":
    port = find_available_port()
    print(f"Aplicacao disponivel em: http://127.0.0.1:{port}")
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=port)
