 Hawk.AjaxRequestsController = function() {
    this.requestLinks;

    this.operations = {};

    this.registerOperation = function(options) {
        this.operations[options.name] = options;

        return this;
    };

    this.sendRequest = function(generalData, moduleData) {
        var that = this;

        var data = Hawk.mergeWholeObjects(generalData, moduleData);

        console.log(data);

        $.ajax({
            type: "POST",
            //url: "/ajax.php",
            url: '/ajax/request',
            dataType: "json",
            data: data,
            success: function(result) {
                console.log(result);

                that.operations[result.operation].callback(result);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            },
            complete: function() {
                //spinner.hide();
            }
        });

        return this;
    }

    this.refreshDependencies = function() {
        var that = this;

        this.requestLinks = $('.ajax-request-button');

        this.requestLinks.unbind('click').click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var operation = $(this).attr('data-operation');

            var data = that.operations[operation].collectData($(this));

            that.sendRequest({ operation: operation }, data);
        });
    }

    this.run = function() {
        this.refreshDependencies();
    }
}