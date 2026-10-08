/* SaT PaK — motion
   Dependency-free scroll choreography for the cinematic pages.

   Building blocks (all opt-in through data attributes):
     [data-in="up|fade|clip|scale"]   reveal once when scrolled into view
     [data-stagger]                    children reveal one after another
     [data-scene="pin|pass|enter"]     exposes scroll progress to CSS as --p (0 → 1)
     [data-parallax="0.12"]            drifts against the scroll
     [data-words]                      text that lights up word by word with its scene
     [data-count-to]                   counts up from zero when it comes into view
     video[data-src-wide]              picks a wide or tall cut, plays only when visible
   Everything still reads correctly with JavaScript off or reduced motion on. */
(function(){
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 901px)");

  doc.classList.add("js-motion");
  if(reduceMotion) doc.classList.add("reduce-motion");

  function clamp(v, min, max){ return v < min ? min : (v > max ? max : v); }
  function toArray(list){ return Array.prototype.slice.call(list); }

  /* ------------------------------------------------------------------
     Hero lines: rise into place once the display face has loaded
     ------------------------------------------------------------------ */
  function markReady(){ document.body.classList.add("is-ready"); }
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){ requestAnimationFrame(markReady); });
    setTimeout(markReady, 1200);
  } else {
    setTimeout(markReady, 100);
  }

  /* ------------------------------------------------------------------
     One-off reveals
     ------------------------------------------------------------------ */
  toArray(document.querySelectorAll("[data-stagger]")).forEach(function(group){
    toArray(group.children).forEach(function(child, i){ child.style.setProperty("--i", i); });
  });

  var revealTargets = toArray(document.querySelectorAll("[data-in],[data-stagger]"));
  if("IntersectionObserver" in window && !reduceMotion){
    /* The root is stretched far upwards so anything already scrolled past
       (anchor jumps, fast flings) counts as seen and is never left hidden. */
    var revealer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealer.unobserve(entry.target);
      });
    }, { rootMargin:"99999px 0px -12% 0px", threshold:0.01 });
    revealTargets.forEach(function(el){ revealer.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add("is-in"); });
  }

  /* ------------------------------------------------------------------
     Words that light up as their scene is scrolled
     ------------------------------------------------------------------ */
  function splitWords(el){
    var words = [];
    toArray(el.childNodes).forEach(function(node){
      if(node.nodeType === 3){
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function(part){
          if(!part) return;
          if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          frag.appendChild(span);
          words.push(span);
        });
        node.parentNode.replaceChild(frag, node);
      } else if(node.nodeType === 1){
        node.classList.add("w");
        words.push(node);
      }
    });
    return words;
  }
  var wordBlocks = toArray(document.querySelectorAll("[data-words]")).map(function(el){
    return { el:el, words:splitWords(el) };
  });

  /* ------------------------------------------------------------------
     Scenes: progress through a section, shared with CSS as --p
     ------------------------------------------------------------------ */
  var scenes = toArray(document.querySelectorAll("[data-scene]")).map(function(el){
    return { el:el, type:el.getAttribute("data-scene"), p:-1 };
  });
  var parallaxEls = toArray(document.querySelectorAll("[data-parallax]")).map(function(el){
    return { el:el, speed:parseFloat(el.getAttribute("data-parallax")) || 0.1 };
  });
  var tracks = toArray(document.querySelectorAll("[data-htrack]")).map(function(el){
    return { el:el, scene:el.closest("[data-scene]"), distance:0 };
  });
  var pipelines = toArray(document.querySelectorAll("[data-pipeline]")).map(function(el){
    var scene = el.closest("[data-scene]") || el;
    return {
      el:el,
      scene:scene,
      stations:toArray(el.querySelectorAll(".station")),
      current:scene.querySelector("[data-pipeline-current]"),
      path:el.querySelector(".pipe-flow"),
      drop:el.querySelector(".pipe-drop"),
      lastIndex:-1
    };
  });

  function sceneProgress(scene, vh){
    var rect = scene.el.getBoundingClientRect();
    if(rect.bottom < -vh || rect.top > vh * 2) return null; /* far away: skip */
    var travel = rect.height - vh;
    if(scene.type === "pin" && travel > 40){
      return clamp(-rect.top / travel, 0, 1);
    }
    if(scene.type === "enter"){
      return clamp((vh - rect.top) / (vh * 0.75), 0, 1);
    }
    return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
  }

  function measureTracks(){
    tracks.forEach(function(t){
      t.distance = Math.max(0, t.el.scrollWidth - t.el.parentNode.clientWidth);
    });
  }

  function placeDrop(line, p){
    if(!line.path || !line.drop || !line.path.getTotalLength) return;
    var svg = line.path.ownerSVGElement;
    var box = svg.viewBox.baseVal;
    var len = line.path.getTotalLength();
    var pt = line.path.getPointAtLength(len * p);
    var sx = svg.clientWidth / box.width, sy = svg.clientHeight / box.height;
    line.drop.style.transform = "translate(" + (pt.x * sx) + "px," + (pt.y * sy) + "px)";
  }

  var ticking = false;
  function update(){
    ticking = false;
    var vh = window.innerHeight;

    scenes.forEach(function(scene){
      var p = sceneProgress(scene, vh);
      if(p === null || Math.abs(p - scene.p) < 0.0005) return;
      scene.p = p;
      scene.el.style.setProperty("--p", p.toFixed(4));
    });

    parallaxEls.forEach(function(item){
      var rect = item.el.getBoundingClientRect();
      if(rect.bottom < -200 || rect.top > vh + 200) return;
      var centre = (rect.top + rect.height / 2 - vh / 2) / vh;
      item.el.style.setProperty("--py", (centre * item.speed * -100).toFixed(2) + "px");
    });

    wordBlocks.forEach(function(block){
      var host = block.el.closest("[data-scene]");
      var p = host ? parseFloat(host.style.getPropertyValue("--p")) || 0 : 1;
      var lit = Math.round(clamp((p - 0.12) / 0.5, 0, 1) * block.words.length);
      block.words.forEach(function(w, i){ w.classList.toggle("is-lit", i < lit); });
    });

    tracks.forEach(function(t){
      if(!desktop.matches){ t.el.style.transform = ""; return; }
      var p = t.scene ? parseFloat(t.scene.style.getPropertyValue("--p")) || 0 : 0;
      t.el.style.transform = "translate3d(" + (-t.distance * p).toFixed(1) + "px,0,0)";
    });

    pipelines.forEach(function(line){
      var p = parseFloat(line.scene.style.getPropertyValue("--p")) || 0;
      var n = line.stations.length;
      var index = Math.min(n - 1, Math.floor(p * n * 1.0001));
      line.stations.forEach(function(st, i){ st.classList.toggle("is-lit", i <= index && p > 0.01); });
      if(index !== line.lastIndex && line.current){
        line.current.textContent = ("0" + (Math.max(0, index) + 1)).slice(-2);
        line.lastIndex = index;
      }
      placeDrop(line, p);
    });
  }

  function requestUpdate(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }

  if(!reduceMotion){
    window.addEventListener("scroll", requestUpdate, { passive:true });
    window.addEventListener("resize", function(){ measureTracks(); requestUpdate(); });
    window.addEventListener("load", function(){ measureTracks(); requestUpdate(); });
    measureTracks();
    requestUpdate();
  } else {
    scenes.forEach(function(scene){ scene.el.style.setProperty("--p", "1"); });
    wordBlocks.forEach(function(b){ b.words.forEach(function(w){ w.classList.add("is-lit"); }); });
    pipelines.forEach(function(line){ line.stations.forEach(function(st){ st.classList.add("is-lit"); }); });
  }

  /* ------------------------------------------------------------------
     Counters — every number shares one duration, so the small ones
     tick slowly and the large ones race, and all of them land together
     ------------------------------------------------------------------ */
  var counterGroups = toArray(document.querySelectorAll("[data-counter-group]"));
  function formatCount(el, value){
    el.textContent = value.toLocaleString("en-US") + (el.getAttribute("data-count-suffix") || "");
  }
  counterGroups.forEach(function(group){
    var nums = toArray(group.querySelectorAll("[data-count-to]"));
    if(reduceMotion || !("IntersectionObserver" in window)){
      nums.forEach(function(el){ formatCount(el, parseInt(el.getAttribute("data-count-to"), 10)); });
      return;
    }
    nums.forEach(function(el){ formatCount(el, 0); });
    var io = new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting) return;
      io.disconnect();
      var duration = 2400, start = null;
      function frame(now){
        if(start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        nums.forEach(function(el){
          formatCount(el, Math.round(parseInt(el.getAttribute("data-count-to"), 10) * eased));
        });
        if(t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, { rootMargin:"99999px 0px -10% 0px", threshold:0 });
    io.observe(group);
  });

  /* ------------------------------------------------------------------
     Background films: right cut for the screen, play only when seen
     ------------------------------------------------------------------ */
  var films = toArray(document.querySelectorAll("video[data-src-wide]"));
  var portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
  films.forEach(function(video){
    video.muted = true;
    video.setAttribute("playsinline", "");
    if(reduceMotion) return; /* poster frame only */
    video.src = video.getAttribute(portrait ? "data-src-tall" : "data-src-wide");
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var play = video.play();
            if(play && play.catch) play.catch(function(){});
          } else {
            video.pause();
          }
        });
      }, { threshold:0.15 }).observe(video);
    } else {
      video.play();
    }
  });

  /* ------------------------------------------------------------------
     Department rows: a preview frame that trails the cursor
     ------------------------------------------------------------------ */
  var deptList = document.querySelector("[data-dept-list]");
  var preview = document.querySelector("[data-dept-preview]");
  if(deptList && preview && window.matchMedia("(hover: hover)").matches){
    var panes = toArray(preview.querySelectorAll(".pane"));
    var mx = 0, my = 0, px = 0, py = 0, raf = null;
    function follow(){
      px += (mx - px) * 0.14;
      py += (my - py) * 0.14;
      preview.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
      raf = requestAnimationFrame(follow);
    }
    toArray(deptList.querySelectorAll("[data-preview]")).forEach(function(row){
      row.addEventListener("mouseenter", function(){
        var target = parseInt(row.getAttribute("data-preview"), 10);
        panes.forEach(function(pane, i){ pane.classList.toggle("is-shown", i === target); });
        preview.classList.add("is-live");
      });
      row.addEventListener("mouseleave", function(){ preview.classList.remove("is-live"); });
    });
    deptList.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY;
      if(!raf){ px = mx; py = my; follow(); }
    });
    deptList.addEventListener("mouseleave", function(){
      if(raf){ cancelAnimationFrame(raf); raf = null; }
    });
  }

  /* ------------------------------------------------------------------
     Testimonials
     ------------------------------------------------------------------ */
  toArray(document.querySelectorAll("[data-quotes]")).forEach(function(box){
    var slides = toArray(box.querySelectorAll(".quote-slide"));
    var ticks = toArray(box.querySelectorAll(".quote-tick"));
    if(slides.length < 2) return;
    var current = 0, timer = null, hold = 7000;
    function show(i){
      current = (i + slides.length) % slides.length;
      slides.forEach(function(s, k){ s.classList.toggle("is-active", k === current); });
      ticks.forEach(function(t, k){
        t.classList.remove("is-running");
        t.classList.toggle("is-done", k < current);
      });
      if(ticks[current]){ void ticks[current].offsetWidth; ticks[current].classList.add("is-running"); }
    }
    function restart(){
      clearInterval(timer);
      if(!reduceMotion) timer = setInterval(function(){ show(current + 1); }, hold);
    }
    var prev = box.querySelector("[data-quote-prev]");
    var next = box.querySelector("[data-quote-next]");
    if(prev) prev.addEventListener("click", function(){ show(current - 1); restart(); });
    if(next) next.addEventListener("click", function(){ show(current + 1); restart(); });
    ticks.forEach(function(t, k){ t.addEventListener("click", function(){ show(k); restart(); }); });
    show(0);
    restart();
  });

  /* ------------------------------------------------------------------
     Article: monthly bill estimator
     ------------------------------------------------------------------ */
  toArray(document.querySelectorAll("[data-calc]")).forEach(function(calc){
    var refill = parseInt(calc.getAttribute("data-refill"), 10) || 110;
    var deposit = parseInt(calc.getAttribute("data-deposit"), 10) || 1100;
    var range = calc.querySelector("[data-calc-bottles]");
    var weeksBtns = toArray(calc.querySelectorAll("[data-calc-weeks]"));
    var outBottles = calc.querySelector("[data-calc-bottles-out]");
    var outMonth = calc.querySelector("[data-calc-month]");
    var outDeposit = calc.querySelector("[data-calc-deposit]");
    var weeks = 4;
    function money(v){ return "Rs " + v.toLocaleString("en-US"); }
    function render(){
      var n = parseInt(range.value, 10) || 1;
      outBottles.textContent = n + (n === 1 ? " bottle" : " bottles");
      outMonth.textContent = money(n * refill * weeks);
      outDeposit.textContent = money(n * deposit);
      range.style.setProperty("--fill", ((n - range.min) / (range.max - range.min) * 100) + "%");
    }
    range.addEventListener("input", render);
    weeksBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        weeks = parseInt(btn.getAttribute("data-calc-weeks"), 10);
        weeksBtns.forEach(function(b){ b.classList.toggle("is-active", b === btn); });
        render();
      });
    });
    render();
  });
})();
