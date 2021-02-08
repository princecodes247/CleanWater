$(document).ready(function () {
  var mobileW = 720;
  var hamburgerW = 800;
  var menuToggle = $(".site-header__mobile-menu-button").unbind();
  menuToggle.on("click", function (e) {
    e.preventDefault();
    $(".site-header__navigation").slideToggle();
  });
  $(".site-header__main-nav-item--has-submenu > a").click(function (e) {
    if ($(window).width() < hamburgerW) {
      e.preventDefault();
      $(this).siblings(".site-header__submenu-container").slideToggle();
    }
  });
  $(".site-header__tertiary-menu-title").click(function (e) {
    if ($(window).width() < hamburgerW) {
      e.preventDefault();
      $(this).siblings(".site-header__tertiary-menu").slideToggle();
    }
  });
  $("a[href^=http]").each(function () {
    $(this).attr("target", "_blank");
  });
  $(".article-body__share-trigger").click(function (e) {
    e.preventDefault();
    $(".article-body__share-list").slideToggle();
  });
  $(".article-gallery__list").each(function () {
    $(this).magnificPopup({
      delegate: "a",
      type: "image",
      gallery: {
        arrowMarkup:
          '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% icon-arrow-%dir%"></button>',
        enabled: true,
      },
      closeMarkup:
        '<button title="%title%" type="button" class="mfp-close icon-close"></button>',
    });
  });
  $(".article-gallery__trigger").click(function (e) {
    e.preventDefault();
    $(
      $(this).parents(".article-gallery").children(".article-gallery__list")
    ).magnificPopup("open");
  });
  $(".expander").click(function () {
    $(this).toggleClass("expander--is-open");
    $(this).children(".expander__text").slideToggle();
  });
  function initSlider() {
    var autoplay = true;
    if ($(window).width() < mobileW) {
      var autoplay = false;
    }
    $(".general-slider:not(.general-slider--timeline)").flexslider({
      slideshow: autoplay,
      pauseOnHover: true,
      touch: false,
      prevText: '<span class="icon-arrow-left"></span>',
      nextText: '<span class="icon-arrow-right"></span>',
    });
  }
  function initTimeline() {
    if ($(window).width() > mobileW) {
      $(".general-slider--timeline").flexslider({
        slideshow: true,
        pauseOnHover: true,
        touch: false,
        prevText: '<span class="icon-arrow-left"></span>',
        nextText: '<span class="icon-arrow-right"></span>',
      });
    }
  }
  function initWow() {
    var wow = new WOW({ offset: 200, mobile: false });
    wow.init();
  }
  function initCampaignSlider() {
    if ($(".campaign-slider__dot").length > 0) {
      $(".campaign-slider__dot").click(function () {
        var slider = $(".campaign-slider").data("flexslider");
        slider.flexAnimate($(this).parent().data("slide"));
        $(this).blur();
      });
    }
    if ($(window).width() > mobileW) {
      $(".campaign-slider").flexslider({
        slideshow: false,
        pauseOnHover: true,
        touch: false,
        controlNav: false,
        smoothHeight: true,
        prevText: '<span class="icon-arrow-left"></span>',
        nextText: '<span class="icon-arrow-right"></span>',
        start: function () {
          $(".campaign-slider__dot-holder[data-slide=0]").addClass(
            "campaign-slider__dot-holder--active"
          );
        },
        after: function () {
          var slider = $(".campaign-slider").data("flexslider");
          $(".campaign-slider__dot-holder--active").removeClass(
            "campaign-slider__dot-holder--active"
          );
          $(
            ".campaign-slider__dot-holder[data-slide=" +
              slider.currentSlide +
              "]"
          ).addClass("campaign-slider__dot-holder--active");
        },
      });
    }
  }
  function initCarouselBanner() {
    $(".callout-stripe--flexslider").flexslider({
      animation: "fade",
      slideshow: true,
      pauseOnAction: true,
      pauseOnHover: true,
      controlNav: false,
      directionNav: true,
      prevText: '<span class="icon-arrow-left"></span>',
      nextText: '<span class="icon-arrow-right"></span>',
      start: function (slider) {
        var start_time = $(slider.slides[slider.currentSlide]).data("duration");
        clearInterval(slider.animatedSlides);
        slider.animatedSlides = setInterval(slider.animateSlides, start_time);
      },
      after: function (slider) {
        slider.pause();
        slider.vars.slideshowSpeed = $(slider.slides[slider.currentSlide]).data(
          "duration"
        );
        slider.play();
      },
    });
  }
  var stepsInAnimation = 15;
  var animatingStats = [];
  function initStats() {
    if (
      $(".text-stat__number").length > 0 ||
      $(".bubble-stat__number").length > 0 ||
      $(".stacked-stat__number").length > 0
    ) {
      $(".text-stat__number, .bubble-stat__number, .stacked-stat__number").each(
        function () {
          var num = $(this)
            .html()
            .replace(",", "")
            .replace(/[^\d.-]/g, "");
          if ($(this).parents(".interactive-map").length < 1) {
            if (num >= 10) {
              $(this).addClass("animatable-stat");
              $(this).css("width", Math.ceil($(this).innerWidth()) + 1);
              $(this).attr("data-endstr", $(this).html());
              $(this).attr("data-num", num);
              $(this).attr(
                "data-numstr",
                $(this)
                  .html()
                  .replace(",", "")
                  .replace(/[0-9]+/, "XXX")
              );
              $(this).html($(this).data("numstr").replace("XXX", 0));
            }
          }
        }
      );
      checkForAnimatingStats();
    }
  }
  function updateTheStat(el) {
    var endNum = $(el).data("num");
    var numStep = Math.ceil(endNum / stepsInAnimation);
    var currentNum = Number(
      $(el)
        .html()
        .replace(/[^\d.-]/g, "")
    );
    var newNum = Math.round(currentNum + numStep);
    var newString = $(el).data("numstr").replace("XXX", newNum);
    if (newNum > endNum) newString = $(el).data("endstr");
    $(el).html(newString);
    if (newNum >= endNum) $(el).removeAttr("style");
  }
  function checkForAnimatingStats() {
    $(".animatable-stat:not(.animatable-stat--animated)").each(function () {
      if (
        $(window).scrollTop() + $(window).height() >
        $(this).offset().top + 100
      ) {
        $(this).addClass("animatable-stat--animated");
        animatingStats.push($(this));
        var stat = $(this);
        for (var i = 0; i < stepsInAnimation; i++) {
          setTimeout(function () {
            updateTheStat(stat);
          }, 500 + 70 * i);
        }
      }
    });
  }
  $(window).scroll(function () {
    checkForAnimatingStats();
  });
  function enableMapSection(secnum) {
    $(".interactive-map__details[data-section=" + secnum + "]").fadeIn(200);
    $(".interactive-map__details[data-section=" + secnum + "]").addClass(
      "interactive-map__details--is-active"
    );
    $(".interactive-map__nav-link[data-section=" + secnum + "]").addClass(
      "interactive-map__nav-link--is-active"
    );
  }
  function disableMapSection(secnum) {
    $(".interactive-map__details--is-active").fadeOut(200);
    setTimeout(function () {
      $(".interactive-map__details--is-active").removeClass(
        "interactive-map__details--is-active"
      );
      $(".interactive-map__nav-link--is-active").removeClass(
        "interactive-map__nav-link--is-active"
      );
      enableMapSection(secnum);
    }, 210);
  }
  function enableMapDetails(country) {
    $(".interactive-map__detail-content[data-country=" + country + "]").fadeIn(
      200
    );
  }
  function disableMapDetails() {
    $(".interactive-map__detail-content").fadeOut(200);
  }
  function handleMapDotClick(el) {
    var marker = el.parent();
    disableMapDetails();
    if ($(".interactive-map__marker--is-active").length > 0) {
      $(".interactive-map__marker").removeClass(
        "interactive-map__marker--is-active"
      );
      setTimeout(function () {
        enableMapDetails($(marker).data("country"));
      }, 210);
    } else {
      enableMapDetails($(marker).data("country"));
    }
    $(marker).addClass("interactive-map__marker--is-active");
    $(".interactive-map__header__headline").html($(marker).data("country"));
    $(".interactive-map__header__subhead").html($(marker).data("region"));
    $(".interactive-map__header").removeClass(
      "interactive-map__header--is-hidden"
    );
  }
  function handleMapNavClick(el) {
    disableMapSection(el.data("section"));
  }
  function initMap() {
    if ($(".interactive-map").length > 0) {
      enableMapSection(1);
      $(".interactive-map__marker--india").addClass(
        "interactive-map__marker--is-active"
      );
      enableMapDetails("India");
      $(".interactive-map__header__headline").html("India");
      $(".interactive-map__header__subhead").html("Asia");
      $(".interactive-map__header").removeClass(
        "interactive-map__header--is-hidden"
      );
      $(".interactive-map__marker-dot").click(function (evt) {
        evt.preventDefault();
        handleMapDotClick($(this));
      });
      $(".interactive-map__nav-link").click(function (evt) {
        evt.preventDefault();
        handleMapNavClick($(this));
      });
    }
  }
  function initAnimatedHeadline() {
    var headlines = window.header_headlines;
    var currentHeadline = 0;
    var animatedHeadlineTimer;
    if (headlines && headlines.length > 1) {
      $(".page-header__headline").attr("data-hlnum", 0);
      $(".page-header__headline").addClass("page-header__headline--visible");
      for (var i = 1; i < headlines.length; i++) {
        $(".page-header__headline[data-hlnum=" + (i - 1) + "]").after(
          '<h1 class="page-header__headline" data-hlnum="' +
            i +
            '">' +
            headlines[i] +
            "</h1>"
        );
      }
      $(".page-header__headline:not([data-hlnum=0])")
        .hide()
        .css("position", "absolute")
        .css("top", "0");
      animatedHeadlineTimer = setInterval(function () {
        currentHeadline++;
        animateHeadline(currentHeadline);
        if (currentHeadline == headlines.length - 1)
          clearInterval(animatedHeadlineTimer);
      }, 2000);
    }
  }
  function animateHeadline(str) {
    var finalH = $(".page-header__headline[data-hlnum=" + str + "]").height();
    $(".page-header__headline[data-hlnum=" + (str - 1) + "]").animate(
      { opacity: 0 },
      { duration: 400, queue: false }
    );
    $(".page-header__headline[data-hlnum=" + str + "]").fadeIn(
      400,
      function () {
        $(".page-header__headline--visible").removeClass(
          "page-header__headline--visible"
        );
        $(this).addClass("page-header__headline--visible");
      }
    );
    $(".page-header__headline[data-hlnum=0]").animate(
      { height: finalH },
      { duration: 400, queue: false }
    );
  }
  function initStickyPromo() {
    if ($(".sticky-promo__close").length > 0) {
      $(".sticky-promo__close").click(function (evt) {
        evt.preventDefault();
        $(".sticky-promo").fadeOut();
      });
    }
  }
  function resizeBrowser() {
    if ($(window).width() > mobileW) {
    } else {
      if ($(".article-slider").length > 0) {
        $(".article-slider").data("flexslider").flexAnimate(0);
        $(".article-slider").flexslider("pause");
      }
    }
    if ($(window).width() > hamburgerW) {
      $(".site-header__navigation").attr("style", "");
      $(".site-header__submenu-container").attr("style", "");
      $(".site-header__tertiary-menu").attr("style", "");
    }
    if (window.header_headlines) {
      $(".page-header__headline[data-hlnum=0]").animate(
        { height: $(".page-header__headline--visible").height() },
        50
      );
    }
  }
  $(window).resize(function () {
    resizeBrowser();
  });
  function init() {
    initSlider();
    initTimeline();
    initWow();
    initStats();
    initMap();
    initAnimatedHeadline();
    initStickyPromo();
    initCampaignSlider();
    initCarouselBanner();
  }
  init();
});
function getParam(paramName) {
  var match = RegExp("[?&]" + paramName + "=([^&]*)").exec(
    window.location.search
  );
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
$(function () {
  var utmParams = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  };
  var woParams = {
    campaign: "",
    fund: "",
    appeal: "",
    package: "",
    solicitor: "",
  };
  var formParams = {
    amount: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street_address: "",
    street_address_2: "",
    city: "",
    state: "",
    zip_code: "",
  };
  var setUtmParamCookie = false;
  var setWoParamCookie = false;
  var setFormParamCookie = false;
  for (var prop in utmParams) {
    param = getParam(prop);
    if (param) {
      setUtmParamCookie = true;
      utmParams[prop] = param;
    }
  }
  for (var prop in woParams) {
    param = getParam(prop);
    if (param) {
      setWoParamCookie = true;
      woParams[prop] = param;
    }
  }
  for (var prop in formParams) {
    param = getParam(prop);
    if (param) {
      setFormParamCookie = true;
      formParams[prop] = param;
    }
  }
  if (setUtmParamCookie) {
    Cookies.set("utmParamCookie", utmParams);
  }
  if (setWoParamCookie) {
    Cookies.set("woParamCookie", woParams);
  }
  if (setFormParamCookie) {
    Cookies.set("formParamCookie", formParams);
  }
  var utmParamCookie = Cookies.getJSON("utmParamCookie");
  if (utmParamCookie) {
    $("#utm_params").val(JSON.stringify(utmParamCookie));
  }
  var woParamCookie = Cookies.getJSON("woParamCookie");
  if (woParamCookie) {
    var woParamsVal = $("#wo_params").val();
    if (!woParamsVal) {
      $("#wo_params").val(JSON.stringify(woParamCookie));
    }
  }
  var formParamCookie = Cookies.getJSON("formParamCookie");
  if (formParamCookie) {
    for (var key in formParamCookie) {
      var form_field_id_selector = "#id_" + key;
      $(form_field_id_selector).val(formParamCookie[key]);
    }
  }
});
$(function () {
  $(".donately-donation-form #url").val(window.location.href);
  donation_payload_param = getParam("donation_payload");
  if (donation_payload_param) {
    var donation_payload = JSON.parse(donation_payload_param);
    for (var dp_prop in donation_payload) {
      if (donation_payload.hasOwnProperty(dp_prop)) {
        $(".donation-payload-" + dp_prop).text(donation_payload[dp_prop]);
      }
    }
    donatelyEcommerceTracking(donation_payload);
  }
});
function donatelyEcommerceTracking(donation_payload) {
  dataLayer.push({
    ecommerce: {
      purchase: {
        actionField: {
          id: donation_payload["id"],
          affiliation: "Water.org",
          revenue: donation_payload["amount_in_cents"] / 100,
        },
        products: [
          {
            name: "Donation",
            variant:
              donation_payload["recurring"] == true ? "Recurring" : "Single",
          },
        ],
      },
    },
    event: "donationComplete",
  });
}
