/* WizLeads Ghost Theme — vanilla JS */
(function () {
    'use strict';

    /* ---------------------------------------------------------------
       Sticky header scroll state
       --------------------------------------------------------------- */
    var header = document.querySelector('[data-site-header]');
    if (header) {
        var updateScrolled = function () {
            header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
        };
        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });
    }

    /* ---------------------------------------------------------------
       Mobile nav toggle
       --------------------------------------------------------------- */
    /* Floating header mobile menu */
    var fhBtn = document.querySelector('.fh-mobile-btn');
    var fhMenu = document.querySelector('.fh-mobile-menu');
    if (fhBtn && fhMenu) {
        fhBtn.addEventListener('click', function () {
            fhMenu.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.floating-header') && !e.target.closest('.fh-mobile-menu')) {
                fhMenu.classList.remove('open');
            }
        });
        fhMenu.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') fhMenu.classList.remove('open');
        });
    }

    /* ---------------------------------------------------------------
       Table of contents — build from content headings
       --------------------------------------------------------------- */
    var tocList = document.querySelector('[data-toc-list]');
    var content = document.querySelector('[data-content]');
    if (tocList && content) {
        var headings = content.querySelectorAll('h2, h3');
        if (headings.length < 2) {
            var tocEl = document.querySelector('[data-toc]');
            if (tocEl) tocEl.remove();
        } else {
            var items = [];
            headings.forEach(function (h, i) {
                if (!h.id) h.id = 'section-' + i;
                var li = document.createElement('li');
                li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
                var a = document.createElement('a');
                a.href = '#' + h.id;
                a.textContent = h.textContent;
                li.appendChild(a);
                tocList.appendChild(li);
                items.push({ id: h.id, link: a });
            });

            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        var link = items.find(function (it) { return it.id === entry.target.id; });
                        if (link && entry.isIntersecting) {
                            items.forEach(function (it) { it.link.classList.remove('is-active'); });
                            link.link.classList.add('is-active');
                        }
                    });
                }, { rootMargin: '-10% 0px -70% 0px' });
                headings.forEach(function (h) { observer.observe(h); });
            }
        }
    }

    /* ---------------------------------------------------------------
       Copy-to-clipboard share button
       --------------------------------------------------------------- */
    document.querySelectorAll('[data-share="copy"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var url = window.location.href;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function () {
                    var svg = btn.querySelector('svg');
                    if (svg) {
                        btn.style.color = '#7c3aed';
                        setTimeout(function () { btn.style.color = ''; }, 1500);
                    }
                });
            }
        });
    });

})();
