const Contact = require("../models/Contact");

// Get all contacts
exports.getAllContacts = (req, res) => {
  // Retrieve and return all contacts from the database
  Contact.find()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get a single contact by ID
exports.getContactById = (req, res) => {
  // Retrieve and return a contact by ID from the database
  Contact.findById(req.params.id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Create a new contact
exports.createContact = (req, res) => {
  // Create a new contact using the request body
  const contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    // Add more contact properties as needed
  });

  // Save the contact to the database
  contact
    .save()
    .then((createdContact) => {
      res.status(201).json(createdContact);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

// Update a contact by ID
exports.updateContact = (req, res) => {
  // Find and update a contact by ID in the database
  Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(updatedContact);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

// Delete a contact by ID
exports.deleteContact = (req, res) => {
  // Find and delete a contact by ID from the database
  Contact.findByIdAndDelete(req.params.id)
    .then((deletedContact) => {
      if (!deletedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({ message: "Contact deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
