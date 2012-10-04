package com.eugeneborshch.controller;

import com.eugeneborshch.model.Contact;
import com.eugeneborshch.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Spring MVC controller to serve Contacts.
 * <p/>
 * User: Eugene Borshch
 */


@Controller
public class ContactsController {

    @Autowired
    private ContactRepository repository;


    @RequestMapping(method= RequestMethod.GET, value="")
    public @ResponseBody List<Contact> getContacts() {
        return new ArrayList<Contact>((Collection<? extends Contact>) repository.findAll());
    }

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody  Contact getContact(@PathVariable Integer id) {
        return repository.findOne(id);
    }

    @RequestMapping(method=RequestMethod.POST, value="")
    public @ResponseBody Contact addContact(@RequestBody Contact contact) {
        System.out.println("add contact "+contact);
        repository.save(contact);
        return contact;
    }

    @RequestMapping(method=RequestMethod.PUT, value="{id}")
    public @ResponseBody Contact updateContact(
            @RequestBody Contact contact, @PathVariable String id) {
        repository.save(contact);
        return contact;
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody void deleteContact(@PathVariable String id) {
        repository.delete(Integer.parseInt(id));
    }


    @PostConstruct
    public void init() {
        System.out.println("init test data");
        Contact c = new Contact();
        c.setName("Indiana Jons");
        c.setPhone("11111111");
        c.setEmail("indiana@jones.com");
        repository.save(c);


        c = new Contact();
        c.setName("Hans Solo");
        c.setPhone("333333333");
        c.setEmail("hans@solo.com");
        repository.save(c);


        c = new Contact();
        c.setName("Rick Deckard");
        c.setPhone("222222222");
        c.setEmail("rick@deckard.com");
        repository.save(c);
    }

}
