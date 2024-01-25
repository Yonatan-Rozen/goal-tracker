import { useState } from "react";

const initialTasks = [
  {
    done: false,
    description: "set up shopify account",
    category: "Setup",
    deadline: "Mon, Mar 26, 2024",
    priority: "Medium",
  },
  {
    done: true,
    description: "build home page",
    category: "Design",
    deadline: "Thu, Mar 27, 2024",
    priority: "High",
  },
  {
    done: false,
    description: "purchase domain name",
    category: "Setup",
    deadline: "Sun, Mar 25, 2024",
    priority: "Low",
  },
];

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  function handleShowAddTaskForm() {
    setShowAddTaskForm((show) => !show);
  }

  function handleDoneUpdate(updatedTask, isDone) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.description === updatedTask.description
          ? { ...task, done: isDone }
          : task
      )
    );
  }

  function handlePriorityUpdate(updatedTask, newPriority) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.description === updatedTask.description
          ? { ...task, priority: newPriority }
          : task
      )
    );
  }

  function handleAddTask(newTask) {
    setTasks((tasks) => [...tasks, newTask]);
  }

  return (
    <div className="app">
      <div>
        <TaskTable
          tasks={tasks}
          handleDoneUpdate={handleDoneUpdate}
          handlePriorityUpdate={handlePriorityUpdate}
        />
        {showAddTaskForm && <FormAddTask onAddTask={handleAddTask} />}
        <Button onClick={handleShowAddTaskForm}>
          {showAddTaskForm ? "Close" : "Add New Task"}
        </Button>
      </div>
    </div>
  );
}

function TaskTable({ tasks, handleDoneUpdate, handlePriorityUpdate }) {
  return (
    <div className="task-table">
      <ul>
        <span>Done</span>
        <span>Description</span>
        <span>Category</span>
        <span>Deadline</span>
        <span>Priority</span>
        <span>Days Left</span>
        {tasks.map((task) => (
          <Task
            key={task.description}
            task={task}
            onDoneUpdate={handleDoneUpdate}
            onPriorityUpdate={handlePriorityUpdate}
          />
        ))}
      </ul>
    </div>
  );
}

function Task({ task, onDoneUpdate, onPriorityUpdate }) {
  const daysLeft = calculateDaysLeft(task.deadline);

  function calculateDaysLeft(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDifference = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  }

  return (
    <>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => onDoneUpdate(task, !task.done)}
      />
      <span>{task.description}</span>
      <span>{task.category}</span>
      <span>{task.deadline}</span>
      <select
        value={task.priority}
        onChange={(e) => onPriorityUpdate(task, e.target.value)}
      >
        <option value={"Low"}>Low</option>
        <option value={"Medium"}>Medium</option>
        <option value={"High"}>High</option>
      </select>
      <span>{daysLeft}</span>
    </>
  );
}

function FormAddTask({ onAddTask }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Low");

  function formatDate(date) {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
  }

  function handleAddTask() {
    if (!description || !category || !deadline) return;

    const newTask = {
      done: false,
      description,
      category,
      deadline: formatDate(deadline),
      priority,
    };

    onAddTask(newTask);
  }

  return (
    <div className="add-task-form">
      <ul>
        <input type="checkbox" disabled />
        <input
          type="text"
          placeholder="description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value={"Low"}>Low</option>
          <option value={"Medium"}>Medium</option>
          <option value={"High"}>High</option>
        </select>
        <Button onClick={handleAddTask}>Add</Button>
      </ul>
    </div>
  );
}

/*
export default function App() {
  
  const [tasks, setTasks] = useState(initialTasks);
  const [showAddTask, setShowAddTaskForm] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriendForm((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriendForm(false);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur && cur.id === friend.id ? null : friend));
    setShowAddFriendForm(false);
  }

  function handleUpdateFriend(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelect={handleSelectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          friend={selectedFriend}
          onUpdateBalance={handleUpdateFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelect }) {
  const isSelected = selectedFriend && selectedFriend.id === friend.id;

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onUpdateBalance }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [payer, setPayer] = useState("user");
  const friendExpense = bill ? bill - yourExpense : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !yourExpense) return;

    onUpdateBalance(payer === "user" ? friendExpense : -yourExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => {
          const value = Number(e.target.value);
          setBill(isNaN(value) || value === 0 ? "" : Number(e.target.value));
          setYourExpense("");
        }}
      />

      <label>🧍‍♂️ Your exspense</label>
      <input
        type="text"
        value={yourExpense}
        disabled={bill === ""}
        onChange={(e) => {
          const value = Number(e.target.value);
          setYourExpense(
            isNaN(value) || value === 0 ? "" : Math.min(Number(value), bill)
          );
        }}
      />

      <label>👫 {friend.name}'s expense</label>
      <input disabled type="text" value={friendExpense} />

      <label>🤑 Who is paying the bill?</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}*/

/*
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  function handleShowAddFriendForm() {
    setShowAddFriendForm((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriendForm(false);
  }

  function handleUpdateFriend(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  function handleShowSplitBill(friend) {
    setSelectedFriend((curFriend) =>
      friend.id === curFriend?.id ? null : friend
    );
    setShowAddFriendForm(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleShowSplitBill}
        />

        {showAddFriendForm && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriendForm}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          friend={selectedFriend}
          onSplitBill={handleUpdateFriend}
        />
      )}
    </div>
  );
}

function FriendList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelectFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨🏻‍🤝‍👩🏻Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expense, seExpense] = useState("");
  const friendExpense = bill ? bill - expense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !expense) return;

    onSplitBill(whoIsPaying === "user" ? friendExpense : -expense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {friend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>🧍‍♂️Your expense</label>
      <input
        type="number"
        value={expense}
        onChange={(e) =>
          seExpense(
            Number(e.target.value) > bill
              ? expense
              : Number(e.target.value) < 0
              ? expense
              : e.target.value
          )
        }
      />

      <label>👨🏻‍🤝‍👩🏻{friend.name}'s expense:</label>
      <input type="number" disabled value={friendExpense} />

      <label>🤑Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
*/
