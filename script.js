// Selections
const learnMoreBtn = document.querySelector('.hero__learn-more');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const section4 = document.querySelector('#section--4');
const section5 = document.querySelector('#section--5');
const section6 = document.querySelector('#section--6');
const nav = document.querySelector('.nav__ul');
const navigation = document.querySelector('.nav');
const tabBtns = document.querySelectorAll('.operations__btn');
const btnContainer = document.querySelector('.operations__buttons');
const tabContent = document.querySelectorAll('.operations__generic-grid');
const sections = document.querySelectorAll('.section');
const images = document.querySelectorAll('[data-src]');
const reviews = document.querySelectorAll('.not-sure__review-container');
const rightBtn = document.querySelector('.not-sure__arrow-right');
const leftBtn = document.querySelector('.not-sure__arrow-left');
const markers = document.querySelector('.not-sure__markers');

//Smooth Scrolling
learnMoreBtn.addEventListener('click', () => {
  const coords = section2.getBoundingClientRect();
  window.scrollTo({
    left: 0,
    top: coords.top + window.scrollY,
    behavior: "smooth"
  });
});

//Page Navigation
nav.addEventListener('click', (e) => {
  if(e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')){
    e.preventDefault();
    const coord = document.querySelector(`${e.target.getAttribute('href')}`).getBoundingClientRect();
    window.scrollTo({
      top: coord.top + window.scrollY,
      left: 0,
      behavior: 'smooth'
    });
  }
}); 

//Tabbed Component
btnContainer.addEventListener('click', (e) => {
  const clicked = e.target;
  if(clicked.tagName !== "BUTTON") return;
  const no = clicked.getAttribute('data-tab');
  console.log(no);
  tabBtns.forEach( (ele, idx) => {
      ele.classList.remove('lift');
      if(`${idx + 1}` === no) ele.classList.add('lift');
  });

  tabContent.forEach( (ele, idx) => {
    if(`${idx + 1}` !== no){
      ele.classList.add('hide');
    }else{
      ele.classList.remove('hide');
    }
  });
});

//Fading Menu
nav.addEventListener('mouseover', (e) => {
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.parentElement.parentElement.children;
    
    [...siblings].forEach( (ele) => {
      if(ele.firstElementChild !== link) ele.style.opacity = 0.5;
      else ele.style.opacity = 1;
    });
  }
}); 

nav.addEventListener('mouseout', (e) => {
  if(e.target.classList.contains('nav__link')){
    const siblings = e.target.parentElement.parentElement.children;
    [...siblings].forEach( (ele) => {
      ele.style.opacity = 1;
    });
  }  
}); 

//Sticky nav

const iO  = new IntersectionObserver(function(entries){
    const [entry] = entries;
      navigation.classList.toggle('sticky', !entry.isIntersecting);
},{
    root: null,
    threshold: 0,
});

iO.observe(section1);

//Reveal Section

const sectionObserver = new IntersectionObserver(function(entries){
    const [entry] = entries;
    if(entry.isIntersecting){
      entry.target.classList.remove('section__hidden');
      sectionObserver.unobserve(entry.target);
    }
},{
  root: null,
  threshold: 0.15
});

sections.forEach( (section) => {
  section.classList.add('section__hidden');
  sectionObserver.observe(section);
});

//Lazy Loading
const imgObserver = new IntersectionObserver(function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  entry.target.setAttribute('src',`${entry.target.getAttribute('data-src')}`);
  entry.target.classList.remove('features__image-lazy');
  imgObserver.unobserve(entry.target);
}, {
  root: null,
  threshold: 0.9
});

images.forEach( image => {
  imgObserver.observe(image);
});

//Slider
let currSlide = 0;
const maxSlide = reviews.length;

const activeDot = function(slide){
    [...markers.children].forEach( ele => {
        ele.classList.remove('selected');
    });
    markers.children[slide].classList.add('selected');
}

const goToSlide = function(slide){
    reviews.forEach( (ele, idx) => {
      ele.style.transform = `translateX(${100 * (idx - slide)}%)`;
    });
}

goToSlide(0);
activeDot(0);

const rightSlide = () => {
  if(currSlide >= maxSlide - 1){
    currSlide = 0;
  } else{
  currSlide++;
  }
  goToSlide(currSlide);
  activeDot(currSlide);
};

const leftSlide = () => {
  if(currSlide <= 0){
    currSlide = maxSlide - 1;
  } else{
    currSlide--;
  }

  goToSlide(currSlide);
  activeDot(currSlide);
};

rightBtn.addEventListener('click', rightSlide);
leftBtn.addEventListener('click', leftSlide);
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') leftSlide();
    else if(e.key === 'ArrowRight') rightSlide();
});

markers.addEventListener('click', (e) => {
  if(e.target.classList.contains('marker')){
    currSlide = e.target.getAttribute('data-slide');
    goToSlide(currSlide);
    activeDot(currSlide);
  }
});
