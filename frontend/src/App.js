import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    deadline: "",
    skillRequired: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check server status by sending a request
        const checkServerStatus = await axios.get("http://localhost:5000/api/team-members");
        
        if (checkServerStatus.status === 200) {
          const teamMembersResponse = await axios.get("http://localhost:5000/api/team-members");
          setTeamMembers(teamMembersResponse.data);
  
          const ticketsResponse = await axios.get("http://localhost:5000/api/tickets");
          setTickets(ticketsResponse.data);
        } else {
          console.error("Server status is not OK. Status code:", checkServerStatus.status);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };
  
    fetchData();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/tickets", newTicket)
      .then((response) => {
        setTickets([...tickets, response.data]);
        setNewTicket({ title: "", description: "", deadline: "", skillRequired: "" });
      })
      .catch((error) => console.error("Error creating the ticket:", error));
  };

  return (
    <div className="App">
      <h1>Ticket Assignment System</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={newTicket.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={newTicket.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Deadline:</label>
          <input type="date" name="deadline" value={newTicket.deadline} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Required Skill:</label>
          <select name="skillRequired" value={newTicket.skillRequired} onChange={handleInputChange} required>
            <option value="">Select Skill</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="design">Design</option>
          </select>
        </div>
        <button type="submit" className="create-button">Create Ticket</button>
      </form>

      <h2>Ticket List</h2>
      <ul>
        {tickets && tickets.map((ticket) => (
          <li key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p><strong>Deadline:</strong> {ticket.deadline}</p>
            <p><strong>Assigned to:</strong> {ticket.assignedTo || "Unassigned"}</p>
            <p><strong>Status:</strong> {ticket.status || "Pending"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
