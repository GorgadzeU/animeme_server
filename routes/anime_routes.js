const { Router } = require('express');
const router = Router();
const { catchErrors } = require('../utils');
const animes = require('../controllers/animes');

router.get('/all', catchErrors(animes.getAll));
router.post('/getById', catchErrors(animes.getById));
router.post('/new', catchErrors(animes.addNew));
router.put('/update/:id', catchErrors(animes.updateById));
router.delete('/remove/:id', catchErrors(animes.removeAnimeById));
router.get('/category/:genre', catchErrors(animes.getByCategory));

module.exports = router;
