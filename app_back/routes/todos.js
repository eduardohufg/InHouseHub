const router = require('express').Router();

router.get("/", (req, res) => {
    res.json([
        {
            id : 1,
            title : "Todo 1",
            completed: false
        },
    ]);


});

module.exports = router;    

