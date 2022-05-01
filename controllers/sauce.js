const Sauce = require("../models/sauce.js");

const fn = require("./fn.js");

exports.getAll = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(400).json({ err }));
};

exports.getSpecific = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(404).json({ err }));
};

exports.newSauce = async (req, res) => {
  const postSauce = JSON.parse(req.body.sauce);
  try {
    await fn.validateInput(req.body.sauce, "string", "sauce name is required");
    const sauce = new Sauce({
      ...postSauce,
      imageUrl: `${req.protocol}://${req.get("host")}/public/images/${
        req.file.filename
      }`,
    });
    await sauce.save();
    res.status(200).json({ message: "sauce created" });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.deleteSauce = async (req, res) => {
  try {
    const sauceDeleted = await Sauce.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })
    if(sauceDeleted.imageUrl){
        await fn.deleteImage(sauceDeleted.imageUrl)
    }
    res.status(200).json("Sauce deleted")
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.updateSauce = (req, res) => {
  if (!req.file) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      {
        ...req.body,
      }
    )
      .then(() => res.status(200).json("Sauce updated"))
      .catch((err) => res.status(404).json({ err }));
  } else {
    const requestBody = JSON.parse(req.body.sauce);
    Sauce.findOne({ _id: req.params.id, userId: requestBody.userId }).then(
      async (sauce) => {
        await fn.deleteImage(sauce.imageUrl);
        Sauce.findOneAndUpdate(
          { _id: req.params.id, userId: requestBody.userId },
          {
            ...requestBody,
            imageUrl: `${req.protocol}://${req.get("host")}/public/images/${
              req.file.filename
            }`,
          }
        )
          .then(() => res.status(200).json("Sauce updated"))
          .catch((err) => res.status(404).json({ err }));
      }
    );
  }
};

exports.toggleLike = (req, res) => {
    // Sauce.findOneAndUpdate(
    //     { _id: req.params.id },
    //     {
    //     $inc: { likes: req.body.like ? 1 : -1 },
    //     }
    // )
    //     .then(() => res.status(200).json("Sauce updated"))
    //     .catch((err) => res.status(404).json({ err }));
}
