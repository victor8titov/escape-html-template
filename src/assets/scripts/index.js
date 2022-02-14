window.addEventListener('load', function () {
  initHandlersForNavigationBurger()
})

function initHandlersForNavigationBurger() {
  const _navigation = document.querySelector('.header__navigation');

  document
    .querySelector('.navigation__wrapper-button')
    .addEventListener('click', handlerClickBurgerButton)

  window.addEventListener('resize', resetNav)

  document
    .querySelector('.navigation__wrapper-item>ul')
    .addEventListener('click', handlerClickBackgroundList)
  
  function handlerClickBurgerButton (e) {
    _navigation.classList.toggle('header__navigation_active');

    if (_navigation.classList.contains('header__navigation_active')) {
      hideScroll()
    } else {
      showScroll()
    }
  }

  function handlerClickBackgroundList (e) {
    if (e.target === e.currentTarget) resetNav();
  }

  function resetNav() {
    showScroll()

    const _navigation = document.querySelector('.header__navigation');
    _navigation.classList.remove('header__navigation_active');
  }
}


function hideScroll () {
  document.body.style.paddingRight = `${getScrollbarWidth()}px`
  document.body.style.overflow = 'hidden'    
} 

function showScroll () {
  document.body.style.paddingRight = ''
  document.body.style.overflow = 'visible'
}


const getScrollbarWidth = () => {
  const outer = document.createElement('div')

  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  outer.style.width = '50px'
  outer.style.height = '50px'
  outer.style.overflow = 'scroll'
  outer.style.visibility = 'hidden'

  document.body.appendChild(outer)
  
  const scrollBarWidth = outer.offsetWidth - outer.clientWidth;
  document.body.removeChild(outer)

  return scrollBarWidth;
}
