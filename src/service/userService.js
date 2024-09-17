import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExist = await checkUserEmail(email);
      let userData = {};
      if (isExist) {
        // let user = await db.User.findOne({
        //   where: { email: email },
        // });

        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          //compare password
          // bcrypt.compareSync("B4c0/\/", hash); // true

          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = `Ok`;
            // delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User is not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your email isn't exist in our system`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let compareUserPassword = () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "aa";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exist?
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          message: "Your email is already in used, please try another one!",
        });
      }

      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve({
        errCode: 0,
        message: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      resolve({
        errCode: 2,
        errMessage: "User isn't exist",
      });
    }

    await db.User.destroy({
      where: { id: userId },
    });

    resolve({
      errCode: 0,
      errMessage: "User is deleted!",
    });
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 2,
          errMessage: "Missing required parameter!",
        });
      }
      let user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();
        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   address: data.address,
        // });
        resolve({
          errCode: 0,
          errMessage: "Update user success!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User is not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
};
