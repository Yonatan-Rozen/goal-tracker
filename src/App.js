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
      <h1>Goal Tracker</h1>
      <div className={`table ${showAddTaskForm ? "form-open" : ""}`}>
        <TaskTable
          tasks={tasks}
          handleDoneUpdate={handleDoneUpdate}
          handlePriorityUpdate={handlePriorityUpdate}
        />
        {showAddTaskForm && <FormAddTask onAddTask={handleAddTask} />}
      </div>
      <Button onClick={handleShowAddTaskForm}>
        {showAddTaskForm ? "Close" : "Add New Task"}
      </Button>
    </div>
  );
}

function TaskTable({ tasks, handleDoneUpdate, handlePriorityUpdate }) {
  return (
    <div className="task-table">
      <ul>
        <span className="title">Done</span>
        <span className="title">Description</span>
        <span className="title">Category</span>
        <span className="title">Deadline</span>
        <span className="title">Priority</span>
        <span className="title">Days Left</span>
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
    return Math.max(0, Math.ceil(timeDifference / (1000 * 3600 * 24)));
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
