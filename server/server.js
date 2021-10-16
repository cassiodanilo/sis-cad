const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const port = process.env.PORT || 3000;

app.db = router.db;

const rules = auth.rewriter({
  users: 600,
  clientes: 660,
})

app.use(
  cors({
      origin: true,
      credentials: true,
      preflightContinue: false,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);
app.options('*', cors());
app.use(rules)
app.use(auth);
app.use(router);
app.listen(port, () => {
  console.log('JSON Server is running')
});