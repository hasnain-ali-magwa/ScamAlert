
/* ======================================================
   SCAMALERT RESPONSIVE JAVASCRIPT
====================================================== */


/* ======================================================
   ELEMENTS
====================================================== */

const hamburger = document.querySelector('.hamburger');

const navMenu = document.querySelector('.nav-menu');

const navLinksResponsive = document.querySelectorAll('.nav-link');


/* ======================================================
   TOGGLE MOBILE MENU
====================================================== */

hamburger.addEventListener('click', () => {

    navMenu.classList.toggle('active');

    hamburger.classList.toggle('active');

});


/* ======================================================
   CLOSE MENU ON LINK CLICK
====================================================== */

navLinksResponsive.forEach(link => {

    link.addEventListener('click', () => {

        navMenu.classList.remove('active');

        hamburger.classList.remove('active');

    });

});


/* ======================================================
   CLOSE MENU WHEN CLICK OUTSIDE
====================================================== */

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


/* ======================================================
   RESET MENU ON RESIZE
====================================================== */

window.addEventListener('resize', () => {

    if (window.innerWidth > 992) {

        navMenu.classList.remove('active');

        hamburger.classList.remove('active');

    }

});


/* ======================================================
   PREVENT BODY SCROLL WHEN MENU OPEN
====================================================== */

hamburger.addEventListener('click', () => {

    if (navMenu.classList.contains('active')) {

        document.body.style.overflow = 'hidden';

    }

    else {

        document.body.style.overflow = 'auto';

    }

});


/* ======================================================
   RESTORE SCROLL AFTER LINK CLICK
====================================================== */

navLinksResponsive.forEach(link => {

    link.addEventListener('click', () => {

        document.body.style.overflow = 'auto';

    });

});


/* ======================================================
   RESTORE SCROLL AFTER OUTSIDE CLICK
====================================================== */

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
