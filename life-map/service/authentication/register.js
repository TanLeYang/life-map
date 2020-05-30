const db = require('../../db/db.js')
const bcrypt = require('bcrypt')

const registerUser = async (email, name, password) => {
  try {
    const existing = await db.get_user_by_email.execute(email)
    if (existing.length !== 0) {
      return {
        success: false,
        message: 'duplicate'
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      await db.register_user.execute(name, email, hashedPassword)
      return {
        success: true,
        message: `${name} registered with ${email}`
      }
    }
  } catch (err) {
    throw (err)
  }
}

module.exports = registerUser;