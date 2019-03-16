require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const ADMIN_ROLE = 'admin';

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  const { username } = req.body;

  chatkit
    .createUser({
      id: username,
      name: username,
    })
    .then(() => {
      res.status(201);
      res.send({ is_admin: false });
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        chatkit.getUserRoles({ userId: username }).then(roles => {
          const adminRole = roles.find(permission => {
            return permission.role_name === ADMIN_ROLE;
          });

          res.status(200).json({ is_admin: adminRole !== undefined });
        });
        return;
      }

      res.status(err.status).json(err);
    });
});

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id,
  });
  res.status(authData.status).send(authData.body);
});

app.set('port', process.env.PORT || 5200);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running on port ${server.address().port}`);
});
