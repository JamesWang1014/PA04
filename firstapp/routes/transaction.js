/*this is the router for transaction page,
it will show all the transaction that the user has made, allows user to add/delete/edit transaction, and allow user to sort the transactoin by description, amount, date, and category*/
const express = require('express');
const router = express.Router();
const TransactionItem = require('../models/Transaction')
const User = require('../models/User');

isLoggedIn = (req,res,next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/transaction',
    isLoggedIn,
    async (req, res, next) => {
        let items=[]
        items = await TransactionItem.find({userId:req.user._id})
        res.render('transaction',{items});
    }

)
router.get('/transaction/groupBy/:category',
    isLoggedIn,
    async (req, res, next) => {
        let items=[]
        items = await TransactionItem.find({userId:req.user._id}).sort({Category:1})
        res.render('transaction',{items});
    }
)
router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const transaction = new TransactionItem(
        {
            Description: req.body.description,
            Amount: req.body.amount,
            Category: req.body.category,
            Date: req.body.date,
            userId: req.user._id
        })
      await transaction.save();
      res.redirect('/transaction')
});

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:itemId")
      await TransactionItem.deleteOne({_id:req.params.itemId});
      res.redirect('/transaction')
});

module.exports = router;