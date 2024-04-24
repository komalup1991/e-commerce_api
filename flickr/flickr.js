const router = require("express").Router();
const { Op } = require("sequelize");
const FLICKR_API = process.env.FLICKR_API;

router.get("/images/:category", async (req, res) => {
  const text = req.params.category;
  const url = `https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=${FLICKR_API}&format=json&nojsoncallback=1`;

  const urlSearch = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API}&tags=${text}&format=json&nojsoncallback=1`;

  try {
    const response = await fetch(urlSearch);
    const data = await response.json();
    res.send(data.photos.photo); // Adjust based on how the data is structured
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});
module.exports = router;
