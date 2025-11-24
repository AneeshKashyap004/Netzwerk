/* Premium motion system using GSAP with graceful fallbacks */
(function(){
  const hasGSAP = typeof window.gsap !== 'undefined';
  if(!hasGSAP){
    // CSS-only fallback: ensure base reveal classes work via existing IntersectionObserver
    // Also add a light float for icons if CSS keyframes exist
    return;
  }

  const gsap = window.gsap;
  try{ gsap.registerPlugin(window.ScrollTrigger); }catch(e){}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseEase = 'power2.out';

  // Page enter
  window.addEventListener('DOMContentLoaded', ()=>{
    if(prefersReduced) return;

    // Hero entrance (headline, sub, cta, media)
    const hero = document.querySelector('.hero, .services-hero');
    if(hero){
      const tl = gsap.timeline({ defaults: { ease: baseEase, duration: 0.8 } });
      const headline = hero.querySelector('h1, .headline');
      const lead = hero.querySelector('.lead, p');
      const ctas = hero.querySelectorAll('.btn');
      const media = hero.querySelector('img, .hero-media');

      tl.from(headline, { y: 24, opacity: 0 })
        .from(lead, { y: 18, opacity: 0 }, '-=0.5')
        .from(ctas, { y: 12, opacity: 0, stagger: 0.08 }, '-=0.5');
      if(media) tl.from(media, { y: 24, opacity: 0, scale: 0.98 }, '-=0.6');
    }

    // Animated section headings
    document.querySelectorAll('.animate-heading').forEach((el)=>{
      gsap.from(el, {
        opacity: 0,
        letterSpacing: '0.06em',
        y: 12,
        duration: 0.7,
        ease: baseEase,
        scrollTrigger: { trigger: el, start: 'top 80%' }
      });
      const underline = el.nextElementSibling?.classList.contains('heading-underline') ? el.nextElementSibling : null;
      if(underline){
        gsap.fromTo(underline, { scaleX: 0 }, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power1.out',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });
      }
    });

    // Generic reveal utilities
    const map = [
      ['.reveal-up', { y: 24 }],
      ['.reveal-left', { x: -24 }],
      ['.reveal-right', { x: 24 }]
    ];
    map.forEach(([sel, from])=>{
      document.querySelectorAll(sel).forEach((el, i)=>{
        gsap.from(el, {
          ...from,
          opacity: 0,
          duration: 0.6,
          ease: baseEase,
          delay: Math.min(i * 0.06, 0.35),
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });
    });

    // Icon subtle float
    document.querySelectorAll('.icon-float').forEach((el)=>{
      gsap.to(el, { y: -6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
  });
})();
