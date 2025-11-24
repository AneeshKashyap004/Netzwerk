// Small JS for mobile nav toggle and smooth scroll
document.addEventListener('DOMContentLoaded', function(){
  // Ensure reveal content never stays hidden
  try{
    requestAnimationFrame(()=> setTimeout(()=>{
      document.querySelectorAll('.reveal').forEach(el=> el.classList.add('visible'));
    }, 120));
  }catch(e){}
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  toggle.setAttribute('aria-expanded','false');
  toggle.addEventListener('click', ()=>{
    const isOpen = nav.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(isOpen));
    // move focus to first link when opening
    if(isOpen){
      const first = nav.querySelector('a');
      if(first) first.focus();
    }
  });

  // Theme toggle with persistence
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  const getStoredTheme = () => localStorage.getItem('theme');
  const applyTheme = (mode) => {
    if(mode === 'dark'){
      html.setAttribute('data-theme','dark');
      if(themeBtn){ themeBtn.setAttribute('aria-pressed','true'); themeBtn.textContent = '☀️'; }
    } else {
      html.removeAttribute('data-theme');
      if(themeBtn){ themeBtn.setAttribute('aria-pressed','false'); themeBtn.textContent = '🌙'; }
    }
  };
  const initTheme = () => {
    const stored = getStoredTheme();
    if(stored){ applyTheme(stored); return; }
    applyTheme(prefersDark && prefersDark.matches ? 'dark' : 'light');
  };
  initTheme();
  if(themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const isDark = html.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try{ localStorage.setItem('theme', next); }catch(e){}
    });
  }
  if(prefersDark && prefersDark.addEventListener){
    prefersDark.addEventListener('change', (e)=>{
      const stored = getStoredTheme();
      if(!stored){ applyTheme(e.matches ? 'dark' : 'light'); }
    });
  }

  // Mark current link active by comparing href to location
  document.querySelectorAll('#main-nav a').forEach(a=>{
    try{
      const href = new URL(a.href);
      if(href.pathname === window.location.pathname || (href.pathname === '/' && window.location.pathname.endsWith('index.html'))){
        a.classList.add('active');
      }
    }catch(e){/* ignore invalid urls */}
  });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        window.scrollTo({top: target.offsetTop - 60, behavior: 'smooth'});
        nav.classList.remove('show');
      }
    });
  });

  // FAQ accordion on services page
  document.querySelectorAll('.faq-question').forEach(q=>{
    q.addEventListener('click', ()=>{
      const ans = q.nextElementSibling;
      if(!ans) return;
      ans.classList.toggle('open');
      q.setAttribute('aria-expanded', String(ans.classList.contains('open')));
    });
  });

  // small hover effect for service cards (add/remove elevated class)
  document.querySelectorAll('.service-card').forEach(card=>{
    card.addEventListener('mouseenter', ()=>{
      card.style.transform = 'translateY(-6px)';
      card.style.boxShadow = '0 22px 48px rgba(11,19,32,0.08)';
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // Hero parallax (subtle) for hero-floating
  const heroFloat = document.querySelector('.hero-floating');
  if(heroFloat){
    window.addEventListener('scroll', ()=>{
      const rect = heroFloat.getBoundingClientRect();
      const offset = Math.max(-40, Math.min(40, (window.scrollY - rect.top) * 0.02));
      heroFloat.style.transform = `translateY(${offset}px) rotate(-4deg)`;
    }, {passive:true});
  }

  // Simple testimonials carousel
  const carousel = document.getElementById('testimonial-carousel');
  if(carousel){
    const slides = carousel.querySelectorAll('.testimonial-slide');
    let idx = 0;
    const slidesArr = Array.from(slides);
    const announceEl = document.getElementById('carousel-announce');
    const show = (i, announce=false)=>{
      slidesArr.forEach((s,j)=> s.style.transform = `translateX(${100*(j-i)}%)`);
      // update dots active state
      const dots = document.querySelectorAll('.carousel-dots .dot');
      dots.forEach((d,di)=> d.classList.toggle('active', di===i));
      // announce for screen readers when requested
      if(announce && announceEl){
        const q = slidesArr[i].querySelector('.testimonial-quote');
        announceEl.textContent = q ? q.innerText.trim() : `Showing testimonial ${i+1}`;
      }
    };
    show(idx);
    const next = ()=>{ idx = (idx+1) % slidesArr.length; show(idx); };
    const prev = ()=>{ idx = (idx-1 + slidesArr.length) % slidesArr.length; show(idx); };
    // build dots
    const dotsContainer = document.getElementById('carousel-dots');
    if(dotsContainer){
      slidesArr.forEach((_,i)=>{
        const b = document.createElement('button');
        b.className = 'dot';
        b.setAttribute('aria-label', `Show testimonial ${i+1}`);
        b.addEventListener('click', ()=>{ idx = i; show(idx, true); resetAutoplay(); if(carousel) carousel.focus(); });
        dotsContainer.appendChild(b);
      });
    }
    let autoplay = setInterval(next, 7000);
    const resetAutoplay = ()=>{ clearInterval(autoplay); autoplay = setInterval(next, 7000); };
    const nBtn = document.getElementById('carousel-next');
    const pBtn = document.getElementById('carousel-prev');
  if(nBtn) nBtn.addEventListener('click', ()=>{ next(); resetAutoplay(); if(carousel) carousel.focus(); });
  if(pBtn) pBtn.addEventListener('click', ()=>{ prev(); resetAutoplay(); if(carousel) carousel.focus(); });
    // pause on hover
    const carouselWrap = carousel.closest('.testimonial-strip');
    if(carouselWrap){
      carouselWrap.addEventListener('mouseenter', ()=> clearInterval(autoplay));
      carouselWrap.addEventListener('mouseleave', ()=> resetAutoplay());
    }
  }

  // Close nav when clicking outside (mobile)
  document.addEventListener('click', (e)=>{
    const navEl = document.getElementById('main-nav');
    const toggleEl = document.getElementById('nav-toggle');
    if(!navEl || !toggleEl) return;
    if(navEl.classList.contains('show') && !navEl.contains(e.target) && !toggleEl.contains(e.target)){
      navEl.classList.remove('show');
      toggleEl.setAttribute('aria-expanded','false');
    }
  });

  // IntersectionObserver reveal animations
  try{
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    // Apply staggered delays for groups of items
    const groups = [
      '.feature-cards .reveal',
      '.service-grid .reveal',
      '.choose-grid .reveal',
      '.testimonial-cards .reveal',
      '.team-grid .reveal'
    ];
    groups.forEach(sel=>{
      const items = document.querySelectorAll(sel);
      items.forEach((el, i)=>{
        el.style.transitionDelay = `${Math.min(i * 80, 400)}ms`;
      });
    });
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    // Safety fallback: force-show any reveals that didn't trigger (e.g., older browsers/CDN issues)
    setTimeout(()=>{
      document.querySelectorAll('.reveal').forEach(el=>{
        if(!el.classList.contains('visible')){
          el.classList.add('visible');
        }
      });
    }, 1200);
  }catch(err){/* no-op */}

  // Active state for hash links on scroll
  const sections = ['#services','#solutions','#about','#testimonials','#contact']
    .map(id=>document.querySelector(id))
    .filter(Boolean);
  const setActive = ()=>{
    let current = null;
    const y = window.scrollY + 80;
    sections.forEach(sec=>{ if(sec.offsetTop <= y) current = sec; });
    document.querySelectorAll('#main-nav a[href^="#"]').forEach(link=>{
      const href = link.getAttribute('href');
      link.classList.toggle('active', current && href === `#${current.id}`);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Contact form validation
  const form = document.getElementById('contact-form');
  if(form){
    const note = document.getElementById('form-note');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[+]?\d[\d\s-]{7,}$/;
    form.addEventListener('submit', (e)=>{
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const phone = form.querySelector('#phone');
      const msg = form.querySelector('#message');
      let ok = true;
      const errs = [];
      if(!name.value.trim()){ ok = false; errs.push('Name is required'); }
      if(!emailRe.test(email.value.trim())){ ok = false; errs.push('Valid email is required'); }
      if(phone && !phoneRe.test(phone.value.trim())){ ok = false; errs.push('Valid phone is required'); }
      if(!msg.value.trim()){ ok = false; errs.push('Message is required'); }
      if(!ok){
        e.preventDefault();
        if(note){ note.textContent = errs.join(' • '); note.style.color = '#c00'; }
      } else if(note){
        note.textContent = 'Opening your mail client…';
        note.style.color = 'inherit';
      }
    });
  }

  // Page transitions (fade)
  try{
    const body = document.body;
    body.classList.add('fade-in');
    const sameOrigin = (u)=>{
      try{ const x = new URL(u, window.location.href); return x.origin === window.location.origin; }catch(e){ return false; }
    };
    document.querySelectorAll('a[href]').forEach(link=>{
      const href = link.getAttribute('href');
      if(!href || href.startsWith('#') || link.target === '_blank' || !sameOrigin(href)) return;
      link.addEventListener('click', (e)=>{
        // allow modifier keys
        if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        body.classList.add('fade-out');
        setTimeout(()=>{ window.location.href = href; }, 200);
      });
    });
  }catch(e){/* ignore */}
});