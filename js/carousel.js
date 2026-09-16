/* Shared carousel component: arrows, dots, keyboard, touch swipe (native
   scroll-snap), and an optional lightbox. Used by testimonials (index.html)
   and work-sample image carousels (project pages). */
(function () {
  var lightboxRoot = null;
  var lightboxIndex = 0;

  function setupCarousel(root) {
    var track = root.querySelector(".carousel__track");
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    var hasLightbox = root.hasAttribute("data-carousel-lightbox");
    var dots = [];
    var current = 0;

    function step() {
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var width = slides[0] ? slides[0].getBoundingClientRect().width : 0;
      return width + gap;
    }

    function currentIndex() {
      var s = step();
      return s ? Math.round(track.scrollLeft / s) : 0;
    }

    function goTo(index) {
      index = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({ left: index * step(), behavior: "smooth" });
    }

    function setActive(index) {
      current = index;
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(currentIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(currentIndex() + 1); });

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1) + " of " + slides.length);
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    if (slides.length > 1 && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
              setActive(slides.indexOf(entry.target));
            }
          });
        },
        { root: track, threshold: 0.6 }
      );
      slides.forEach(function (slide) { observer.observe(slide); });
    }
    setActive(0);

    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(currentIndex() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(currentIndex() + 1); }
    });

    if (hasLightbox) {
      slides.forEach(function (slide, i) {
        if (!slide.querySelector("img")) return;
        slide.addEventListener("click", function () { openLightbox(root, i); });
      });
    }
  }

  function openLightbox(root, index) {
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    if (!lightbox || !lightboxImg) return;
    lightboxRoot = root;
    lightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function lightboxImages() {
    var track = lightboxRoot.querySelector(".carousel__track");
    return Array.prototype.map.call(track.children, function (slide) {
      return slide.querySelector("img");
    });
  }

  function updateLightboxImage() {
    var lightboxImg = document.getElementById("lightboxImg");
    if (!lightboxRoot || !lightboxImg) return;
    var img = lightboxImages()[lightboxIndex];
    if (!img) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
  }

  function closeLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxRoot = null;
  }

  function lightboxStep(direction) {
    if (!lightboxRoot) return;
    var images = lightboxImages();
    lightboxIndex = (lightboxIndex + direction + images.length) % images.length;
    updateLightboxImage();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-carousel]").forEach(setupCarousel);

    var lightbox = document.getElementById("lightbox");
    var lightboxClose = document.getElementById("lightboxClose");
    var lightboxPrev = document.getElementById("lightboxPrev");
    var lightboxNext = document.getElementById("lightboxNext");

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", function () { lightboxStep(-1); });
    if (lightboxNext) lightboxNext.addEventListener("click", function () { lightboxStep(1); });
    if (lightbox) {
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (!lightbox || !lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxStep(-1);
      if (e.key === "ArrowRight") lightboxStep(1);
    });
  });
})();
