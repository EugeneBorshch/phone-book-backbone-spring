/**
 * Created with IntelliJ IDEA.
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
                    name:"No name no cry",
                    email:"No email no cry",
                    phone:"No phone no cry"
                };
            },

            validation:{
                name:{
                    required:true,
                    msg:'Please enter a name'
                },
                phone:{
                    required:true,
                    pattern:'number',
                    msg:'Please enter a valid phone number'
                },
                email:{
                    pattern:'email',
                    msg:'Please enter a valid email'
                }
            }
        }
    ); //Backbone.Model.extend end


    // The collection of contacts

    var ContactCollection = Backbone.Collection.extend(
        {
            model:Contact,
            localStorage:new Backbone.LocalStorage("phone-backbone"),

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
                this.model.on('change', this.render, this);
                // this.model.on('destroy', this.remove, this);
            },

            events:{
                "click .entry":"openContact"
            },


            render:function () {
                $(this.el).html(this.template({contact:this.model.toJSON()}));
                return this;
            },

            openContact:function (e) {

                e.preventDefault();
                var id = $(e.currentTarget).data("id");
                var item = this.model.get(id);
                var contactView = new ContactDetailsView({model:item});
                contactView.render();
            }
        }
    );


    var ContactDetailsView = Backbone.View.extend(
        {
            el:$("#contact-details-block"), // DOM element with contact details


            template:_.template($('#contact-details-template').html()),

            events:{
                "blur input":"updateContact"
            },

            render:function () {
                $(this.el).html(this.template({contact:this.model.toJSON()}));

                Backbone.Validation.bind(this, {
                    valid:function (view, attr) {
                        var control;
                        if (attr == 'name')
                            control = $('#inputName');
                        var control;
                        if (attr == 'phone')
                            control = $('#inputPhone');
                        var control;
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
                        var control;
                        if (attr == 'phone')
                            control = $('#inputPhone');
                        var control;
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
                 console.log(this.model.toJSON());
                this.model.save({name:newName, phone:newPhone, email:newEmail });

            }
        }
    );

    /**********************************************************************************
     **                     Router
     **********************************************************************************/



//    var Controller = Backbone.Router.extend({
//        routes: {
//            "": "list",
//            "!/": "list",
//            "!/add": "add"
//        },
//
//        start: function () {
//            $(".block").hide();
//            $("#start").show();
//        },
//
//        success: function () {
//            $(".block").hide();
//            $("#success").show();
//        }
//
//
//    });

   // var controller = new Controller();

   // Backbone.history.start();
    //TEST INIT
    var testCollection = new ContactCollection();


    var contactView = new ContactListView({model:testCollection});

    testCollection.create({
        name:"John Smith",
        phone:"144412311231",
        email:"john@smith.com"
    });

    testCollection.create({
        name:"Alison Burgers",
        phone:"2223333543",
        email:"alison@burgers.com"
    });

    testCollection.create({
        name:"Ben Roonie",
        phone:"4444444",
        email:"ben@roonie.com"
    });

});