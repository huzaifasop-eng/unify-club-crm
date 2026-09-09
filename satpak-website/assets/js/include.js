/* SaT PaK — loads shared header/footer partials, then signals main.js */
(function(){
  "use strict";

  /* Safety net: if partials or main.js ever fail to run (network hiccup,
     wrong deploy path), don't leave scroll-reveal content permanently
     invisible — force it visible after a short grace period. */
  setTimeout(function(){
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function(el){
      el.classList.add("is-visible");
    });
  }, 2500);

  var nodes = document.querySelectorAll("[data-include]");
  var pending = nodes.length;

  function markActiveNav(root){
    var page = document.body.getAttribute("data-page");
    if(!page) return;
    root.querySelectorAll(".navlink[data-nav]").forEach(function(a){
      if(a.getAttribute("data-nav") === page) a.classList.add("active");
    });
  }

  function done(){
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  }

  if(pending === 0){ done(); return; }

  nodes.forEach(function(node){
    var url = node.getAttribute("data-include");
    fetch(url).then(function(res){ return res.text(); }).then(function(html){
      node.outerHTML = html;
    }).catch(function(){
      node.innerHTML = "";
    }).finally(function(){
      pending -= 1;
      if(pending === 0){
        markActiveNav(document);
        done();
      }
    });
  });
})();
