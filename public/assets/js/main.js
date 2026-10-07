/**
 * VALKYRIE MOTORCYCLES - MAIN JAVASCRIPT
 * Interactions, Dynamic Theming, 360 Drag, Angle Selector, & Web Audio Engine Rev
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. COLOR PALETTE SWITCHER (THEMES)
     ========================================================================== */
  const swatches = document.querySelectorAll('.swatch-btn');
  const selectedColorName = document.getElementById('selectedColorName');
  const customizerBikeImg = document.getElementById('customizerBikeImg');
  const showcaseImg = document.getElementById('mainShowcaseImg');

  const colorMeta = {
    sapphire: {
      name: 'Sapphire Apex (Biru Elektrik)',
      filter: 'none',
      showcaseFilter: 'none'
    },
    emerald: {
      name: 'Emerald Phantom (Zamrud & Emas)',
      filter: 'hue-rotate(85deg) saturate(1.25) brightness(0.96)',
      showcaseFilter: 'hue-rotate(85deg) saturate(1.25) brightness(0.96)'
    },
    crimson: {
      name: 'Rosso Corsa (Merah Kirmizi Balap)',
      filter: 'hue-rotate(170deg) saturate(1.35) brightness(1.02)',
      showcaseFilter: 'hue-rotate(170deg) saturate(1.35) brightness(1.02)'
    },
    stealth: {
      name: 'Stealth Obsidian (Titanium Hitam)',
      filter: 'saturate(0.08) brightness(0.86) contrast(1.15)',
      showcaseFilter: 'saturate(0.08) brightness(0.86) contrast(1.15)'
    }
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const colorKey = swatch.dataset.color;
      document.body.setAttribute('data-theme', colorKey);

      if (colorMeta[colorKey]) {
        selectedColorName.textContent = colorMeta[colorKey].name;
        
        // Smooth color transition on bikes
        if (customizerBikeImg) {
          customizerBikeImg.style.transition = 'filter 0.5s ease';
          customizerBikeImg.style.filter = colorMeta[colorKey].filter;
        }
        if (showcaseImg) {
          showcaseImg.style.transition = 'filter 0.5s ease';
          showcaseImg.style.filter = colorMeta[colorKey].showcaseFilter;
        }
      }
    });
  });


  /* ==========================================================================
     2. SHOWCASE ANGLE SELECTOR (SECTION 2 CAROUSEL)
     ========================================================================== */
  const angleButtons = document.querySelectorAll('.angle-thumb-btn');
  const anglePrev = document.getElementById('anglePrev');
  const angleNext = document.getElementById('angleNext');

  const angleImages = {
    front: 'assets/images/bike_showcase.png',
    side: 'assets/images/bike_side.png',
    cockpit: 'assets/images/hero_bike.png',
    engine: 'assets/images/bike_showcase.png',
    rear: 'assets/images/bike_side.png'
  };

  let currentAngleIndex = 0;

  function setAngle(index) {
    if (index < 0) index = angleButtons.length - 1;
    if (index >= angleButtons.length) index = 0;
    currentAngleIndex = index;

    angleButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentAngleIndex);
    });

    const activeBtn = angleButtons[currentAngleIndex];
    const viewType = activeBtn.dataset.view;

    if (showcaseImg && angleImages[viewType]) {
      showcaseImg.style.opacity = '0.3';
      showcaseImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        showcaseImg.src = angleImages[viewType];
        showcaseImg.style.opacity = '1';
        showcaseImg.style.transform = 'scale(1)';
      }, 200);
    }
  }

  angleButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => setAngle(idx));
  });

  if (anglePrev) {
    anglePrev.addEventListener('click', () => setAngle(currentAngleIndex - 1));
  }
  if (angleNext) {
    angleNext.addEventListener('click', () => setAngle(currentAngleIndex + 1));
  }


  /* ==========================================================================
     3. 360 INTERACTIVE ROTATE / DRAG (SECTION 3)
     ========================================================================== */
  const btn360Toggle = document.getElementById('btn360Toggle');
  const viewport = document.getElementById('bikeStageViewport');
  let is360Spinning = false;
  let spinInterval = null;
  let currentRotationAngle = 0;

  if (btn360Toggle && customizerBikeImg) {
    btn360Toggle.addEventListener('click', () => {
      is360Spinning = !is360Spinning;
      btn360Toggle.classList.toggle('active', is360Spinning);

      if (is360Spinning) {
        btn360Toggle.querySelector('.label-360').textContent = 'STOP';
        btn360Toggle.style.backgroundColor = '#0f172a';
        btn360Toggle.style.color = '#ffffff';
        
        let direction = 1;
        spinInterval = setInterval(() => {
          currentRotationAngle += direction * 0.8;
          if (currentRotationAngle > 8 || currentRotationAngle < -8) {
            direction *= -1;
          }
          customizerBikeImg.style.transform = `perspective(800px) rotateY(${currentRotationAngle}deg)`;
        }, 30);
      } else {
        clearInterval(spinInterval);
        btn360Toggle.querySelector('.label-360').textContent = '360°';
        btn360Toggle.style.backgroundColor = '';
        btn360Toggle.style.color = '';
        customizerBikeImg.style.transform = 'perspective(800px) rotateY(0deg)';
      }
    });

    // Drag to interact
    let isDragging = false;
    let startX = 0;

    viewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      if (spinInterval) clearInterval(spinInterval);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => {
          customizerBikeImg.style.transform = 'perspective(800px) rotateY(0deg)';
        }, 1200);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      const rot = Math.max(-20, Math.min(20, delta * 0.15));
      customizerBikeImg.style.transform = `perspective(800px) rotateY(${rot}deg)`;
    });
  }


  /* ==========================================================================
     4. LINEUP MODELS SELECTOR (RIGHT SIDEBAR)
     ========================================================================== */
  const lineupCards = document.querySelectorAll('.lineup-card');
  const paginationDots = document.querySelectorAll('.lineup-pagination-dots .dot');

  lineupCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      lineupCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      paginationDots.forEach((dot, dotIdx) => {
        dot.classList.toggle('active', dotIdx === index);
      });

      const model = card.dataset.model;
      if (model === 'naked') {
        customizerBikeImg.src = 'assets/images/bike_showcase.png';
      } else if (model === 'supersport') {
        customizerBikeImg.src = 'assets/images/bike_side.png';
      } else if (model === 'motard') {
        customizerBikeImg.src = 'assets/images/hero_bike.png';
      }
    });
  });

  paginationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (lineupCards[index]) {
        lineupCards[index].click();
      }
    });
  });


  /* ==========================================================================
     5. ENGINE SOUND SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  const btnSoundRev = document.getElementById('btnSoundRev');
  let audioCtx = null;
  let isRevving = false;

  if (btnSoundRev) {
    btnSoundRev.addEventListener('click', () => {
      if (isRevving) return;
      isRevving = true;
      btnSoundRev.classList.add('playing');
      const originalText = btnSoundRev.querySelector('span').textContent;
      btnSoundRev.querySelector('span').textContent = 'MERAUNG... 🏍️💨';

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Master Gain
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.3);
        masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.8);
        masterGain.connect(audioCtx.destination);

        // Low rumble oscillator (sub-bass cylinder pulse)
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(70, audioCtx.currentTime); // idle
        osc1.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 1.2); // high rev
        osc1.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 1.8); // throttle drop
        osc1.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 2.3); // secondary blip
        osc1.frequency.exponentialRampToValueAtTime(75, audioCtx.currentTime + 2.8);

        // High frequency exhaust buzz
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 1.2);
        osc2.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 1.8);
        osc2.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 2.3);
        osc2.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 2.8);

        // Distortion / overdrive curve for rich aggressive engine roar
        const waveShaper = audioCtx.createWaveShaper();
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        const k = 50;
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        waveShaper.curve = curve;

        // Lowpass filter to shape exhaust tone
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2400, audioCtx.currentTime + 1.2);
        filter.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 2.8);

        osc1.connect(waveShaper);
        osc2.connect(waveShaper);
        waveShaper.connect(filter);
        filter.connect(masterGain);

        osc1.start(audioCtx.currentTime);
        osc2.start(audioCtx.currentTime);

        osc1.stop(audioCtx.currentTime + 2.9);
        osc2.stop(audioCtx.currentTime + 2.9);

        setTimeout(() => {
          btnSoundRev.classList.remove('playing');
          btnSoundRev.querySelector('span').textContent = originalText;
          isRevving = false;
        }, 2900);

      } catch (err) {
        console.warn('Web Audio not available or permission denied', err);
        btnSoundRev.classList.remove('playing');
        btnSoundRev.querySelector('span').textContent = originalText;
        isRevving = false;
      }
    });
  }


  /* ==========================================================================
     6. MODAL & INTERACTIVE TEST RIDE FORM
     ========================================================================== */
  const exploreModal = document.getElementById('exploreModal');
  const btnExplore = document.getElementById('btnExplore');
  const btnCloseModal = document.getElementById('btnModalClose');
  const btnOpenContact = document.getElementById('btnOpenContact');
  const btnOpenContact2 = document.getElementById('btnOpenContact2');
  const btnOpenAbout = document.getElementById('btnOpenAbout');
  const testRideForm = document.getElementById('testRideForm');
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  function openModal() {
    exploreModal.classList.add('open');
    exploreModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    exploreModal.classList.remove('open');
    exploreModal.setAttribute('aria-hidden', 'true');
  }

  function showToast(message) {
    if (toastMsg) toastMsg.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4000);
  }

  const btnHeaderTestRide = document.getElementById('btnHeaderTestRide');
  const btnHeroAudio = document.getElementById('btnHeroAudio');

  if (btnExplore) btnExplore.addEventListener('click', openModal);
  if (btnOpenContact) btnOpenContact.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (btnOpenContact2) btnOpenContact2.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (btnOpenAbout) btnOpenAbout.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (btnHeaderTestRide) btnHeaderTestRide.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  if (btnHeroAudio && btnSoundRev) {
    btnHeroAudio.addEventListener('click', () => {
      btnSoundRev.click();
    });
  }

  if (exploreModal) {
    exploreModal.addEventListener('click', (e) => {
      if (e.target === exploreModal) closeModal();
    });
  }

  if (testRideForm) {
    testRideForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('userName').value;
      closeModal();
      showToast(`Terima kasih, ${userName}! Permintaan Test Ride Anda berhasil dikirim.`);
      testRideForm.reset();
    });
  }

});
