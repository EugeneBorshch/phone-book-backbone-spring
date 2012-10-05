/**
 * Phonebook backbone application
 *\
 * User: EBorshch
 */

//Load application with JQuery when DOM is ready
$(function () {

    /**********************************************************************************
     **                     Models
     **********************************************************************************/
    var Contact = Backbone.Model.extend(
        {
            // Default attributes for the Contact item
            defaults:function () {
                return {
                    name:"",
                    email:"",
                    phone:""
                };
            },

            validation:{
                name:{
                    minLength:5,
                    msg:'Please enter a name'
                },
                phone:{
                    minLength:5,
                    pattern:'number',
                    msg:'Please enter a valid phone number'
                },
                email:{
                    pattern:'email',
                    minLength:5,
                    msg:'Please enter a valid email'
                }
            }
        }
    ); //Backbone.Model.extend end


    // The collection of contacts
    var ContactCollection = Backbone.Collection.extend(
        {
            model:Contact,
            url:"/contacts/",

            comparator:function (contact) {
                return contact.get("name");
            }
        }
    );


    /**********************************************************************************
     **                     Views
     **********************************************************************************/
    var ContactListView = Backbone.View.extend(
        {
            el:$("#contact-list-block"), // DOM element with contact list

            template:_.template($('#contact-list-template').html()),

            initialize:function () {
                this.model.on('all', this.render, this);
            },

            render:function () {
                $(this.el).html(this.template({contact:this.model.toJSON()}));
                return this;
            }

        }
    );


    var ContactDetailsView = Backbone.View.extend(
        {
            el:$("#contact-details-block"), // DOM element with contact details

            template:_.template($('#contact-details-template').html()),

            events:{
                "click  #form-btn":"updateContact",
                "click  #form-btn-remove":"deleteContact"
            },

            render:function () {
                $(this.el).html(this.template({
                    contact:this.model.toJSON()
                }));

                if (this.model.isNew()) {
                    $("#form-btn-remove").addClass("disabled");
                }

                Backbone.Validation.bind(this, {
                    valid:function (view, attr) {

                        var control;
                        if (attr == 'name')
                            control = $('#inputName');
                        if (attr == 'phone')
                            control = $('#inputPhone');
                        if (attr == 'email')
                            control = $('#inputEmail');
                        if (control != undefined) {
                            var group = control.parents(".control-group");
                            group.removeClass("error");
                        }
                    },
                    invalid:function (view, attr, error, selector) {
                        var control;
                        if (attr == 'name')
                            control = $('#inputName');
                        if (attr == 'phone')
                            control = $('#inputPhone');
                        if (attr == 'email')
                            control = $('#inputEmail');
                        if (control != undefined) {
                            var group = control.parents(".control-group");
                            group.addClass("error");
                        }

                    }
                });
                return this;
            },

            updateContact:function (e) {
                e.preventDefault();
                var newName = this.$("#inputName").val();
                var newPhone = this.$("#inputPhone").val();
                var newEmail = this.$("#inputEmail").val();

                var success = this.model.set({name:newName, phone:newPhone, email:newEmail});
                if (success) {
                    if (this.model.isNew()) {
                        contactCollection.create(this.model, {wait:true});
                    }
                    else {
                        this.model.save({}, {wait:true});
                    }
                    controller.navigate("", {trigger:true});
                }
            },

            deleteContact:function (e) {
                e.preventDefault();
                if (!this.model.isNew()) {
                    this.model.destroy({wait:true});
                    contactCollection.remove(this.model);
                    controller.navigate("", {trigger:true})
                }
            },

            //kill zombie views
            //http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
            close:function () {
                $(this.el).unbind();
                $(this.el).empty();
            }
        }
    );

    /**********************************************************************************
     **                     Router
     **********************************************************************************/
    var Controller = Backbone.Router.extend({
        routes:{
            "":"list",
            "!/":"list",
            "!/contact/:id":"details",
            "!/add":"add"
        },

        list:function () {
            if (this.contactView) {
                this.contactView.close();
            }

            if (contactCollection) {
                contactCollection.fetch();
            }

        },

        details:function (id) {
            var item = contactCollection.get(id);
            if (!item) {

                contactCollection.fetch({success:function () {
                    item = contactCollection.get(id);

                    if (this.contactView) {
                        this.contactView.close();
                    }

                    this.contactView = new ContactDetailsView({model:item});
                    this.contactView.render();

                }});


            } else {
                if (this.contactView) {
                    this.contactView.close();
                }

                this.contactView = new ContactDetailsView({model:item});
                this.contactView.render();

            }

        },

        add:function () {
            var item = new Contact();
            if (this.contactView) {
                this.contactView.close();
            }

            this.contactView = new ContactDetailsView({model:item});
            this.contactView.render();
        }
    });

    var contactCollection = new ContactCollection();
    contactCollection.reset(contactCollection.toJSON());

    var contactListView = new ContactListView({model:contactCollection});
    contactListView.render();

    var controller = new Controller();

    Backbone.history.start();
});