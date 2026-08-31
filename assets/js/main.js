/* ==========================================================================
   Wiesenhalle Koppelheck — Interaktion
   ========================================================================== */
(function () {
  'use strict';

  /* --- Navigation: Sticky-Zustand + Mobile-Menü -------------------------- */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav__links');

  if (nav) {
    var setStuck = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        burger.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });
  }

  /* --- Scroll-Reveal ----------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* --- Countdown --------------------------------------------------------- */
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var target = new Date(cd.getAttribute('data-countdown')).getTime();
    var out = {
      d: cd.querySelector('[data-cd="d"]'),
      h: cd.querySelector('[data-cd="h"]'),
      m: cd.querySelector('[data-cd="m"]'),
      s: cd.querySelector('[data-cd="s"]')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };

    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        cd.classList.add('is-live');
        if (out.d) out.d.textContent = '00';
        if (out.h) out.h.textContent = '00';
        if (out.m) out.m.textContent = '00';
        if (out.s) out.s.textContent = '00';
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      if (out.d) out.d.textContent = pad(Math.floor(s / 86400));
      if (out.h) out.h.textContent = pad(Math.floor(s / 3600) % 24);
      if (out.m) out.m.textContent = pad(Math.floor(s / 60) % 60);
      if (out.s) out.s.textContent = pad(s % 60);
    };
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* --- Vergangene Termine ausgrauen -------------------------------------- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  document.querySelectorAll('.event[data-date]').forEach(function (el) {
    if (new Date(el.getAttribute('data-date')) < today) el.classList.add('is-past');
  });

  /* --- Kontaktformular: Validierung + Mail-Fallback ---------------------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');

    var invalidate = function (field, msg) {
      var wrap = field.closest('.field');
      wrap.classList.add('has-error');
      var err = wrap.querySelector('.field__error');
      if (err && msg) err.textContent = msg;
    };

    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field');
      if (wrap) wrap.classList.remove('has-error');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      var name = form.querySelector('#name');
      var mail = form.querySelector('#email');
      var msg = form.querySelector('#nachricht');

      if (!name.value.trim()) { invalidate(name, 'Bitte gib deinen Namen an.'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) {
        invalidate(mail, 'Bitte gib eine gültige E-Mail-Adresse an.'); ok = false;
      }
      if (!msg.value.trim()) { invalidate(msg, 'Bitte schreib uns kurz, worum es geht.'); ok = false; }

      if (!ok) {
        form.querySelector('.has-error input, .has-error textarea').focus();
        return;
      }

      /* Ohne Backend: sauberer mailto-Fallback.
         Beim Live-Gang hier den Endpoint des Formular-Dienstes eintragen. */
      var betreff = form.querySelector('#betreff');
      var subject = betreff && betreff.value.trim()
        ? betreff.value.trim()
        : 'Anfrage über wiesenhalle-koppelheck.de';
      var body = 'Name: ' + name.value.trim() + '\nE-Mail: ' + mail.value.trim() + '\n\n' + msg.value.trim();

      window.location.href = 'mailto:info@wiesenhalle.de'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      if (status) {
        status.hidden = false;
        status.textContent = 'Danke! Dein E-Mail-Programm öffnet sich mit der fertigen Nachricht. '
          + 'Klappt das nicht? Schreib uns direkt an info@wiesenhalle.de.';
      }
    });
  }

  /* --- Jahr im Footer ---------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
