import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 48;
const MOBILE_PARTICLE_COUNT = 24;
const INTERACTION_RADIUS = 140;

function createParticles(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: 1 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.5,
  }));
}

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const container = canvas.parentElement;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const mobileQuery = window.matchMedia('(max-width: 640px)');

    const pointer = {
      x: -10000,
      y: -10000,
      active: false,
    };

    let particles = [];
    let frameId = null;
    let width = 0;
    let height = 0;
    let elapsed = 0;
    let lastTime = 0;

    function resize() {
      const bounds = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = bounds.width;
      height = bounds.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = createParticles(mobileQuery.matches ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT);

      draw();
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      const darkTheme = document.documentElement.dataset.theme === 'dark';

      const color = darkTheme ? 'rgba(159, 188, 255, 0.55)' : 'rgba(82, 111, 232, 0.35)';

      particles.forEach((particle) => {
        let x = particle.x * width + Math.sin(elapsed * particle.speed + particle.phase) * 9;

        let y = particle.y * height + Math.cos(elapsed * particle.speed + particle.phase) * 9;

        if (pointer.active && !motionQuery.matches) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < INTERACTION_RADIUS) {
            const strength = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;

            x += (dx / distance) * strength * 20;
            y += (dy / distance) * strength * 20;
          }
        }

        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      });
    }

    function animate(time) {
      if (lastTime !== 0) {
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        elapsed += delta;
      }

      lastTime = time;
      draw();

      frameId = window.requestAnimationFrame(animate);
    }

    function stop() {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      lastTime = 0;
    }

    function start() {
      stop();

      if (!motionQuery.matches && !document.hidden) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        elapsed = 0;
        draw();
      }
    }

    function handlePointerMove(event) {
      const bounds = container.getBoundingClientRect();

      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    function handleVisibilityChange() {
      start();
    }

    function handlePreferenceChange() {
      resize();
      start();
    }

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    motionQuery.addEventListener('change', handlePreferenceChange);
    mobileQuery.addEventListener('change', handlePreferenceChange);

    const themeObserver = new MutationObserver(draw);

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      themeObserver.disconnect();

      container.removeEventListener('pointermove', handlePointerMove);

      container.removeEventListener('pointerleave', handlePointerLeave);

      document.removeEventListener('visibilitychange', handleVisibilityChange);

      motionQuery.removeEventListener('change', handlePreferenceChange);

      mobileQuery.removeEventListener('change', handlePreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="career-hero-particles" aria-hidden="true" />;
}
