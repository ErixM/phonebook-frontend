import React, { useState, useEffect } from "react";
import Filter from "./components/filter";
import AddPersonForm from "./components/form";
import Persons from "./components/persons";
import axiFunctions from "./services/axiFunctions";
import Notification from "./components/notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const clearErrorMessage = () => {
    return setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };
  const clearSuccessMessage = () => {
    return setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const deleteIsConfirmed = (personToDelete) =>
    window.confirm(`Are you sure you want to delete ${personToDelete.name}?`);

  useEffect(() => {
    axiFunctions.getAllPersons().then((returnedPersons) => {
      setFiltered(returnedPersons);
      setPersons(returnedPersons);
    });
  }, []);

  const addContact = (contact) => {
    axiFunctions
      .createPerson(contact)
      .then((contact) => {
        setFiltered(persons.concat(contact));
        setPersons(persons.concat(contact));
        setSuccessMessage(`${contact.name}'s number added correctly`);
        clearSuccessMessage();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    setNewName("");
    setNewNumber("");
  };
  const updateContact = (contact) => {
    const personToUpdate = filtered.find((person) => person.name === newName);
    axiFunctions
      .updatePerson(personToUpdate.id, contact)
      .then(() => {
        axiFunctions
          .getAllPersons()
          .then((response) => {
            setFiltered(response);
            setSuccessMessage(`${newName} number updated correctly`);
            clearSuccessMessage();
          })
          .catch(() => {
            setErrorMessage(
              `Couldn't update ${personToUpdate.name} because it has already been deleted`
            );
            clearErrorMessage();
          });
      })
      .catch((error) => {
        setErrorMessage(`${JSON.stringify(error.response.data)}`);
        clearErrorMessage();
      });
    setNewName("");
    setNewNumber("");
  };
  const addOrUpdate = (event) => {
    event.preventDefault();
    const contact = {
      name: newName,
      number: newNumber,
    };
    const wantToUpdate = () =>
      window.confirm(
        `${contact.name} already added on the phonebook, do you want to update it?`
      );

    if (!contact.number) {
      setErrorMessage("Please insert a number!");
      clearErrorMessage();
    } else if (contact.name.length < 3) {
      setErrorMessage("Minimum required name length is 3!");
      clearErrorMessage();
    } else if (contact.number.length < 8) {
      setErrorMessage("Minimum required number length is 8!");
      clearErrorMessage();
    } else if (
      persons.some(
        (person) => person.name.toUpperCase() === newName.toUpperCase()
      ) &&
      wantToUpdate()
    ) {
      updateContact(contact);
    } else {
      addContact(contact);
    }
  };
  const removeContact = (id) => {
    const personToDelete = filtered.find((person) => person.id === id);
    if (deleteIsConfirmed(personToDelete)) {
      axiFunctions
        .deletePerson(personToDelete.id)
        .then(() => {
          setFiltered(filtered.filter((person) => person.id !== id));
          setPersons(filtered.filter((person) => person.id !== id));
          setErrorMessage(`"${personToDelete.name}" deleted!`);
          clearErrorMessage();
        })
        .catch(() => {
          setErrorMessage(
            ` Couldn't delete ${personToDelete.name} as it has already been deleted`
          );
          clearErrorMessage();
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };
  const filterContacts = (e) => {
    setFiltered(
      persons.filter((person) =>
        person.name.toUpperCase().includes(e.target.value.toUpperCase())
      )
    );
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Notification message={successMessage} type={"success"} />
      <Notification message={errorMessage} type={"error"} />
      <Filter filterHandler={filterContacts} />
      <AddPersonForm
        addContact={addOrUpdate}
        // addContact={addContact}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filtered} removeFunction={removeContact} />
      ...
    </>
  );
};

export default App;
