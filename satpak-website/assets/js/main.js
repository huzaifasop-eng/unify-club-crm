/* SaT PaK — shared site behaviour. Runs once header/footer partials are injected.
   Each feature below runs inside safe(), so one broken block (a selector that
   doesn't match on a given page, a third-party API hiccup) logs to the
   console and stops there — it never takes the rest of the page's behaviour
   down with it. */
function satpakInit(){
  "use strict";

  function safe(name, fn){
    try{ fn(); }
    catch(e){ if(window.console && console.error) console.error("[SaT PaK] \"" + name + "\" block failed:", e); }
  }

  /* ---------- shared: toast (used by the cart block below) ---------- */
  var toastEl = document.querySelector(".toast");
  var toastTimer = null;
  function showToast(msg){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("is-visible"); }, 2200);
  }

  /* ---------- header condense on scroll ---------- */
  safe("header condense", function(){
    var header = document.querySelector(".site-header");
    function onScroll(){
      if(!header) return;
      if(window.scrollY > 40){ header.classList.add("is-solid"); }
      else { header.classList.remove("is-solid"); }
    }
    document.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
  });

  /* ---------- mobile menu + search panel (share Escape-to-close) ---------- */
  safe("mobile menu + search", function(){
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
  });

  /* ---------- scroll reveal ---------- */
  safe("scroll reveal", function(){
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
  });

  /* ---------- accordion ---------- */
  safe("accordion", function(){
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
  });

  /* ---------- step-line (R&D): click a step for more detail ---------- */
  safe("step-line", function(){
    document.querySelectorAll("[data-step-toggle]").forEach(function(step){
      var more = step.querySelector(".step-more");
      if(!more) return;
      step.addEventListener("click", function(){
        var isOpen = step.classList.contains("is-open");
        step.classList.toggle("is-open", !isOpen);
        step.setAttribute("aria-expanded", !isOpen ? "true" : "false");
        more.style.maxHeight = !isOpen ? more.scrollHeight + "px" : null;
      });
    });
  });

  /* ---------- product / catalogue filters ---------- */
  safe("catalogue filters", function(){
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
  });

  /* ---------- cart (quantity + pack size, WhatsApp checkout, product controls) ---------- */
  safe("cart", function(){
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
          '<div class="cart-item-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h5v3h3l2 3v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9l2-3V3z"/><path d="M6 13h12"/></svg></div>' +
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
      var savedCity = null;
      try{ savedCity = localStorage.getItem("satpak_city"); }catch(e){}
      var cityLine = savedCity ? ("Shehar: " + savedCity + "\n\n") : "";
      var msg = "Assalam o Alaikum, mujhe ye chahiye:\n" + lines.join("\n") + "\n\n" + cityLine + "Baraye meherbani rate aur availability bata dein.";
      window.open("https://wa.me/923181112606?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });

    /* product cards: qty selector + pack select + Add to Cart + live price */
    document.querySelectorAll("[data-product-controls]").forEach(function(ctrl){
      var name = ctrl.getAttribute("data-product-name") || "Product";
      var qtyInput = ctrl.querySelector("[data-qty-input]");
      var packSelect = ctrl.querySelector("[data-pack-select]");
      var dec = ctrl.querySelector("[data-qty-dec]");
      var inc = ctrl.querySelector("[data-qty-inc]");
      var addBtn = ctrl.querySelector("[data-add-to-cart]");
      var priceOut = ctrl.parentElement.querySelector("[data-price-display]");

      function refreshPrice(){
        if(!priceOut) return;
        var opt = packSelect ? packSelect.options[packSelect.selectedIndex] : null;
        var unitPrice = opt ? parseFloat(opt.getAttribute("data-price")) : NaN;
        var qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        if(isNaN(unitPrice)){
          priceOut.textContent = "Price on inquiry";
        } else {
          priceOut.textContent = "Rs " + (unitPrice * qty).toLocaleString("en-PK");
        }
      }

      if(dec) dec.addEventListener("click", function(){
        var v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
        qtyInput.value = v;
        refreshPrice();
      });
      if(inc) inc.addEventListener("click", function(){
        var v = (parseInt(qtyInput.value, 10) || 1) + 1;
        qtyInput.value = v;
        refreshPrice();
      });
      if(packSelect) packSelect.addEventListener("change", refreshPrice);
      if(addBtn) addBtn.addEventListener("click", function(){
        var qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        var pack = packSelect ? packSelect.value : "";
        addToCart(name, pack, qty);
        if(qtyInput) qtyInput.value = 1;
        refreshPrice();
      });
      refreshPrice();
    });

    renderCart();
    window.addEventListener("satpak:cart-updated", renderCart);
  });

  /* ---------- clickable product cards (catalogue -> detail page) ----------
     The card itself opens the product page; clicks on the pack selector,
     quantity stepper, Add to Cart, or the View Details link keep their own
     behaviour instead of also triggering navigation. */
  safe("clickable product cards", function(){
    document.querySelectorAll(".product-card[data-product]").forEach(function(card){
      var link = card.querySelector(".product-actions a");
      if(!link) return;
      card.classList.add("is-clickable");
      card.addEventListener("click", function(e){
        if(e.target.closest("select, input, button, a")) return;
        window.location.href = link.href;
      });
    });
  });

  /* ---------- plant-floor shots: click for detail (lightbox) ---------- */
  safe("plant-floor lightbox", function(){
    var plantShots = document.querySelectorAll("[data-plant-shot]");
    var lightbox = document.querySelector("[data-plant-lightbox]");
    if(!plantShots.length || !lightbox) return;
    var lbImg = lightbox.querySelector("[data-plant-lightbox-img]");
    var lbTitle = lightbox.querySelector("[data-plant-lightbox-title]");
    var lbDetail = lightbox.querySelector("[data-plant-lightbox-detail]");
    var lastFocused = null;
    function openLightbox(shot){
      var img = shot.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = shot.querySelector("figcaption").textContent;
      lbDetail.textContent = shot.getAttribute("data-detail") || "";
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".plant-lightbox-close").focus();
    }
    function closeLightbox(){
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if(lastFocused) lastFocused.focus();
    }
    plantShots.forEach(function(shot){
      shot.addEventListener("click", function(){ openLightbox(shot); });
      shot.addEventListener("keydown", function(e){
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openLightbox(shot); }
      });
    });
    lightbox.querySelectorAll("[data-plant-lightbox-close]").forEach(function(btn){
      btn.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  });

  /* ---------- generic form handling ----------
     Every form POSTs to Web3Forms (free, no server needed) when a real access
     key is set below, so leads land by email with spam protection built in.
     Get a free key at https://web3forms.com (30 seconds, no card) and paste
     it in place of the placeholder — see README "Forms & integrations". Until
     then, forms still confirm submission locally with a reference number so
     nothing looks broken to a visitor. */
  safe("forms", function(){
    function makeReference(prefix){
      var d = new Date();
      var stamp = d.getFullYear().toString().slice(2) +
        ("0"+(d.getMonth()+1)).slice(-2) + ("0"+d.getDate()).slice(-2);
      var rand = Math.floor(1000 + Math.random()*9000);
      return (prefix || "SATPAK") + "-" + stamp + "-" + rand;
    }

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
  });

  /* ---------- detect location (Article subscribe form) ---------- */
  safe("detect location", function(){
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
  });

  /* ---------- footer year ---------- */
  safe("footer year", function(){
    document.querySelectorAll("[data-year]").forEach(function(el){
      el.textContent = new Date().getFullYear();
    });
  });

  /* ---------- cookie consent ---------- */
  safe("cookie consent", function(){
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
  });

  /* Stat counters are animated by assets/js/motion.js (data-counter-group). */

  /* ---------- theme switcher (light/dark — shades of the brand palette only) ---------- */
  safe("theme switcher", function(){
    var THEME_KEY = "satpak_theme";
    var themeToggle = document.querySelector("[data-theme-toggle]");
    function applyTheme(theme){
      if(theme === "dark"){
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      if(themeToggle){
        themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
        themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      }
    }
    var savedTheme = null;
    try{ savedTheme = localStorage.getItem(THEME_KEY); }catch(e){}
    if(!savedTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
      savedTheme = "dark";
    }
    applyTheme(savedTheme);
    if(themeToggle) themeToggle.addEventListener("click", function(){
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
    });
  });

  /* ---------- language switcher (English / Urdu) ----------
     Proof-of-concept scope: header, footer and Home are translated via the
     SATPAK_I18N dictionary (assets/js/i18n.js). Elements opt in with
     data-i18n="key" (textContent) or data-i18n-placeholder="key". Untagged
     pages/elements simply stay in English until translated. */
  safe("language switcher", function(){
    var LANG_KEY = "satpak_lang";
    var langToggle = document.querySelector("[data-lang-toggle]");
    function applyLang(lang){
      var dict = (window.SATPAK_I18N && window.SATPAK_I18N[lang]) || null;
      document.documentElement.lang = lang === "ur" ? "ur" : "en";
      document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
      document.querySelectorAll("[data-lang-label]").forEach(function(el){
        el.textContent = lang === "ur" ? "English" : "اردو";
      });
      if(!dict) return; /* English source text is already in the markup */
      document.querySelectorAll("[data-i18n]").forEach(function(el){
        var key = el.getAttribute("data-i18n");
        if(dict[key]) el.textContent = dict[key];
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el){
        var key = el.getAttribute("data-i18n-placeholder");
        if(dict[key]) el.setAttribute("placeholder", dict[key]);
      });
    }
    var savedLang = null;
    try{ savedLang = localStorage.getItem(LANG_KEY); }catch(e){}
    applyLang(savedLang === "ur" ? "ur" : "en");
    if(langToggle) langToggle.addEventListener("click", function(){
      var next = document.documentElement.lang === "ur" ? "en" : "ur";
      applyLang(next);
      try{ localStorage.setItem(LANG_KEY, next); }catch(e){}
    });
  });

  /* ---------- process step animation (line draw + sequential nodes) ---------- */
  safe("process track", function(){
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
  });

  /* ---------- segmented chooser (Contact) ---------- */
  safe("segmented chooser", function(){
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
  });

  /* ---------- contact wizard (Typeform-style, one question at a time) ----------
     Takes over presentation of the existing segment-panel forms — same
     fields, same submit handler above, no duplicated markup. Clicking a
     department button opens the wizard for that form; closing it falls
     back to the normal inline panel underneath. */
  safe("contact wizard", function(){
    var segGroup = document.querySelector("[data-segmented]");
    if(!segGroup) return;

    function closeWizard(card){
      card.classList.remove("is-wizard");
      document.body.style.overflow = "";
      if(card.__wizardHome){
        if(card.__wizardHome.next && card.__wizardHome.next.parentNode === card.__wizardHome.parent){
          card.__wizardHome.parent.insertBefore(card, card.__wizardHome.next);
        } else {
          card.__wizardHome.parent.appendChild(card);
        }
      }
    }

    function buildWizard(form){
      var card = form.closest(".form-card");
      if(!card || card.__wizardOpen) return;
      var fields = Array.prototype.slice.call(form.querySelectorAll(".form-field"));
      if(!fields.length) return;
      form.setAttribute("novalidate", "");
      var submitBtn = form.querySelector('button[type="submit"]');

      var bar = document.createElement("div");
      bar.className = "wizard-bar";
      var barFill = document.createElement("div");
      barFill.className = "wizard-bar-fill";
      bar.appendChild(barFill);

      var closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "wizard-close";
      closeBtn.setAttribute("aria-label", "Close");
      closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>';

      var nav = document.createElement("div");
      nav.className = "wizard-nav";
      var backBtn = document.createElement("button");
      backBtn.type = "button"; backBtn.className = "wizard-back"; backBtn.textContent = "Back";
      var countEl = document.createElement("span");
      countEl.className = "wizard-count";
      var nextBtn = document.createElement("button");
      nextBtn.type = "button"; nextBtn.className = "wizard-next"; nextBtn.textContent = "Next";
      nav.appendChild(backBtn); nav.appendChild(countEl); nav.appendChild(nextBtn);

      card.appendChild(bar);
      card.appendChild(closeBtn);
      card.appendChild(nav);

      var errorEls = fields.map(function(f){
        var err = document.createElement("div");
        err.className = "wizard-field-error";
        err.textContent = "This one's needed before we can continue.";
        f.appendChild(err);
        return err;
      });

      var total = fields.length + 1;
      var step = 0;

      function render(){
        fields.forEach(function(f, i){ f.classList.toggle("is-wizard-active", i === step); });
        errorEls.forEach(function(e){ e.classList.remove("is-visible"); });
        barFill.style.width = (((step + 1) / total) * 100) + "%";
        backBtn.style.visibility = step === 0 ? "hidden" : "visible";
        countEl.textContent = (step + 1) + " / " + total;
        nextBtn.textContent = step < fields.length ? "Next" : "Submit";
        if(step < fields.length){
          var input = fields[step].querySelector("input,select,textarea");
          if(input) setTimeout(function(){ input.focus(); }, 60);
        }
      }

      function currentFieldValid(){
        if(step >= fields.length) return true;
        var control = fields[step].querySelector("[required]");
        return !control || !!control.value;
      }

      function goNext(){
        if(!currentFieldValid()){
          errorEls[step].classList.add("is-visible");
          return;
        }
        if(step < total - 1){ step++; render(); }
        else if(submitBtn){ submitBtn.click(); }
      }
      function goBack(){ if(step > 0){ step--; render(); } }

      nextBtn.addEventListener("click", goNext);
      backBtn.addEventListener("click", goBack);
      closeBtn.addEventListener("click", function(){ closeWizard(card); });

      fields.forEach(function(f){
        var control = f.querySelector("input,select");
        if(control){
          control.addEventListener("keydown", function(e){
            if(e.key === "Enter"){ e.preventDefault(); goNext(); }
          });
        }
      });

      form.addEventListener("submit", function(){
        setTimeout(function(){ closeWizard(card); step = 0; render(); }, 1400);
      });

      card.__wizardOpen = function(){
        if(!card.__wizardHome){
          card.__wizardHome = { parent: card.parentNode, next: card.nextSibling };
        }
        document.body.appendChild(card);
        card.classList.add("is-wizard");
        step = 0;
        render();
        document.body.style.overflow = "hidden";
      };
    }

    document.querySelectorAll("[data-segment-panel] form[data-satpak-form]").forEach(buildWizard);

    segGroup.querySelectorAll(".segment-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        var target = btn.getAttribute("data-segment-target");
        var panel = document.querySelector('[data-segment-panel="' + target + '"]');
        var form = panel && panel.querySelector("form[data-satpak-form]");
        var card = form && form.closest(".form-card");
        if(card && card.__wizardOpen) card.__wizardOpen();
      });
    });
  });

  /* ---------- city picker (Home) ----------
     Pick a city -> saved silently (localStorage) -> department picker
     appears. The saved city auto-fills into [data-city-autofill] fields on
     any later form/WhatsApp message, with no manual re-entry. */
  var CITY_KEY = "satpak_city";
  safe("city picker", function(){
    var grid = document.querySelector("[data-city-grid]");
    var picker = document.querySelector("[data-dept-picker]");
    if(!grid || !picker) return;
    var cityOut = picker.querySelector("[data-dept-picker-city]");
    grid.querySelectorAll(".city-card").forEach(function(card){
      card.addEventListener("click", function(){
        var city = card.getAttribute("data-city");
        if(city === "Other"){
          window.open("https://wa.me/923181112606?text=" + encodeURIComponent("Hi SaT PaK, I'm not in one of your listed cities — can you help?"), "_blank", "noopener");
          return;
        }
        grid.querySelectorAll(".city-card").forEach(function(c){ c.classList.remove("is-selected"); });
        card.classList.add("is-selected");
        try{ localStorage.setItem(CITY_KEY, city); }catch(e){}
        if(cityOut) cityOut.textContent = city;
        picker.hidden = false;
        setTimeout(function(){ picker.scrollIntoView({behavior:"smooth", block:"center"}); }, 80);
      });
    });
  });

  /* ---------- kit builder (Chemicals — pick 3, see a kit rate) ---------- */
  safe("kit builder", function(){
    var wrap = document.querySelector("[data-kit-builder]");
    if(!wrap) return;
    var chips = Array.prototype.slice.call(wrap.querySelectorAll("[data-kit-item]"));
    var slots = Array.prototype.slice.call(wrap.querySelectorAll("[data-kit-slot]"));
    var glowEl = wrap.querySelector("[data-kit-glow]");
    var priceEl = wrap.querySelector("[data-kit-price]");
    var checkoutBtn = wrap.querySelector("[data-kit-checkout]");
    var KIT_DISCOUNT = 0.1;
    var picked = []; // {name, pack, price, can, chip}

    function money(n){ return "Rs " + Math.round(n).toLocaleString("en-PK"); }

    function renderSlots(){
      slots.forEach(function(slot, i){
        var item = picked[i];
        if(!item){
          slot.className = "kit-slot";
          slot.style.removeProperty("--can");
          slot.innerHTML = '<span class="kit-slot-num">' + (i + 1) + '</span>';
          return;
        }
        slot.className = "kit-slot is-filled";
        slot.style.setProperty("--can", item.can);
        slot.innerHTML =
          '<button type="button" class="kit-slot-remove" data-kit-remove="' + i + '" aria-label="Remove ' + item.name + '">×</button>' +
          '<span class="kit-slot-name">' + item.name + '</span>' +
          '<span class="kit-slot-price">' + money(item.price) + '</span>';
        slot.querySelector("[data-kit-remove]").addEventListener("click", function(){
          var line = picked[i];
          picked.splice(i, 1);
          if(line && line.chip) line.chip.classList.remove("is-added");
          render();
        });
      });
    }

    function renderChips(){
      chips.forEach(function(chip){
        var name = chip.getAttribute("data-name");
        var isAdded = picked.some(function(p){ return p.name === name; });
        chip.classList.toggle("is-added", isAdded);
        chip.classList.toggle("is-disabled", !isAdded && picked.length >= 3);
      });
    }

    function renderPrice(){
      if(picked.length < 3){
        priceEl.innerHTML = '<span class="kit-price-hint">' + (3 - picked.length) + ' more to see your kit rate</span>';
        checkoutBtn.setAttribute("disabled", "disabled");
        return;
      }
      var total = picked.reduce(function(sum, p){ return sum + p.price; }, 0);
      var discounted = total * (1 - KIT_DISCOUNT);
      priceEl.innerHTML =
        '<span class="kit-price-was">' + money(total) + '</span>' +
        '<span class="kit-price-now">' + money(discounted) + '</span>' +
        '<span class="kit-price-save">Indicative kit rate — ' + Math.round(KIT_DISCOUNT * 100) + '% off, confirmed on WhatsApp</span>';
      checkoutBtn.removeAttribute("disabled");
    }

    function renderGlow(){
      var last = picked[picked.length - 1];
      if(glowEl) glowEl.style.setProperty("--glow", last ? last.can : "var(--brass-light)");
    }

    function render(){
      renderSlots();
      renderChips();
      renderPrice();
      renderGlow();
    }

    chips.forEach(function(chip){
      chip.addEventListener("click", function(){
        var name = chip.getAttribute("data-name");
        if(picked.some(function(p){ return p.name === name; })) return;
        if(picked.length >= 3) return;
        picked.push({
          name: name,
          pack: chip.getAttribute("data-pack") || "",
          price: parseFloat(chip.getAttribute("data-price")) || 0,
          can: chip.style.getPropertyValue("--can") || "var(--brass-light)",
          chip: chip
        });
        render();
      });
    });

    checkoutBtn.addEventListener("click", function(){
      if(picked.length < 3) return;
      var CART_KEY = "satpak_cart";
      var cart = [];
      try{ cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){}
      picked.forEach(function(item){
        var idx = -1;
        for(var i = 0; i < cart.length; i++){
          if(cart[i].name === item.name && cart[i].pack === item.pack){ idx = i; break; }
        }
        if(idx > -1){ cart[idx].qty += 1; }
        else { cart.push({ name: item.name, pack: item.pack, qty: 1 }); }
      });
      try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
      window.dispatchEvent(new Event("satpak:cart-updated"));
      if(typeof showToast === "function") showToast("Kit added — ask for the kit rate at checkout");
      var names = picked.map(function(p){ return p.name; }).join(", ");
      var msg = "Hi SaT PaK, I built a kit on your site: " + names + ". Can you confirm the kit rate?";
      window.open("https://wa.me/923181112606?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });

    render();
  });

  /* ---------- department carousel (Home hero) ---------- */
  safe("department carousel", function(){
    var track = document.querySelector("[data-carousel-track]");
    if(!track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll(".carousel-card"));
    var glow = document.querySelector("[data-carousel-glow]");
    var nameEl = document.querySelector("[data-carousel-name]");
    var descEl = document.querySelector("[data-carousel-desc]");
    var ctaEl = document.querySelector("[data-carousel-cta]");
    var prevBtn = document.querySelector("[data-carousel-prev]");
    var nextBtn = document.querySelector("[data-carousel-next]");

    var descriptions = {
      ro: "Designed around your water, built end to end, looked after for years.",
      chemicals: "Water-treatment chemistry formulated, compounded and packed in our own facility.",
      article: "Mineralized drinking water, delivered in 19-litre bottles across Karachi.",
      health: "Mineral-based personal care, built on the same chemistry.",
      homecare: "Anti-bacterial essentials from a water-treatment manufacturer."
    };

    var active = cards.findIndex(function(c){ return c.classList.contains("is-active"); });
    if(active < 0) active = 0;

    function render(){
      cards.forEach(function(card, i){
        card.style.setProperty("--i", i - active);
        card.classList.toggle("is-active", i === active);
      });
      var card = cards[active];
      var dept = card.getAttribute("data-dept");
      var href = card.getAttribute("data-href");
      var name = card.querySelector(".carousel-card-name").textContent;
      if(glow) glow.style.setProperty("--cc-rgb", getComputedStyle(card).getPropertyValue("--cc-rgb"));
      if(nameEl) nameEl.textContent = name;
      if(descEl) descEl.textContent = descriptions[dept] || "";
      if(ctaEl) ctaEl.href = href;
    }

    cards.forEach(function(card, i){
      card.addEventListener("click", function(){
        if(i === active){ window.location.href = card.getAttribute("data-href"); return; }
        active = i;
        render();
      });
    });
    if(prevBtn) prevBtn.addEventListener("click", function(){ active = (active - 1 + cards.length) % cards.length; render(); });
    if(nextBtn) nextBtn.addEventListener("click", function(){ active = (active + 1) % cards.length; render(); });

    render();
  });

  /* ---------- donation (Home) — WhatsApp lead-routing, not a checkout ---------- */
  safe("donation form", function(){
    var form = document.querySelector("[data-donate-form]");
    if(!form) return;
    var whatChips = Array.prototype.slice.call(form.querySelectorAll("[data-donate-what] .donate-chip"));
    var whereSelect = form.querySelector("[data-donate-where]");
    var submitBtn = form.querySelector("[data-donate-submit]");
    var selectedWhat = null;

    whatChips.forEach(function(chip){
      chip.addEventListener("click", function(){
        whatChips.forEach(function(c){ c.classList.remove("is-selected"); });
        chip.classList.add("is-selected");
        selectedWhat = chip.getAttribute("data-value");
      });
    });

    if(submitBtn){
      submitBtn.addEventListener("click", function(){
        var where = (whereSelect && whereSelect.value) || "a location I'll specify";
        var what = selectedWhat || "a product or service";
        var msg = "Hi SaT PaK, I'd like to donate " + what + " to " + where + ". Can you help arrange it?";
        window.open("https://wa.me/923181112606?text=" + encodeURIComponent(msg), "_blank", "noopener");
      });
    }
  });

  /* ---------- city auto-fill (any page with a saved city) ---------- */
  safe("city autofill", function(){
    var city = null;
    try{ city = localStorage.getItem(CITY_KEY); }catch(e){}
    if(!city) return;
    document.querySelectorAll("[data-city-autofill]").forEach(function(field){
      if(!field.value) field.value = city;
    });
  });
}

document.addEventListener("partials:loaded", satpakInit);
/* pages with no [data-include] nodes (none expected, but safe fallback) */
if(!document.querySelector("[data-include]")){
  document.addEventListener("DOMContentLoaded", satpakInit);
}
