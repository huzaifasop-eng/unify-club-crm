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
  var skipBtn = loader.querySelector("[data-loader-skip]");
  var done = false;
  var timers = [];

  function finish(){
    if(done) return;
    done = true;
    timers.forEach(clearTimeout);
    try{ sessionStorage.setItem(KEY, "1"); }catch(e){}
    loader.classList.add("is-descending");
    timers.push(setTimeout(function(){
      loader.classList.add("is-hidden");
      setTimeout(remove, 650);
    }, 650));
  }

  /* brand mark fades in over the sky, holds, then descends to reveal the
     real hero footage already playing behind the overlay */
  requestAnimationFrame(function(){ loader.classList.add("is-ready"); });
  timers.push(setTimeout(finish, 1900));
  if(skipBtn) skipBtn.addEventListener("click", finish);
})();
