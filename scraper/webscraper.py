from bs4 import BeautifulSoup
import requests
import json

# TODO: add parameters into url based on category
root_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=4&c_code%5Bid%5D="

response = requests.get(root_url)

content = BeautifulSoup(response.content, "html.parser")

counter = 0

npo_list = []

all_tds = content.findAll('td')

for index, t_d in enumerate(all_tds):
    if len(t_d.text.splitlines()) == 3 and t_d.text.splitlines()[1].lstrip()[0] != '$':
        non_profit_object = {
            "title": all_tds[index - 1].find('a').text,
            "location": t_d.text.splitlines()[1].lstrip()
        }
        npo_list.append(non_profit_object)

with open('scraper/npo_data.json', 'w') as outfile:
    json.dump(npo_list, outfile)