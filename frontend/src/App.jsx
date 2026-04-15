import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (token) {
    return <Dashboard setToken={setToken} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Task Manager</h2>

      <button onClick={() => setPage("login")}>Login</button>
      <button onClick={() => setPage("register")}>Register</button>

      {page === "login" ? (
        <Login setToken={setToken} />
      ) : (
        <Register setPage={setPage} />
      )}
    </div>
  );
}

export default App;