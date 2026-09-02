/* ==========================================================================
   Scheinwerfer-Traverse (three.js)

   Beim Laden hängen die Movingheads unter der Traverse und leuchten im 45°-
   Winkel auf den Boden. Scrollt man nach unten, fahren sie auf 90° hoch und
   zeigen nach vorne — der Lichtkegel verschwindet, übrig bleibt die LED.

   Läuft nur, wenn WebGL und three.js verfügbar sind. Ohne das Skript zeigt
   die Seite die CSS-Traverse (.truss) und sieht vollständig aus.
   ========================================================================== */
(function () {
  'use strict';

  if (!window.THREE) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('rig');
  if (!canvas) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  } catch (e) { return; }

  var small = window.innerWidth < 760;
  var COUNT = small ? 5 : 9;          // Anzahl Scheinwerfer
  var SPAN  = small ? 11 : 19;        // Breite der Traverse
  var TRUSS_Y = 6.0, TRUSS_Z = -6.0;  // Position der Traverse
  var HEAD_Y  = TRUSS_Y - 0.75;
  var BEAM_LEN = 15;
  var PITCH_START = -Math.PI / 4;     // 45° — auf den Boden
  var PITCH_END   = -Math.PI / 2;     // 90° — nach vorne

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1 : 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.2, 10);
  camera.lookAt(0, 1.2, 0);

  /* ----- Traverse ------------------------------------------------------- */
  var steel = new THREE.MeshBasicMaterial({ color: 0x24242a });
  var truss = new THREE.Group();
  truss.position.set(0, TRUSS_Y, TRUSS_Z);

  var chordGeo = new THREE.CylinderGeometry(0.055, 0.055, SPAN, 6);
  chordGeo.rotateZ(Math.PI / 2);
  [[0.3, 0.3], [0.3, -0.3], [-0.3, 0.3], [-0.3, -0.3]].forEach(function (o) {
    var m = new THREE.Mesh(chordGeo, steel);
    m.position.set(0, o[0], o[1]);
    truss.add(m);
  });

  // Diagonalstreben auf der Vorderseite — das typische Zickzack
  var braceGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.95, 5);
  var step = 0.72, up = true;
  for (var x = -SPAN / 2 + 0.4; x < SPAN / 2 - 0.4; x += step) {
    var b = new THREE.Mesh(braceGeo, steel);
    b.position.set(x + step / 2, 0, 0.3);
    b.rotation.z = up ? 0.72 : -0.72;
    truss.add(b);
    up = !up;
  }
  scene.add(truss);

  /* ----- Glühpunkt-Textur für die LED ----------------------------------- */
  function glowTexture() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.25, 'rgba(255,255,255,.55)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  var glowTex = glowTexture();

  /* ----- Lichtkegel: additiver Kegel mit weichen Rändern ---------------- */
  var beamVert = [
    'varying float vT;',
    'varying vec3 vN;',
    'varying vec3 vV;',
    'uniform float uLen;',
    'void main() {',
    '  vT = clamp(-position.y / uLen, 0.0, 1.0);',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vV = normalize(-mv.xyz);',
    '  vN = normalize(normalMatrix * normal);',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var beamFrag = [
    'varying float vT;',
    'varying vec3 vN;',
    'varying vec3 vV;',
    'uniform vec3 uColor;',
    'uniform float uOpacity;',
    'void main() {',
    '  float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.7);',
    '  float len  = pow(1.0 - vT, 1.6);',
    '  float a = edge * len * uOpacity;',
    '  if (a < 0.002) discard;',
    '  gl_FragColor = vec4(uColor, a);',
    '}'
  ].join('\n');

  var beamGeo = new THREE.CylinderGeometry(0.09, 1.45, BEAM_LEN, 22, 1, true);
  beamGeo.translate(0, -BEAM_LEN / 2, 0);   // Spitze in den Ursprung

  var MAGENTA = new THREE.Color(0xff2ecc);
  var BONE    = new THREE.Color(0xf2efe8);

  var heads = [];
  for (var i = 0; i < COUNT; i++) {
    var t = COUNT === 1 ? 0.5 : i / (COUNT - 1);
    var px = -SPAN / 2 + 0.9 + t * (SPAN - 1.8);

    var pivot = new THREE.Group();
    pivot.position.set(px, HEAD_Y, TRUSS_Z);

    // Gehäuse
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.5, 10), steel);
    body.position.y = -0.1;
    pivot.add(body);

    // Lichtkegel
    var color = (i % 4 === 2) ? BONE : MAGENTA;
    var beam = new THREE.Mesh(beamGeo, new THREE.ShaderMaterial({
      uniforms: {
        uColor:   { value: color },
        uOpacity: { value: 0.34 },
        uLen:     { value: BEAM_LEN }
      },
      vertexShader: beamVert,
      fragmentShader: beamFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    }));
    beam.position.y = -0.34;
    pivot.add(beam);

    // LED / Linse
    var lens = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: color, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    lens.position.y = -0.36;
    lens.scale.setScalar(0.9);
    pivot.add(lens);

    // Aufhängung an der Traverse
    var yoke = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.7, 0.07), steel);
    yoke.position.set(0, 0.35, 0);
    pivot.add(yoke);

    scene.add(pivot);
    heads.push({ pivot: pivot, beam: beam, lens: lens, phase: i * 0.9, color: color });
  }

  /* ----- Scroll-Steuerung ----------------------------------------------- */
  var progress = 0, target = 0, visible = true, raf = null;

  function readScroll() {
    var vh = window.innerHeight || 1;
    target = Math.min(Math.max(window.scrollY / (vh * 0.85), 0), 1);

    // Bühne ausblenden, sobald der Inhalt übernimmt
    var fade = 1 - Math.min(Math.max((window.scrollY - vh * 1.15) / (vh * 0.6), 0), 1);
    canvas.style.opacity = fade;
    visible = fade > 0.01;
  }

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  var clock = new THREE.Clock();

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;

    var time = clock.getElapsedTime();
    progress += (target - progress) * 0.08;         // weich nachziehen

    var pitch = PITCH_START + (PITCH_END - PITCH_START) * progress;

    for (var i = 0; i < heads.length; i++) {
      var h = heads[i];
      // leichtes Wandern, damit die Anlage lebt
      h.pivot.rotation.x = pitch + Math.sin(time * 0.5 + h.phase) * 0.045;
      h.pivot.rotation.z = Math.sin(time * 0.32 + h.phase * 1.7) * 0.13 * (1 - progress);

      // Kegel verschwindet, LED wird kräftiger
      h.beam.material.uniforms.uOpacity.value = 0.34 * Math.pow(1 - progress, 1.7);
      h.lens.scale.setScalar(0.9 + progress * 1.5);
      h.lens.material.opacity = 0.55 + progress * 0.45;
    }

    camera.position.x = Math.sin(time * 0.15) * 0.25;
    camera.lookAt(0, 1.2 + progress * 0.6, 0);

    renderer.render(scene, camera);
  }

  readScroll();
  resize();
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { clock.getDelta(); frame(); }
  });

  document.documentElement.classList.add('rig-on');
  frame();
})();
