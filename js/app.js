var backlog = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (backlog[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    backlog[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

backlog.Router = Backbone.Router.extend({

    routes: {
        "":                 "home"
        ,"contact":          "contact"
        // ,"employees/:id":    "employeeDetails"
    },

    initialize: function () {
        backlog.shellView = new backlog.ShellView();
        $('body').html(backlog.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!backlog.homelView) {
            backlog.homelView = new backlog.HomeView();
            backlog.homelView.render();
        } else {
            console.log('reusing home view');
            backlog.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(backlog.homelView.el);
        backlog.shellView.selectMenuItem('home-menu');
    },

    contact: function () {
        if (!backlog.contactView) {
            backlog.contactView = new backlog.ContactView();
            backlog.contactView.render();
        }
        this.$content.html(backlog.contactView.el);
        backlog.shellView.selectMenuItem('contact-menu');
    },

	/*
    employeeDetails: function (id) {
        var employee = new backlog.Employee({id: id});
        var self = this;
        backlog.fetch({
            success: function (data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                self.$content.html(new backlog.EmployeeView({model: data}).render().el);
            }
        });
        backlog.shellView.selectMenuItem();
    }
	*/
});

$(document).on("ready", function () {
    backlog.loadTemplates(["HomeView", "ShellView", "ContactView"],
        function () {
            backlog.router = new backlog.Router();
            Backbone.history.start();
        });
});
