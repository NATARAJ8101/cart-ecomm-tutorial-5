const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const { checkToken } = require("../../auth/token_validation");


//SERVER SIDE GET ALL PRODUCTS
router.get("/all-items/", checkToken, (req, res) => {
    let sql = `SELECT * FROM items`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result);
        }
    });
});


//SERVER SIDE POST NEW ITEM
router.post("/post-item", checkToken, (req, res) => {
    let sql = `INSERT INTO  items SET ?`;
    let query = db.query(sql, {
        itemName: req.body.itemName,
        stockQty: req.body.stockQty,
        category: req.body.category,
        price: req.body.price,
        details: req.body.details,
        searchWords: req.body.searchWords,
        images: req.body.images
    }, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result);
        }
    });
});

//SERVER SIDE PUT/UPDATE ITEM
router.put("/updateItem/", checkToken, (req, res) => {
    let sql = `UPDATE items SET stockQty = '${req.body.stockQty}', price = '${req.body.price}', category = '${req.body.category}', details = '${req.body.details}',  searchWords= '${req.body.searchWords}', images= '${req.body.images}' WHERE itemName = '${req.body.itemName}'`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result);
        }
    });
});


//SERVER SIDE UPDATE REVIEW 

router.put("/update-review/", checkToken, (req, res) => {
    let sql = `UPDATE items SET reviewData = '${req.body.reviewData}' WHERE itemName = '${req.body.itemName}'`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(result);
        }
    });
});

//SERVER SIDE DELETE ITEM BY NAME
router.delete("/delete-item/:itemName", checkToken, (req, res) => {
    let sql = `DELETE FROM items WHERE itemName = '${req.params.itemName}'`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        }
        else {
            res.send(result);
        }
    });
});

module.exports = router;





