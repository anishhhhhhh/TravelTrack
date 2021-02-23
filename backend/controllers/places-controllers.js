const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    // if there is problem in the request then this is error occurs

    return next(error);
  }

  if (!place) {
    // throw new HttpError("Could not find a place for the provided id", 404);

    const error = new HttpError(
      "Could not find place for the provided id.",
      404
    );
    // if the request is fine and it could not find the place the it this error occurs

    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
  // getters convert _id to id in mongoose object
  // res.json({ place }); //=> {place} => {place:place}

  // write next(error) if we want to stop the further execution
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    // places = await Place.find({ creator: userId });
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }
  // const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  // OR
  // const error = new HttpError(
  //   "Fetching places failed, Please try again later",
  //   500
  // );
  // return next(error);
  // both the error methods are same

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
      //you have to write return when there is next otherwise the function execution won't be stopped!!!
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
    //this id is added dynamically when the token is authenticated in the middleware
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    //this is where you are you are creating place and simulatneosly adding the place id in user collection
    const sess = await mongoose.startSession();
    // current session starts
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    // save is an async function!!!
    user.places.push(createdPlace);
    //push is not a standard push used in js, it is mongoose method which behind the scenes helps us to establish the connection betweent the two models
    //mongoDB adds only the place ID in the user collections
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
    //if we don't add next(error) the code will continue its execution even after throwing an error!!!
    //only when database server is failed or database validation fails
    //when either of the operations fails ie.saving place or adding place id in users collection this error will occur
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
      // throw new HttpError();
      // throw doesnt work in async fn
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    // place.creator has special mongoose id
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  // DUMMY_PLACES[placeIndex] = updatedPlace;
  // res.status(200).json({ place: updatedPlace });
  try {
    await place.save();
    //save is an async task
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
    //to refer a document stored in a another collection and we can acces entire creator ie.user document
    //finding is also an async task
    // console.log(place);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
      //unauthorised
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    //this is where we remove the entire place in from the place collection and remove it from user's places attribute array SIMULTANEOUSLY
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    //pull wil automatically remove ID we do not have to explicitly tell to remove ID.

    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError("Could not find the place", 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
