const controllers = (module.exports = exports = {});
const Anime = require('../models/Anime');
const objectHasAllFields = require('../utils/validation');
const { cloudinary } = require('../utils/cloudinary');

controllers.getAll = async (req, res) => {
  const animes = await Anime.find({});

  res.status(200).json(animes);
};

controllers.getById = async (req, res) => {
  const { id } = req.body;

  if (!id) throw new Error('Anime id is required');

  const anime = await Anime.findById(id);

  if (!anime) {
    return res
      .send(404)
      .json({ error: true, msg: 'Can not find anime by that id' });
  }

  res.status(200).json(anime);
};

controllers.addNew = async (req, res) => {
  const {
    name,
    description,
    genres,
    episodes,
    mainImage,
    backImage,
  } = req.body;
  // Validate request params
  const validationRes = objectHasAllFields(req.body, [
    'name',
    'description',
    'genres',
    'mainImage',
    'backImage',
  ]);

  // If validation has failed (aka not returned true)
  if (!(validationRes === true)) throw validationRes;

  // Upload images to cloudinary
  let main;
  let background;
  try {
    const mainImgRes = await cloudinary.uploader.upload(mainImage, {
      upload_preset: 'anime_main',
      eager: [{ width: 250, height: 200 }],
    });

    const backImgRes = await cloudinary.uploader.upload(backImage, {
      upload_preset: 'anime_background',
    });

    main = mainImgRes.secure_url;
    background = backImgRes.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error('Cant Upload  Image');
  }

  const anime = await Anime.create({
    name,
    description,
    genres,
    episodes,
    mainImage: main,
    backImage: background,
  });

  res.status(200).json(anime);
};

controllers.getByCategory = async (req, res) => {
  const animes = await Anime.find({ genres: req.params.genre });

  if (animes.length === 0)
    throw new Error(`Can not find animes in ${req.params.genre}`);

  res.status(200).json(animes);
};

controllers.updateById = async (req, res) => {
  const { name, description, genres, year, image } = req.body;
  const id = req.params.id;

  const anime = await Anime.findById(id);

  if (!anime) throw new Error('Anime by requested id does not exists');

  if (name) anime.name = name;
  if (description) anime.description = description;
  if (genres) anime.genres = genres;
  if (year) anime.year = year;
  if (image) anime.image = image;

  await anime.save();

  res.status(200).json(anime);
};

controllers.removeAnimeById = async (req, res) => {
  const id = req.params.id;

  await Anime.findByIdAndDelete(id);

  res.status(200).json({ message: 'Removed successfuly' });
};
