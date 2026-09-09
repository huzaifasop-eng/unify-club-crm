/* SaT PaK — shared site behaviour. Runs once header/footer partials are injected. */
function satpakInit(){
  "use strict";

  /* ---------- header condense on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 40){ header.classList.add("is-solid"); }
    else { header.classList.remove("is-solid"); }
  }
  document.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector(".header-burger");
  var mobileMenu = document.querySelector(".mobile-menu");
  var mobileClose = document.querySelector(".mobile-menu-close");
  function toggleMenu(open){
    if(!mobileMenu) return;
    mobileMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if(burger) burger.addEventListener("click", function(){ toggleMenu(true); });
  if(mobileClose) mobileClose.addEventListener("click", function(){ toggleMenu(false); });
  document.querySelectorAll(".mobile-menu .navlink").forEach(function(a){
    a.addEventListener("click", function(){ toggleMenu(false); });
  });

  /* ---------- search panel ---------- */
  var searchBtns = document.querySelectorAll(".header-search-btn");
  var searchPanel = document.querySelector(".search-panel");
  var searchClose = document.querySelector(".search-panel-close");
  searchBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      if(searchPanel){
        searchPanel.classList.add("is-open");
        var input = searchPanel.querySelector("input");
        if(input) setTimeout(function(){ input.focus(); }, 150);
      }
    });
  });
  if(searchClose) searchClose.addEventListener("click", function(){ searchPanel.classList.remove("is-open"); });
  if(searchPanel) searchPanel.addEventListener("click", function(e){
    if(e.target === searchPanel) searchPanel.classList.remove("is-open");
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      if(searchPanel) searchPanel.classList.remove("is-open");
      toggleMenu(false);
    }
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -60px 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------- tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function(group){
    var btns = group.querySelectorAll(".tab-btn");
    var panels = group.querySelectorAll(".tab-panel");
    btns.forEach(function(btn){
      btn.addEventListener("click", function(){
        var target = btn.getAttribute("data-tab-target");
        btns.forEach(function(b){ b.classList.remove("is-active"); });
        panels.forEach(function(p){ p.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var panel = group.querySelector('[data-tab-panel="' + target + '"]');
        if(panel) panel.classList.add("is-active");
      });
    });
  });

  /* activate a tab if the URL hash targets one (e.g. /contact.html#technical) */
  if(window.location.hash){
    var hashTarget = window.location.hash.slice(1);
    var hashBtn = document.querySelector('.tab-btn[data-tab-target="' + hashTarget + '"]');
    if(hashBtn){ hashBtn.click(); setTimeout(function(){ hashBtn.scrollIntoView({behavior:"smooth", block:"start"}); }, 150); }
  }

  /* ---------- accordion ---------- */
  document.querySelectorAll(".accordion-item").forEach(function(item){
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if(!trigger || !panel) return;
    trigger.addEventListener("click", function(){
      var isOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".accordion-item").forEach(function(other){
        other.classList.remove("is-open");
        other.querySelector(".accordion-panel").style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- product / catalogue filters ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function(group){
    var chips = group.querySelectorAll(".filter-chip");
    var targetSelector = group.getAttribute("data-filter-group");
    var items = document.querySelectorAll(targetSelector);
    chips.forEach(function(chip){
      chip.addEventListener("click", function(){
        chips.forEach(function(c){ c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var val = chip.getAttribute("data-filter");
        items.forEach(function(item){
          var cats = (item.getAttribute("data-cats") || "").split(",");
          var show = val === "all" || cats.indexOf(val) !== -1;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* ---------- inquiry basket (multi-product, no account) ---------- */
  var BASKET_KEY = "satpak_inquiry_basket";
  function getBasket(){
    try{ return JSON.parse(localStorage.getItem(BASKET_KEY)) || []; }catch(e){ return []; }
  }
  function saveBasket(items){
    localStorage.setItem(BASKET_KEY, JSON.stringify(items));
    updateBasketCount();
  }
  function updateBasketCount(){
    var count = getBasket().length;
    document.querySelectorAll("[data-basket-count]").forEach(function(el){
      el.textContent = count;
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
    renderBasketList();
  }
  function renderBasketList(){
    var basket = getBasket();
    document.querySelectorAll("[data-basket-list]").forEach(function(list){
      list.innerHTML = "";
      if(basket.length === 0){
        list.innerHTML = '<li style="color:rgba(30,30,30,0.5);">No products added yet — browse Chemicals &amp; Minerals and use "Add to Inquiry".</li>';
        return;
      }
      basket.forEach(function(name){
        var li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "8px 0";
        li.style.borderBottom = "1px solid var(--line)";
        li.innerHTML = '<span>' + name + '</span>';
        var rm = document.createElement("button");
        rm.type = "button";
        rm.className = "btn-text btn-sm";
        rm.textContent = "Remove";
        rm.addEventListener("click", function(){
          saveBasket(getBasket().filter(function(n){ return n !== name; }));
        });
        li.appendChild(rm);
        list.appendChild(li);
      });
    });
    document.querySelectorAll("[data-basket-summary-field]").forEach(function(field){
      field.value = basket.join(", ");
    });
  }
  document.querySelectorAll("[data-basket-clear]").forEach(function(btn){
    btn.addEventListener("click", function(){ saveBasket([]); });
  });
  document.querySelectorAll("[data-add-to-inquiry]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var name = btn.getAttribute("data-product-name") || "Product";
      var basket = getBasket();
      if(basket.indexOf(name) === -1) basket.push(name);
      saveBasket(basket);
      var original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(function(){ btn.textContent = original; }, 1600);
    });
  });
  updateBasketCount();

  /* ---------- reference number ---------- */
  function makeReference(prefix){
    var d = new Date();
    var stamp = d.getFullYear().toString().slice(2) +
      ("0"+(d.getMonth()+1)).slice(-2) + ("0"+d.getDate()).slice(-2);
    var rand = Math.floor(1000 + Math.random()*9000);
    return (prefix || "SATPAK") + "-" + stamp + "-" + rand;
  }

  /* ---------- generic form handling (client-side placeholder) ----------
     Forms are wired to visually confirm submission with a reference number.
     Connect `action` + a real backend (e.g. Formspree, Netlify Forms, or the
     CRM webhook) before go-live — see README "Forms & integrations". */
  document.querySelectorAll("form[data-satpak-form]").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var statusEl = form.querySelector(".form-status");
      var requiredOk = true;
      form.querySelectorAll("[required]").forEach(function(field){
        if(!field.value){ requiredOk = false; field.style.borderColor = "#c94b4b"; }
        else { field.style.borderColor = ""; }
      });
      if(!requiredOk){
        if(statusEl){
          statusEl.className = "form-status is-visible error";
          statusEl.textContent = "Please fill in the required fields highlighted above.";
        }
        return;
      }
      var ref = makeReference(form.getAttribute("data-ref-prefix"));
      if(statusEl){
        statusEl.className = "form-status is-visible success";
        statusEl.textContent = "Thank you — your request has been received. Reference number " + ref + ". Our team will contact you shortly.";
      }
      var refOut = form.querySelector("[data-ref-output]");
      if(refOut) refOut.textContent = ref;
      form.reset();
    });
  });

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ---------- cookie consent ---------- */
  var COOKIE_KEY = "satpak_cookie_consent";
  var consentBar = document.querySelector(".cookie-consent");
  if(consentBar){
    if(!localStorage.getItem(COOKIE_KEY)){
      consentBar.classList.add("is-visible");
    }
    var acceptBtn = consentBar.querySelector("[data-cookie-accept]");
    if(acceptBtn) acceptBtn.addEventListener("click", function(){
      localStorage.setItem(COOKIE_KEY, "accepted");
      consentBar.classList.remove("is-visible");
    });
  }
}

document.addEventListener("partials:loaded", satpakInit);
/* pages with no [data-include] nodes (none expected, but safe fallback) */
if(!document.querySelector("[data-include]")){
  document.addEventListener("DOMContentLoaded", satpakInit);
}
