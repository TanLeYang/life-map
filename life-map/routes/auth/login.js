const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  let message = "Log in page"
  res.json({
    message: message
  })
})

module.exports = router;
