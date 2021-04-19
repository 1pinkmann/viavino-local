import gsap from 'gsap'

let brands = [
    { name: 'viavino', active: true, title: 'Viavino' },
    { name: 'mascarada', active: false, title: 'Mascarada' },
    { name: 'rueDuVin', active: false, title: 'Rue Du Vin' },
];

class App {
    constructor() {
        this.introSection = document.querySelector('.intro');
        this.intoLinks = document.querySelector('[data-intro-links]');
        this.introDecor = document.querySelector('.intro .intro__decor--1');
        this.introHeading = document.querySelector('.intro .intro__heading');
        this.introText = document.querySelector('.intro .intro__text');
        this.navigationWrapper = document.querySelector('[data-navigation]');
        this.links = document.querySelectorAll('[data-brand-link]');
        this.footerButtonsWrapper = document.querySelector('[data-footer-buttons]');
        this.sideLinks = document.querySelectorAll('[data-brand-link]');

        this.wrapper = document.querySelector('[data-brand="viavino"]');
        this.totalScreens = this.wrapper.querySelectorAll('[data-brand-wine]');
        this.logo = this.wrapper.querySelector('[data-brand-logo]');
        this.brandWines = this.wrapper.querySelectorAll('[data-brand-wine]');

        this.initNavigation(this.wrapper);

        this.timeline = gsap.timeline();

        this.currentScreen = 0;

        this.initDefaults();
        this.initBrandLinks();
        this.setActiveBrandClass();

        this.animateIntroIn(this.timeline);

        this.handleGlobalClick = this.handleGlobalClick.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleMobileOff = this.handleMobileOff.bind(this);

        document.addEventListener('click', this.handleGlobalClick);

        window.addEventListener('wheel', this.handleWheel);

        window.addEventListener('resize', this.handleMobileOff)
    }

    setActiveBrandClass() {
        let activeBrand = brands.find(brand => {
            return brand.active === true;
        });

        this.activeClass = `page--${activeBrand.name}`;
    }

    handleWheel(e) {
        if (this.timeline.isActive() || (document.body.clientWidth < 1060)) return;

        if ((Math.sign(e.deltaY) * -1 > 0) && (this.currentScreen > 0)) {
            this.currentScreen--;
            this.triggerAnimation('up');

        } else if ((Math.sign(e.deltaY) * -1 < 0) && (this.currentScreen <= this.totalScreens.length)) {
            this.triggerAnimation('down');
            this.currentScreen++;
        }
    }

    initDefaults() {
        let defaults = gsap.defaults()

        this.duration = defaults.duration
        this.enabled = false
    }

    triggerAnimation(direction) {

        if (direction === 'down') {

            if (this.currentScreen === 0) {
                this.timeline
                    .add(this.animateIntroOut())
                    .add(this.animateIn(this.brandWines[this.currentScreen]));
            } else if (this.currentScreen === this.totalScreens.length) {
                this.timeline
                    .add(this.animateOut(this.brandWines[this.currentScreen - 1]))
                    .add(this.animateFooterIn())
            } else {
                this.timeline
                    .add(this.animateOut(this.brandWines[this.currentScreen - 1]))
                    .add(this.animateIn(this.brandWines[this.currentScreen]));

            }
        } else if (direction === 'up') {

            if (this.currentScreen === 0) {
                this.timeline
                    .add(this.animateOut(this.brandWines[this.currentScreen]))
                    .add(this.animateIntroIn());

            } else if (this.currentScreen === this.totalScreens.length) {
                this.timeline
                    .add(this.animateFooterOut())
                    .add(this.animateIn(this.brandWines[this.currentScreen - 1]))
            } else {
                this.timeline
                    .add(this.animateOut(this.brandWines[this.currentScreen]))
                    .add(this.animateIn(this.brandWines[this.currentScreen - 1]))
            }
        }
    }

    animateIntroIn() {
        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        return gsap.timeline()
            .set(this.introSection, { autoAlpha: 1, immediateRender: false })
            .to(navigationLinks, { autoAlpha: 0, stagger: 0.1 }, this.calcDuration(0))
            .to(document.body, { className: `page page--intro ${this.activeClass}` }, this.calcDuration(0))
            .to(this.introDecor, { autoAlpha: 1, scale: 1, duration: this.calcDuration(8) }, this.calcDuration(0))
            .to(this.intoLinks, { autoAlpha: 1, y: 0 }, this.calcDuration(1))
            .to(this.introHeading, { autoAlpha: 1, y: 0 }, this.calcDuration(2))
            .to(this.introText, { autoAlpha: 1, y: 0 }, this.calcDuration(3))
    }

    animateIntroOut() {
        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        return gsap.timeline()
            .to(this.introDecor, { autoAlpha: 0, scale: 1.1, duration: this.calcDuration(8) }, this.calcDuration(0))
            .to(this.intoLinks, { autoAlpha: 0, y: -10 }, this.calcDuration(0))
            .to(this.introHeading, { autoAlpha: 0, y: -10 }, this.calcDuration(1))
            .to(this.introText, { autoAlpha: 0, y: -10 }, this.calcDuration(2))
            .set(this.introSection, { autoAlpha: 0, immediateRender: false })
            .to(navigationLinks, { autoAlpha: 1, yPercent: 0, stagger: 0.1 }, this.calcDuration(2))
    }

    animateFooterIn() {
        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        return gsap.timeline()
            .to(navigationLinks, { autoAlpha: 0, stagger: 0.1 }, this.calcDuration(1.5))
            .to(document.body, { className: `page page--footer ${this.activeClass}` }, this.calcDuration(1.5))
            .to(this.footerButtonsWrapper, { autoAlpha: 1, immediateRender: false })
    }

    animateFooterOut() {
        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        return gsap.timeline()
            .to(this.footerButtonsWrapper, { autoAlpha: 0 }, 0)
            .to(document.body, { className: `page page--footer ${this.activeClass}` }, 0.5)
            .to(navigationLinks, { autoAlpha: 1, stagger: 0.1 }, 0.5)
    }

    animateIn(wrapper) {
        let attribute = wrapper.getAttribute('data-brand-wine');
        let can = wrapper.querySelector('.wine__can');
        let decors = wrapper.querySelectorAll('.wine__decor');
        let type = wrapper.querySelector('.wine__type');
        let heading = wrapper.querySelector('.wine__name');
        let texts = wrapper.querySelectorAll('.wine__description');
        let features = wrapper.querySelector('.wine__features');
        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        return gsap.timeline({
            onStart: () => {
                if (document.body.clientWidth > 1060) {
                    this.changeNavigationActiveLink(navigationLinks);
                }
            }
        })
            .set(document.body, { className: `page page--${attribute} ${this.activeClass}` }, 0)
            .set(wrapper, { autoAlpha: 1, immediateRender: false }, 0)
            .to(this.logo, { autoAlpha: 1, immediateRender: false }, 0)
            .to(this.sideLinks, { xPercent: 0, autoAlpha: 0.6 }, this.calcDuration(0))
            .to(can, { autoAlpha: 1, x: 0 }, this.calcDuration(0))
            .to(decors, { autoAlpha: 1, y: 0 }, this.calcDuration(0))
            .to(type, { autoAlpha: 1, y: 0 }, this.calcDuration(.5))
            .to(heading, { autoAlpha: 1, y: 0 }, this.calcDuration(1))
            .to(texts, { autoAlpha: 1, y: 0 }, this.calcDuration(1.5))
            .to(features, { autoAlpha: 1, y: 0 }, this.calcDuration(3))
    }

    animateOut(wrapper) {
        let can = wrapper.querySelector('.wine__can');
        let decors = wrapper.querySelectorAll('.wine__decor');
        let type = wrapper.querySelector('.wine__type');
        let heading = wrapper.querySelector('.wine__name');
        let texts = wrapper.querySelectorAll('.wine__description');
        let features = wrapper.querySelector('.wine__features');

        return gsap.timeline({
            onStart: () => {
                this.animateSideLinksOut();
            }
        })
            .to(this.logo, { autoAlpha: 0, immediateRender: false }, 0)
            .to(can, { autoAlpha: 0, x: 20 }, this.calcDuration(0))
            .to(decors, { autoAlpha: 0, y: -10 }, this.calcDuration(0))
            .to(type, { autoAlpha: 0, y: -10 }, this.calcDuration(.5))
            .to(heading, { autoAlpha: 0, y: -10 }, this.calcDuration(1))
            .to(texts, { autoAlpha: 0, y: -10 }, this.calcDuration(1.5))
            .to(features, { autoAlpha: 0, y: -10 }, this.calcDuration(3))
            .set(wrapper, { autoAlpha: 0, immediateRender: false })
    }

    animateSideLinksOut() {
        this.sideLinks.forEach((sideLink, i) => {
            gsap.to(sideLink, {
                xPercent: (i === 0 ? -10 : 10),
                autoAlpha: 0
            })
        })
    }

    animateNavigationIn() {
        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        return gsap.to(navigationLinks, {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.1
        })
    }

    changeNavigationActiveLink(navigationLinks) {
        navigationLinks.forEach(link => {
            link.classList.remove('active');
        });
        navigationLinks[this.currentScreen - 1].classList.add('active');
    }

    calcDuration(d) {
        return this.duration * d / 6;
    }

    off() {
        if (!this.enabled)
            return

        let allWines = document.querySelectorAll('[data-brand-wine]');

        gsap.set(document.body, {
            className: 'page'
        })

        gsap.set(this.introDecor, {
            clearProps: 'rotate,transform,opacity,visibility'
        })

        gsap.set([this.introSection, this.intoLinks, this.introHeading, this.introText], {
            clearProps: 'rotate,y,opacity,visibility'
        })

        allWines.forEach(wine => {
            let can = wine.querySelector('.wine__can');
            let decor1 = wine.querySelector('.wine__decor--1');
            let decor2 = wine.querySelector('.wine__decor--2');
            let type = wine.querySelector('.wine__type');
            let heading = wine.querySelector('.wine__name');
            let texts = wine.querySelectorAll('.wine__description');
            let features = wine.querySelector('.wine__features');

            gsap.set([decor1, decor2, type, heading, texts, features], {
                clearProps: 'rotate,y,opacity,visibility'
            });

            gsap.set(can, {
                clearProps: 'rotate,x,opacity,visibility'
            });

            gsap.set(brandWine, {
                clearProps: 'opacity,visibility'
            })
        })

        this.enabled = false
    }

    on() {
        if (this.enabled)
            return

        let allWines = document.querySelectorAll('[data-brand-wine]');

        let navigationLinks = document.querySelectorAll('[data-gsap-target-id]');

        gsap.set(navigationLinks, {
            autoAlpha: 0,
            yPercent: 10
        })

        gsap.set(this.introDecor, {
            scale: 1.1,
            rotate: 0.01
        })

        gsap.set([this.intoLinks, this.introHeading, this.introText], {
            y: 10,
            rotate: 0.01
        })

        this.sideLinks.forEach((sideLink, i) => {
            gsap.set(sideLink, {
                xPercent: (i === 0 ? -10 : 10),
                autoAlpha: 0
            })
        })

        allWines.forEach(wine => {
            let can = wine.querySelector('.wine__can');
            let decor1 = wine.querySelector('.wine__decor--1');
            let decor2 = wine.querySelector('.wine__decor--2');
            let type = wine.querySelector('.wine__type');
            let heading = wine.querySelector('.wine__name');
            let texts = wine.querySelectorAll('.wine__description');
            let features = wine.querySelector('.wine__features');

            gsap.set([decor1, decor2, type, heading, texts, features], {
                y: 10,
                rotate: 0.01
            })

            gsap.set(can, {
                x: 20,
                rotate: 0.01
            })
        })

        this.enabled = true
    }

    handleGlobalClick(e) {
        let link = e.target.closest('[data-brand-link]');
        let navLink = e.target.closest('[data-gsap-target-id]');
        let introLink = e.target.closest('[data-intro-link]');
        let footerButton = e.target.closest('[data-footer-button]');

        if (link) {
            this.changeActiveLink(link);
        } else if (navLink) {
            e.preventDefault();
            this.handleNavigationLinkClick(navLink);
        } else if (introLink) {
            this.handleIntroLinkClick(introLink);
        } else if (footerButton) {
            this.handleFooterButtonClick(footerButton);
        }
    }

    handleNavigationLinkClick(navLink) {

        let index = Number(navLink.getAttribute('data-index'));

        let localTl = gsap.timeline();

        localTl
            .add(this.animateOut(this.brandWines[this.currentScreen - 1]))
            .add(this.animateIn(this.brandWines[index]))

        this.currentScreen = index + 1;
    }

    handleFooterButtonClick(footerButton) {
        let attribute = footerButton.getAttribute('data-footer-button');

        this.wrapper = document.querySelector(`[data-brand="${attribute}"]`);
        this.totalScreens = this.wrapper.querySelectorAll('[data-brand-wine]');
        this.logo = this.wrapper.querySelector('[data-brand-logo]');
        this.brandWines = this.wrapper.querySelectorAll('[data-brand-wine]');

        this.currentScreen = 1;

        this.initNavigation(this.wrapper);

        this.changeActiveBrand(attribute);

        this.initBrandLinks();

        let localTl = gsap.timeline();

        if (document.body.clientWidth > 1060) {
            localTl
                .add(this.animateFooterOut(localTl))
                .add(this.animateIn(this.brandWines[0]))
        } else {
            localTl
                .add(() => {
                    let coords = document.querySelector('.intro').getBoundingClientRect().height;
                    window.scrollTo({
                        top: coords,
                        behavior: 'smooth',
                    });
                }, 0)
                .add(() => {
                    document.body.className = `page page--${attribute} ${this.activeClass}`;
                }, 0.5)
        }
    }

    initBrandLinks() {
        let unActiveBrands = brands.filter(brand => {
            return brand.active === false;
        });

        this.links.forEach((link, i) => {
            let linkText = link.querySelector('[data-brand-link-text]');
            linkText.textContent = unActiveBrands[i].title;
            link.setAttribute('data-brand-link', unActiveBrands[i].name);
        });
    }

    changeActiveLink(link) {

        let activeBrandAttribute = link.getAttribute('data-brand-link');

        let previousBrand = brands.find(item => item.active === true);

        let previousBrandWrapper = document.querySelector(`[data-brand=${previousBrand.name}]`);

        let previousBrandWines = previousBrandWrapper.querySelectorAll('[data-brand-wine]');

        let currentBrand = document.querySelector(`[data-brand="${activeBrandAttribute}"]`);

        this.currentScreen = 1;

        let changingTl = gsap.timeline();

        previousBrandWines.forEach(item => {
            changingTl.add(this.animateOut(item), 0);
        });

        this.totalScreens = currentBrand.querySelectorAll('[data-brand-wine]');
        this.logo = currentBrand.querySelector('[data-brand-logo]');
        this.brandWines = currentBrand.querySelectorAll('[data-brand-wine]');

        this.changeActiveBrand(activeBrandAttribute);

        changingTl
            .add(this.initNavigation(currentBrand))
            .add(this.animateNavigationIn())
            .add(() => {
                this.animateIn(this.brandWines[this.currentScreen - 1])
            })
            .add(() => {
                this.initBrandLinks();
            })
    }

    initNavigation(wrapper) {
        let currentWines = wrapper.querySelectorAll('[data-brand-wine]');

        this.navigationWrapper.innerHTML = null;

        this.navigationWrapper.innerHTML += this.renderNavigationLinks(currentWines);
    }

    renderNavigationLinks(currentWines) {

        let content = '';
        for (let index = 0; index < currentWines.length; index++) {

            let id = currentWines[index].getAttribute('data-brand-wine');

            content +=
                `<a href="#" class="js-navigate bullet bullet--${id} flex items-center justify-center" data-gsap-target-id="${id}" data-index="${index}">` +
                '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<circle class="bullet__circle" cx="13" cy="13" r="3" />' +
                '<circle class="bullet__outline" cx="13" cy="13" r="12" />' +
                '</svg>' +
                '</a>'
        }

        return content;
    }

    handleIntroLinkClick(introLink) {
        let attribute = introLink.getAttribute('data-intro-link');
        this.wrapper = document.querySelector(`[data-brand="${attribute}"]`);
        this.totalScreens = this.wrapper.querySelectorAll('[data-brand-wine]');
        this.logo = this.wrapper.querySelector('[data-brand-logo]');
        this.brandWines = this.wrapper.querySelectorAll('[data-brand-wine]');

        this.changeActiveBrand(attribute);

        if (document.body.clientWidth > 1060) {
            this.initBrandLinks();
            this.initNavigation(this.wrapper);
            this.triggerAnimation('down');
            this.currentScreen = 1;
        } else {
            document.body.className = `page page--${attribute} ${this.activeClass}`;
        }
    }

    changeActiveBrand(activeBrandAttribute) {
        brands = brands.map(brand => {
            if (brand.name === activeBrandAttribute) {
                this.activeClass = `page--${brand.name}`;
                return { ...brand, active: true }
            } else {
                return { ...brand, active: false }
            }
        });
    }

    handleMobileOff() {
        if (document.body.clientWidth < 1060) {
            this.off();
        } else {
            this.on();
        }
    }
}

gsap.defaults({
    duration: .5,
    ease: 'power1.inOut'
})

new App();

const stickyHeaderBar = document.querySelector('.header__bar--sticky');

window.addEventListener('scroll', (e) => {

    if (window.scrollY > 0 && document.body.clientWidth < 1060) {
        stickyHeaderBar.classList.add('header__bar--stuck');
    } else {
        stickyHeaderBar.classList.remove('header__bar--stuck');
    }
})

document.querySelector('.hamburger').addEventListener('click', function (e) {
    e.preventDefault()

    if (document.body.className.includes('page--dialog'))
        document.body.classList.remove('page--dialog');
    else
        document.body.classList.add('page--dialog');
})

document.addEventListener('DOMContentLoaded', () => {
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('scroll'))
})