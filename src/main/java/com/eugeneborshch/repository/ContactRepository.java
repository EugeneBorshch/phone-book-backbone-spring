package com.eugeneborshch.repository;

import com.eugeneborshch.model.Contact;
import org.springframework.data.repository.CrudRepository;

/**
 * User: Eugene Borshch
 */
public interface ContactRepository extends CrudRepository<Contact, Integer> {
}
