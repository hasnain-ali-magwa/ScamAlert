
SCAM_KEYWORDS = [

    'urgent',
    'otp',
    'bank',
    'blocked',
    'verify',
    'kyc',
    'winner',
    'lottery',
    'claim reward',
    'free money',
    'refund',
    'upi',
    'login now',
    'security alert',
    'account locked',
    'click now',
    'limited time'

]

def analyze_message(message):

    message = message.lower().strip()

    risk_score = 0

    detected_issues = []


    for keyword in SCAM_KEYWORDS:

        if keyword in message:

            risk_score += 8

            detected_issues.append(
                f'Suspicious keyword detected: {keyword}'
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
            'No major scam indicators detected.'
        )


    return {

        'risk_level': risk_level,

        'risk_score': risk_score,

        'detected_issues': detected_issues

    }