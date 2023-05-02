const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

//get all
server.get('/users', (req, res) => {
    const data = router.db.get('users').value();
    const response = {
        data: {
            data: data,
            total: data.length
        }
    };
    res.json(response);
});

//get by id
server.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const data = router.db.get('users').find({ id: parseInt(id) }).value();
    const response = {
        data: data,
        total: 1
    };
    res.json(response);
});

// update user
server.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const index = router.db.get('users').findIndex({ id: parseInt(id) }).value();
    router.db.get('users').splice(index, 1, updatedUser).write();
    const response = {
        data: updatedUser,
        total: 1
    };
    res.json(response);
});

// Add a new user
server.post('/users/addEditUser', (req, res) => {
    const user = req.body;
    const users = router.db.get('users');
    const id = parseInt(req.query.id);

    if (id === 0) {
      // Add new user
      users
        .insert({...user,id:users.length+2,lastLogin:new Date(),avatarId:1})
        .write();
    } else {
      // Update existing user
      users
        .find({ id: id })
        .assign(user)
        .write();
    }
  
    const response = { success: true };
    res.json(response);
  });

// Remove a user
server.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    router.db.get('users').remove({ id: parseInt(id) }).write();
    res.json({ success: true,data:'user removed' });
});

server.use(router);
server.listen(3004, () => {
    console.log('JSON Server is running at port 3004');
});