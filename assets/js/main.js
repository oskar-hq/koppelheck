/* ==========================================================================
   Wiesenhalle Koppelheck — Interaktion
   ========================================================================== */
(function () {
  'use strict';

  /* --- Navigation -------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var stick = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
    stick();
    window.addEventListener('scroll', stick, { passive: true });
  }

  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  if (burger && menu) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* --- Countdown --------------------------------------------------------- */
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var end = new Date(cd.getAttribute('data-countdown')).getTime();
    var slot = {
      d: cd.querySelector('[data-cd="d"]'), h: cd.querySelector('[data-cd="h"]'),
      m: cd.querySelector('[data-cd="m"]')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var timer;
    var tick = function () {
      var diff = end - Date.now();
      if (diff <= 0) {
        Object.keys(slot).forEach(function (k) { if (slot[k]) slot[k].textContent = '00'; });
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      if (slot.d) slot.d.textContent = Math.floor(s / 86400);
      if (slot.h) slot.h.textContent = pad(Math.floor(s / 3600) % 24);
      if (slot.m) slot.m.textContent = pad(Math.floor(s / 60) % 60);
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* --- Vergangene Termine kennzeichnen ---------------------------------- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  document.querySelectorAll('.ev[data-date]').forEach(function (el) {
    if (new Date(el.getAttribute('data-date')) < today) el.style.opacity = '.45';
  });

  /* --- Kontaktformular --------------------------------------------------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var status = form.querySelector('[data-status]');

    form.addEventListener('input', function (e) {
      var f = e.target.closest('.f');
      if (f) f.classList.remove('err');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var fail = function (el) { el.closest('.f').classList.add('err'); ok = false; };

      var name = form.querySelector('#name');
      var mail = form.querySelector('#email');
      var text = form.querySelector('#nachricht');

      if (!name.value.trim()) fail(name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) fail(mail);
      if (!text.value.trim()) fail(text);

      if (!ok) { form.querySelector('.err input, .err textarea').focus(); return; }

      /* Ohne Backend: mailto-Fallback.
         Beim Live-Gang hier den Endpoint des Formular-Dienstes eintragen. */
      var subj = form.querySelector('#betreff');
      window.location.href = 'mailto:info@wiesenhalle.de'
        + '?subject=' + encodeURIComponent(subj && subj.value.trim() ? subj.value.trim() : 'Anfrage über die Website')
        + '&body=' + encodeURIComponent('Name: ' + name.value.trim() + '\nE-Mail: ' + mail.value.trim() + '\n\n' + text.value.trim());

      if (status) {
        status.hidden = false;
        status.textContent = 'Dein E-Mail-Programm öffnet sich mit der fertigen Nachricht. Klappt das nicht: info@wiesenhalle.de';
      }
    });
  }

  /* --- Jahr im Footer ---------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
