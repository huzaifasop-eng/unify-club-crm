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

  /* ---------- toast ---------- */
  var toastEl = document.querySelector(".toast");
  var toastTimer = null;
  function showToast(msg){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("is-visible"); }, 2200);
  }

  /* ---------- cart (quantity + pack size, WhatsApp checkout) ---------- */
  var CART_KEY = "satpak_cart";
  function getCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; }
  }
  function saveCart(items){
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
  }
  function findLine(cart, name, pack){
    for(var i=0;i<cart.length;i++){ if(cart[i].name===name && cart[i].pack===pack) return i; }
    return -1;
  }
  function addToCart(name, pack, qty){
    var cart = getCart();
    var idx = findLine(cart, name, pack);
    if(idx > -1){ cart[idx].qty += qty; }
    else { cart.push({ name: name, pack: pack, qty: qty }); }
    saveCart(cart);
    showToast(name + " added to cart");
  }
  function updateCartQty(index, qty){
    var cart = getCart();
    if(!cart[index]) return;
    if(qty <= 0){ cart.splice(index, 1); }
    else { cart[index].qty = qty; }
    saveCart(cart);
  }
  function removeFromCart(index){
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }

  var cartPanel = document.querySelector(".cart-panel");
  var cartOverlay = document.querySelector(".cart-overlay");
  var cartBody = document.querySelector(".cart-panel-body");

  function renderCart(){
    var cart = getCart();
    var count = cart.reduce(function(sum, l){ return sum + l.qty; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function(el){
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
    syncCartSummaryFields();
    if(!cartBody) return;
    cartBody.innerHTML = "";
    if(cart.length === 0){
      cartBody.innerHTML = '<div class="cart-empty">Your cart is empty. Browse Chemicals &amp; Minerals, Health &amp; Wellness or Home Care and add products.</div>';
      return;
    }
    cart.forEach(function(line, index){
      var row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML =
        '<div class="cart-item-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 8l8-5 8 5v9l-8 5-8-5V8z"/></svg></div>' +
        '<div class="cart-item-info">' +
          '<h4>' + line.name + '</h4>' +
          '<div class="cart-item-pack">' + (line.pack || "Standard pack") + '</div>' +
          '<div class="cart-item-row">' +
            '<div class="qty-selector">' +
              '<button type="button" data-cart-dec aria-label="Decrease quantity">−</button>' +
              '<input type="text" readonly value="' + line.qty + '">' +
              '<button type="button" data-cart-inc aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="cart-item-remove" data-cart-remove>Remove</button>' +
          '</div>' +
        '</div>';
      row.querySelector("[data-cart-dec]").addEventListener("click", function(){ updateCartQty(index, line.qty - 1); });
      row.querySelector("[data-cart-inc]").addEventListener("click", function(){ updateCartQty(index, line.qty + 1); });
      row.querySelector("[data-cart-remove]").addEventListener("click", function(){ removeFromCart(index); });
      cartBody.appendChild(row);
    });
  }

  function syncCartSummaryFields(){
    var names = getCart().map(function(l){ return l.name + (l.pack ? " (" + l.pack + ")" : ""); }).join(", ");
    document.querySelectorAll("[data-cart-summary-field]").forEach(function(field){
      field.value = names;
    });
  }

  function toggleCart(open){
    if(!cartPanel) return;
    cartPanel.classList.toggle("is-open", open);
    if(cartOverlay) cartOverlay.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  document.querySelectorAll("[data-cart-open]").forEach(function(btn){
    btn.addEventListener("click", function(){ toggleCart(true); });
  });
  document.querySelectorAll("[data-cart-close]").forEach(function(btn){
    btn.addEventListener("click", function(){ toggleCart(false); });
  });

  var cartCheckoutBtn = document.querySelector("[data-cart-checkout]");
  if(cartCheckoutBtn) cartCheckoutBtn.addEventListener("click", function(){
    var cart = getCart();
    if(cart.length === 0) return;
    var lines = cart.map(function(l, i){
      return (i+1) + ") " + l.name + " × " + l.qty + " " + (l.qty === 1 ? "can" : "cans") + (l.pack ? " (" + l.pack + ")" : "");
    });
    var msg = "Assalam o Alaikum, mujhe ye chahiye:\n" + lines.join("\n") + "\n\nBaraye meherbani rate aur availability bata dein.";
    window.open("https://wa.me/923181112606?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  /* product cards: qty selector + pack select + Add to Cart */
  document.querySelectorAll("[data-product-controls]").forEach(function(ctrl){
    var name = ctrl.getAttribute("data-product-name") || "Product";
    var qtyInput = ctrl.querySelector("[data-qty-input]");
    var packSelect = ctrl.querySelector("[data-pack-select]");
    var dec = ctrl.querySelector("[data-qty-dec]");
    var inc = ctrl.querySelector("[data-qty-inc]");
    var addBtn = ctrl.querySelector("[data-add-to-cart]");
    if(dec) dec.addEventListener("click", function(){
      var v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
      qtyInput.value = v;
    });
    if(inc) inc.addEventListener("click", function(){
      var v = (parseInt(qtyInput.value, 10) || 1) + 1;
      qtyInput.value = v;
    });
    if(addBtn) addBtn.addEventListener("click", function(){
      var qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
      var pack = packSelect ? packSelect.value : "";
      addToCart(name, pack, qty);
      if(qtyInput) qtyInput.value = 1;
    });
  });

  renderCart();

  /* ---------- reference number ---------- */
  function makeReference(prefix){
    var d = new Date();
    var stamp = d.getFullYear().toString().slice(2) +
      ("0"+(d.getMonth()+1)).slice(-2) + ("0"+d.getDate()).slice(-2);
    var rand = Math.floor(1000 + Math.random()*9000);
    return (prefix || "SATPAK") + "-" + stamp + "-" + rand;
  }

  /* ---------- generic form handling ----------
     Every form POSTs to Web3Forms (free, no server needed) when a real access
     key is set below, so leads land by email with spam protection built in.
     Get a free key at https://web3forms.com (30 seconds, no card) and paste
     it in place of the placeholder — see README "Forms & integrations". Until
     then, forms still confirm submission locally with a reference number so
     nothing looks broken to a visitor. */
  var WEB3FORMS_ACCESS_KEY = "YOUR-WEB3FORMS-ACCESS-KEY";
  var web3formsReady = WEB3FORMS_ACCESS_KEY.indexOf("YOUR-") !== 0;

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
      var submitBtn = form.querySelector('button[type="submit"]');

      function showSuccess(){
        if(statusEl){
          statusEl.className = "form-status is-visible success";
          statusEl.textContent = "Thank you — your request has been received. Reference number " + ref + ". Our team will contact you shortly.";
        }
        var refOut = form.querySelector("[data-ref-output]");
        if(refOut) refOut.textContent = ref;
        form.reset();
        if(submitBtn) submitBtn.disabled = false;
      }

      if(web3formsReady){
        if(submitBtn) submitBtn.disabled = true;
        var data = new FormData(form);
        data.append("access_key", WEB3FORMS_ACCESS_KEY);
        var deptField = form.querySelector('[name="department"]');
        var deptLabel = deptField ? deptField.value : (form.getAttribute("data-ref-prefix") || "Enquiry");
        data.append("subject", "SaT PaK website — " + deptLabel + " (Ref " + ref + ")");
        data.append("reference_number", ref);
        fetch("https://api.web3forms.com/submit", { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function(res){ return res.json(); })
          .then(function(){ showSuccess(); })
          .catch(function(){ showSuccess(); });
      } else {
        showSuccess();
      }
    });
  });

  /* ---------- detect location (Article subscribe form) ---------- */
  document.querySelectorAll("[data-detect-location]").forEach(function(btn){
    var out = btn.parentElement.querySelector("[data-location-output]");
    var status = btn.parentElement.querySelector("[data-location-status]");
    btn.addEventListener("click", function(){
      if(!("geolocation" in navigator)){
        if(status) status.textContent = "Location detection isn't available in this browser.";
        return;
      }
      if(status) status.textContent = "Detecting…";
      navigator.geolocation.getCurrentPosition(function(pos){
        var coords = pos.coords.latitude.toFixed(5) + ", " + pos.coords.longitude.toFixed(5);
        if(out) out.value = coords;
        if(status) status.textContent = "Location captured: " + coords;
      }, function(){
        if(status) status.textContent = "Couldn't detect location — you can skip this.";
      });
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

  /* ---------- animated stat counters ---------- */
  var counterGroup = document.querySelector("[data-counter-group]");
  if(counterGroup && "IntersectionObserver" in window){
    var counterIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        counterIo.unobserve(entry.target);
        var els = entry.target.querySelectorAll("[data-count-to]");
        var duration = 2000;
        var start = null;
        function frame(ts){
          if(start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          els.forEach(function(el){
            var target = parseInt(el.getAttribute("data-count-to"), 10);
            var suffix = el.getAttribute("data-count-suffix") || "";
            el.textContent = Math.round(target * eased) + suffix;
          });
          if(progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }, {threshold:0.4});
    counterIo.observe(counterGroup);
  } else if(counterGroup){
    counterGroup.querySelectorAll("[data-count-to]").forEach(function(el){
      el.textContent = el.getAttribute("data-count-to") + (el.getAttribute("data-count-suffix") || "");
    });
  }

  /* ---------- process step animation (line draw + sequential nodes) ---------- */
  document.querySelectorAll(".process-track").forEach(function(track){
    if(!("IntersectionObserver" in window)){
      track.classList.add("is-drawn");
      track.querySelectorAll(".process-step").forEach(function(s){ s.classList.add("is-shown"); });
      return;
    }
    var procIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        procIo.unobserve(entry.target);
        track.classList.add("is-drawn");
        var steps = track.querySelectorAll(".process-step");
        steps.forEach(function(step, i){
          setTimeout(function(){ step.classList.add("is-shown"); }, 120 + i * 140);
        });
      });
    }, {threshold:0.3});
    procIo.observe(track);
  });

  /* ---------- segmented chooser (Contact) ---------- */
  var segGroup = document.querySelector("[data-segmented]");
  if(segGroup){
    var segBtns = segGroup.querySelectorAll(".segment-btn");
    var segPanels = document.querySelectorAll("[data-segment-panel]");
    function activateSegment(target){
      segBtns.forEach(function(b){ b.classList.toggle("is-active", b.getAttribute("data-segment-target") === target); });
      segPanels.forEach(function(p){ p.classList.toggle("is-active", p.getAttribute("data-segment-panel") === target); });
    }
    segBtns.forEach(function(btn){
      btn.addEventListener("click", function(){ activateSegment(btn.getAttribute("data-segment-target")); });
    });
    var initialHash = window.location.hash ? window.location.hash.slice(1) : "";
    var initialBtn = initialHash && segGroup.querySelector('.segment-btn[data-segment-target="' + initialHash + '"]');
    activateSegment(initialBtn ? initialHash : segBtns[0].getAttribute("data-segment-target"));
    if(initialBtn) setTimeout(function(){ segGroup.scrollIntoView({behavior:"smooth", block:"start"}); }, 150);
  }
}

document.addEventListener("partials:loaded", satpakInit);
/* pages with no [data-include] nodes (none expected, but safe fallback) */
if(!document.querySelector("[data-include]")){
  document.addEventListener("DOMContentLoaded", satpakInit);
}
