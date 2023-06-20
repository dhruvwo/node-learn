const Contact = require("../models/Contact");

exports.getAllContacts = (req, res) => {
  Contact.find()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getContactById = (req, res) => {
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

exports.createContact = (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
  });

  contact
    .save()
    .then((createdContact) => {
      res.status(201).json(createdContact);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.updateContact = (req, res) => {
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

exports.deleteContact = (req, res) => {
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
