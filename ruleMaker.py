with open("urls.txt", 'r') as domains, open("urls.json", 'w') as json:
    domainList = domains.readlines()
    count = 0
    for domain in domainList:
        count+= 1
        domain = domain.strip()  
        L = f"""
        {{
            "id": {count},
            "action": {{
                "type": "block"
            }},
            "condition": {{
                "urlFilter": "{domain}"
            }}
        }},
        """  
        json.write(L)
