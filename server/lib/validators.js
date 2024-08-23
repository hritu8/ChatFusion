import { body, param, validationResult, check } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "../middlewares/error.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  console.log(errorMessages);
  if (errors.isEmpty()) {
    return next();
  } else {
    next(new ErrorHandler(errorMessages, 400));
  }
};

const registerValidator = () => [
  // Corrected validation rules for registration form
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter a Valid Username").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
  body(
    "password",
    "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ).notEmpty(),
];

const loginValidator = () => [
  // Corrected validation rules for registration form
  body("username", "Please Enter a Valid Username").notEmpty(),
  body(
    "password",
    "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ).notEmpty(),
];

const newGroupValidator = () => [
  // Corrected validation rules for registration form
  body("name", "Please Enter a  name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be 2-100"),
];

const addmemberValidator = () => [
  // Corrected validation rules for registration form
  body("chatId", "Please Enter a  Chat Id").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];

const removeMemberValidator = () => [
  // Corrected validation rules for registration form
  body("chatId", "Please Enter a  Chat Id").notEmpty(),
  body("userId", "Please Enter a User Id").notEmpty,
];

const sendAttachmentsValidator = () => [
  // Corrected validation rules for registration form
  body("chatId", "Please Enter a  Chat Id").notEmpty(),
];

const chatIdValidator = () => [
  // Corrected validation rules for registration form
  param("id", "Please Enter a  Chat Id").notEmpty(),
];

const renameValidator = () => [
  // Corrected validation rules for registration form
  param("id", "Please Enter a  Chat Id").notEmpty(),
  body("name", "Please Enter a New Name").notEmpty(),
];

const sendRequestValidator = () => [
  // Corrected validation rules for registration form
  body("userId", "Please Enter User Id ").notEmpty(),
];

const acceptrequestValidator = () => [
  // Corrected validation rules for registration form

  body("requestId", "Please Enter request Id ").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter secret Key").notEmpty(),
];

export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupValidator,
  addmemberValidator,
  removeMemberValidator,
  sendAttachmentsValidator,
  chatIdValidator,
  renameValidator,
  sendRequestValidator,
  acceptrequestValidator,
  adminLoginValidator,
};
