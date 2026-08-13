document.addEventListener("DOMContentLoaded", function () {
  if (typeof Swiper !== "undefined") {
    new Swiper(".vshm-ban-slider", {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".vshm-banner .swiper-pagination",
        clickable: true,
      },
      observer: true,
      observeParents: true,
    });
  }

  // Below 767px the platform section is a plain tab panel, so the slider is
  // destroyed and the pill tabs swap the boxes instead.
  var ptplatformDesktop = window.matchMedia("(min-width: 767px)");
  var ptplatformswiper = null;

  function showPlatformTab(targetId) {
    $(".ptplatformtab li").removeClass("active");
    $('.ptplatformtab li[data-rel="' + targetId + '"]').addClass("active");
    $(".ptplat-box").hide();
    $("#" + targetId).fadeIn(400);
  }

  function syncPlatformSwiper() {
    if (ptplatformDesktop.matches) {
      // The tab script leaves inline display styles behind, and on desktop
      // every box has to be visible inside its own slide.
      $(".ptplat-box").css("display", "");

      if (!ptplatformswiper) {
        ptplatformswiper = new Swiper(".ptplatform-slider", {
          direction: "vertical",
          speed: 600,
        });
      }

      return;
    }

    if (ptplatformswiper) {
      ptplatformswiper.destroy(true, true);
      ptplatformswiper = null;
    }

    var active = $(".ptplatformtab li.active");

    if (!active.length) {
      active = $(".ptplatformtab li").first();
    }

    showPlatformTab(active.data("rel"));
  }

  syncPlatformSwiper();

  if (ptplatformDesktop.addEventListener) {
    ptplatformDesktop.addEventListener("change", syncPlatformSwiper);
  } else if (ptplatformDesktop.addListener) {
    ptplatformDesktop.addListener(syncPlatformSwiper);
  }

  $(".ptplatformtab li").on("click", function () {
    showPlatformTab($(this).data("rel"));
  });

  new Swiper(".ptindutabs-slider", {
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next.ptindutabs-swiper-next",
      prevEl: ".swiper-button-prev.ptindutabs-swiper-prev",
    },
    breakpoints: {
      200: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
      767: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      991: {
        spaceBetween: 0,
        slidesPerView: 1,
      },
    },
  });

  new Swiper(".pttest-slider", {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination.pttest-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      767: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      991: {
        slidesPerView: 2.5,
      },
      1199: {
        slidesPerView: 3,
      },
    },
  });

  // Passed as a getter because the instance is destroyed and rebuilt on resize
  if (typeof initPlatformScrollSlider === "function") {
    initPlatformScrollSlider(function () {
      return ptplatformswiper;
    });
  }

  if (typeof initQuoteStepper === "function") {
    initQuoteStepper();
  }

  // Marquee Js
  var marquee = document.querySelector(".ptmctmarq-main");
  var track = document.querySelector(".ptmctmarq-track");

  if (!marquee || !track) {
    return;
  }

  var firstGroup = track.querySelector(".ptmctmarq-group");
  var offset = 0;
  var speed = 0.8;
  var groupWidth = 0;
  var paused = false;

  function setupMarquee() {
    var oldGroups = track.querySelectorAll(".ptmctmarq-group");

    oldGroups.forEach(function (group, index) {
      if (index > 0) {
        group.remove();
      }
    });

    groupWidth = firstGroup.offsetWidth;

    if (!groupWidth) {
      return;
    }

    var neededWidth = marquee.offsetWidth + groupWidth * 2;

    while (track.scrollWidth < neededWidth) {
      var clone = firstGroup.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
  }

  function animateMarquee() {
    if (!paused && groupWidth) {
      offset -= speed;

      if (Math.abs(offset) >= groupWidth) {
        offset += groupWidth;
      }

      track.style.transform = "translate3d(" + offset + "px, 0, 0)";
    }

    requestAnimationFrame(animateMarquee);
  }

  marquee.addEventListener("mouseenter", function () {
    paused = true;
  });

  marquee.addEventListener("mouseleave", function () {
    paused = false;
  });

  window.addEventListener("resize", function () {
    offset = 0;
    track.style.transform = "translate3d(0, 0, 0)";
    setupMarquee();
  });

  setupMarquee();

  window.addEventListener("load", setupMarquee);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setupMarquee);
  }

  animateMarquee();

  // ptindutabs Tabing Js
  $(".ptindutabs-slider .ptindu-item").on("click", function () {
    var targetId = $(this).data("rel");

    // Toggle active state on tabs
    $(".ptindutabs-slider .ptindu-item").removeClass("active");
    $(this).addClass("active");

    // Swap content panes
    $(".ptindutabs-content").hide();
    $("#" + targetId).fadeIn(400);
  });

  // Counting Js
  const statsSection = document.querySelector(".vshm-stats");
  if (statsSection) {
    const countNumbers = statsSection.querySelectorAll(".count");
    countNumbers.forEach((count) => {
      count.dataset.target = count.textContent.trim();
    });

    const startStatsAnimation = () => {
      statsSection.classList.add("is-animated");
      countNumbers.forEach((count, index) => {
        const targetText = count.dataset.target || "0";
        const target = parseInt(targetText, 10);
        const hasLeadingZero =
          targetText.length > 1 && targetText.startsWith("0");
        const duration = 5000;
        const delay = 0;

        setTimeout(() => {
          count.textContent = hasLeadingZero
            ? "0".padStart(targetText.length, "0")
            : "0";
          const startTime = performance.now();
          const updateCount = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * easedProgress);
            count.textContent = hasLeadingZero
              ? String(value).padStart(targetText.length, "0")
              : value;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              count.textContent = targetText;
            }
          };

          requestAnimationFrame(updateCount);
        }, delay);
      });
    };

    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startStatsAnimation();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.35,
        },
      );
      statsObserver.observe(statsSection);
    } else {
      startStatsAnimation();
    }
  }

  // Hamburger bars fold into a cross while the menu is open
  $(".navbar-toggler").on("click", function () {
    $(this).toggleClass("active");
  });

  // Below 767px the right column is hidden by CSS and the tabs slide it in on
  var megamenuNarrow = window.matchMedia("(max-width: 767px)");

  function resetMegamenuRight() {
    $(".megamenu-right").css("display", "");
  }

  if (megamenuNarrow.addEventListener) {
    megamenuNarrow.addEventListener("change", resetMegamenuRight);
  } else if (megamenuNarrow.addListener) {
    megamenuNarrow.addListener(resetMegamenuRight);
  }

  // Menu Platform Tabing Js
  $(".megamenu-tabs .megamenu-item").on("click", function () {
    var targetId = $(this).data("rel");

    // Toggle active state on tabs
    $(".megamenu-tabs .megamenu-item").removeClass("active");
    $(this).addClass("active");

    // Swap content panes
    $(".megamenutb-content").hide();
    $("#" + targetId).fadeIn(400);

    if (megamenuNarrow.matches) {
      $(this).closest(".megamenu-panel").find(".megamenu-right").show();
    }
  });

  // Mega menu open/close - one panel at a time
  $(".menu-item-has-children > a").on("click", function (event) {
    event.preventDefault();

    var panel = $(this).siblings(".megamenupanel-main");
    var isOpen = panel.hasClass("megamenupanel-show");

    // Whichever link was clicked before releases its panel first
    $(".megamenupanel-main").removeClass("megamenupanel-show");
    resetMegamenuRight();

    if (!isOpen) {
      panel.addClass("megamenupanel-show");
    }
  });

  // Back button closes the panel it sits in
  $(".megamenupanel-back").on("click", function () {
    var right = $(this).closest(".megamenu-right");

    // A back button inside a tab pane only steps back out to the tab list
    if (megamenuNarrow.matches && right.length) {
      right.hide();
      return;
    }

    resetMegamenuRight();
    $(this).closest(".megamenupanel-main").removeClass("megamenupanel-show");
  });
});
$(document).ready(function () {
  $(".navbar-toggler").click(function () {
    $(".collapse").addClass("show");
  });
});

$(document).ready(function () {
  $(".close-btn").click(function () {
    $(".collapse").removeClass("show");
  });
});

new Swiper(".innovation-img-slider", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".innovation-next",
    prevEl: ".innovation-prev",
  },
  pagination: {
    el: ".innovation-pagination",
    clickable: true,
  },
  grabCursor: true,

  breakpoints: {
    200: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    767: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    991: {
      spaceBetween: 0,
      slidesPerView: 1,
    },
  },
});

// project slider
const projectsSwiper = new Swiper(".projects-img-slider", {
  slidesPerView: 1.2,
  centeredSlides: true,
  spaceBetween: 30,
  loop: false,
  pagination: {
    el: ".projects-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".projects-control-next",
    prevEl: ".projects-control-prev",
  },
  grabCursor: true,

  breakpoints: {
    200: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    767: {
      slidesPerView: 1,
    },
    991: {
      spaceBetween: 20,
      slidesPerView: 1.4,
    },
  },
});

var spacesSlider = new Swiper(".spaces-feature-slider", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: ".innovation-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".innovation-next",
    prevEl: ".innovation-prev",
  },
  breakpoints: {
    200: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    767: {
      slidesPerView: 1,
    },
    991: {
      spaceBetween: 20,
      slidesPerView: 1,
    },
  },
});
