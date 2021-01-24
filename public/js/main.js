'use strict';

$(document).ready(function() {

    Hawk.run();


    var locationPath = window.location;

    var currentPath = locationPath.pathname;

    var Routes = {

    };


    /***** OVERLAYERS *****/

    var overlayerVars = {};

    var ajaxOverlayer = new Hawk.AjaxOverlayerManager('overlayer', {
      onLoad: function(overlayermanager, id, result) {
        
      },
      onHide: function(om, id) {

      }
    });
    ajaxOverlayer.run();


    /**$(window).resize(function() {
      $('.scrollable-section').mCustomScrollbar('update');
    });**/

    /***** RATE FIELD *****/


    /***** NEWSLETTER FORM *****/

    var fields = [
      new Hawk.FormField("name", Hawk.formFieldTypes.TEXT, "form-field", true, Hawk.Validator.isNotEmpty),
      new Hawk.FormField("email", Hawk.formFieldTypes.TEXT, "form-field", true, Hawk.Validator.isEmail),
      new Hawk.FormField("phone", Hawk.formFieldTypes.TEXT, "form-field", false, Hawk.Validator.isNotEmpty),
      new Hawk.FormField("message", Hawk.formFieldTypes.TEXTAREA, "form-field", true, Hawk.Validator.isNotEmpty),
      new Hawk.FormField("conditions", Hawk.formFieldTypes.CHECKBOX, "choice-field", true, Hawk.Validator.isSomethingChecked)
    ];

    var lang = $('html').attr('lang');

    var mailer = new Hawk.FormSender('form-contact', fields, {
        extraData: {
           action: 'mail',
           lang: lang
        }
    });
    mailer.run();


    /***** ANOTHER LITTLE FUNCTIONS *****/

    function checkSections(sections, callback, offset) {
      sections.each(function() {
          var currentOffset = $(this).offset().top;

          if (typeof offset != 'undefined') {
            currentOffset = currentOffset - offset;
          }

          if (window.scrollY >= currentOffset && window.scrollY <= currentOffset + $(this).outerHeight()) {
            if (typeof callback == 'function') {
              if (callback($(this))) {
                return true;
              }
            }  
          }
      });
    }

    var ajaxRequestManager = new Hawk.AjaxRequestsManager();

    ajaxRequestManager.get("http://localhost:8080/api/s3//buckets", {});

    var sections = $('.site-section').add($('#site-header')).add($('#site-footer')).add($('.skew-section'));
    var menuToggler = $('.menu-toggler');
    var menuTogglerContainer = $('.menu-toggler-container');


    $(window).scroll(function() {
      checkSections(sections, function(current) {
        if (!current.hasClass('site-section--medium') && !current.hasClass('site-section--dark') && !current.hasClass('site-footer') && !current.hasClass('skew-section')) {
          menuToggler.removeClass('icon-hamburger--light');
        } else {
          menuToggler.addClass('icon-hamburger--light');
        }

        if (current.hasClass('site-section--surrounded')) {
          menuTogglerContainer.addClass('menu-toggler-container--deep');
        } else {
          menuTogglerContainer.removeClass('menu-toggler-container--deep');
        }
      }, 16);
    });

});

