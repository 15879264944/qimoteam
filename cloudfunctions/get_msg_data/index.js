// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//获取数据库集合
const db = cloud.database()
//获取数据库操作符
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event==>",event)
  //如果有传入startTime参数或endTime参数，则event.time要修改
  if(event.startTime){
    event.time=_.gte(event.startTime).and(_.lte(event.endTime))
  }

  return await db.collection("msg_data").where({
    date:event.time,
    userInfo:event.userInfo
  }).get()
}