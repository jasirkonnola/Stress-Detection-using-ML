import urllib.request
import urllib.error

try:
    with urllib.request.urlopen("http://127.0.0.1:5000/", timeout=5) as response:
        print(f"Status: {response.status}")
        print("Server is responding!")
except urllib.error.URLError as e:
    print(f"Server not reachable: {e}")
