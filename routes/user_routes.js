const { Router } = require('express');
const router = Router();
const { catchErrors } = require('../utils');
const users = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/register', catchErrors(users.register));
router.post('/login', catchErrors(users.logIn));
router.get('/load', auth, catchErrors(users.load));

module.exports = router;
