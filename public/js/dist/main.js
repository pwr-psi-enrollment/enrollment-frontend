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
                that.header.load(page.header.path, function() {
                    page.header.callback();
                });

                // this.requestManager.get(page.header.path, {
                //     onSuccess: function(result) {
                //         that.header.html(result);
                //
                //         page.header.callback();
                //     }
                // });
            }

            that.content.load(page.content.path, function() {
                page.content.callback();
            });

            // this.requestManager.get(page.content.path, {
            //     onSuccess: function(result) {
            //         that.content.html(result);
            //
            //         page.content.callback();
            //     }
            // });
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
                    path: "/templates/site-header.html",
                    callback: function() {
                        requestsManager.post("/api/enrollment-service/student-details", {
                            //token: localStorage.getItem('token')
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem('token')
                            },
                            onSuccess: function(result) {

                                Student.update('name', result.name);
                                Student.update('indexNumber', result.indexNumber);


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
                    path: "/templates/site-main.html",
                    callback: function() {



                        html.css({ height: 'auto' });
                        body.css({ height: 'auto' });

                        console.log({
                            token: localStorage.getItem('token')
                        });

                        requestsManager.post("/api/enrollment-service/student-details", {

                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem('token')
                            },
                           onSuccess: function(result) {
                               AppComponentManagers.FieldOfStudy.parseItems(result.fieldsOfStudy, {});
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
                    path: "/templates/site-login.html",
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

                                if (typeof result.value != 'undefined') {
                                    localStorage.setItem("token", result.value);

                                    pagesManager.load("main");
                                } else {
                                    loginForm.changeMessage("Błędny login lub hasło");
                                }
                            },
                            onError: function(result) {
                                loginForm.changeMessage("Błędny login lub hasło");
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
            //token: localStorage.getItem('token')
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token')
            },
            onSuccess: function(result) {
                pagesManager.load("main");
            },
            onError: function(result) {
                pagesManager.load("login");
            }
        });
    } else {
        pagesManager.load("login");
    }



});

