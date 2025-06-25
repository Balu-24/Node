import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const fetchItems = () => {
    fetch("http://localhost:5000/items")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = () => {
    if (!newItem.trim()) return;
    fetch("http://localhost:5000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add item");
        return res.json();
      })
      .then((addedItem) => {
        setItems((prev) => [...prev, addedItem]);
        setNewItem("");
      })
      .catch((err) => setError(err.message));
  };

  const updateItem = () => {
    if (!updateId || !updateName.trim()) return;
    fetch(`http://localhost:5000/items/${updateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: updateName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update item");
        return res.json();
      })
      .then(() => {
        setUpdateId("");
        setUpdateName("");
        fetchItems();
      })
      .catch((err) => setError(err.message));
  };

  const deleteItem = () => {
    if (!deleteId) return;
    fetch(`http://localhost:5000/items/${deleteId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete item");
        return res.json();
      })
      .then(() => {
        setDeleteId("");
        fetchItems();
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Items from Backend</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.id}: {item.name}
          </li>
        ))}
      </ul>

      <br /><hr />
      <h2>Add new item</h2>
      <input
        placeholder="Enter a Name"
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Add item</button>

      <br /><hr />
      <h2>Update Item</h2>
      <input
        placeholder="Enter ID"
        type="number"
        value={updateId}
        onChange={(e) => setUpdateId(e.target.value)}
      />
      <input
        placeholder="Enter New Name"
        type="text"
        value={updateName}
        onChange={(e) => setUpdateName(e.target.value)}
      />
      <button onClick={updateItem}>Update Item</button>

      <br /><hr />
      <h2>Delete Item</h2>
      <input
        placeholder="Enter ID to Delete"
        type="number"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
      />
      <button onClick={deleteItem}>Delete Item</button>
    </div>
  );
}

export default App;
