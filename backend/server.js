const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tickets = [];
let currentId = 1;

const teamMembers = [
  { id: 1, name: "Alice", skills: ["frontend", "design"] },
  { id: 2, name: "Bob", skills: ["backend", "api"] },
  { id: 3, name: "Charlie", skills: ["frontend", "backend"] }
];

// Get all team members
app.get("/api/team-members", (req, res) => {
  res.json(teamMembers);
});

// Create a new ticket and assign it
app.post("/api/tickets", (req, res) => {
  const { title, description, deadline, skillRequired } = req.body;
  const assignedTo = assignTicket(skillRequired);
  if (!assignedTo) {
    return res.status(400).json({ error: "No team member with required skill." });
  }

  const newTicket = {
    id: currentId++,
    title,
    description,
    deadline,
    assignedTo: assignedTo.name,
    status: "Open"
  };
  
  tickets.push(newTicket);
  res.json(newTicket);
});

// Get all tickets
app.get("/api/tickets", (req, res) => {
  res.json(tickets);
});

// Function to assign a ticket based on required skills
function assignTicket(skillRequired) {
  for (const member of teamMembers) {
    if (member.skills.includes(skillRequired)) {
      return member;
    }
  }
  return null;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});