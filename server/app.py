"""
compare two persons' D-Flower. Precisely, it's a rader plot of two persons' scores/ranks in ten dimensions:

    Egoism, Greedy, Machiavellianism, Moral disengagement, 
    Narcissism, Phycological Entitlement, Psychopathy, 
    Sadeism, Self-centreness, Spitefulness
    
"""
import re
import textwrap
from urllib.request import urlopen 

from flask import Flask, jsonify, request
from flask_cors import CORS

class DarkFlowerApp:
    
    DATACOL= ['traits', 'traitDescr', 'scores', 'ranks']

    def __init__(self):
        pass
    # load page
    def data_scraping(self, url):
        """
        Scraping data from the url
        """
        page = urlopen(url)
        html_bytes = page.read()
        html = html_bytes.decode("utf-8")

        # find the data section
        script = html[html.find('var traits = ['):]
        var_start_index = [m.start() for m in re.finditer('var', script)]

        data = dict.fromkeys(self.DATACOL)
        i = 0
        while i < len(var_start_index)-1:
            content = script[var_start_index[i]:var_start_index[i+1]]
            name = content[content.find(' '):content.find('=')].strip()
            
            # load only the variables in DATACOL
            if name in data.keys():
                data[name] = eval(content[content.find('=')+1: content.find(';')])
                i+=1
            else:
                break
        
        # clearning traits
        data['traits'] = [tr[0].strip() for tr in data['traits']]
        data['traitDescr'] = ['<br>'.join(textwrap.wrap(txt, width=50)) for txt in data['traitDescr']]

        return data
    
    
app = Flask(__name__)
dark_flower_app = DarkFlowerApp()
CORS(app, support_credentials=True)

@app.route("/tochatgpt", methods=["POST"])
def compare_to_chatgpt():
    error = None
    result = []
    
    url_gpt = 'https://qst.darkfactor.org/?site=pFBSUk2YXViV0c1ajVodUI3MzBWL2hqdTBMbnZjMXNSVWsramswT0g2NVdDSlZZQThJWEZDYTZxYzFTdXhVUEJoQg'
    url = request.get_json().get("query")
    try:
        user_df = dark_flower_app.data_scraping(url)
        user_df['name'] = 'Human'
        result.append(user_df)

        user_df = dark_flower_app.data_scraping(url_gpt)
        user_df['name'] = 'ChatGPT'
        result.append(user_df)
        
    except Exception as err:
        error = str(err)
    return jsonify(error=error, result=result)

@app.route("/")
def index():
    return 'Hello World!'

# app.run()
    