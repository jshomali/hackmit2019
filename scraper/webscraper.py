from bs4 import BeautifulSoup
import requests
import json

a_c_h_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=1&c_code%5Bid%5D="
education_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=2&c_code%5Bid%5D="
e_a_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=3&c_code%5Bid%5D="
health_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=4&c_code%5Bid%5D="
h_s_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=5&c_code%5Bid%5D="
i_f_a_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=6&c_code%5Bid%5D="
p_s_b_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=7&c_code%5Bid%5D="
religion_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=8&c_code%5Bid%5D="
membership_benefit_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=9&c_code%5Bid%5D="
unknown_url = "https://projects.propublica.org/nonprofits/search?utf8=%E2%9C%93&q=&state%5Bid%5D=&ntee%5Bid%5D=10&c_code%5Bid%5D="

responses = []

responses.append(requests.get(a_c_h_url))
responses.append(requests.get(education_url))
responses.append(requests.get(e_a_url))
responses.append(requests.get(health_url))
responses.append(requests.get(h_s_url))
responses.append(requests.get(i_f_a_url))
responses.append(requests.get(p_s_b_url))
responses.append(requests.get(religion_url))
responses.append(requests.get(membership_benefit_url))
responses.append(requests.get(unknown_url))

categories = []

categories.append("Arts, Culture & Humanities")
categories.append("Education")
categories.append("Environment and Animals")
categories.append("Health")
categories.append("Human Services")
categories.append("International, Foreign Affairs")
categories.append("Public, Societal Benefit")
categories.append("Religion Related")
categories.append("Mutual/Membership Benefit")
categories.append("Unknown, Unclassified")

cat_counter = 0

npo_list = []

for res in responses:
    content = BeautifulSoup(res.content, "html.parser")

    counter = 0

    all_tds = content.findAll('td')

    for index, t_d in enumerate(all_tds):
        if len(t_d.text.splitlines()) == 3 and t_d.text.splitlines()[1].lstrip()[0] != '$':
            non_profit_object = {
                "title": all_tds[index - 1].find('a').text,
                "location": t_d.text.splitlines()[1].lstrip(),
                "category": categories[cat_counter]
            }
            npo_list.append(non_profit_object)

    with open('scraper/npo_data.json', 'w') as outfile:
        json.dump(npo_list, outfile)

    cat_counter += 1