

import re


PHISHING_PATTERNS = [

    'bit.ly',
    'tinyurl',
    '.xyz',
    '.top',
    '.ru',
    '.tk',
    '@',
    'secure-login',
    'verify-now'

]


def check_phishing(message):

    message = message.lower().strip()

    risk_score = 0

    detected_issues = []


    for pattern in PHISHING_PATTERNS:

        if pattern in message:

            risk_score += 12

            detected_issues.append(
                f'Phishing pattern detected: {pattern}'
            )


    url_pattern = r'https?:\\/\\/[^\\s]+'


    if re.search(url_pattern, message):

        risk_score += 10

        detected_issues.append(
            'Suspicious URL detected'
        )


    if risk_score > 100:

        risk_score = 100


    risk_level = 'Low Risk'


    if risk_score >= 70:

        risk_level = 'High Risk'

    elif risk_score >= 40:

        risk_level = 'Medium Risk'


    if not detected_issues:

        detected_issues.append(
            'No phishing indicators detected.'
        )


    return {

        'risk_level': risk_level,

        'risk_score': risk_score,

        'detected_issues': detected_issues

    }