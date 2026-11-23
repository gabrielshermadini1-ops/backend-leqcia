import express from 'express';

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});
