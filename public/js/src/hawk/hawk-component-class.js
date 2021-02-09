
Hawk.ComponentClass = function(classname, values, subcomponents, options, parseJSON) {
    const that = this;

    this.classname = classname;

    this.values = values;
    this.subcomponents = subcomponents;
    this.options = options;

    this.getHTML = options.getHTML || function() { return ""; };

    this.prepareJSON = options.prepareJSON || function(json) {
        return json;
    };

    this.parseJSON = parseJSON || function(json) {
        return {
            id: -1,
            values: {},
            subcomponents: {}
        };
    };

    this.instances = {};

    this.getOptions = function() {
        return this.options;
    }

    this.getValues = function() {
        return this.values;
    }

    this.newInstance = function(id, values, subcomponents) {
        //if (!this.instanceExists(id)) {
            let certainValues = this.getValues();

            if (typeof values != 'undefined') {
                certainValues = this.parseValues(values);
            }

            if (typeof subcomponents == 'undefined') {
                subcomponents = this.subcomponents;
            }
            
            const instance = new Hawk.Component(this.getClassname(), certainValues, subcomponents, this.getOptions(), id);
            instance.run();
            instance.refreshView();

            this.instances[instance.getID()] = instance;

            return instance;
        // } else {
        //     return null;
        // }
    }

    this.instanceExists = function(index) {
        return typeof this.instances[index] != 'undefined';
    }

    this.parseValues = function(certainValues) {
        const resultValues = {};

        for (let i in this.values) {
            if (typeof certainValues[i] != 'undefined') {
                resultValues[i] = certainValues[i];
            }
        }

        return resultValues;
    }

    this.getInstance = function(index) {
        if (this.instanceExists(index)) {
            return this.instances[index];
        } else {
            return null;
        }
    }

    this.getInstanceFromDOM = function(id) {
        
    }

    this.getAllInstances = function() {
        return this.instances;
    }

    this.updateAll = function(key, value) {
        for (var i in this.instances) {
            this.instances[i].update(key, value);
        }
    }

    this.removeInstance = function(index) {
        if (this.instanceExists(index)) {
            const current = this.instances[index];

            current.remove();
        }
    }

    this.refreshView = function() {
        for (let i in this.instances) {
            this.instances[i].refreshView();
        }
    }

    this.createFromJSON = function(json) {
        const data = this.parseJSON(json);

        if (typeof data.id != 'undefined') {
            const values = this.parseValues(data.values);

            return this.newInstance(data.id, values, data.subcomponents);
        } else {
            return null;
        }
    }

    this.clearInstances = function() {
        this.instances = [];
    }

    this.getClassname = function() {
        return this.classname;
    }

    this.initialize = function() {
        const components = $('.' + this.getClassname());

        let currentID = -1;

        components.each(function() {
            currentID = $(this).attr(Hawk.Constants.COMPONENT_ID_ATTRIBUTE);

            if (currentID > 0) {
                that.newInstance(currentID);
            }
        });
    }
}