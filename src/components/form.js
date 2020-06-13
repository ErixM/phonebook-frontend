import React from "react";

const AddPersonForm = ({
  addContact,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addContact}>
      <div>
        name:{" "}
        <input
          placeholder="name here"
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number:{" "}
        <input
          placeholder="number here"
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <button onClick={addContact} type="submit">
        add
      </button>
    </form>
  );
};
export default AddPersonForm;
