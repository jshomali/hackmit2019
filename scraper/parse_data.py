import json
from google.cloud import firestore

with open('scraper/npo_data.json') as json_data:
    jsonData = json.load(json_data)

db = firestore.Client()

npo_ref = db.collection(u'non-profits')

for i in jsonData:
    npo_ref.add({
        u'title': i['title'],
        u'location': i['location'],
    })