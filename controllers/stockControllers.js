const User = require("../modal/userModal");
const Store = require("../modal/inventoryModal");
const factory = require("./handleFactory");
const catchAsync = require("../utils/catchAsync");

// using factory functions
exports.getAllItem = factory.getAll(Store);
exports.getoneItem = factory.getOne(Store, { path: "store" });
exports.createItem = factory.createOne(Store);
exports.updateItem = factory.updateOne(Store);
exports.deleteItem = factory.deleteOne(Store);

exports.getItemByDate = catchAsync(async (req, res, next) => {
  const groupedDate = await Store.aggregate([
    {
      $group: {
        _id: { dailyDate: "$dailyDate" },
        allMovedCylinder: { $sum: "$filledIn" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      groupedDate,
    },
  });
});

// {
//   $project: {
//     fields: {
//       editedBy: ["$editedBy"],
//   emptyMoved: "$emptyMoved",
//   emptyQuantity: "$emptyQuantity",
//   expense: "$expense",
//   filledMoved: "$filledMoved",
//   filledQuantity: "$filledQuantity",
//   moneyTypeCash: "$moneyTypeCash",
//   id: "$id",
//   moneyTypeCashQuantity: "$moneyTypeCashQuantity",
//   moneyTypeOnline: "$moneyTypeOnline",
//   moneyTypeOnlineQuantity: "$moneyTypeOnlineQuantity",
//   name: "$name",
//   purchasedTypeDBC: "$purchasedTypeDBC",
//   purchasedTypeRefill: "$purchasedTypeRefill",
//   purchasedTypeSBC: "$purchasedTypeSBC",
//   showRoomName: "$showRoomName",
//   totalMoney: "$totalMoney",
//   expenseDescription: "$expenseDescription",
//   dailyDiscription: "$dailyDiscription",
//     },
//   },
// },
