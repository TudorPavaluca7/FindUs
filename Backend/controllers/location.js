const Location = require("../models/location");

exports.createLocation = (req, res) => {
  const locParameter={country:req.body.country,city:req.body.city}
  const location = new Location(locParameter);
  location.save().then((result) => {
    res.json({
      location: result,
    });
  });
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().select("country").distinct("country");
    
    //console.log(loc)
    res.json(locations);
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: err,
    });
  }
};

exports.locationsByCountry = async (req, res) => {
  try {
    const str = req.url;
    const country = str.split("/")[2];
    const cities = await Location.find({ country: country }).select("city").distinct("city"); //.select("_id title body")
    res.json(cities);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};
