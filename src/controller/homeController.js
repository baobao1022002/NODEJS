import { logger } from "sequelize/lib/utils/logger";
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
  await CRUDService.createNewUser(req.body);
  return res.send("post crud from server");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  console.log(data);

  return res.render("displayCRUD.ejs", { dataTable: data });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  console.log(userId);

  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);
    //check user data not found

    return res.render("editCRUD.ejs", { user: userData });
  } else {
    return res.send("user not found");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", { dataTable: allUsers });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send("delete user succeed");
  } else {
    return res.send("user not found!");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
