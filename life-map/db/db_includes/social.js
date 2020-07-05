module.exports = function (crud) {
  return {
    // follow requests
    create_follow_request: require('../tables/social/create_follow_request.js')(crud),
    get_follow_requests: require('../tables/social/get_follow_requests.js')(crud),
    delete_follow_request: require('../tables/social/delete_follow_request.js')(crud),

    // follower relationship
    create_follower_relationship: require('../tables/social/create_follower_relationship.js')(crud),
    get_followers: require('../tables/social/get_followers.js')(crud),
    get_following: require('../tables/social/get_following.js')(crud),
    delete_follower_relationship: require('../tables/social/delete_follower_relationship.js')(crud)
  }
}