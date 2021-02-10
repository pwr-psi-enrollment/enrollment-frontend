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


    function PageManager(header, content, options) {
        var that = this;

        this.header = header;
        this.content = content;

        this.defaultOptions = {
            routes: {}
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        this.requestManager = new Hawk.AjaxRequestsManager();

        this.getRoute = function(key) {
            return this.options.routes[key];
        }

        this.load = function(route) {
            var page = this.getRoute(route);

            if (typeof page.header != 'undefined') {
                this.requestManager.get(page.header.path, {
                    onSuccess: function(result) {
                        that.header.html(result.html);

                        page.header.callback();
                    }
                });
            }

            this.requestManager.get(page.content.path, {
                onSuccess: function(result) {
                    that.content.html(result.html);

                    page.content.callback();
                }
            });
        }
    }



    // function EnrollmentManager(container, options) {
    //     this.container = container;
    //
    //     this.fieldOfStudy;
    //
    //     this.defaultOptions = {
    //         semestersClass: 'enrollment-manager__semesters'
    //     };
    //
    //     this.options = Hawk.mergeObjects(this.defaultOptions, options);
    //
    //     this.setFieldOfStudy = function(fieldOfStudy) {
    //
    //     }
    //
    //     this.setSemester = function(semester) {
    //
    //     }
    // }

    var html = $('html');
    var body = $('body');

    var pagesManager = new PageManager($('#site-header'), $('#site-content'), {
        routes: {
            main: {
                header: {
                    path: "/template/site-header",
                    callback: function() {
                        requestsManager.post("/api/enrollment-service/student-details", {
                            token: localStorage.getItem('token')
                        }, {
                            onSuccess: function(result) {
                                if (result.statusCode == 200) {
                                    Student.update('name', result.bundle.name);
                                    Student.update('indexNumber', result.bundle.indexNumber);
                                } else {
                                    console.log("Błędny tokn");
                                }

                            }
                        });

                        // requestsManager.get("/ajax/get-student", {
                        //     onSuccess: function(result) {
                        //         Student.update('name', result.bundle.student.name);
                        //         Student.update('indexNumber', result.bundle.student.indexNumber);
                        //     }
                        // });

                        $('.logout-link').click(function() {
                            localStorage.clear();

                            pagesManager.load("login");
                        });
                    }
                },
                content: {
                    path: "/template/site-main",
                    callback: function() {



                        html.css({ height: 'auto' });
                        body.css({ height: 'auto' });

                        console.log({
                            token: localStorage.getItem('token')
                        });

                        requestsManager.post("/api/enrollment-service/student-details", {
                            token: localStorage.getItem('token')
                        }, {
                           onSuccess: function(result) {
                               AppComponentManagers.FieldOfStudy.parseItems(result.bundle.fieldsOfStudy, {});
                           }
                        });

                        PageHeader.update('title', "Zapisy");
                        PageHeader.update('firstSubtitle', "Wybierz kierunek");

                        EnrollmentManager.semestersContainer = $('.enrollment-manager__semesters');
                        EnrollmentManager.fieldsOfStudyContainer = $('.enrollment-manager__fields-of-study');
                        EnrollmentManager.coursesContainer = $('.enrollment-manager__courses');

                        Schedule.container = $('#schedule');
                    }
                }
            },
            login: {
                content: {
                    path: "/template/login",
                    callback: function() {
                        pagesManager.header.html('');

                        html.css({ height: '100%' });
                        body.css({ height: '100%' });

                        var loginFields = [
                            new Hawk.FormField("username", Hawk.formFieldTypes.TEXT, "extended-form-field", true, Hawk.Validator.isNotEmpty),
                            new Hawk.FormField("password", Hawk.formFieldTypes.TEXT, "extended-form-field", true, Hawk.Validator.isNotEmpty)
                        ];

                        var loginForm = new Hawk.FormSender('form-login', loginFields, {
                            ajaxPath: '/api/auth/login',
                            onCorrect: function(result) {
                                console.log(result);

                                if (typeof result.bundle.token != 'undefined') {
                                    localStorage.setItem("token", result.bundle.token);

                                    pagesManager.load("main");
                                } else {
                                    loginForm.changeMessage("Błędny login lub hasło");
                                }
                            }
                        });
                        loginForm.run();
                    }
                }
            }
        }
    });

    //localStorage.removeItem("token");

    if (localStorage.token) {
        requestsManager.post("/api/enrollment-service/student-details", {
            token: localStorage.getItem('token')
        }, {
            onSuccess: function(result) {
                if (result.statusCode == 200) {
                    pagesManager.load("main");
                } else {
                    pagesManager.load("login");
                }
            }
        });
    } else {
        pagesManager.load("login");
    }





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

   // ajaxRequestManager.get("http://localhost:8080/api/s3//buckets", {});

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

