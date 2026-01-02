// import mongoose from "mongoose";

// const bidSchema = new mongoose.Schema({
//   sp: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   statement: {
//     type: String,
//     required: true
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const bidSessionSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true
//     },

//     description: {
//       type: String
//     },

//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     allowBidVisibility: {
//       type: Boolean,
//       default: false
//     },

//     status: {
//       type: String,
//       enum: ["open", "closed"],
//       default: "open"
//     },

//     bids: [bidSchema],

//     winner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("BidSession", bidSessionSchema);








import mongoose from "mongoose";

// Bid schema (for individual bids in the session)
const bidSchema = new mongoose.Schema({
  sp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  statement: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Bid session schema (for managing the session itself)
const bidSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    allowBidVisibility: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },

    amount: {
      type: Number, // Amount to start the session
      required: true
    },

    hasTimer: {
      type: Boolean,
      default: false // Whether the session has a timer
    },

    duration: {
      type: Number, // Duration in hours for the timer
      required: function() {
        return this.hasTimer; // Only required if hasTimer is true
      }
    },

    bids: [bidSchema],

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

// Export the model
export default mongoose.model("BidSession", bidSessionSchema);
