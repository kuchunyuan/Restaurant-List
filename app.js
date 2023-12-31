const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
const restaurants = require("./public/jsons/restaurant.json").results;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});
app.get("/restaurants", (req, res) => {
  const keyword = req.query.search?.trim();
  const item = ["name", "category", "location", "phone", "description"];
  const condition = restaurants.filter((restaurant) =>
    item.some((property) => {
      return restaurant[property]
        .toString()
        .trim()
        .toLowerCase()
        .includes(keyword.toLowerCase());
    })
  );
  const matchedRestaurant = keyword ? condition : restaurants;
  if (condition.length !== 0) {
    res.render("index", { restaurants: matchedRestaurant, keyword });
    console.log("success");
  } else {
    res.render("notFound", { keyword: keyword });
  }
});
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find((restaurant) => {
    return restaurant.id.toString() === id.toString();
  });
  res.render("detail", { restaurant: restaurant });
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
