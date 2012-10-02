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


    @RequestMapping(method= RequestMethod.GET, value="/contacts")
    public @ResponseBody List<Contact> getContacts() {
        System.out.println("get all contacts");
        return new ArrayList<Contact>((Collection<? extends Contact>) repository.findAll());
    }

    @RequestMapping(method=RequestMethod.GET, value="/contacts/{id}")
    public @ResponseBody  Contact getContact(@PathVariable Integer id) {
        System.out.println("get contact "+id);
        return repository.findOne(id);
    }

    @RequestMapping(method=RequestMethod.POST, value="/contacts")
    public @ResponseBody Contact addContact(@RequestBody Contact contact) {
        System.out.println("add contact "+contact);
        repository.save(contact);
        return contact;
    }

    @RequestMapping(method=RequestMethod.PUT, value="/contacts/{id}")
    public @ResponseBody Contact updateContact(
            @RequestBody Contact contact, @PathVariable String id) {
        System.out.println("update contact " +contact);
        repository.save(contact);
        return contact;
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/contacts/{id}")
    public @ResponseBody void deleteContact(@PathVariable String id) {
        System.out.println("delete contact "+id);
        repository.delete(Integer.parseInt(id));
    }


    @PostConstruct
    public void init() {
        System.out.println("init test data");
        Contact c =new Contact();
        c.setName("Indiana Jons");
        c.setPhone("23423453");
        c.setEmail("indiana@jones.com");
        repository.save(c);
    }

}
