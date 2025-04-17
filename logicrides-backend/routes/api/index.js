const express = require("express");

const router = express.Router();

router.get("/", (req,res)=>{
    res.json({
        message: "Welcome to the LogicRides Backend!",
        status: 200
    })    
});

module.exports = router;
