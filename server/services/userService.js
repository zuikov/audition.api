const User = require('../models/user');
const Session = require('../models/Session');
const status = require('../utils/userStatus');
require('dotenv').config();

class userService {
  static async addUserName(id, firstName, lastName) {
    return await User.findByIdAndUpdate(id, {name: {firstName, lastName}});
  }

  static async giveNotice(session) {
    await session.giveNotice();
    if (await session.isBlock()) {
      const user = await User.findByID({_id: session.id});
      await user.setStatus(status.block);
      throw new Error('User Blocked!');
    }
  }
}

module.exports = userService;
