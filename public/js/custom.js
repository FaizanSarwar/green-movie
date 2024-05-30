(function (jQuery) {
  'use strict';
  jQuery(document).ready(function () {
    /*---------------------------------------------------------------------
      Header Menu Dropdown
    ---------------------------------------------------------------------*/
    jQuery('[data-toggle=more-toggle]').on('click', function () {
      jQuery(this).next().toggleClass('show');
    });

    jQuery(document).on('click', function (e) {
      let myTargetElement = e.target;
      let selector, mainElement;
      if (
        jQuery(myTargetElement).hasClass('search-toggle') ||
        jQuery(myTargetElement).parent().hasClass('search-toggle') ||
        jQuery(myTargetElement).parent().parent().hasClass('search-toggle')
      ) {
        if (jQuery(myTargetElement).hasClass('search-toggle')) {
          selector = jQuery(myTargetElement).parent();
          mainElement = jQuery(myTargetElement);
        } else if (jQuery(myTargetElement).parent().hasClass('search-toggle')) {
          selector = jQuery(myTargetElement).parent().parent();
          mainElement = jQuery(myTargetElement).parent();
        } else if (
          jQuery(myTargetElement).parent().parent().hasClass('search-toggle')
        ) {
          selector = jQuery(myTargetElement).parent().parent().parent();
          mainElement = jQuery(myTargetElement).parent().parent();
        }
        if (
          !mainElement.hasClass('active') &&
          jQuery('.navbar-list li').find('.active')
        ) {
          jQuery('.navbar-right li').removeClass('iq-show');
          jQuery('.navbar-right li .search-toggle').removeClass('active');
        }

        selector.toggleClass('iq-show');
        mainElement.toggleClass('active');

        e.preventDefault();
      } else if (jQuery(myTargetElement).is('.search-input')) {
      } else {
        jQuery('.navbar-right li').removeClass('iq-show');
        jQuery('.navbar-right li .search-toggle').removeClass('active');
      }
    });

    /*---------------------------------------------------------------------
      Page Loader
    ----------------------------------------------------------------------- */
    jQuery('.widget .fa.fa-angle-down, #main .fa.fa-angle-down').on(
      'click',
      function () {
        jQuery(this).next('.children, .sub-menu').slideToggle();
      }
    );

    /*---------------------------------------------------------------------
    Mobile Menu Overlay
    ----------------------------------------------------------------------- */
    jQuery(document).on('click', function (event) {
      var $trigger = jQuery('.main-header .navbar');
      var $headerMenu = jQuery(event.target);
      if ($trigger !== event.target && !$trigger.has(event.target).length) {
        jQuery('.main-header .navbar-collapse').collapse('hide');
        jQuery('body').removeClass('nav-open');
      } else if (
        $headerMenu.hasClass('navbar-toggler-icon') ||
        $headerMenu.hasClass('navbar-toggler')
      ) {
        jQuery('.main-header .navbar-collapse').addClass('show');
        jQuery('body').addClass('nav-open');
      }
    });
    jQuery('.c-toggler').on('click', function () {
      jQuery('body').addClass('nav-open');
    });
  });
})(jQuery);
