/* ==========================================================================
   Wiesenhalle Koppelheck — Interaktion
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOUR = 36e5, DAY = 864e5;
  var PARTY_LEN = 7 * HOUR;   // so lange gilt eine Party nach Einlass als „läuft"

  /* --- Kopfzeile: beim Scrollen Glasfläche ------------------------------- */
  var nav = document.querySelector('.nav');
  var prog = document.querySelector('.prog');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('is-stuck', y > 8);
      if (prog) {
        var max = root.scrollHeight - window.innerHeight;
        prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* --- LED-Trenner ------------------------------------------------------- */
  document.querySelectorAll('[data-leds]').forEach(function (bar) {
    var build = function () {
      var n = Math.max(12, Math.round(bar.clientWidth / 16));
      if (bar.childElementCount === n) return;
      bar.textContent = '';
      var frag = document.createDocumentFragment();
      for (var i = 0; i < n; i++) {
        var led = document.createElement('span');
        led.style.setProperty('--i', i);
        frag.appendChild(led);
      }
      bar.appendChild(frag);
    };
    build();
    window.addEventListener('resize', build);
  });

  /* --- Termine: Vergangenes ausblenden, nächsten Termin finden ---------- */
  var now = Date.now();
  var events = Array.prototype.slice.call(document.querySelectorAll('.ev[data-start]'))
    .map(function (el) { return { el: el, start: new Date(el.getAttribute('data-start')).getTime() }; })
    .filter(function (e) { return !isNaN(e.start); })
    .sort(function (a, b) { return a.start - b.start; });

  var upcoming = events.filter(function (e) {
    if (e.start + PARTY_LEN < now) { e.el.hidden = true; return false; }
    return true;
  });
  var next = upcoming[0];

  // Ein Termin in fremder Halle ist kein „Nächste Party bei uns" — trotzdem
  // zeigen, aber nur, wenn es keinen eigenen gibt.
  var own = upcoming.filter(function (e) { return !e.el.classList.contains('ev--away'); });
  if (own.length) next = own[0];
  if (next) next.el.classList.add('is-next');

  /* --- Ticket befüllen --------------------------------------------------- */
  var ticket = document.querySelector('[data-next]');
  var MON = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  function set(sel, text) {
    var el = ticket.querySelector(sel);
    if (el) el.textContent = text;
    return el;
  }

  function relDays(start) {
    var a = new Date(); a.setHours(0, 0, 0, 0);
    var b = new Date(start); b.setHours(0, 0, 0, 0);
    var d = Math.round((b - a) / DAY);
    if (d <= 0) return 'Heute';
    if (d === 1) return 'Morgen';
    return 'In ' + d + ' Tagen';
  }

  if (ticket && next) {
    var ev = next.el, d = new Date(next.start);
    set('[data-next-day]', String(d.getDate()).padStart(2, '0'));
    set('[data-next-mon]', MON[d.getMonth()]);
    set('[data-next-when]', ev.getAttribute('data-when') || '');
    set('[data-next-name]', ev.querySelector('.ev__name').textContent);
    var sub = ev.querySelector('.ev__sub');
    set('[data-next-sub]', sub ? sub.textContent : '');
    set('[data-next-rel]', relDays(next.start));

    var facts = ticket.querySelector('[data-next-facts]');
    if (facts) {
      facts.textContent = '';
      var add = function (k, v) {
        var li = document.createElement('li'), b = document.createElement('b');
        li.textContent = k; b.textContent = v; li.appendChild(b); facts.appendChild(li);
      };
      if (ev.getAttribute('data-price')) add('Eintritt', ev.getAttribute('data-price'));
      var hl = (ev.getAttribute('data-highlight') || '').split('|');
      if (hl.length === 2) add(hl[0], hl[1]);
      facts.hidden = !facts.childElementCount;
    }

    var link = ticket.querySelector('[data-next-link]');
    if (link) link.setAttribute('href', '#' + ev.id);

    // Zweite Aktion aus dem Termin übernehmen (z. B. Tisch reservieren)
    var row = link && link.parentNode;
    var action = ev.querySelector('[data-action]');
    if (row && action) {
      var b2 = document.createElement('a');
      b2.className = 'btn btn--ghost';
      b2.href = action.getAttribute('href');
      b2.textContent = action.textContent.trim();
      row.appendChild(b2);
    }

    var cdEl = ticket.querySelector('[data-countdown]');
    if (cdEl) cdEl.setAttribute('data-countdown', new Date(next.start).toISOString());
  } else if (ticket) {
    // Keine Termine mehr in der Liste
    set('[data-next-state]', 'Demnächst');
    set('[data-next-name]', 'Neue Termine folgen');
    set('[data-next-when]', 'Bleib dran');
    set('[data-next-sub]', 'Die nächsten Partys stehen bald fest. Frag gern direkt bei uns nach.');
    var tile = ticket.querySelector('.ticket__date'); if (tile) tile.hidden = true;
    var evs = document.querySelector('.evs'); if (evs) evs.closest('.sec').hidden = true;
    var f = ticket.querySelector('[data-next-facts]'); if (f) f.hidden = true;
    var c = ticket.querySelector('[data-countdown]'); if (c) c.hidden = true;
    var l = ticket.querySelector('[data-next-link]');
    if (l) { l.href = 'kontakt.html'; l.textContent = 'Kontakt aufnehmen'; }
  }

  // „Alle Infos" springt zum Termin und lässt ihn kurz aufleuchten
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target || !target.classList.contains('ev')) return;
    setTimeout(function () {
      target.classList.add('is-flash');
      setTimeout(function () { target.classList.remove('is-flash'); }, 1400);
    }, reduced ? 0 : 450);
  });

  /* --- Rückblick: vergangene Tagesveranstaltung kennzeichnen ------------ */
  document.querySelectorAll('[data-past-after]').forEach(function (el) {
    var t = new Date(el.getAttribute('data-past-after')).getTime();
    if (t < now) el.textContent = el.getAttribute('data-past-text');
  });

  /* --- Countdown --------------------------------------------------------- */
  var cd = document.querySelector('[data-countdown]');
  if (cd && !cd.hidden) {
    var end = new Date(cd.getAttribute('data-countdown')).getTime();
    var slot = {
      d: cd.querySelector('[data-cd="d"]'), h: cd.querySelector('[data-cd="h"]'),
      m: cd.querySelector('[data-cd="m"]'), s: cd.querySelector('[data-cd="s"]')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var timer;
    var live = function () {
      clearInterval(timer);
      var box = document.createElement('p');
      box.className = 'cd__live';
      box.innerHTML = '<span class="pulse" aria-hidden="true"></span>Läuft gerade — komm vorbei';
      cd.replaceWith(box);
      var st = ticket && ticket.querySelector('[data-next-state]');
      if (st) st.lastChild.textContent = 'Heute Nacht';
    };
    var tick = function () {
      var diff = end - Date.now();
      if (diff <= 0) { live(); return; }
      var s = Math.floor(diff / 1000);
      slot.d.textContent = Math.floor(s / 86400);
      slot.h.textContent = pad(Math.floor(s / 3600) % 24);
      slot.m.textContent = pad(Math.floor(s / 60) % 60);
      if (slot.s) slot.s.textContent = pad(s % 60);
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* --- Sichtbarkeit: Reveal + LED-Trenner zünden ------------------------ */
  var watched = document.querySelectorAll('.rv, .ledbar');
  if (watched.length) {
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
      watched.forEach(function (el) { io.observe(el); });
    } else {
      watched.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

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
