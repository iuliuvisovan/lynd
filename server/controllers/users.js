const { body, validationResult } = require("express-validator/check");
const { login, createAuthToken } = require("../auth");
const User = require("../models/user");

exports.login = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  login(req, res, next);
};

exports.register = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { username, password } = req.body;

    const user = await User.create({ username, password });

    const token = createAuthToken(user.toJSON());
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.requestSmsCode = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { phoneNumber } = req.body;

    // await Twilio.sendSmsCode();
    setTimeout(() => {
      res.status(200).json({ codeSentSuccesfully: true });
    }, 1000);
  } catch (err) {
    next(err);
  }
};

exports.testSmsCode = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { phoneNumber, smsCode } = req.body;

    // await Twilio.sendSmsCode();
    if (smsCode == "2345") {
      res.status(200).json({ isCodeValid: true });
    } else {
      res.status(200).json({ isCodeValid: false });
    }
  } catch (err) {
    next(err);
  }
};

exports.validate = method => {
  if (method === "request-sms-code") {
    const errors = [
      body("phoneNumber")
        .exists()
        .withMessage("is required")

        .isLength({ min: 1 })
        .withMessage("cannot be blank")

        .isLength({ max: 15 })
        .withMessage("must be at most 15 characters long")

        .custom(value => value.trim() === value)
        .withMessage("cannot start or end with whitespace")

        .matches(/^\+[0-9]+$/)
        .withMessage("contains invalid characters")
    ];
    return errors;
  }

  if (method === "test-sms-code") {
    const errors = [
      body("phoneNumber")
        .exists()
        .withMessage("is required")

        .isLength({ min: 1 })
        .withMessage("cannot be blank")

        .isLength({ max: 15 })
        .withMessage("must be at most 15 characters long")

        .custom(value => value.trim() === value)
        .withMessage("cannot start or end with whitespace")

        .matches(/^\+[0-9]+$/)
        .withMessage("contains invalid characters"),
      body("smsCode")
        .exists()
        .withMessage("is required")

        .isLength({ min: 4 })
        .withMessage("cannot be blank")

        .isLength({ max: 4 })
        .withMessage("must be at most 15 characters long")

        .custom(value => value.trim() === value)
        .withMessage("cannot start or end with whitespace")

        .matches(/^[0-9]+$/)
        .withMessage("contains invalid characters")
    ];
    return errors;
  }

  const errors = [
    body("username")
      .exists()
      .withMessage("is required")

      .isLength({ min: 1 })
      .withMessage("cannot be blank")

      .isLength({ max: 32 })
      .withMessage("must be at most 32 characters long")

      .custom(value => value.trim() === value)
      .withMessage("cannot start or end with whitespace")

      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage("contains invalid characters"),

    body("password")
      .exists()
      .withMessage("is required")

      .isLength({ min: 1 })
      .withMessage("cannot be blank")

      .isLength({ min: 8 })
      .withMessage("must be at least 8 characters long")

      .isLength({ max: 72 })
      .withMessage("must be at most 72 characters long")
  ];

  if (method === "register") {
    errors.push(
      body("username").custom(async username => {
        const exists = await User.countDocuments({ username });
        if (exists) throw new Error("already exists");
      })
    );
  }

  return errors;
};
