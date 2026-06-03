
const revealElements = document.querySelectorAll(
    '.hero-content, .analyzer-card, .result-card, .feature-card, .contact-form, .section-header'
);


function revealOnScroll() {

    const windowHeight = window.innerHeight;


    revealElements.forEach(element => {

        const elementTop = element.getBoundingClientRect().top;

        const revealPoint = 100;


        if (elementTop < windowHeight - revealPoint) {

            element.classList.add('reveal', 'active');

        }

    });

}

revealOnScroll();


window.addEventListener('scroll', revealOnScroll);


const featureCards = document.querySelectorAll('.feature-card');


featureCards.forEach(card => {

    card.addEventListener('mousemove', (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;

        const y = event.clientY - rect.top;


        const rotateY = ((x / rect.width) - 0.5) * 12;

        const rotateX = ((y / rect.height) - 0.5) * -12;


        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
        `;

    });


    card.addEventListener('mouseleave', () => {

        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0px)
        `;

    });

});

const navbar = document.querySelector('.navbar');


window.addEventListener('scroll', () => {

    if (window.scrollY > 50) {

        navbar.style.boxShadow =
            '0 10px 40px rgba(0,0,0,0.35)';

    }

    else {

        navbar.style.boxShadow = 'none';

    }

});
