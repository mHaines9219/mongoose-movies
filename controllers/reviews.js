const Movie = require("../models/movie");

module.exports = {
  create,
  delete: deleteReview,
};

async function create(req, res) {
  const movie = await Movie.findById(req.params.id);

  // Add the user-centric info to req.body (the new review)
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;

  // We can push (or unshift) subdocs into Mongoose arrays
  movie.reviews.push(req.body);
  try {
    // Save any changes made to the movie doc
    await movie.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/movies/${movie._id}`);
}

function deleteReview(req, res, next) {
  //note dot syntax to query for movie with a review nested in an array
  Movie.findOne({
    "reviews._id": req.params.id,
    "reviews.user": req.user._id,
  }).then(function (movie) {
    if (!movie) return res.redirect;
    movie.reviews.remove(req.params.id);
    movie
      .save()
      .then(function () {
        res.redirect(`/movies/${movie._id}`);
      })
      .catch(function (err) {
        return next(err);
      });
  });
}
