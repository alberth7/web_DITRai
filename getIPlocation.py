import requests
import json

resultados='E:\\thesis_2022\\thesis_code\\web_DITRai\\result.json'

with open(resultados, 'r') as f:
    json_data = json.load(f)

for instance in json_data["instances"]:
    ip = instance["ipdst"]
    url = f"https://api.iplocation.net/?ip={ip}"
    response = requests.get(url)
    if response.status_code == 200:
        ip_location = response.json()
        instance["ip_location"] = ip_location

print(json.dumps(json_data))


with open(resultados, 'w') as f:
    f.write(json.dumps(json_data))
