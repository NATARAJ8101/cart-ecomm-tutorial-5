const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const { checkToken } = require("../../auth/token_validation");

/*{"saleId":"hank@testing.com:2022-04-20T13:32:57","itemName":"gloves","price":"6.00"}*/

//SERVER SIDE GET PURCHASE WITHING SPECIFIC TIME FRAME REQUESTED 
router.get("/ordersFrom/:timeFrame", checkToken, (req, res) => {
    let sql = `SELECT * FROM purchaseLog WHERE saleId LIKE '%${req.params.timeFrame}%'`;
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(results);
        }
    })
});


//SERVER SIDE GET PURCHASE FROM SPECIFIC USER
router.get("/ordersFromUser/:email", checkToken, (req, res) => {
    let sql = `SELECT * FROM purchaseLog WHERE saleId LIKE '%${req.params.email + ":"}%'`;
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(results);
        }
    })
});


///SERVER SIDE POST PURCHASES
router.post("/post-purchase", checkToken, (req, res) => {
    let sql = "INSERT INTO purchaseLog SET ?";
    let query = db.query(sql, {
        saleId: req.body.saleId,
        itemName: req.body.itemName,
        price: req.body.price,
        uuid: req.body.uuid
    }, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result)
        }
    });
});

module.exports = router;

