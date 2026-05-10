# backend/app.py


# ==========================================================
# SCAMALERT FLASK BACKEND
# ==========================================================


# ==========================================================
# IMPORTS
# ==========================================================

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

from dotenv import load_dotenv
import requests
import re
from google import genai
import os



# ==========================================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================================

load_dotenv()


# ==========================================================
# FLASK APP
# ==========================================================

app = Flask(__name__)
@app.route('/')
def home():

    return render_template('index.html')
CORS(app)


# ==========================================================
# ENV VARIABLES
# ==========================================================

DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

VIRUSTOTAL_API_KEY = os.getenv('VIRUSTOTAL_API_KEY')

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')


# ==========================================================
# GEMINI CONFIG
# ==========================================================
client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================================
# SCAM KEYWORDS
# ==========================================================

SCAM_KEYWORDS = [

    'otp',
    'bank',
    'verify',
    'kyc',
    'refund',
    'upi',
    'account',
    'security alert'

]


# ==========================================================
# URGENCY WORDS
# ==========================================================

URGENCY_WORDS = [

    'urgent',
    'immediately',
    'verify now',
    'account blocked',
    'limited time',
    'click now',
    'act now',
    'suspended'

]


# ==========================================================
# SAFE WORDS
# ==========================================================

SAFE_WORDS = [

    'do not share otp',
    'never share your otp',
    'official website',
    'customer care',
    'secure banking',
    'this is an automated message'

]


# ==========================================================
# PHISHING PATTERNS
# ==========================================================

PHISHING_PATTERNS = [

    'bit.ly',
    'tinyurl',
    '.xyz',
    '.top',
    '.ru',
    '.tk',
    '@',
    'http://',
    'secure-login',
    'verify-now'

]

# ==========================================================
# VIRUSTOTAL URL CHECK
# ==========================================================

def check_url_virustotal(url):

    try:

        headers = {
            'x-apikey': VIRUSTOTAL_API_KEY
        }


        response = requests.post(
            'https://www.virustotal.com/api/v3/urls',
            headers=headers,
            data={'url': url}
        )


        if response.status_code != 200:
            return None


        analysis_id = response.json()['data']['id']


        report_response = requests.get(
            f'https://www.virustotal.com/api/v3/analyses/{analysis_id}',
            headers=headers
        )


        if report_response.status_code != 200:
            return None


        report = report_response.json()

        stats = report['data']['attributes']['stats']


        malicious = stats.get('malicious', 0)

        suspicious = stats.get('suspicious', 0)


        return {
            'malicious': malicious,
            'suspicious': suspicious
        }


    except Exception:

        return None


# ==========================================================
# GEMINI AI ANALYSIS
# ==========================================================
def analyze_with_gemini(message):

    try:

        prompt = f'''
        Analyze this message for scam or phishing behavior.

        Message:
        {message}

        Return:
        - Threat level
        - Confidence score
        - Scam reasons
        - Safety advice
        '''

        response = client.models.generate_content(

            model='gemini-1.5-flash',

            contents=prompt

        )

        return response.text

    except Exception as error:

        return f'AI analysis unavailable: {error}'

# ==========================================================
# ANALYZE ROUTE
# ==========================================================

@app.route('/analyze', methods=['POST'])
def analyze():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                'success': False,
                'message': 'No data received.'

            }), 400


        user_input = data.get('message', '').lower().strip()


        if not user_input:

            return jsonify({

                'success': False,
                'message': 'Message is required.'

            }), 400


        risk_score = 0

        detected_issues = []


        # ==================================================
        # BASIC KEYWORD CHECK
        # ==================================================

        for keyword in SCAM_KEYWORDS:

            if keyword in user_input:

                risk_score += 5

                detected_issues.append(
                    f'Sensitive keyword detected: {keyword}'
                )


        # ==================================================
        # URGENCY DETECTION
        # ==================================================

        for word in URGENCY_WORDS:

            if word in user_input:

                risk_score += 20

                detected_issues.append(
                    f'Urgency tactic detected: {word}'
                )


        # ==================================================
        # PHISHING PATTERN CHECK
        # ==================================================

        for pattern in PHISHING_PATTERNS:

            if pattern in user_input:

                risk_score += 25

                detected_issues.append(
                    f'Suspicious phishing pattern: {pattern}'
                )


        # ==================================================
        # URL CHECK
        # ==================================================

        url_pattern = r'https?:\/\/[^\s]+'


        if re.search(url_pattern, user_input):

            risk_score += 15

            detected_issues.append(
                'External link detected'
            )


        # ==================================================
        # SAFE MESSAGE CHECK
        # ==================================================

        for safe_word in SAFE_WORDS:

            if safe_word in user_input:

                risk_score -= 15

                detected_issues.append(
                    f'Safe indicator found: {safe_word}'
                )


        # ==================================================
        # LIMIT SCORE
        # ==================================================

        if risk_score < 0:
            risk_score = 0


        if risk_score > 100:
            risk_score = 100


        # ==================================================
        # RISK LEVEL
        # ==================================================

        risk_level = 'Low Risk'


        if risk_score >= 70:
            risk_level = 'High Risk'

        elif risk_score >= 40:
            risk_level = 'Medium Risk'


        # ==================================================
        # DEFAULT SAFE RESPONSE
        # ==================================================

        if not detected_issues:

            detected_issues.append(
                'No major scam indicators detected.'
            )


        # ==================================================
        # SAFETY TIPS
        # ==================================================

        safety_tips = []


        if risk_level == 'High Risk':

            safety_tips = [
                'Avoid clicking suspicious links.',
                'Do not share OTP or banking details.',
                'Verify through official sources only.'
            ]


        elif risk_level == 'Medium Risk':

            safety_tips = [
                'Double-check the sender identity.',
                'Avoid downloading unknown files.'
            ]


        else:

            safety_tips = [
                'No major threats detected.',
                'Stay cautious while sharing information.'
            ]


        # ==================================================
        # URL EXTRACTION
        # ==================================================

        urls = re.findall(
            r'https?:\\/\\/[^\\s]+',
            user_input
        )


        virustotal_result = None


        if urls:

            virustotal_result = check_url_virustotal(urls[0])


            if virustotal_result:

                malicious = virustotal_result['malicious']

                suspicious = virustotal_result['suspicious']


                risk_score += (malicious * 8)
                risk_score += (suspicious * 5)


                if malicious > 0:

                    detected_issues.append(
                        f'VirusTotal detected {malicious} malicious engines.'
                    )


                if suspicious > 0:

                    detected_issues.append(
                        f'VirusTotal detected {suspicious} suspicious engines.'
                    )


        # ==================================================
        # GEMINI AI ANALYSIS
        # ==================================================
        # ==================================================

        return jsonify({

            'success': True,
            'risk_level': risk_level,
            'risk_score': risk_score,
            'detected_issues': detected_issues,
            'safety_tips': safety_tips

        })


    except Exception as error:

        return jsonify({

            'success': False,
            'message': str(error)

        }), 500


# ==========================================================
# CONTACT ROUTE
# ==========================================================

@app.route('/contact', methods=['POST'])
def contact():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                'success': False,
                'message': 'No data received.'

            }), 400


        name = data.get('name', '').strip()

        email = data.get('email', '').strip()

        subject = data.get('subject', '').strip()

        message = data.get('message', '').strip()


        if not all([name, email, subject, message]):

            return jsonify({

                'success': False,
                'message': 'All fields are required.'

            }), 400


        # ==================================================
        # DISCORD EMBED
        # ==================================================

        embed = {

            'title': '📩 New ScamAlert Contact Message',

            'color': 6227711,

            'fields': [

                {
                    'name': '👤 Name',
                    'value': name,
                    'inline': False
                },

                {
                    'name': '📧 Email',
                    'value': email,
                    'inline': False
                },

                {
                    'name': '📝 Subject',
                    'value': subject,
                    'inline': False
                },

                {
                    'name': '💬 Message',
                    'value': message,
                    'inline': False
                }

            ]

        }


        payload = {

            'embeds': [embed]

        }


        # ==================================================
        # SEND TO DISCORD
        # ==================================================

        response = requests.post(
            DISCORD_WEBHOOK_URL,
            json=payload
        )


        if response.status_code not in [200, 204]:

            return jsonify({

                'success': False,
                'message': 'Failed to send message to Discord.'

            }), 500


        return jsonify({

            'success': True,
            'message': 'Message sent successfully.'

        })


    except Exception as error:

        return jsonify({

            'success': False,
            'message': str(error)

        }), 500


# ==========================================================
# START SERVER
# ==========================================================

if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
