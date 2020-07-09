const db = require('../../db/db.js')
const homepage = require('../homepage/homepage.js');
const social = require('../social/social.js');
const AWS = require("../aws-upload/aws.js");

const profile = () => {
  let modules = {};

  modules.getUserProfile = async (id) => {
    const [profile, entries, socialInfo] = await Promise.all([
      db.get_user_profile.execute(id), 
      homepage.arrangeUserData(id),
      social.arrangeSocialInfo(id)
    ]);
    if (profile[0].profile_pic) {
      const picture = await AWS.retrieve(profile[0].profile_pic);
      profile[0].profile_pic = picture.data;
    }
    return {
      ...profile[0],
      entries: entries,
      ...socialInfo
    }
  }

  modules.updateUserProfile = async (profile_id, id, bio, name) => {
    return Promise.all([
      db.update_bio.execute(profile_id, bio),
      db.update_name.execute(id, name)
    ]);
  }

  modules.getProfilePic = async (id) => {
    const file_name = (await db.get_profile_pic.execute(id))[0].profile_pic;
    if (file_name) {
      return AWS.retrieve(file_name).data;
    } else {
      return null;
    }
  }

  modules.updateProfilePic = async (profile_id, file) => {
    const file_name = file ? file.name : null;
    let promises = [];
    promises.push(db.update_profile_pic.execute(profile_id, file_name));
    if (file_name) {
      promises.push(AWS.upload(file));
    }
    return Promise.all(promises);
  }

  return modules;
}

module.exports = profile();