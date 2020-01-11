import moongoose from "mongoose";

const CommentSchema = new moongoose.Schema({
  text: {
    type: String,
    required: "Text is required."
  },
  creator: {
    type: moongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const model = moongoose.model("Comment", CommentSchema);

export default model;
