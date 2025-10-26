function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function getRequestingUserUID(req) {
  return req.user ? req.user.uid : null;
}

module.exports = { isValidObjectId, getRequestingUserUID };
