import { useEffect, useState } from "react";

export default function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  if (!token) {
    return <h3>Please login again</h3>;
  }


  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("TASK ERROR:", data);
        return;
      }

      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    try {
      const res = await fetch("http://localhost:5000/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: "Created from frontend",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTitle("");
        fetchTasks();
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

 
  const deleteTask = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

 
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>

      <div style={styles.addBox}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.map((t) => (
        <div key={t._id} style={styles.card}>
          <h4>{t.title}</h4>
          <button onClick={() => deleteTask(t._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { width: "500px", margin: "40px auto" },
  logout: { background: "red", color: "white", padding: "5px" },
  addBox: { display: "flex", gap: "10px", marginBottom: "20px" },
  card: {
    padding: "10px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
};
