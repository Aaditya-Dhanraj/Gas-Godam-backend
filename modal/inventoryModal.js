const mongoose = require("mongoose");
const User = require("./userModal");

const storeSchema = new mongoose.Schema(
  {
    exportEmpty: {
      type: Number,
      default: 0,
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
      default: "N/A",
    },
    filledQuantityInitial: {
      type: Number,
      default: 0,
      required: [true, "Please provide quantity"],
    },
    filledQuantityFinal: {
      type: Number,
      default: 0,
      required: [true, "Please provide quantity"],
    },
    rate: {
      type: Number,
      default: 889.50,
      required: [true, "Please provide rate"],
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
    emptyQuantityInitial: {
      type: Number,
      required: [true, "Please provide final quantity"],
      default: 0,
    },
    emptyQuantityFinal: {
      type: Number,
      required: [true, "Please provide final quantity"],
      default: 0,
    },
    filledIn: {
      type: Number,
      default: 0,
    },
    filledOut: {
      type: Number,
      default: 0,
    },
    totalEmpty: {
      type: Number,
      default: 0,
    },
    emptyIn: {
      type: Number,
      default: 0,
    },
    initialTotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPayment: {
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
      default: "N/A",
    },
    SVSBC: {
      type: Number,
      default: 0,
    },
    SVDBC: {
      type: Number,
      default: 0,
    },
    SVToDBC: {
      type: Number,
      default: 0,
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
