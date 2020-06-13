import React from "react";

const Persons = ({ persons, removeFunction }) =>
  persons.map((person) => (
    <div key={person.name}>
      {person.name} {person.number}
      <button
        style={{
          borderRadius: "4px",
          paddingTop: "2px",
          margin: "2px",
          border: "2px solid blue",
          background: "pink",
        }}
        onClick={() => removeFunction(person.id)}
      >
        Delete
      </button>
    </div>
  ));
export default Persons;
