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

  function handleTaskDoneUpdate(updatedTask, isDone) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.description === updatedTask.description
          ? { ...task, done: isDone }
          : task
      )
    );
  }

  function handleTaskPriorityUpdate(updatedTask, newPriority) {
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
    setShowAddTaskForm(false);
  }

  return (
    <>
      <div className="app">
        <h1>Goal Tracker</h1>
        <div className={`table ${showAddTaskForm ? "form-open" : ""}`}>
          <TaskTable
            tasks={tasks}
            handleTaskDoneUpdate={handleTaskDoneUpdate}
            handleTaskPriorityUpdate={handleTaskPriorityUpdate}
          />
          {showAddTaskForm && <FormAddTask onAddTask={handleAddTask} />}
        </div>
        <Button onClick={handleShowAddTaskForm}>
          {showAddTaskForm ? "Close" : "Add New Task"}
        </Button>
      </div>
      <Footer />
    </>
  );
}

function TaskTable({ tasks, handleTaskDoneUpdate, handleTaskPriorityUpdate }) {
  return (
    <div className="task-table">
      <ul>
        <span className="title">Done</span>
        <span className="title">Description</span>
        <span className="title">Category</span>
        <span className="title">Deadline</span>
        <span className="title">Priority</span>
        <span className="title">Days Left</span>
        <TasksRows
          tasks={tasks}
          handleTaskDoneUpdate={handleTaskDoneUpdate}
          handleTaskPriorityUpdate={handleTaskPriorityUpdate}
        />
      </ul>
    </div>
  );
}

function TasksRows({ tasks, handleTaskDoneUpdate, handleTaskPriorityUpdate }) {
  return tasks.map((task) => (
    <Task
      key={task.description}
      task={task}
      onDoneUpdate={handleTaskDoneUpdate}
      onPriorityUpdate={handleTaskPriorityUpdate}
    />
  ));
}

function Task({ task, onDoneUpdate, onPriorityUpdate }) {
  const { description, done, category, deadline, priority } = task;
  const daysLeft = calculateDaysLeft(deadline);

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
        checked={done}
        onChange={(e) => onDoneUpdate(task, !done)}
      />
      <span>{description}</span>
      <span>{category}</span>
      <span>{deadline}</span>
      <select
        value={priority}
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
  const [formState, setFormState] = useState({
    description: "",
    category: "",
    deadline: "",
    priority: "Low",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  }

  function handleAddTask() {
    if (!formState.description || !formState.category || !formState.deadline)
      return;

    const newTask = {
      ...formState,
      done: false,
      deadline: new Date(formState.deadline).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    onAddTask(newTask);
  }

  return (
    <div className="add-task-form">
      <ul>
        <input type="checkbox" disabled name="done" />
        <input
          type="text"
          placeholder="description..."
          value={formState.description}
          onChange={handleChange}
          name="description"
        />
        <input
          type="text"
          placeholder="category..."
          value={formState.category}
          onChange={handleChange}
          name="category"
        />
        <input
          type="date"
          value={formState.deadline}
          onChange={handleChange}
          name="deadline"
        />
        <select
          value={formState.priority}
          onChange={handleChange}
          name="priority"
        >
          <option value={"Low"}>Low</option>
          <option value={"Medium"}>Medium</option>
          <option value={"High"}>High</option>
        </select>
        <Button onClick={handleAddTask}>Add</Button>
      </ul>
    </div>
  );
}
