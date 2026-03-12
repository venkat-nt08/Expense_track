import requests
import time

def check_health():
    url = "http://127.0.0.1:8000/"
    try:
        response = requests.get(url)
        print(f"Backend is UP. Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Backend is DOWN. Error: {e}")

if __name__ == "__main__":
    check_health()
