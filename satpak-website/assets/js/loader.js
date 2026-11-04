/* SaT PaK — cinematic loading intro. Runs immediately (not gated behind
   partials:loaded), shows once per browser session, and gets out of the
   way instantly for anyone who prefers reduced motion or has already
   seen it this session. */
(function(){
  "use strict";
  var loader = document.getElementById("site-loader");
  if(!loader) return;

  var KEY = "satpak_intro_seen";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try{ seen = sessionStorage.getItem(KEY) === "1"; }catch(e){}

  function remove(){
    if(loader && loader.parentNode) loader.parentNode.removeChild(loader);
    document.body.style.overflow = "";
  }

  if(seen || reduceMotion){
    remove();
    return;
  }

  document.body.style.overflow = "hidden";
  var pctEl = loader.querySelector("[data-loader-pct]");
  var skipBtn = loader.querySelector("[data-loader-skip]");
  var done = false;

  function finish(){
    if(done) return;
    done = true;
    try{ sessionStorage.setItem(KEY, "1"); }catch(e){}
    loader.classList.add("is-hidden");
    setTimeout(remove, 550);
  }

  var duration = 1100, start = null;
  function frame(ts){
    if(start === null) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    if(pctEl) pctEl.textContent = Math.round(progress * 100) + "%";
    if(progress < 1 && !done){ requestAnimationFrame(frame); }
    else if(!done){ setTimeout(finish, 200); }
  }
  requestAnimationFrame(frame);
  if(skipBtn) skipBtn.addEventListener("click", finish);
})();
