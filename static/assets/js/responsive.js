
const hamburger = document.querySelector('.hamburger');

const navMenu = document.querySelector('.nav-menu');

const navLinksResponsive = document.querySelectorAll('.nav-link');


hamburger.addEventListener('click', () => {

    navMenu.classList.toggle('active');

    hamburger.classList.toggle('active');

});


navLinksResponsive.forEach(link => {

    link.addEventListener('click', () => {

        navMenu.classList.remove('active');

        hamburger.classList.remove('active');

    });

});

window.addEventListener('click', (event) => {

    const clickedInsideMenu = navMenu.contains(event.target);

    const clickedHamburger = hamburger.contains(event.target);


    if (
        !clickedInsideMenu &&
        !clickedHamburger &&
        navMenu.classList.contains('active')
    ) {

        navMenu.classList.remove('active');

        hamburger.classList.remove('active');

    }

});


window.addEventListener('resize', () => {

    if (window.innerWidth > 992) {

        navMenu.classList.remove('active');

        hamburger.classList.remove('active');

    }

});


hamburger.addEventListener('click', () => {

    if (navMenu.classList.contains('active')) {

        document.body.style.overflow = 'hidden';

    }

    else {

        document.body.style.overflow = 'auto';

    }

});


navLinksResponsive.forEach(link => {

    link.addEventListener('click', () => {

        document.body.style.overflow = 'auto';

    });

});


window.addEventListener('click', (event) => {

    const clickedInsideMenu = navMenu.contains(event.target);

    const clickedHamburger = hamburger.contains(event.target);


    if (
        !clickedInsideMenu &&
        !clickedHamburger
    ) {

        document.body.style.overflow = 'auto';

    }

});
