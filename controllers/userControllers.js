const User = require("../modal/userModal");
const AppError = require("../utils/appError");
const factory = require("./handleFactory");
const catchAsync = require("./../utils/catchAsync");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "fail,",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) check if anything irrelevent present or not like password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route can only change names if you wish to change the password then please go to /changepassword route",
        400
      )
    );
  }

  // 2) filter out data that are not allowed to be there
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) update the document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

// do not update password with this because in update function no save querry is runned
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
