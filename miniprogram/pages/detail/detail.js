// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options==>',options)
    //从本地缓存里获取对应的数据
    wx.getStorage({
      key:options.id,
      success:res => {
        console.log(res.data)
        //对日期格式进行处理
        var dateArr = res.data.date.split('-');//分割，返回一个数组
        console.log(dateArr)
        res.data.date = dateArr[0]+'年'+Number(dateArr[1])+'月'+Number(dateArr[2])+'日'
        this.setData({
          info:res.data
        })
      },
      
    })
  },
  //删除数据
  deleteMsgData(){
    wx.showLoading({
      title:"正在删除",
    })
    //调用云函数
    wx.cloud.callFunction({
      name:"delete_msg_data",
      data:{
        id:this.data.info._id
      },
      success:res => {
        console.log("删除成功==>",res)
        wx.hideLoading({
          success:res => {
            //删除完成，返回首页
            wx.navigateBack()
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})