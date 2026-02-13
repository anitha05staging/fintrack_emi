import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"
USERNAME = "testuser"
PASSWORD = "password123"

def login():
    url = f"{BASE_URL}/users/login/"
    payload = {"username": USERNAME, "password": PASSWORD}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("✅ Login Successful")
            return response.json()['access']
        else:
            print(f"❌ Login Failed: {response.status_code} - {response.text}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Login Error: {e}")
        sys.exit(1)

def check_endpoint(name, url, token, method="GET", payload=None):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=payload)
            
        if response.status_code in [200, 201]:
            print(f"✅ {name}: {response.status_code} OK")
            # print(json.dumps(response.json(), indent=2)) # Uncomment only if detailed output needed
            return response.json()
        else:
            print(f"❌ {name}: Failed {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ {name}: Error {e}")
        return None

def verify_all():
    print("🚀 Starting API Verification...\n")
    token = login()
    
    # 1. Dashboard Summary
    dashboard = check_endpoint("Dashboard Summary", f"{BASE_URL}/loans/dashboard_summary/", token)
    if dashboard:
        print(f"   - Total Outstanding: {dashboard.get('outstanding_balance')}")

    # 2. List Loans
    loans = check_endpoint("List Loans", f"{BASE_URL}/loans/", token)
    loan_id = None
    if loans and len(loans) > 0:
        loan_id = loans[0]['id']
        print(f"   - Found {len(loans)} loans. Using Loan ID {loan_id} for filter test.")

    # 3. List Payments (All)
    check_endpoint("List Payments (All)", f"{BASE_URL}/payments/", token)

    # 4. List Payments (Filtered)
    if loan_id:
        check_endpoint(f"List Payments (Loan {loan_id})", f"{BASE_URL}/payments/?loan_id={loan_id}", token)

    # 5. List Reminders
    check_endpoint("List Reminders", f"{BASE_URL}/reminders/", token)

    # 6. Trigger Overdue Check
    check_endpoint("Trigger Overdue Check", f"{BASE_URL}/payments/trigger_overdue_check/", token, method="POST")

    print("\n✨ Verification Complete.")

if __name__ == "__main__":
    verify_all()
