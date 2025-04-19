const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CarSchema = new Schema({
    model: {
        type: String,
        required: [true, 'Car model is required']
    },
    make: {
        type: String,
        required: [true, 'Car make is required']
    },
    year: { 
       type: Number,
       required: [true, 'Manufacturing year is required']
    },
    type: {
        type: String,
        required: [true, 'Car type is required']
    },
    seats: {
        type: Number,
        required: [true, 'Number of seats is required']
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual'],
        required: [true, 'Transmission type is required']
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric'],
        required: [true, 'Fuel type is required']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Price per day is required']
    },
    location: { // Where the car is generally based or available
        type: String,
        required: [true, 'Car location is required']
    },
    // Availability: We'll handle this via bookings for the MVP.
    // A simple 'isAvailable' flag might be easier initially than managing date ranges here.
    // Let's add a simple boolean flag for now. Availability based on booking dates will be calculated dynamically.
    isAvailable: {
       type: Boolean,
       default: true
    },
    // Images: Store an array of URLs pointing to the uploaded images
    images: [{
        type: String,
        required: false 
    }],
    features: [{ 
        type: String // e.g., 'Air Conditioning', 'GPS', 'Bluetooth'
    }],
    owner: { 
       type: Schema.Types.ObjectId,
       ref: 'User' // Establishes a relationship with the User model
       // required: true // Make this required if users list their own cars
    },
}, { timestamps: true }); // Add createdAt and updatedAt

module.exports = mongoose.model('Car', CarSchema);