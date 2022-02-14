window.addEventListener('load', function () {
  initHandlersForNavigationBurger()
})

/* РАБОТЫ С НАВИГАЦИЕЙ */

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

    // скрываем или показываем скролл всего документа в зависимости от 
    // состояния меню
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


/* ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ */

function hideScroll () {
  // задаем правый отступ для всей страницы 
  // нужно чтобы не было прыжка в момент когда скролл у всей страницы пропадает
  document.body.style.paddingRight = `${getScrollbarWidth()}px`

  // ключевое действие для блокировки скроллинга на странице
  // это свойство прячет скролл для body и в тоже время блокирует вертикальный 
  // и горизонтальный скролл
  document.body.style.overflow = 'hidden'    
} 

function showScroll () {
  // убираем отступ
  document.body.style.paddingRight = ''
  // восстанавливаем нативное поведение скролла для всей страницы
  document.body.style.overflow = 'visible'
}


// вспомогательная функция для определения ширины скролла
const getScrollbarWidth = () => {
  const outer = document.createElement('div')

  // создаем элемент который мы спрячем.
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  outer.style.width = '50px'
  outer.style.height = '50px'
  outer.style.overflow = 'scroll'
  outer.style.visibility = 'hidden'

  document.body.appendChild(outer)

  // тут ключевой момент мы высчитываем ширину скролла для этого маленького блока
  // но поскольку стилизация скролла для всех блоков едина то можно считать что для 
  // body он тоже будет таким же. здесь
  
  // offsetWidth:  содержат «внешнюю» ширину элемента, то есть его полный размер, включая рамки border и ширину полосы прокрутки
  // clientWidth: включают в себя ширину содержимого width вместе с полями padding, но без прокрутки.
  
  const scrollBarWidth = outer.offsetWidth - outer.clientWidth;
  // замерили ширину полосы прокрутки и удаляем елемент с dom
  document.body.removeChild(outer)

  return scrollBarWidth;
}
