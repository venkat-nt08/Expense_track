import requests

def test_signup():
    url = "http://127.0.0.1:8000/signup"
    payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_signup()
