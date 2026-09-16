(() => {
  'use strict';
  const C = window.DAISY_CONFIG || {};
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function track(event, params={}) {
    if (window.gtag && C.ga4MeasurementId) window.gtag('event', event, params);
    window.dispatchEvent(new CustomEvent('daisy:track', { detail: { event, params } }));
  }

  function waUrl(message) { return `https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(message)}`; }
  function openWhatsApp(message) { track('whatsapp_click', { service: 'enquiry' }); window.open(waUrl(message), '_blank', 'noopener,noreferrer'); }

  function hydrate() {
    const logoEls = $$('[data-config=\"logo\"]'); logoEls.forEach(img => img.addEventListener('error', () => { img.style.display='none'; const fb=img.nextElementSibling; if(fb) fb.style.display='inline'; }, {once:true}));
    $$('[data-config]').forEach(el => {
      const key = el.dataset.config;
      if (key === 'phone') { el.textContent = C.phone; if (el.tagName === 'A') el.href = C.phoneHref; }
      else if (key === 'email') { el.textContent = C.email; if (el.tagName === 'A') el.href = `mailto:${C.email}`; }
      else if (key === 'address') el.textContent = C.address;
      else if (key === 'company') el.textContent = C.companyName;
      else if (key === 'maps') { el.href = C.mapsUrl; }
      else if (key === 'website') el.textContent = C.website.replace(/^https?:\/\//,'');
      else if (key === 'logo') { el.src = (window.DAISY_PATH_PREFIX || '') + C.logoPath; el.alt = C.companyName; }
      else if (key === 'instagram' || key === 'facebook') el.href = C[key];
    });
    $$('[data-wa]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openWhatsApp(a.dataset.wa || `Hello Daisy Cafe & Eatery, I'd like to know more.`); }));
  }

  function initNav() {
    const toggle = $('.nav-toggle'), menu = $('#site-menu');
    if (!toggle || !menu) return;
    const dropdowns = $$('.menu-dropdown', menu);
    const setMenu = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      menu.style.display = open ? 'block' : 'none';
      menu.style.visibility = open ? 'visible' : 'hidden';
      menu.style.opacity = open ? '1' : '0';
      menu.style.pointerEvents = open ? 'auto' : 'none';
      document.body.classList.toggle('menu-open', open);
      if (!open) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('open');
          const btn = $('.menu-drop-btn', dropdown);
          if (btn) btn.setAttribute('aria-expanded','false');
        });
      }
    };
    menu.setAttribute('aria-hidden','true');
    toggle.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('.site-nav a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    $$('[data-open-celebration]', menu).forEach(b => b.addEventListener('click', () => setMenu(false)));
    dropdowns.forEach(dropdown => {
      const btn = $('.menu-drop-btn', dropdown);
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const open = btn.getAttribute('aria-expanded') === 'true';
        dropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('open');
            const otherBtn = $('.menu-drop-btn', other);
            if (otherBtn) otherBtn.setAttribute('aria-expanded','false');
          }
        });
        btn.setAttribute('aria-expanded', String(!open));
        dropdown.classList.toggle('open', !open);
      });
    });
    document.addEventListener('click', e => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth >= 980) setMenu(false); }, {passive:true});
  }

  function initHeroCarousel() {
    const root = $('[data-hero-carousel]'); if (!root) return;
    const slides = $$('[data-hero-slide]', root);
    const dots = $$('[data-hero-dot]', root);
    if (slides.length < 2) return;
    let index = 0, timer = null;
    const setState = next => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const offset = (i - index + slides.length) % slides.length;
        slide.classList.remove('is-active','is-prev','is-next','is-far-prev','is-far-next');
        if (offset === 0) slide.classList.add('is-active');
        else if (offset === 1) slide.classList.add('is-next');
        else if (offset === slides.length - 1) slide.classList.add('is-prev');
        else if (offset === 2) slide.classList.add('is-far-next');
        else slide.classList.add('is-far-prev');
      });
      dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === index)));
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => setState(index + 1), 4500);
    };
    $('[data-hero-prev]', root)?.addEventListener('click', () => { setState(index - 1); start(); });
    $('[data-hero-next]', root)?.addEventListener('click', () => { setState(index + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { setState(i); start(); }));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) start(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    setState(0); start();
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach(x=>x.classList.add('revealed')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); io.unobserve(e.target); } }), {threshold:.12}); items.forEach(x=>io.observe(x));
  }

  function initModal() {
    const modal = $('#reservation-modal'); if (!modal) return;
    const openers = $$('[data-open-reservation]'); const close = () => { modal.hidden = true; document.body.classList.remove('modal-open'); };
    openers.forEach(b => b.addEventListener('click', () => { modal.hidden=false; document.body.classList.add('modal-open'); setTimeout(()=>$('#reservation-name')?.focus(),50); track('cta_click',{service:'reservation'}); }));
    $$('[data-close-modal]', modal).forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', e => { if(e.target === modal) close(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape' && !modal.hidden) close(); });
    const form = $('#reservation-form');
    form?.addEventListener('submit', e => {
      e.preventDefault(); if(!form.reportValidity()) return;
      const d = Object.fromEntries(new FormData(form));
      const msg = `Hello Daisy Cafe & Eatery,\n\nI'd like to reserve a table.\n\nName: ${d.name}\nPhone: ${d.phone}\nGuests: ${d.guests}\nDate: ${d.date}\nTime: ${d.time}\nNotes: ${d.notes || '—'}\n\nPlease confirm availability. Thank you!`;
      track('form_submit',{service:'reservation'}); openWhatsApp(msg); close();
    });
  }

  function initCelebrationModal() {
    let modal = $('#celebration-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'celebration-modal';
      modal.className = 'modal';
      modal.hidden = true;
      modal.setAttribute('aria-label','Plan a celebration');
      modal.innerHTML = `
        <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="celebration-title">
          <button class="modal-close" type="button" data-close-celebration aria-label="Close celebration form">×</button>
          <span class="eyebrow">Celebration planning</span>
          <h2 id="celebration-title">Tell us what you’re celebrating.</h2>
          <p class="muted">Share the basics and we’ll open WhatsApp with your request so Daisy can discuss the details with you.</p>
          <form id="celebration-form" class="form-grid two">
            <div class="field"><label for="celebration-name">Name</label><input id="celebration-name" name="name" required autocomplete="name"></div>
            <div class="field"><label for="celebration-phone">Phone</label><input id="celebration-phone" name="phone" required inputmode="tel" autocomplete="tel"></div>
            <div class="field"><label for="celebration-occasion">Occasion</label><select id="celebration-occasion" name="occasion" required><option value="">Select occasion</option><option>Birthday</option><option>Anniversary</option><option>Surprise</option><option>Family celebration</option><option>Other special moment</option></select></div>
            <div class="field"><label for="celebration-guests">Guests</label><input id="celebration-guests" name="guests" type="number" min="1" max="100" required></div>
            <div class="field"><label for="celebration-date">Preferred date</label><input id="celebration-date" name="date" type="date" required></div>
            <div class="field"><label for="celebration-time">Preferred time</label><input id="celebration-time" name="time" type="time"></div>
            <div class="field"><label for="celebration-cake">Cake requirement</label><select id="celebration-cake" name="cake"><option>No cake</option><option>Custom cake</option><option>Need help choosing a cake</option></select></div>
            <div class="field"><label for="celebration-theme">Theme / decoration</label><input id="celebration-theme" name="theme" placeholder="Colour, theme or decoration idea"></div>
            <div class="field" style="grid-column:1/-1"><label for="celebration-notes">Notes</label><textarea id="celebration-notes" name="notes" placeholder="Tell us anything else we should know"></textarea></div>
            <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Continue to WhatsApp</button></div>
          </form>
        </div>`;
      document.body.appendChild(modal);
    }
    const openers = $$('[data-open-celebration]');
    const close = () => { modal.hidden = true; document.body.classList.remove('modal-open'); };
    openers.forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      modal.hidden = false;
      document.body.classList.add('modal-open');
      setTimeout(() => $('#celebration-name')?.focus(), 50);
      track('cta_click',{service:'celebration'});
    }));
    $$('[data-close-celebration]', modal).forEach(b => b.addEventListener('click', close));
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
    $('#celebration-form', modal)?.addEventListener('submit', e => {
      e.preventDefault(); const form=e.currentTarget; if(!form.reportValidity()) return;
      const d=Object.fromEntries(new FormData(form));
      const msg=`Hello Daisy Cafe & Eatery,\n\nI'd like to plan a celebration.\n\nName: ${d.name}\nPhone: ${d.phone}\nOccasion: ${d.occasion}\nGuests: ${d.guests}\nPreferred date: ${d.date}\nPreferred time: ${d.time || 'Flexible'}\nCake: ${d.cake || '—'}\nTheme / decoration: ${d.theme || '—'}\nNotes: ${d.notes || '—'}\n\nPlease let me know the available options and next steps. Thank you!`;
      track('form_submit',{service:'celebration'}); openWhatsApp(msg); close(); form.reset();
    });
  }

  function initAccordions() {
    $$('.faq-item button').forEach(btn => btn.addEventListener('click', () => { const item=btn.closest('.faq-item'); const open=item.classList.toggle('open'); btn.setAttribute('aria-expanded',String(open)); }));
  }

  function initGallery() {
    const lightbox=$('#lightbox'); if(!lightbox) return;
    const img=$('#lightbox-image'), cap=$('#lightbox-caption');
    $$('.gallery-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); img.src=a.href; img.alt=a.dataset.alt||''; cap.textContent=a.dataset.alt||''; lightbox.hidden=false; }));
    $$('[data-close-lightbox]',lightbox).forEach(b=>b.addEventListener('click',()=>lightbox.hidden=true));
  }

  function initForms() {
    $$('form[data-endpoint-form]').forEach(form => form.addEventListener('submit', async e => {
      e.preventDefault();
      const status=$('.form-status',form); if(!form.reportValidity()) return;
      const data=Object.fromEntries(new FormData(form));
      const attribution = getAttribution(); Object.assign(data, attribution, {landing_page: location.href, referrer: document.referrer});
      track('form_submit',{service: form.dataset.service || 'contact'});
      if (C.formEndpoint) {
        try { const res=await fetch(C.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!res.ok) throw new Error('Request failed'); status.textContent='Thanks — your enquiry has been sent.'; form.reset(); return; } catch(err) { status.textContent='We could not send the form automatically. Please call or WhatsApp Daisy directly.'; }
      } else {
        status.textContent='Your details are ready. Please use WhatsApp or call Daisy to complete the enquiry.';
        const msg=`Hello Daisy Cafe & Eatery,\n\nEnquiry: ${form.dataset.service || 'General'}\nName: ${data.name || '—'}\nPhone: ${data.phone || '—'}\nEmail: ${data.email || '—'}\nMessage: ${data.message || data.notes || '—'}`;
        openWhatsApp(msg);
      }
    }));
  }

  function getAttribution() {
    const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term']; const p=new URLSearchParams(location.search); const out={};
    keys.forEach(k=>{const v=p.get(k); if(v){sessionStorage.setItem('daisy_'+k,v);} out[k]=sessionStorage.getItem('daisy_'+k)||'';}); return out;
  }

  function initDelivery() {
    const root=$('#delivery-app'); if(!root) return;
    const status=$('#delivery-status'), distanceEl=$('#delivery-distance'), cartEl=$('#cart-items'), totalEl=$('#cart-total'), cartCount=$('#cart-count'), addBtns=$$('.add-to-cart');
    const hourPill=$('#delivery-open-pill'), hourCopy=$('#delivery-window-copy'), checkBtn=$('#check-location'), checkoutBtn=$('#delivery-checkout'), cartAside=$('.order-cart'), cartReady=$('#cart-ready');
    const search=$('#order-search'), emptyState=$('#order-empty'), countEl=$('#delivery-menu-count');
    const categoryBtns=$$('[data-category-filter]'), dietBtns=$$('[data-diet-filter]'), cards=$$('.order-item-card');
    let cart=[]; let eligible=false; let deliveryOpen=false; let selectedCategory='all'; let selectedDiet='all';

    const hav=(a,b,c,d)=>{const R=6371,rad=x=>x*Math.PI/180; const dLat=rad(c-a),dLon=rad(d-b); const x=Math.sin(dLat/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dLon/2)**2; return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));};
    const indiaMinutes=()=>{const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()); const h=+(parts.find(x=>x.type==='hour')?.value||0),m=+(parts.find(x=>x.type==='minute')?.value||0); return h*60+m;};
    const setStatusMessage=(title,copy)=>{if(!status)return; const main=$('.delivery-status-main',status); if(main) main.innerHTML=`<strong>${title}</strong><span>${copy}</span>`;};

    function updateDeliveryHours(){
      const mins=indiaMinutes();
      deliveryOpen=mins>=600 && mins<1320;
      root.classList.toggle('delivery-hours-open',deliveryOpen);
      root.classList.toggle('delivery-hours-closed',!deliveryOpen);
      status?.classList.toggle('is-open',deliveryOpen);
      status?.classList.toggle('is-closed',!deliveryOpen);
      hourPill?.classList.toggle('is-open',deliveryOpen); hourPill?.classList.toggle('is-closed',!deliveryOpen);
      cartReady?.classList.toggle('is-closed',!deliveryOpen);
      if(hourPill) hourPill.textContent=deliveryOpen?'Open for delivery':'Closed for delivery';
      if(hourCopy) hourCopy.textContent=deliveryOpen?'You can place delivery orders now. Delivery closes at 10:00 PM IST.':'Delivery orders are accepted from 10:00 AM to 10:00 PM IST.';
      if(!deliveryOpen){
        eligible=false;
        if(distanceEl) distanceEl.textContent='Delivery hours closed';
        setStatusMessage('Delivery is currently closed.','Online delivery orders open at 10:00 AM IST and close at 10:00 PM IST.');
        if(checkBtn){checkBtn.disabled=true;checkBtn.textContent='Delivery closed';}
      }else{
        if(checkBtn){checkBtn.disabled=false;checkBtn.textContent='Check my location';}
        if(!eligible) setStatusMessage('Check delivery availability','Delivery is available within Daisy\'s 8 km delivery radius during delivery hours.');
      }
      addBtns.forEach(b=>b.disabled=!(deliveryOpen&&eligible));
      if(checkoutBtn) checkoutBtn.disabled=!(deliveryOpen&&eligible&&cart.length);
      if(cartReady) cartReady.textContent=deliveryOpen?'Delivery':'Closed';
    }

    function renderCart(){
      cartEl.innerHTML=''; let total=0;
      if(!cart.length) cartEl.innerHTML='<p class="muted">Your cart is empty.</p>';
      cart.forEach((it,i)=>{total+=it.price*it.qty; const row=document.createElement('div'); row.className='cart-row'; row.innerHTML=`<div><strong>${esc(it.name)}</strong><small>${esc(it.category||'Menu item')} · ₹${it.price} × ${it.qty}</small></div><div class="cart-controls"><button type="button" data-dec="${i}" aria-label="Remove one ${esc(it.name)}">−</button><span>${it.qty}</span><button type="button" data-inc="${i}" aria-label="Add one ${esc(it.name)}">+</button></div>`; cartEl.appendChild(row);});
      totalEl.textContent=`₹${total}`; cartCount.textContent=cart.reduce((s,x)=>s+x.qty,0); cartAside?.classList.toggle('has-items',cart.length>0);
      $$('.cart-controls button').forEach(b=>b.addEventListener('click',()=>{const i=b.dataset.inc!==undefined?+b.dataset.inc:+b.dataset.dec; const delta=b.dataset.inc!==undefined?1:-1; cart[i].qty+=delta; if(cart[i].qty<=0)cart.splice(i,1); renderCart(); updateDeliveryHours();}));
      if(checkoutBtn) checkoutBtn.disabled=!(deliveryOpen&&eligible&&cart.length);
    }

    function applyFilters(){
      const q=(search?.value||'').trim().toLowerCase(); let visible=0;
      cards.forEach(card=>{const matchesCategory=selectedCategory==='all'||card.dataset.category===selectedCategory; const matchesDiet=selectedDiet==='all'||card.dataset.diet===selectedDiet; const matchesSearch=!q||card.dataset.name.includes(q); const show=matchesCategory&&matchesDiet&&matchesSearch; card.hidden=!show; if(show)visible++;});
      if(emptyState) emptyState.hidden=visible!==0; if(countEl) countEl.textContent=`${visible} item${visible===1?'':'s'}`;
    }

    categoryBtns.forEach(btn=>btn.addEventListener('click',()=>{selectedCategory=btn.dataset.categoryFilter||'all'; categoryBtns.forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});applyFilters();}));
    dietBtns.forEach(btn=>btn.addEventListener('click',()=>{selectedDiet=btn.dataset.dietFilter||'all'; dietBtns.forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});applyFilters();}));
    search?.addEventListener('input',applyFilters);
    $('#clear-order-filters')?.addEventListener('click',()=>{selectedCategory='all';selectedDiet='all';if(search)search.value='';categoryBtns.forEach(b=>{const on=b.dataset.categoryFilter==='all';b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});dietBtns.forEach(b=>{const on=b.dataset.dietFilter==='all';b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});applyFilters();});

    addBtns.forEach(btn=>btn.addEventListener('click',()=>{if(!deliveryOpen||!eligible)return;const name=btn.dataset.name,price=+btn.dataset.price,category=btn.dataset.category||'Menu item';const found=cart.find(x=>x.name===name&&x.category===category);found?found.qty++:cart.push({name,price,category,qty:1});renderCart();track('cta_click',{service:'food_delivery',item:name,category});}));

    checkBtn?.addEventListener('click',()=>{
      if(!deliveryOpen){updateDeliveryHours();return;}
      if(!navigator.geolocation){setStatusMessage('Location access is not supported.','Please use a browser that supports location access to check delivery eligibility.');return;}
      checkBtn.disabled=true; checkBtn.textContent='Checking…'; setStatusMessage('Checking your location…','Please allow location access to calculate the approximate distance from Daisy.');
      navigator.geolocation.getCurrentPosition(pos=>{const km=hav(C.latitude,C.longitude,pos.coords.latitude,pos.coords.longitude);distanceEl.textContent=`Approx. ${km.toFixed(1)} km from Daisy`;eligible=km<=C.deliveryRadiusKm;root.classList.toggle('delivery-eligible',eligible);setStatusMessage(eligible?'Delivery available.':`Sorry, delivery is not available here.`,`Your location is approximately ${km.toFixed(1)} km away. Daisy currently delivers within ${C.deliveryRadiusKm} km.`);addBtns.forEach(b=>b.disabled=!(deliveryOpen&&eligible));if(checkoutBtn)checkoutBtn.disabled=!(deliveryOpen&&eligible&&cart.length);checkBtn.disabled=false;checkBtn.textContent='Check again';},()=>{eligible=false;addBtns.forEach(b=>b.disabled=true);if(checkoutBtn)checkoutBtn.disabled=true;setStatusMessage('Location access was not granted.','Please allow location access to check delivery eligibility.');checkBtn.disabled=false;checkBtn.textContent='Try again';},{enableHighAccuracy:false,timeout:8000,maximumAge:300000});
    });

    checkoutBtn?.addEventListener('click',()=>{updateDeliveryHours();if(!deliveryOpen||!cart.length||!eligible)return;$('#checkout-modal').hidden=false;document.body.classList.add('modal-open');});
    $('#checkout-form')?.addEventListener('submit',e=>{e.preventDefault();updateDeliveryHours();if(!deliveryOpen||!eligible||!cart.length){$('#checkout-modal').hidden=true;document.body.classList.remove('modal-open');return;}const form=e.currentTarget;if(!form.reportValidity())return;const d=Object.fromEntries(new FormData(form));const items=cart.map(x=>`${x.name} × ${x.qty} — ₹${x.price*x.qty}`).join('\n');const total=cart.reduce((s,x)=>s+x.price*x.qty,0);const msg=`Hello Daisy Cafe & Eatery,\n\nI'd like to place a food delivery order.\n\nItems:\n${items}\n\nTotal: ₹${total}\n\nCustomer name: ${d.name}\nPhone: ${d.phone}\nAlternate phone: ${d.alt_phone||'—'}\nAddress: ${d.address}\nNearest landmark: ${d.landmark}\n\nDelivery hours acknowledgement: 10:00 AM to 10:00 PM IST.\nPayment notice acknowledged: prepaid orders only.\n\nPlease confirm the order and payment process.`;track('form_submit',{service:'food_delivery'});openWhatsApp(msg);$('#checkout-modal').hidden=true;document.body.classList.remove('modal-open');});

    applyFilters(); renderCart(); updateDeliveryHours(); setInterval(updateDeliveryHours,30000);
  }

  function initMap() {
    $$('[data-load-map]').forEach(btn => btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.loadMap); if (!target || target.dataset.loaded) return;
      const iframe = document.createElement('iframe'); iframe.src=C.mapsEmbedSrc; iframe.width='100%'; iframe.height='360'; iframe.loading='lazy'; iframe.title='Daisy Cafe & Eatery location map'; iframe.style.border='0'; iframe.allowFullscreen=true; iframe.referrerPolicy='strict-origin-when-cross-origin'; target.appendChild(iframe); target.dataset.loaded='true'; btn.disabled=true; btn.textContent='Map loaded'; track('map_click',{service:'contact'});
    }));
  }

  function initSticky() {
    $$('[data-sticky]').forEach(el=>el.addEventListener('click',()=>track('cta_click',{service:el.dataset.service||'sticky'})));
  }

  function init() { hydrate(); const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); initNav(); initHeroCarousel(); initReveal(); initModal(); initCelebrationModal(); initAccordions(); initGallery(); initMap(); initForms(); initDelivery(); initSticky(); track('page_view',{page_path:location.pathname}); }
  document.addEventListener('DOMContentLoaded', init);
})();
