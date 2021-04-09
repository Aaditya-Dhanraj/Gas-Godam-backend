const mongoose = require("mongoose");
const User = require("./userModal");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    showRoomName: {
      type: String,
      required: [true, "Please provide showroom name"],
    },
    dailyDate: {
      type: Date,
      required: [true, "Please provide a time"],
    },
    editedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    dailyDiscription: {
      type: String,
    },
    filledQuantity: {
      type: Number,
      required: [true, "Please provide quantity"],
    },
    purchasedTypeSBC: {
      type: Number,
      default: 0,
      required: [true, "Purchase type must be defined"],
    },
    purchasedTypeDBC: {
      type: Number,
      default: 0,
      required: [true, "Purchase type must be defined"],
    },
    purchasedTypeRefill: {
      type: Number,
      default: 0,
      required: [true, "Purchase type must be defined"],
    },
    emptyQuantity: {
      type: Number,
      required: [true, "Please provide final quantity"],
      default: 0,
    },
    filledIn: {
      type: Number,
      default: 0,
    },
    emptyOut: {
      type: Number,
      default: 0,
    },
    moneyTypeCashQuantity: {
      type: Number,
      default: 0,
    },
    moneyTypeOnlineQuantity: {
      type: Number,
      default: 0,
    },
    moneyTypeCash: {
      type: Number,
      default: 0,
    },
    moneyTypeOnline: {
      type: Number,
      default: 0,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
    expenseDescription: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

storeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "editedBy",
    select: "name",
  });
  next();
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
