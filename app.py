import requests

API_KEY = "e6377954f91472498d14c516012487f58fd6f3d2"

url = "https://api.hunter.io/v2/domain-search"

params = {
    "domain": "maaney.store",
    "api_key": API_KEY
}

r = requests.get(url, params=params, timeout=20)
print("Status:", r.status_code)
print("Response:", r.text)
