/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

class Navbar extends HTMLElement {
  constructor () {
    super()

    this.handleDropdownsBackdrop()
    this.handleMegaMenus()
    this.handleHeaderReveal()
    this.adjustOffcanvasMenu()
  }

  adjustOffcanvasMenu () {
    const offcanvasMenu = document.querySelector('#offcanvas-menu')
    const navbarMobile = document.querySelector('#navbar-mobile')

    offcanvasMenu?.addEventListener('show.bs.offcanvas', () => {
      const navbarSpacing = document.querySelector('#navbar-mobile').getBoundingClientRect().bottom
      offcanvasMenu.style.height = `${window.innerHeight - navbarSpacing}px`

      navbarMobile.querySelector('.svg-icon-menu')?.classList.add('svg-icon-menu-close')
    })

    offcanvasMenu?.addEventListener('hide.bs.offcanvas', () => {
      navbarMobile.querySelector('.svg-icon-menu')?.classList.remove('svg-icon-menu-close')
    })
  }

  handleHeaderReveal () {
    let oldScroll = window.scrollY
    const headerGroup = document.querySelector('#header-group')

    window.addEventListener('scroll', () => {
      const newScroll = window.scrollY
      if (newScroll > oldScroll) {
        if (newScroll > headerGroup.clientHeight) {
          headerGroup.classList.add('hide')
        }
      } else if (newScroll < oldScroll) {
        headerGroup.classList.remove('hide')
      }

      oldScroll = Math.max(window.scrollY, 0)
    })
  }

  handleDropdownsBackdrop () {
    this.querySelectorAll('#navbar-desktop .dropdown-toggle').forEach(dropdown => {
      dropdown.addEventListener('hidden.bs.dropdown', () => {
        if (!document.querySelector('#navbar-desktop .dropdown-toggle.show')) {
          document.body.classList.remove('navbar-dropdown-open')
        }
      })
      dropdown.addEventListener('show.bs.dropdown', () => {
        document.body.classList.add('navbar-dropdown-open')
      })
    })
  }

  handleMegaMenus () {
    const items = [...this.querySelectorAll('.navbar-mega-item')]
    let closeTimer
    const cancelClose = () => {
      window.clearTimeout(closeTimer)
      closeTimer = null
    }
    const closeMenus = () => {
      cancelClose()
      items.forEach(item => {
        item.classList.remove('is-open')
        item.querySelector('.navbar-mega-toggle').setAttribute('aria-expanded', 'false')
      })
    }
    const scheduleClose = () => {
      cancelClose()
      closeTimer = window.setTimeout(closeMenus, 450)
    }
    const openMenu = item => {
      closeMenus()
      item.classList.add('is-open')
      item.querySelector('.navbar-mega-toggle').setAttribute('aria-expanded', 'true')
    }

    items.forEach(item => {
      const toggle = item.querySelector('.navbar-mega-toggle')
      toggle.addEventListener('click', () => {
        const shouldOpen = !item.classList.contains('is-open')
        if (shouldOpen) openMenu(item)
        else closeMenus()
      })
      item.addEventListener('mouseenter', () => openMenu(item))
      item.addEventListener('mouseleave', scheduleClose)
      item.querySelector('.navbar-mega-panel').addEventListener('mouseenter', cancelClose)
      item.addEventListener('focusin', event => {
        if (event.target !== toggle && !item.classList.contains('is-open')) openMenu(item)
      })
      item.addEventListener('focusout', event => {
        if (!item.contains(event.relatedTarget)) closeMenus()
      })
    })

    document.addEventListener('click', event => {
      if (!this.contains(event.target)) closeMenus()
    })
    this.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenus()
    })
  }
}
customElements.define('navbar-wrapper', Navbar)
