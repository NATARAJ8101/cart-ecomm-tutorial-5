const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const { checkToken } = require("../../auth/token_validation");

//SERVER SIDE OBTAIN PRODUCT RATING -POSSILY DO THIS ON THE CLIENT SIDE DURING EACH SUBMISSION 


//SERVER SIDE GET REVIEWS OF SPECIFIC ITEM
router.get("/:itemName", (req, res) => {
    let sql = `SELECT * FROM reviews WHERE itemName = '${req.params.itemName}'`;
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(results);
        }
    })
})

//SERVER SIDE ADD REVIEW
router.post("/add-review", checkToken, (req, res) => {
    let review = {
        email: req.body.email,
        itemName: req.body.itemName,
        rating: req.body.rating,
        userTimestamp: req.body.userTimestamp,
        comment: req.body.comment
    }

    let sql = "INSERT INTO reviews SET ?";
    let query = db.query(sql, review, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result);
        }
    })
});

//SERVER SIDE DELETE REVIEW
router.delete("/remove-review/:userTimestamp", (req, res) => {
    let sql = `DELETE FROM reviews WHERE userTimestamp = '${req.params.userTimestamp}'`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result);
        }
    })
})


module.exports = router;