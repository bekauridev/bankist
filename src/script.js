"use strict"
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// * Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // ! old Way to smooth Scrolling
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

});
// /////////////////////////////////////
//* Page navigation

//! 1. Add EventListener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // ! Matching stragetgy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// * Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); //!target button el

  //* ignore klick (Guard clause)
  if (!clicked) return;

  // ! Remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  // ! Active tab
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //! Actove content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});


//* Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//  Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Reveal images 
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15,
  rootMargin: `200px`,
});
imgTargets.forEach(img => imageObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right ');

  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  // Fucntions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dotsDot" data-slide="${i}"></button>`
      );
    });
  };

  const GoToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dotsDot')
      .forEach(dot => dot.classList.remove('dotsDotActive'));

    document
      .querySelector(`.dotsDot[data-slide='${slide}']`)
      .classList.add('dotsDotActive');
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    GoToSlide(curSlide);
    activateDot(curSlide);
  };
  const pervSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    GoToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    GoToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', pervSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') pervSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dotsDot`')) {
      const { slide } = e.target.dataset;
      GoToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// hamburger menu

const hamburger_btn = document.querySelector('.hamburgerButton')
const mobile_menu = document.querySelector('.mobile_nav')
const logo = document.querySelector('.nav__logo')

hamburger_btn.addEventListener('click', function () {
  hamburger_btn.classList.toggle('is--active')
  mobile_menu.classList.toggle('is--active')

})
document.querySelector('.nav__links-mobile').addEventListener('click', function () {
  mobile_menu.classList.remove('is--active')
  hamburger_btn.classList.remove('is--active')
  logo.style.opacity = 1

})

