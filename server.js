import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
const PORT = 3000;

let tasks = [
  {
    id: "1",
    title: "Learn Express basics",
    category: "Study",
    points: 10,
    completed: false
  },
  {
    id: "2",
    title: "Build REST API",
    category: "Backend",
    points: 20,
    completed: false
  },
  {
    id: "3",
    title: "Eat BreakFast",
    category: "Food",
    points: 10,
    completed: false
  },
  {
    id: "4",
    title: "Fix Bugs",
    category: "Work",
    points: 50,
    completed: false
  }
];

// Middlewares
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});


app.get('/', (req, res) => {
  res.send('The Project Is Working!')
})
app.get('/hello', (req, res) => {
  res.send('Hello from Backend!');
});

app.get('/api/tasks', (req, res) => {
  const { completed, category } = req.query;

  let filteredTasks = tasks;

  if (completed !== undefined) {
    if (completed !== 'true' && completed !== 'false') {
      return res.status(400).json({ error: "completed პარამეტრი უნდა იყოს 'true' ან 'false'" });
    }
    const isCompleted = completed === 'true';
    filteredTasks = filteredTasks.filter((task) => task.completed === isCompleted);
  }

  if (category) {
    filteredTasks = filteredTasks.filter(
      (task) => task.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.status(200).json(filteredTasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "მისია ვერ მოიძებნა" });
  }

  res.status(200).json(task);
});

app.post('/api/tasks', (req, res) => {
  const { title, category, points } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title სავალდებულოა და უნდა იყოს არაცარიელი ტექსტი' });
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'category სავალდებულოა და უნდა იყოს არაცარიელი ტექსტი' });
  }

  if (typeof points !== 'number' || !Number.isInteger(points) || points < 1 || points > 100) {
    return res.status(400).json({ error: 'points უნდა იყოს მთელი რიცხვი 1-დან 100-მდე' });
  }

  const newTask = {
    id: randomUUID(),
    title: title.trim(),
    category: category.trim(),
    points,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "მისია ვერ მოიძებნა" });
  }

  const { title, category, points, completed } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title სავალდებულოა და უნდა იყოს არაცარიელი ტექსტი' });
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'category სავალდებულოა და უნდა იყოს არაცარიელი ტექსტი' });
  }

  if (typeof points !== 'number' || !Number.isInteger(points) || points < 1 || points > 100) {
    return res.status(400).json({ error: 'points სავალდებულოა და უნდა იყოს მთელი რიცხვი 1-დან 100-მდე' });
  }

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed სავალდებულოა და უნდა იყოს boolean (true ან false)' });
  }

  task.title = title.trim();
  task.category = category.trim();
  task.points = points;
  task.completed = completed;

  res.status(200).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "მისია ვერ მოიძებნა" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.get('/api/stats', (req, res) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const availablePoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points, 0);

  res.status(200).json({
    totalTasks,
    completedTasks,
    availablePoints,
    earnedPoints
  });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});
