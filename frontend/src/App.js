import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const serverURL = "http://45.61.166.8:5000/api/";
function App() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    deadline: "",
    skillRequired: "",
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const teamMembersResponse = await axios.get(`${serverURL}team-members`);
        if (checkServerStatus.status === 200) {
          setTeamMembers(teamMembersResponse.data);
        } else {
          console.error(
            "Server status is not OK. Status code:",
            checkServerStatus.status
          );
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };

    const fetchTicketData = async () => {
      try {
        const ticketsResponse = await axios.get(`${serverURL}tickets`);
        if (ticketsResponse.status === 200) {
          setTickets(ticketsResponse.data);
        } else {
          console.error(
            "Server status is not OK. Status code:",
            checkServerStatus.status
          );
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };

    fetchMemberData();
    fetchTicketData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${serverURL}tickets`, newTicket)
      .then((response) => {
        setTickets([...tickets, response.data]);
        setNewTicket({
          title: "",
          description: "",
          deadline: "",
          skillRequired: "",
        });
      })
      .catch((error) => console.error("Error creating the ticket:", error));
  };

  return (
    <div className="App">
      <h1>Ticket Assignment System</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newTicket.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newTicket.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={newTicket.deadline}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Required Skill:</label>
          <select
            name="skillRequired"
            value={newTicket.skillRequired}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Skill</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="design">Design</option>
          </select>
        </div>
        <button type="submit" className="create-button">
          Create Ticket
        </button>
      </form>

      <h2>Ticket List</h2>
      <ul>
        {tickets &&
          tickets.map((ticket) => (
            <li key={ticket.id}>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p>
                <strong>Deadline:</strong> {ticket.deadline}
              </p>
              <p>
                <strong>Assigned to:</strong>{" "}
                {ticket.assignedTo || "Unassigned"}
              </p>
              <p>
                <strong>Status:</strong> {ticket.status || "Pending"}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
