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

    /* ---------------------------------------------------------------
       Hero search — inline Ghost Content API search
       --------------------------------------------------------------- */
    var heroInput = document.getElementById('hero-search-input');
    var heroBtn = document.getElementById('hero-search-btn');
    var heroResults = document.getElementById('hero-search-results');
    var searchTimer = null;
    var GHOST_API_URL = window.location.origin + '/ghost/api/content/posts/';
    var GHOST_API_KEY = 'aac7ae7956a99ebc3907879ba3';

    function doSearch(query) {
        if (!query || query.length < 2) {
            heroResults.classList.remove('active');
            heroResults.innerHTML = '';
            return;
        }
        var url = GHOST_API_URL + '?key=' + GHOST_API_KEY +
            '&limit=5&fields=title,url,excerpt,feature_image&filter=title:~%27' +
            encodeURIComponent(query) + '%27';

        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var posts = data.posts || [];
                if (!posts.length) {
                    heroResults.innerHTML = '<div class="hero-search-no-results">No results found</div>';
                    heroResults.classList.add('active');
                    return;
                }
                heroResults.innerHTML = posts.map(function (p) {
                    var img = p.feature_image
                        ? '<img src="' + p.feature_image + '" alt="" width="48" height="48" loading="lazy">'
                        : '';
                    var excerpt = (p.excerpt || '').substring(0, 80);
                    return '<a href="' + p.url + '" class="hero-search-result">' +
                        img +
                        '<div class="hero-search-result-text">' +
                            '<div class="hero-search-result-title">' + p.title + '</div>' +
                            '<div class="hero-search-result-excerpt">' + excerpt + '</div>' +
                        '</div></a>';
                }).join('');
                heroResults.classList.add('active');
            })
            .catch(function () {
                heroResults.innerHTML = '<div class="hero-search-no-results">Search unavailable</div>';
                heroResults.classList.add('active');
            });
    }

    if (heroInput && heroBtn && heroResults) {
        heroInput.addEventListener('input', function () {
            clearTimeout(searchTimer);
            var q = this.value.trim();
            searchTimer = setTimeout(function () { doSearch(q); }, 300);
        });
        heroInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(searchTimer);
                doSearch(this.value.trim());
            }
        });
        heroBtn.addEventListener('click', function () {
            doSearch(heroInput.value.trim());
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.subscribe-form')) {
                heroResults.classList.remove('active');
            }
        });
    }

    /* ---------------------------------------------------------------
       CTA Subscribe — Airtable integration
       --------------------------------------------------------------- */
    var ctaForm = document.getElementById('cta-subscribe-form');
    var ctaMsg = document.getElementById('cta-subscribe-msg');
    if (ctaForm && ctaMsg) {
        ctaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = ctaForm.querySelector('input[name="name"]').value.trim();
            var email = ctaForm.querySelector('input[name="email"]').value.trim();
            if (!name || !email) return;

            var btn = ctaForm.querySelector('button');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            fetch('https://api.airtable.com/v0/appq85YavAIEtTVfB/tblBEO4Xex0ijCJrz', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer patEG4OqaQod4ljR3.f2b9df69aea901f9bfd013365ed71fe78ec9d3919aaa503f6b5476e9ab7488be',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [{ fields: { Name: name, Email: email } }]
                })
            })
            .then(function (r) {
                if (!r.ok) throw new Error('Failed');
                return r.json();
            })
            .then(function () {
                ctaMsg.style.color = '#a5f3a3';
                ctaMsg.textContent = 'You\'re in! We\'ll notify you about giveaways and deals.';
                ctaForm.style.display = 'none';
            })
            .catch(function () {
                ctaMsg.style.color = '#fca5a5';
                ctaMsg.textContent = 'Something went wrong. Please try again.';
                btn.textContent = 'Subscribe';
                btn.disabled = false;
            });
        });
    }

    /* ---------------------------------------------------------------
       Infinite scroll — AJAX "Load More" for post grids
       --------------------------------------------------------------- */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-load-more');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();

        var nextUrl = btn.getAttribute('href');
        if (!nextUrl || btn.classList.contains('loading')) return;

        btn.classList.add('loading');
        var originalText = btn.textContent;
        btn.textContent = 'Loading…';

        fetch(nextUrl)
            .then(function (res) {
                if (!res.ok) throw new Error(res.status);
                return res.text();
            })
            .then(function (html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                var newCards = doc.querySelectorAll('.post-card');
                var grid = document.querySelector('.posts-grid');

                if (grid && newCards.length) {
                    newCards.forEach(function (card) {
                        grid.appendChild(document.importNode(card, true));
                    });
                }

                var nextPageBtn = doc.querySelector('.btn-load-more');
                if (nextPageBtn && nextPageBtn.getAttribute('href')) {
                    btn.setAttribute('href', nextPageBtn.getAttribute('href'));
                    btn.textContent = originalText;
                    btn.classList.remove('loading');
                } else {
                    btn.parentElement.style.display = 'none';
                }
            })
            .catch(function () {
                btn.textContent = originalText;
                btn.classList.remove('loading');
            });
    });

})();
