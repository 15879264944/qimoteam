// miniprogram/pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth:false,  //判断用户是否授权
    userInfo:{
      nickName:'请先登入'
    },  //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户的授权状态
    wx.getSetting({
      success:res => {
        console.log(res)
        if(res.authSetting['scope.userInfo']){
          console.log("用户已授权")
          //获取用户信息
          wx.getUserInfo({
            success:e => {
              //console.log(e)
              //数据响应
              this.setData({
                userInfo:e.userInfo,
                isAuth:true
              })
            }
          })
        }
      }
    })
  },
  getUserInfo(e){
    console.log(e)
    if(e.detail.userInfo){
      //用户授权成功
      this.setData({
        userInfo:e.detail.userInfo,
        isAuth:true
      })
    }
  }
  
})