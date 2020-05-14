const tcb = require("@cloudbase/node-sdk");

const cloud = tcb.init({
  env: "云开发环境ID",
});
const db = cloud.database();
const _ = db.command;
exports.main = async (event, context) => {
  let res = {};
  const auth = cloud.auth().getUserInfo();
  const uid = auth.uid;
  if (uid != null) {
    const result = (
      await db
        .collection("shudu")
        .where({
          _id: "FIRST",
        })
        .get()
    ).data;
    if (result.length != 0) {
      let updateitem = {
        number: _.inc(1),
      };
      if (result[0].uid.indexOf(uid)) {
        updateitem.people = _.inc(1);
        updateitem.uid = _.push([uid]);
      }
      res.msg = await db.collection("shudu").doc("FIRST").update(updateitem);
    } else {
      res.msg = await db.collection("shudu").add({
        _id: "FIRST",
        number: 1,
        people: 1,
        uid: [uid],
      });
    }
    res.code = 0;
  } else {
    res.code = 404;
  }
  return res;
};
