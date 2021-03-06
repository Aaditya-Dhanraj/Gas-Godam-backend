const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const signInToken = (id) => {
  return jwt.sign(
    { id },
    "long-long-time-ago-my-long-long-secret-got-reveled",
    {
      expiresIn: "90d",
    }
  );
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signInToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + 90 + 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // This will remove the password
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // this line of code needs to be deleted because everyone can then register as admin and delete anything
    // role: req.body.role,
  });
  // const url = `${req.protocol}://${req.get('host')}/me`;
  // await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, req, res);

  // const token = signInToken(newUser._id);

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check if email and password are present or not
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide Email and Password", 400));
  }
  //2) check if email and password exist and valid or not  // using a "+" sign to make select property to true
  const user = await User.findOne({ email }).select("+password");

  //   console.log(user);

  // 3) compare the password and compare using instance middleware because its availaval

  //   const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  createSendToken(user, 200, req, res);
});

exports.logout = async (req, res) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and checking if its true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in ! Please log in to get access", 401)
    );
  }

  // Varification tokens  using promisify ie inbuilt promise returning of node js
  const decoded = await promisify(jwt.verify)(token, "long-long-time-ago-my-long-long-secret-got-reveled");
  // console.log(decoded);
  //check if user still exists by checking the id still exists or not

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );
  }

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "The user Changed the Id or Password, please log in again",
        401
      )
    );
  }

  //IF the code reaches through this point then its granted the protected route access

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        "long-long-time-ago-my-long-long-secret-got-reveled"
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is a array of names passed in userRouter in delete route in restrictTo function
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have Permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  next();
};
