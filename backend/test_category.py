import requests

def test_create_category():
    # 1. Login to get token
    login_url = "http://127.0.0.1:8000/token"
    login_data = {"username": "test@example.com", "password": "password123"} # Assuming this user exists from previous tests
    
    try:
        # Try logging in (or signup if fails, but let's assume login first)
        response = requests.post(login_url, data=login_data)
        if response.status_code != 200:
            print("Login failed, trying signup...")
            signup_url = "http://127.0.0.1:8000/signup"
            signup_data = {"email": "test@example.com", "password": "password123"}
            requests.post(signup_url, json=signup_data)
            response = requests.post(login_url, data=login_data)

        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Try creating a category
        cat_url = "http://127.0.0.1:8000/expenses/categories"
        cat_data = {"name": "Test Category", "color": "#FF0000"}
        
        print(f"Sending request to {cat_url} with data {cat_data}")
        cat_res = requests.post(cat_url, json=cat_data, headers=headers)
        
        print(f"Status Code: {cat_res.status_code}")
        print(f"Response: {cat_res.text}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_create_category()
