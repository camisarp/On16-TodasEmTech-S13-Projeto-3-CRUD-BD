const PokedexModel = require("../models/pokedexModel");
const CoachModel = require("../models/coachModel");

const createPokemon = async (req, res) => {
  try {
    const { coachId, name, type, abilities, description } = req.body;

    if (!coachId) {
      return res.status(400).json({ message: "Trainer id is required!" });
    }
    const findCoach = await CoachModel.findById(coachId);
    if (!findCoach) {
      return res.status(404).json({ message: "Trainer not found!" });
    }

    const newPokemon = new PokedexModel({
      coach: coachId,
      name,
      type,
      abilities,
      description,
    });
    const savedPokemon = await newPokemon.save();

    res.status(200).json(savedPokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const findAllPokemon = async (req, res) => {
  try {
    const allPokemons = await PokedexModel.find().populate("coach");
    res.status(200).json(allPokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findPokemonById = async (req, res) => {
  try {
    const findPokemon = await PokedexModel.findById(req.params.id).populate(
      "coach"
    );

    if (findPokemon == null) {
      return res.status(404).json({ message: "Pokemon not found!" });
    }
    res.status(200).json(findPokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePokemonById = async (req, res) => {
  try {
    const { id } = req.params;
    const { coachId, name, type, abilities, description } = req.body;

    const findPokemon = await PokedexModel.findById(id);

    if (findPokemon == null) {
      return res.status(404).json({ message: "Pokemon not found!" });
    }

    if (coachId) {
      const findCoach = await CoachModel.findById(coachId);

      if (findCoach == null) {
        return res.status(404).json({ message: "Trainer not found!" });
      }
    }

    findPokemon.name = name || findPokemon.name;
    findPokemon.type = type || findPokemon.type;
    findPokemon.abilities = abilities || findPokemon.abilities;
    findPokemon.description = description || findPokemon.description;
    findPokemon.coach = coachId || findPokemon.coach;

    const savedPokemon = await findPokemon.save();

    res.status(200).json(savedPokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePokemonById = async (req, res) => {
  try {
    const { id } = req.params;
    const findPokemon = await PokedexModel.findById(id);

    if (findPokemon == null) {
      return res
        .status(404)
        .json({ message: `The Pokemon with the id# ${id} was not found!` });
    }
    await findPokemon.remove();

    res
      .status(200)
      .json({
        message: `The Pokemon ${findPokemon} was successfully deleted!`,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPokemon,
  findAllPokemon,
  findPokemonById,
  updatePokemonById,
  deletePokemonById,
};
