
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api/complaints";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "General",
    subject: "",
    description: "",
  });

  async function loadComplaints() {
    try {
      const response = await fetch(API);
      if (!response.ok) {
  const errorText = await response.text();
  throw new Error(errorText || `HTTP error: ${response.status}`);
}
      setComplaints(await response.json());
    } catch (error){
       setMessage("Submission failed: " + error.message);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitComplaint(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed");

      setForm({
        name: "",
        email: "",
        category: "General",
        subject: "",
        description: "",
      });

      setMessage("Complaint submitted successfully!");
      await loadComplaints();
    } catch {
      setMessage("Submission failed. Check your backend.");
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Online Complaints System</h1>
        <p>We listen. We resolve. We improve.</p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Submit a Complaint</h2>

          <form onSubmit={submitComplaint}>
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter your full name"
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Enter your email"
            />

            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>General</option>
              <option>Academic</option>
              <option>Technical</option>
              <option>Infrastructure</option>
              <option>Other</option>
            </select>

            <label>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Complaint subject"
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={3000}
              rows={5}
              placeholder="Describe your complaint"
            />

            <button type="submit">Submit Complaint</button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="panel">
          <h2>All Complaints</h2>
          <p>Total complaints: {complaints.length}</p>

          {complaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            complaints.map((c) => (
              <article className="complaint" key={c.id}>
                <h3>#{c.id} — {c.subject}</h3>
                <p><b>Name:</b> {c.name}</p>
                <p><b>Category:</b> {c.category}</p>
                <p><b>Description:</b> {c.description}</p>
                <p><b>Status:</b> {c.status}</p>
              </article>
            ))
          )}
        </section>
      </main>

      <footer>Online Complaints Management System</footer>
    </div>
  );
}

export default App;
