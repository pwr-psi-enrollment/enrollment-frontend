// require ./hawk/_hawk.js

const AppConstants = {};

AppConstants.MachineStates = {
    RUNNING: "running",
    STOPPED: "stopped"
};

AppConstants.SemesterType = {
    SUMMER: "SUMMER",
    WINTER: "WINTER",

    getPolishName: function(key) {
        if (key == this.SUMMER) {
            return "Letni";
        } else {
            return "Zimowy";
        }
    }
}

AppConstants.AcademicDegree = {
    SUMMER: "ENGENEER",
    WINTER: "MASTER",

    getPolishName: function(key) {
        if (key == this.MASTER) {
            return "Magisterskie";
        } else {
            return "Inżynierskie";
        }
    }
}

AppConstants.CourseType = {
    LECTURE: "LECTURE",
    EXERCISE: "EXERCISE",
    LABORATORY: "LABORATORY",
    PROJECT: "PROJECT",
    SEMINAR: "SEMINAR",

    getPolishName: function(key) {
        if (key == this.LECTURE) {
            return "Wykład";
        } else if (key == this.EXERCISE) {
            return "Ćwiczenia";
        } else if (key == this.LABORATORY) {
            return "Laboratorium";
        } else if (key == this.PROJECT) {
            return "Projekt";
        } else if (key == this.SEMINAR) {
            return "Seminarium";
        } else {
            return "";
        }
    },

    getSymbol: function(key) {
        if (key == this.LECTURE) {
            return "W";
        } else if (key == this.EXERCISE) {
            return "Ć";
        } else if (key == this.LABORATORY) {
            return "L";
        } else if (key == this.PROJECT) {
            return "P";
        } else if (key == this.SEMINAR) {
            return "S";
        } else {
            return "";
        }
    }
}

AppConstants.RegistrationDestination = {
    FACULTY: "FACULTY",
    UNIVERSITY: "UNIVERSITY",

    getPolishName: function(key) {
        if (key == this.FACULTY) {
            return "Wydziałowe";
        } else if (key == this.UNIVERSITY) {
            return "Ogólnouczelniane";
        } else {
            return "";
        }
    }
}

AppConstants.RegistrationKind = {
    MAIN: "MAIN",
    CORRECTION: "CORRECTION",

    getPolishName: function(key) {
        if (key == this.MAIN) {
            return "Właściwe";
        } else if (key == this.CORRECTION) {
            return "Korekty";
        } else {
            return "";
        }
    }
}



const Schedule = {
    groups: {},
    container: null,

    getCell: function(group) {
        var row = this.container.find('.schedule__row[data-time="' + group.get('start') + '"]');

        console.log("ROW");
        console.log(row);

        var cell = row.find('.schedule__cell').eq(group.get('dayOfWeek'));

        return cell;
    },

    putGroup: function(group) {
        this.groups[group.getID()] = group;

        var cell = this.getCell(group);

        console.log("CELL", cell);
        cell.html(AppComponents.LectureGroup.getHTML(group));

        group.refreshView();
    },

    removeGroup: function(group) {
        var cell = this.getCell(group);

        cell.html('');

        delete this.groups[group.getID()];
    }
}

const AppComponents = {};

var requestsManager = new Hawk.AjaxRequestsManager();
var defaultDateOptions = {
    year: 'numeric', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
};

const AppComponentManagers = {};

var EnrollmentManager = {
    fieldOfStudy: null,
    semester: null,
    registration: null,

    semestersContainer: $('.enrollment-manager__semesters'),
    fieldsOfStudyContainer: $('.enrollment-manager__fields-of-study'),
    registrationsContainer: $('.enrollment-manager__semesters'),
    coursesContainer: $('.enrollment-manager__courses')
};


var Student = new Hawk.Component('cmpt-student', {
        name: "",
        indexNumber: ""
    },
    {
    },
    {
        methods: {

        }
    }
);

AppComponents.FieldOfStudy = new Hawk.ComponentClass('cmpt-field-of-study', {
        name: "",
        degree: "",
        specialization: "",
        faculty: "",
        status: "",
        startYear: "",
        currentSemester: 1,
        registeredId: 0,
        semesters: {}
    },
    {
    },
    {
        properties: {
            currentSemester: function(component) {
                return component.get('semesters').length;
            },

            academicDegree: function(component) {
                return AppConstants.AcademicDegree.getPolishName(component.get('degree'));
            }
        },

        methods: {

        },

        prepareJSON: function(json) {
            return {
                id: json.id,
                name: json.name,
                degree: json.studyDegree,
                specialization: json.specialization,
                faculty: json.faculty.name,
                status: json.status,
                startYear: json.startYear,
                semester: json.semester,
                registeredId: json.registeredId,
                semesters: json.semesters
            };
        },

        getHTML: function(component) {
            var result = `<section class="spectacular-table-row spectacular-table-row--8-columns cmpt-field-of-study" data-component-id="${component.getID()}">
                            <div class="spectacular-table-row__container">
                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__academicDegree">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__name">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__specialization">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__faculty">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__status">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__startYear">
                                    
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-field-of-study__currentSemester">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <button class="button cmpt-field-of-study__button" type="button">
                                        <div class="button__wrapper">
                                            <div class="button__inner">
                                                Wybierz
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </section>`;

            return result;
        }
    },
    function(json) {
        let result = [];

        const semestersData = json.semesters;

        let semesters = [];

        for (let i in semestersData) {
            const semester = AppComponents.Semester.createFromJSON(AppComponents.Semester.prepareJSON(semestersData[i]));

            semesters[semester.getID()] = semester;
        }

        return {
            id: json.id,
            values: {
                name: json.name,
                degree: json.degree,
                specialization: json.specialization,
                faculty: json.faculty,
                status: json.status,
                startYear: json.startYear,
                registeredId: json.registeredId,
                semesters: json.semesters
            },
            subcomponents: {
                semesters: semesters
            }
        };
    }
);

AppComponents.Registration = new Hawk.ComponentClass('cmpt-registration', {
        name: "",
        destination: "",
        kind: "",
        status: "",
        startTime: "",
        endTime: "",
        studentStartTime: "",
        active: 0
    },
    {
    },
    {
        properties: {
            startTimeDate: function(component) {

            },

            registrationDestination: function(component) {
                return AppConstants.RegistrationDestination.getPolishName(component.get('destination'));
            },

            registrationKind: function(component) {
                return AppConstants.RegistrationKind.getPolishName(component.get('kind'));
            }
        },

        methods: {
            checkActive: function(component) {
                if (component.get('active') == 1) {
                    component.getContainer().addClass('active');
                } else {
                    component.getContainer().removeClass('active');
                }
            }
        },

        prepareJSON: function(json) {
            return {
                id: json.id,
                name: json.name,
                destination: json.destination,
                kind: json.kind,
                status: json.status,
                startTime: new Date(json.startTime),
                endTime: new Date(json.endTime),
                studentStartTime: new Date(json.studentStartTime)
            };
        },

        getHTML: function(component) {
            var result = `<section class="spectacular-table-row spectacular-table-row--registrations cmpt-registration" data-component-id="${component.getID()}">
                            <div class="spectacular-table-row__container">
                                <div class="spectacular-table-row__cell spectacular-table-row__cell--name">
                                    <div class="table-cell cmpt-registration__name">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--destination">
                                    <div class="table-cell cmpt-registration__registrationDestination">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--kind">
                                    <div class="table-cell cmpt-registration__registrationKind">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--status">
                                    <div class="table-cell cmpt-registration__status">
                                       
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--registration-start">
                                    <div class="table-cell cmpt-registration__startTime">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--registration-end">
                                    <div class="table-cell cmpt-registration__endTime">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--distinguished spectacular-table-row__cell--student-registration-start">
                                    <div class="table-cell cmpt-registration__studentStartTime">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell spectacular-table-row__cell--actions">
                                    <div class="table-cell">
                                        <button class="button cmpt-registration__button" type="button">
                                            <div class="button__wrapper">
                                                <div class="button__inner">
                                                    Wybierz
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>`;

            return result;
        }
    },
    function(json) {
        let result = [];

        return {
            id: json.id,
            values: {
                name: json.name,
                destination: json.destination,
                kind: json.kind,
                status: json.status,
                startTime: json.startTime.toLocaleDateString("pl-PL", defaultDateOptions),
                endTime: json.endTime.toLocaleDateString("pl-PL", defaultDateOptions),
                studentStartTime: json.studentStartTime.toLocaleDateString("pl-PL", defaultDateOptions)
            },
            subcomponents: {}
        };
    }
);

AppComponents.Semester = new Hawk.ComponentClass('cmpt-semester', {
        academicYear: "",
        semesterType: "",
        year: 1,
        semesterNumber: 1,
        pointsECTS: 0,
        hoursZZU: 0,
        active: 0
    },
    {
    },
    {
        properties: {
            semesterTypeName: function(component) {
                return AppConstants.SemesterType.getPolishName(component.get('semesterType'));
            }
        },

        methods: {
            checkActive: function(component) {
                if (component.get('active') == 1) {
                    component.getContainer().addClass('active');
                } else {
                    component.getContainer().removeClass('active');
                }
            }
        },

        prepareJSON: function(json) {
            return {
                id: json.id,
                academicYear: json.academicYear,
                semesterType: json.semesterType,
                year: json.year,
                semesterNumber: json.semesterNumber,
                pointsECTS: json.currentEcts,
                hoursZZU: json.currentZzu
            };
        },

        getHTML: function(component) {
            var result = `<section class="spectacular-table-row spectacular-table-row--clickable spectacular-table-row--6-columns cmpt-semester" data-component-id="${component.getID()}">
                            <div class="spectacular-table-row__container">
                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-semester__academicYear">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-semester__semesterTypeName">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-semester__semesterNumber">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-semester__year">
                                        
                                    </div>
                                </div>

                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-semester__pointsECTS">
                                        
                                    </div>
                                </div>
                                
                                <div class="spectacular-table-row__cell">
                                    <div class="table-cell cmpt-semester__hoursZZU">
                                        
                                    </div>
                                </div>
                            </div>
                        </section>`;

            return result;
        }
    },
    function(json) {
        let result = [];

        return {
            id: json.id,
            values: {
                academicYear: json.academicYear,
                semesterType: json.semesterType,
                year: json.year,
                semesterNumber: json.semesterNumber,
                pointsECTS: json.pointsECTS,
                hoursZZU: json.hoursZZU
            },
            subcomponents: {}
        };
    }
);

AppComponents.Course = new Hawk.ComponentClass('cmpt-course', {
        name: "",
        type: "",
        ects: 0,
        zzu: 0,
        enrolled: false
    },
    {
        groups: {}
    },
    {
        properties: {
            courseType: function(component) {
                return AppConstants.CourseType.getPolishName(component.get('type'));
            }
        },

        methods: {
            checkEnrolled: function(component) {
                var bookmark = component.getElement('bookmark');

                if (component.get('enrolled') == 1) {
                    bookmark.addClass('common-bookmark--signed-up');
                } else {
                    bookmark.removeClass('common-bookmark--signed-up');
                }
            },

            prepareButton: function(component) {
                var button = component.getElement('button');

                button.attr('data-course-id', component.getID());
            }
        },

        prepareJSON: function(json) {
            return {
                id: json.id,
                name: json.name,
                type: json.type,
                ects: json.ects,
                zzu: json.zzu,
                enrolled: json.enrolled,
                groups: json.groups
            };
        },

        getHTML: function(component) {
            var result = `<article class="cmpt-course" data-component-id="${component.getID()}">
                                <div class="bookmarks-manager__bookmark common-bookmark cmpt-course__bookmark">
                                    <div class="common-bookmark__wrapper">
                                        <div class="common-bookmark__main-content cmpt-course__name">
                                            
                                        </div>

                                        <div class="common-bookmark__subcontent cmpt-course__courseType">
                                            
                                        </div>
                                    </div>
                                </div>

                                <div class="bookmarks-manager__bookmark-content">
                                    <ul class="courses-list cmpt-course__groups">
                                    
                                    </ul>
                                </div>
                            </article>`;

            return result;
        }
    },
    function(json) {
        let result = [];

        const groupsData = json.groups;

        let groups = [];

        for (let i in groupsData) {
            const lectureGroup = AppComponents.LectureGroup.createFromJSON(AppComponents.LectureGroup.prepareJSON(groupsData[i]));
            lectureGroup.set('name', json.name);
            lectureGroup.set('type', json.type);

            groups[lectureGroup.getID()] = lectureGroup;
        }

        return {
            id: json.id,
            values: {
                name: json.name,
                type: json.type,
                ects: json.ects,
                zzu: json.zzu,
                enrolled: json.enrolled
            },
            subcomponents: {
                groups: groups
            }
        };
    }
);

AppComponents.LectureGroup = new Hawk.ComponentClass('cmpt-lecture-group', {
        code: "",
        lecturer: "",
        name: "",
        type: "",
        dayOfWeek: 0,
        start: "",
        end: "",
        room: "",
        takenSeats: 0,
        allSeats: 0,
        enrolled: false
    },
    {
    },
    {
        properties: {
            dayOfWeekName: function(component) {
                var day = component.get('dayOfWeek');

                if (day == 1) {
                    return "pn";
                } else if (day == 2) {
                    return "wt";
                } else if (day == 3) {
                    return "śr";
                } else if (day == 4) {
                    return "czw";
                } else if (day == 5) {
                    return "pt";
                } else {
                    return "";
                }
            },
            courseType: function(component) {
                return AppConstants.CourseType.getPolishName(component.get('type'));
            },
            courseSymbol: function(component) {
                return AppConstants.CourseType.getSymbol(component.get('type'));
            }
        },

        methods: {
            checkButton: function(component) {
                var buttonContent = component.getElement('button').find('.button__inner');

                if (component.get('enrolled') == 1) {
                    buttonContent.html("Wypisz");
                } else {
                    buttonContent.html("Zapisz");
                }
            },
            checkType: function(component) {
                var symbol = component.getElement('courseSymbol');
                var container = component.getContainer();
                var type = component.get('type');

                if (type == AppConstants.CourseType.EXERCISE) {
                    symbol.addClass('classes-symbol--exercise');
                    container.addClass('schedule-item--exercise');
                } else if(type == AppConstants.CourseType.LABORATORY) {
                    symbol.addClass('classes-symbol--laboratory');
                    container.addClass('schedule-item--laboratory');
                } else if(type == AppConstants.CourseType.LECTURE) {
                    symbol.addClass('classes-symbol--lecture');
                    container.addClass('schedule-item--lecture');
                } else if(type == AppConstants.CourseType.SEMINAR) {
                    symbol.addClass('classes-symbol--seminar');
                    container.addClass('schedule-item--seminar');
                } else if(type == AppConstants.CourseType.PROJECT) {
                    symbol.addClass('classes-symbol--project');
                    container.addClass('schedule-item--project');
                }
            }
        },

        prepareJSON: function(json) {
            return {
                id: json.id,
                code: json.code,
                lecturer: json.lecturer,
                dayOfWeek: json.dayOfWeek,
                start: json.start,
                end: json.end,
                room: json.room,
                takenSeats: json.takenSeats,
                allSeats: json.allSeats,
                enrolled: json.enrolled
            };
        },

        getHTML: function(component, type) {
            if (typeof type != 'undefined' && type == 'list') {
                return `<article class="course-section cmpt-lecture-group" data-component-id="${component.getID()}">
                            <div class="course-section__wrapper">
                                <div class="course-section__row">
                                    <div class="course-section__main-container">
                                        <header class="extended-header">
                                            <div class="extended-header__container">
                                                <div class="extended-header__extra-info-container cmpt-lecture-group__code">
                                                    
                                                </div>

                                                <div class="extended-header__main-container">
                                                    <h5 class="small-title small-title--small cmpt-course__name"></h5>

                                                    <div class="extended-header__subtitle-container">
                                                        <ul class="horizontal-items horizontal-items--small">
                                                            <li class="cmpt-course__courseType">
                                                                
                                                            </li>

                                                            <li class="cmpt-lecture-group__lecturer">
                                                                
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </header>
                                    </div>

                                    <div class="course-section__details-container">
                                        <article class="descripted-label">
                                            <header class="descripted-label__header">
                                                Termin, miejsce
                                            </header>

                                            <div class="descripted-label__content">
                                                <span class="cmpt-lecture-group__dayOfWeekName"></span> <span class="cmpt-lecture-group__start"></span>-<span class="cmpt-lecture-group__end"></span>, <span class="cmpt-lecture-group__room"></span>
                                            </div>
                                        </article>
                                    </div>
                                </div>

                                <div class="course-section__row course-section__row--bottom">
                                    <div class="course-section__main-container">
                                        <section class="simple-table simple-table--with-indent">
                                            <div class="simple-table__row">
                                                <div class="simple-table-row">
                                                    <div class="simple-table-row__cell simple-table-row__cell--title">
                                                        Punkty ECTS:
                                                    </div>

                                                    <div class="simple-table-row__cell cmpt-course__ects">
                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="simple-table__row">
                                                <div class="simple-table-row">
                                                    <div class="simple-table-row__cell simple-table-row__cell--title">
                                                        Godziny ZZU:
                                                    </div>

                                                    <div class="simple-table-row__cell cmpt-course__zzu">
                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="simple-table__row">
                                                <div class="simple-table-row">
                                                    <div class="simple-table-row__cell simple-table-row__cell--title">
                                                        Kod kursu:
                                                    </div>

                                                    <div class="simple-table-row__cell cmpt-lecture-group__code">
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div class="course-section__details-container">
                                        <article class="descripted-label">
                                            <header class="descripted-label__header">
                                                Liczba miejsc
                                            </header>

                                            <div class="descripted-label__content">
                                                <span class="cmpt-lecture-group__takenSeats"></span>/<span class="cmpt-lecture-group__allSeats"></span>
                                            </div>
                                        </article>

                                        <div class="course-section__subrow">
                                            <button class="button button--flat cmpt-course__button cmpt-lecture-group__button" type="button" data-group-id="${component.getID()}">
                                                <div class="button__wrapper">
                                                    <div class="button__inner">
                                                        Zapisz
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>`;

            } else {
                return `<article class="schedule-item cmpt-lecture-group" data-component-id="${component.getID()}">
                            <div class="schedule-item__inner">
                                <header class="schedule-item__header">
                                    <div class="schedule-item__title-container">
                                        <h4 class="tiny-title cmpt-lecture-group__name"></h4>
                                    </div>

                                    <div class="schedule-item__place-container">
                                        <div class="text text--tiny text--compact cmpt-lecture-group__room">
                                            <ul class="plain-list">
                                                <li>D-20</li>
                                                <li>s. 30</li>
                                            </ul>
                                        </div>
                                    </div>
                                </header>

                                <div class="schedule-item__row">
                                    <div class="schedule-item__row-item">
                                        <div class="person-label cmpt-lecture-group__lecturer">
                                            <span class="person-label__title">
                                                Dr inż.
                                            </span>

                                            <span class="person-label__name">
                                                
                                            </span>
                                        </div>
                                    </div>

                                    <div class="schedule-item__row-item">
                                        <div class="classes-symbol cmpt-lecture-group__courseSymbol">
                                            W
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>`;
            }
        }
    },
    function(json) {
        let result = [];

        return {
            id: json.id,
            values: {
                code: json.code,
                lecturer: json.lecturer,
                dayOfWeek: json.dayOfWeek,
                start: json.start,
                end: json.end,
                room: json.room,
                takenSeats: json.takenSeats,
                allSeats: json.allSeats,
                enrolled: json.enrolled
            },
            subcomponents: {}
        };
    }
);

var PageHeader = new Hawk.Component('cmpt-page-header', {
        title: "",
        firstSubtitle: "",
        secondSubtitle: ""
    },
    {
    },
    {
        methods: {
            checkSecondSubtitle: function(component) {
                var secondSubtitleContainer = component.getElement('secondSubtitleContainer');

                if (component.get('secondSubtitle').length > 0) {
                    secondSubtitleContainer.show();
                } else {
                    secondSubtitleContainer.hide();
                }
            }
        }
    }
);

AppComponentManagers.FieldOfStudy = new Hawk.ComponentsManager(AppComponents.FieldOfStudy, 'cmpt-field-of-study-components', {
    parseComponent: function(thisthat, component) {
        var result = "";

        result += "<div class=\"spectacular-table__row\">";
        result += thisthat.getHTML(component);
        result += "</div>";

        return result;
    },
    callback: function(component) {
        var button = component.getElement('button');

        button.click(function() {
            EnrollmentManager.fieldOfStudy = component;

            PageHeader.update('firstSubtitle', component.get('name'));
            PageHeader.update('secondSubtitle', component.get('specialization'));

            var semesters = EnrollmentManager.fieldOfStudy.getAllSubcomponents('semesters');

            AppComponentManagers.Semester.parseComponents(semesters);

            EnrollmentManager.fieldsOfStudyContainer.velocity("slideUp");
            EnrollmentManager.semestersContainer.velocity("slideDown");
        });
    }
});

AppComponentManagers.Semester = new Hawk.ComponentsManager(AppComponents.Semester, 'cmpt-semester-components', {
    parseComponent: function(thisthat, component) {
        var result = "";

        result += "<div class=\"spectacular-table__row\">";
        result += thisthat.getHTML(component);
        result += "</div>";

        return result;
    },
    callback: function(component) {
        var container = component.getContainer();

        container.click(function() {
            EnrollmentManager.semester = component;

            AppComponents.Semester.updateAll('active', 0);

            component.update('active', 1);

            requestsManager.post("/api/enrollment-service/student-registrations?registeredId=" + EnrollmentManager.fieldOfStudy.get('registeredId') + "&semesterId=" + component.getID(), {
                //token: localStorage.token
                }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                onSuccess: function(result) {
                    AppComponentManagers.Registration.parseItems(result, {});
                }
            });

            EnrollmentManager.registrationsContainer.velocity("slideDown");

            Hawk.scrollToElement({ anchor: "#registrations-anchor" });
        });
    }
});

AppComponentManagers.Registration = new Hawk.ComponentsManager(AppComponents.Registration, 'cmpt-registration-components', {
    parseComponent: function(thisthat, component) {
        var result = "";

        result += "<div class=\"spectacular-table__row\">";
        result += thisthat.getHTML(component);
        result += "</div>";

        return result;
    },
    callback: function(component) {
        var button = component.getElement('button');

        button.click(function() {
            EnrollmentManager.registration = component;

            AppComponents.Registration.updateAll('active', 0);

            component.update('active', 1);

            requestsManager.post("/api/enrollment-service/student-registrations/" + component.getID() + "/courses", {
               // token: localStorage.token
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                onSuccess: function(result) {
                    EnrollmentManager.coursesContainer.find('.bookmarks-manager__content').html('');
                    EnrollmentManager.coursesContainer.velocity("slideDown");

                    console.log();

                    AppComponentManagers.Course.parseItems(result.courses, {});



                }
            });
        });
    }
});

AppComponentManagers.Course = new Hawk.ComponentsManager(AppComponents.Course, 'cmpt-course-components', {
    parseComponent: function(thisthat, component) {
        var result = "";

        result += "<li class=\"bookmarks-manager__bookmark-container\">";
        result += thisthat.getHTML(component);
        result += "</li>";

        return result;
    },
    callback: function(component) {

    },
    generalCallback: function(components) {
        var groups;

        for (var i in components) {
            var current = components[i];
            groups = current.getAllSubcomponents('groups');

            console.log(current);

            for (var j in groups) {
                var currentGroup = groups[j];

                if (currentGroup.get('enrolled') == 1) {
                    console.log(AppComponents.LectureGroup.getInstance(currentGroup.getID()));
                    Schedule.putGroup(AppComponents.LectureGroup.getInstance(currentGroup.getID()));

                    console.log("ZAPISANY: " + currentGroup.get('start'));
                }

                current.placeSubcomponent('groups', currentGroup, "<li>" + AppComponents.LectureGroup.getHTML(currentGroup, 'list') + "</li>");

                var button = currentGroup.getElement('button');
                button.click(function() {
                    console.log(currentGroup.getID());

                    var groupID = $(this).attr('data-group-id');
                    var courseID = $(this).attr('data-course-id');

                    var lectureGroup = AppComponents.LectureGroup.getInstance(groupID);
                    var course = AppComponents.Course.getInstance(courseID);

                    console.log(groupID);

                    if (lectureGroup.get('enrolled') == 1) {
                        requestsManager.post("/api/enrollment-service/student-registrations/" + EnrollmentManager.registration.getID() + "/enrollment/" + groupID, {
                            //token: localStorage.token
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem('token')
                            },
                            onSuccess: function (result) {

                                lectureGroup.update('enrolled', false);
                                lectureGroup.update('takenSeats', result.takenSeats);

                                course.update('enrolled', false);

                                Schedule.removeGroup(lectureGroup);

                                EnrollmentManager.semester.update('pointsECTS', parseInt(EnrollmentManager.semester.get('pointsECTS')) - course.get('ects'));
                                EnrollmentManager.semester.update('hoursZZU', parseInt(EnrollmentManager.semester.get('hoursZZU')) - course.get('zzu'));
                            }
                        });
                    } else {
                        requestsManager.post("/api/student-registrations/" + EnrollmentManager.registration.getID() + "/enroll", {
                            groupID: parseInt(groupID)
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem('token')
                            },
                            onSuccess: function (result) {

                                lectureGroup.update('enrolled', true);
                                lectureGroup.update('takenSeats', result.takenSeats);

                                course.update('enrolled', true);

                                Schedule.putGroup(lectureGroup);

                                EnrollmentManager.semester.update('pointsECTS', parseInt(EnrollmentManager.semester.get('pointsECTS')) + course.get('ects'));
                                EnrollmentManager.semester.update('hoursZZU', parseInt(EnrollmentManager.semester.get('hoursZZU')) + course.get('zzu'));
                            }
                        });
                    }

                });
            }

            current.refreshView();
        }

        EnrollmentManager.coursesBookmarks = new Hawk.BookmarksManager($('#courses-bookmarks'), {
            activeBookmarkClass: 'common-bookmark--active'
        });
        EnrollmentManager.coursesBookmarks.run();
    }
});

