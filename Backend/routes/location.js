const express = require("express");

const {createLocation, getLocations, locationsByCountry} = require("../controllers/location");

const router = express.Router();

router.get("/locations", getLocations);
router.post("/new/location", createLocation);
router.get("/cities/:country", locationsByCountry);

module.exports = router;