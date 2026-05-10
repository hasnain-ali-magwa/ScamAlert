/* ======================================================
   SCAMALERT MAIN JAVASCRIPT
====================================================== */


/* ======================================================
   ELEMENTS
====================================================== */

const analyzeButton = document.querySelector('.analyze-btn');

const scamInput = document.getElementById('scamInput');

const resultCard = document.querySelector('.result-card');

const riskBadge = document.querySelector('.risk-badge');

const riskScore = document.querySelector('.risk-score');

const resultList = document.querySelector('.result-content ul');
const detectedURLBox =
    document.querySelector('.detected-url-box');

const contactForm = document.querySelector('.contact-form');
const typingStatus = document.querySelector('.typing-status');

const charCount = document.querySelector('.char-count');

/* ======================================================
   HIDE RESULT INITIALLY
====================================================== */

resultCard.style.display = 'none';
/* ======================================================
   CHARACTER COUNTER
====================================================== */

scamInput.addEventListener('input', () => {

    const text = scamInput.value;

    charCount.textContent =
        `${text.length} Characters`;


    if (text.length === 0) {

        typingStatus.textContent =
            'Ready to analyze';

    }

    else {

        typingStatus.textContent =
            'Analyzing input readiness...';

    }


    /* ==========================================
       AUTO RESIZE
    ========================================== */

    scamInput.style.height = '220px';

    scamInput.style.height =
        scamInput.scrollHeight + 'px';

});

/* ======================================================
   ANALYZE MESSAGE
====================================================== */

analyzeButton.addEventListener('click', async () => {

    const input = scamInput.value.trim();


    if (input === '') {

        alert('Please enter a suspicious message or link.');

        return;

    }


    /* ==========================================
       LOADING STATE
    ========================================== */

    analyzeButton.disabled = true;

analyzeButton.classList.add('loading');


    try {

        const response = await fetch(
            'http://127.0.0.1:5000/analyze',
            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    message: input
                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || 'Analysis failed.'
            );

        }


        /* ==========================================
           SHOW RESULT
        ========================================== */

        resultCard.style.display = 'block';


        /* ==========================================
           RISK LEVEL
        ========================================== */

        riskBadge.textContent = data.risk_level;

        riskBadge.className = 'risk-badge';


        if (data.risk_level === 'High Risk') {

            riskBadge.classList.add('high-risk');

        }

        else if (data.risk_level === 'Medium Risk') {

            riskBadge.classList.add('medium-risk');

        }

        else {

            riskBadge.classList.add('low-risk');

        }


        /* ==========================================
           RISK SCORE
        ========================================== */

        riskScore.textContent =
            `Scam Probability: ${data.risk_score}%`;


        /* ==========================================
           DETECTED ISSUES
        ========================================== */

        resultList.innerHTML = '';

        /* ==========================================
   DETECT URL
========================================== */

const urlRegex =
    /(https?:\/\/[^\s]+)/g;

const detectedURL =
    input.match(urlRegex);


if (detectedURL) {

    detectedURLBox.style.display = 'block';

    detectedURLBox.innerHTML = `

        <h4>
            Suspicious URL Detected
        </h4>

        <div class="detected-url">
            ${detectedURL[0]}
        </div>

    `;

}

else {

    detectedURLBox.style.display = 'none';

}
        data.detected_issues.forEach(issue => {

            const li = document.createElement('li');

            li.textContent = issue;

            resultList.appendChild(li);

        });


        /* ==========================================
           SAFETY TIPS
        ========================================== */

        if (data.safety_tips) {

            const tipsTitle = document.createElement('h3');

            tipsTitle.textContent = 'Safety Tips';

            tipsTitle.style.marginTop = '30px';

            resultList.appendChild(tipsTitle);


            data.safety_tips.forEach(tip => {

                const li = document.createElement('li');

                li.textContent = tip;

                resultList.appendChild(li);

            });

        }


        /* ==========================================
           SCROLL TO RESULT
        ========================================== */

        resultCard.scrollIntoView({

            behavior: 'smooth',
            block: 'center'

        });

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    finally {

        analyzeButton.disabled = false;

analyzeButton.classList.remove('loading');

    }

});


/* ======================================================
   CONTACT FORM SUBMIT
====================================================== */

contactForm.addEventListener('submit', async (event) => {

    event.preventDefault();


    const name =
        contactForm.querySelector(
            'input[type="text"]'
        ).value;

    const email =
        contactForm.querySelector(
            'input[type="email"]'
        ).value;

    const subject =
    document.getElementById(
        'subjectInput'
    ).value;

    const message =
        contactForm.querySelector(
            'textarea'
        ).value;


    const formData = {

        name,
        email,
        subject,
        message

    };


    try {

        const response = await fetch(
            'http://127.0.0.1:5000/contact',
            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(formData)

            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || 'Message failed.'
            );

        }


        alert('Message sent successfully!');

        contactForm.reset();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

});


/* ======================================================
   ACTIVE NAV LINK
====================================================== */

const sections = document.querySelectorAll('section');

const navLinks = document.querySelectorAll('.nav-link');


window.addEventListener('scroll', () => {

    let current = '';


    sections.forEach(section => {

        const sectionTop = section.offsetTop;

        const sectionHeight = section.clientHeight;


        if (scrollY >= sectionTop - 200) {

            current = section.getAttribute('id');

        }

    });


    navLinks.forEach(link => {

        link.classList.remove('active');


        if (
            link.getAttribute('href') === `#${current}`
        ) {

            link.classList.add('active');

        }

    });

});

/* ======================================================
   CUSTOM SELECT
====================================================== */

const customSelect =
    document.querySelector('.custom-select');

const selected =
    document.querySelector('.select-selected');

const options =
    document.querySelectorAll('.select-option');

const hiddenInput =
    document.getElementById('subjectInput');


selected.addEventListener('click', () => {

    customSelect.classList.toggle('active');

});


options.forEach(option => {

    option.addEventListener('click', () => {

        selected.textContent =
            option.textContent;

        hiddenInput.value =
            option.textContent;

        customSelect.classList.remove('active');

    });

});


document.addEventListener('click', (e) => {

    if (!customSelect.contains(e.target)) {

        customSelect.classList.remove('active');

    }

});