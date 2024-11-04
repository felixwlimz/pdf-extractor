import { Schema, model, models } from 'mongoose'

const postSchema = new Schema({
  filepath: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  no_files: {
    type: Number,
    required: true,
  },
  drive_upload: {
    type: Boolean,
    required: true,
  },
  way_extract: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true })


const PostModel = models.post || model('post', postSchema)

export default PostModel;