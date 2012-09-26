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
            }
        }
    ); //Backbone.Model.extend end


    // The collection of contacts

    var ContactCollection = Backbone.Collection.extend(
        {
            model: Contact,
            localStorage: new Backbone.LocalStorage("phone-backbone"),

            comparator: function (contact) {
                return contact.get("name");
            }
        }
    );


    /**********************************************************************************
     **                     Views
     **********************************************************************************/
    var ContactListView = Backbone.View.extend(
        {
            el: $("#contact-list-block"), // DOM element with contact list


            template: _.template($('#contact-list-template').html()) ,

            initialize: function() {
                this.model.on('change', this.render, this);
               // this.model.on('destroy', this.remove, this);
            },

            events: {
                "click .entry": "openContact"
            },


            render: function(){
                $(this.el).html(this.template({contact : this.model.toJSON()}));
                return this;
            } ,

            openContact: function(e){

                e.preventDefault();
                var id = $(e.currentTarget).data("id");
                var item = this.model.get(id);
                var contactView = new ContactDetailsView({model: item});
                contactView.render();
            }
        }
    );


    var ContactDetailsView = Backbone.View.extend(
        {
            el: $("#contact-details-block"), // DOM element with contact details

            template: _.template($('#contact-details-template').html()) ,

            render: function(){
                $(this.el).html(this.template({contact : this.model.toJSON()}));
                return this;
            }
        }
    );



    //TEST INIT
    var testCollection = new ContactCollection();


    var contactView = new ContactListView({model: testCollection});

    testCollection.create({
        name:"John Smith",
        phone:"1444 1231 1231",
        email:"john@smith.com"
    });

    testCollection.create({
        name:"Alison Burgers",
        phone:"222 3333 543",
        email:"alison@burgers.com"
    });

})