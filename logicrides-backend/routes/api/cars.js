const express = require('express');
const router = express.Router();

const Car = require('../../models/Car');

// @route   GET api/cars
// @desc    Get all available cars with optional filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        // --- Filtering Logic ---
        const filters = {};

        // Filters based on your Car schema
        if (req.query.location) {
            filters.location = new RegExp(req.query.location, 'i');
        }
        if (req.query.type) {
            filters.type = req.query.type;
        }
        if (req.query.model) {
            filters.model = new RegExp(req.query.model, 'i');
        }
        if (req.query.fuelType) {
            filters.fuelType = req.query.fuelType;
        }
        if (req.query.seats) {
            filters.seats = Number(req.query.seats);
        }
        if (req.query.year) {
            filters.year = Number(req.query.year);
        }
        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filters.pricePerDay = {};
            if (req.query.minPrice) {
                filters.pricePerDay.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filters.pricePerDay.$lte = Number(req.query.maxPrice);
            }
        }

        // Only show available cars
        filters.isAvailable = true;

        // --- Sorting Logic ---
        let sortOptions = {};
        if (req.query.sortBy === 'price_asc') {
            sortOptions = { pricePerDay: 1 };
        } else if (req.query.sortBy === 'price_desc') {
            sortOptions = { pricePerDay: -1 };
        } else if (req.query.sortBy === 'year_desc') {
            sortOptions = { year: -1 };
        } else {
            sortOptions = { createdAt: -1 };
        }

        // --- Pagination Logic ---
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // --- Database Query ---
        const cars = await Car.find(filters)
                              .sort(sortOptions)
                              .skip(skip)
                              .limit(limit)
                              .populate('owner', 'name email'); // Optional

        // Get total count for pagination info
        const totalCars = await Car.countDocuments(filters);

        res.json({
            message: 'Cars fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(totalCars / limit),
            totalCars: totalCars,
            cars: cars
        });

    } catch (err) {
        console.error('Get Cars Error:', err.message);
        res.status(500).send('Server Error');
    }
});



// @route   GET api/cars/:id
// @desc    Get single car details by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // req.params.id gets the ID from the URL path (e.g., /api/cars/60c7a...)
        const car = await Car.findById(req.params.id);
                            // .populate('owner', 'name email'); // Optional: Populate owner info

        if (!car) {
            return res.status(404).json({ msg: 'Car not found' });
        }

        // We might also want to fetch reviews here later
        res.json(car); // Send the full car details

    } catch (err) {
        console.error('Get Car Detail Error:', err.message);
        // Handle potential CastError if the ID format is invalid
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Car ID format' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;