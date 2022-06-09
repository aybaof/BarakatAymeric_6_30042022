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
    });
    if (sauceDeleted.imageUrl) {
      await fn.deleteImage(sauceDeleted.imageUrl);
    }
    res.status(200).json("Sauce deleted");
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
  switch (req.body.like) {
    case 1:
      Sauce.findOneAndUpdate(
        {
          _id: req.params.id,
          usersLiked: { $nin: [req.body.userId] },
        },
        {
          $pull: { usersDisliked: { $in: [req.body.userId] } },
          $push: { usersLiked: req.body.userId },
          $inc: { likes: 1 },
          $cond: [
            { usersDisliked: { $in: [req.body.userId] } },
            { $inc: { dislikes: -1 } },
            { $inc: { dislikes: 0 } },
          ],
        },
        {
          new: true,
        }
      )
        .then(() => res.status(200).json("Sauce liked"))
        .catch((err) => res.status(500).json({ err }));
      break;
    case 0: {
      try {
        Sauce.findOne(
          {
            _id: req.params.id,
            $or: [
              { usersLiked: { $in: [req.body.userId] } },
              { usersDisliked: { $in: [req.body.userId] } },
            ],
          },
          function (err, sauce) {
            if (!err) {
              if (!sauce) {
                res
                  .status(500)
                  .json({
                    message:
                      "You can't dislike a sauce you haven't liked or disliked",
                  });
              } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                  sauce.usersLiked.pull(req.body.userId);
                  sauce.likes--;
                } else {
                  sauce.usersDisliked.pull(req.body.userId);
                  sauce.dislikes--;
                }
                sauce.save((err) => {
                  if (!err) {
                    res.status(200).json("Opinion updated");
                  } else {
                    res.status(500).json({ err });
                  }
                });
              }
            }
          }
        );
      } catch (err) {
        res.status(500).json({ err });
      }
      // Sauce.findOneAndUpdate(
      //   {
      //     _id: req.params.id,
      //     $or: [
      //       { usersLiked: { $in: [req.body.userId] } },
      //       { usersDisliked: { $in: [req.body.userId] } },
      //     ],
      //   },
      //   {
      //     $switch: {
      //       branches: [
      //         {
      //           case: { usersLiked: { $in: [req.body.userId] } },
      //           then: {
      //             $inc: { likes: -1 },
      //             $pull: { usersLiked: req.body.userId },
      //           },
      //         },
      //         {
      //           case: { userDisliked: { $in: [req.body.userId] } },
      //           then: {
      //             $inc: { dislikes: -1 },
      //             $pull: { usersDisliked: req.body.userId },
      //           },
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     new: true,
      //   }
      // )
      //   .then(() => {
      //     res.status(200).json("Opinion deleted");
      //   })
      //   .catch((err) => res.status(500).json({ err }));
      break;
    }
    case -1: {
      Sauce.findOneAndUpdate(
        {
          _id: req.params.id,
          usersDisliked: { $nin: [req.body.userId] },
        },
        {
          $pull: { usersLiked: { $in: [req.body.userId] } },
          $push: { usersDisliked: req.body.userId },
          $inc: { dislikes: 1 },
          $cond: [
            { usersLiked: { $in: [req.body.userId] } },
            { $inc: { likes: -1 } },
            { $inc: { likes: 0 } },
          ],
        },
        {
          new: true,
        }
      )
        .then(() => res.status(200).json("Sauce Disliked"))
        .catch((err) => res.status(500).json({ err }));
      break;
    }
  }
};
