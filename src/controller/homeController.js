import db from "../models/index";
import CRUDService from "../service/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log(data);

    return res.render("homePage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  await CRUDService.createNewUser(req.body);
  return res.send("post crud from server");
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
};
