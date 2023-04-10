const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const categorySchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
        index: { unique: false }, // change to allow duplicates
      },
    },
    { timestamps: true }
  );
  
//Export the model
module.exports = mongoose.model('Category', categorySchema);