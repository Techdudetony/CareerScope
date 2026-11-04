import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 68;
const MOBILE_PARTICLE_COUNT = 32;
const INTERACTION_RADIUS = 160;
const MAX_TRAIL_POINTS = 80;

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

    const trail = [];

    let isVisible = true;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        start();
      },
      { threshold: 0 }
    );

    visibilityObserver.observe(container);

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

    function drawComet(darkTheme) {
      if (motionQuery.matches || trail.length === 0) {
        return;
      }

      const rgb = darkTheme ? '145, 175, 255' : '76, 108, 235';

      trail.forEach((point, index) => {
        const progress = (index + 1) / trail.length;
        const intensity = point.life * progress;

        const radius = 12 + progress * 18;

        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);

        glow.addColorStop(0, `rgba(${rgb}, ${intensity * 0.16})`);

        glow.addColorStop(0.35, `rgba(${rgb}, ${intensity * 0.08})`);

        glow.addColorStop(1, `rgba(${rgb}, 0)`);

        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = glow;
        context.fill();
      });

      // Soft cursor glow without a sharp central point.
      if (pointer.active) {
        const radius = 28;

        const glow = context.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          radius
        );

        glow.addColorStop(0, `rgba(${rgb}, 0.2)`);
        glow.addColorStop(0.4, `rgba(${rgb}, 0.1)`);
        glow.addColorStop(1, `rgba(${rgb}, 0)`);

        context.beginPath();
        context.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
        context.fillStyle = glow;
        context.fill();
      }
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      const darkTheme = document.documentElement.dataset.theme === 'dark';

      const color = darkTheme ? 'rgba(159, 188, 255, 0.68)' : 'rgba(74, 102, 210, 0.58)';

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

      drawComet(darkTheme);
    }

    function animate(time) {
      if (lastTime !== 0) {
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        elapsed += delta;
      }

      const delta = lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, 0.05);

      elapsed += delta;

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        trail[i].life -= delta * 1.6;

        if (trail[i].life <= 0) {
          trail.splice(i, 1);
        }
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

      if (!motionQuery.matches && !document.hidden && isVisible) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        elapsed = 0;
        draw();
      }
    }

    function handlePointerMove(event) {
      if (event.pointerType !== 'mouse' || motionQuery.matches) {
        return;
      }

      const bounds = container.getBoundingClientRect();

      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;

      const previous = trail[trail.length - 1];

      if (previous) {
        const dx = pointer.x - previous.x;
        const dy = pointer.y - previous.y;
        const distance = Math.hypot(dx, dy);

        const steps = Math.min(12, Math.ceil(distance / 8));

        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;

          trail.push({
            x: previous.x + dx * t,
            y: previous.y + dy * t,
            life: 1,
          });
        }
      } else {
        trail.push({
          x: pointer.x,
          y: pointer.y,
          life: 1,
        });
      }

      if (trail.length > MAX_TRAIL_POINTS) {
        trail.splice(0, trail.length - MAX_TRAIL_POINTS);
      }
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    function handleVisibilityChange() {
      start();
    }

    function handlePreferenceChange() {
      pointer.active = false;
      trail.length = 0;
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
      visibilityObserver.disconnect();

      container.removeEventListener('pointermove', handlePointerMove);

      container.removeEventListener('pointerleave', handlePointerLeave);

      document.removeEventListener('visibilitychange', handleVisibilityChange);

      motionQuery.removeEventListener('change', handlePreferenceChange);

      mobileQuery.removeEventListener('change', handlePreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="career-hero-particles" aria-hidden="true" />;
}
