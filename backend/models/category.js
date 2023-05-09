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
      },
      image: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
//Export the model
module.exports = mongoose.model('Category', categorySchema);