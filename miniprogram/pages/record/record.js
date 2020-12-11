// miniprogram/pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingTitle:[
      {
        name:"支出",
        type:"pay",
        isAct:true
      },
      {
        name: "收入",
        type: "income",
        isAct:false
      }
    ],
    arr:[
      [1,2,3,4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9],
      [1,2]
    ],
    accountData:[
      {
        name:"现金",
        type:"xj",
        isAct:true
      },
      {
        name:"微信钱包",
        type:"WeChat",
        isAct:false
      },
      {
        name:"支付宝",
        type:"zfb",
        isAct:false
      },
      {
        name:"储蓄卡",
        type:"cxk",
        isAct:false
      },
      {
        name:"信用卡",
        type:"信用卡",
        isAct:false
      },
    ],
    //轮播图标数据
    bannerType:{
      pay:[],
      income:[]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取图标数据
    this.getBookingType();
  },
  titleTap(e){
    console.log(e)
    //获取当前点击的数据对应的下标
    var index = e.currentTarget.dataset.index;
    //获取当前修改的数据名称
    var type = e.currentTarget.dataset.type;
    //判断当前点击的数据是否是激活状态，如果是则不执行任何操作
    if(this.data[type][index].isAct){
      return; //终止所有代码
    }
    //取消上一个激活的数据
    for(var i =0;i<this.data[type].length;i++){
      if(this.data[type][i].isAct){
        this.data[type][i].isAct = false;
        break;  //找到激活数据，即可终止循环
      }
    }

    //设置当前点击的数据为激活状态
    this.data[type][index].isAct = true;
    
    //数据响应重新设置
    this.setData({[type]:this.data[type]})
  },

  //获取图标数据
  getBookingType(){
    //调用云函数
    wx.cloud.callFunction({
      name:"get_booking_type",
      success:res => {
        //console.log("成功==>",res)
        //获取返回的数据
        var data = res.result.data;
        // console.log(data)

        //将数据分类，根据收入还是支出
        var banner = {
          pay:[],
          income:[]
        }
        data.forEach(v =>{
          // if(v.type == "pay"){
          //   banner.pay.push(v)
          // }else{
          //   banner.income.push(v)
          // }
          banner[v.type].push(v)
        })
        // console.log(banner)

        for(var k in banner){
          //k:对象的键名
          console.log(banner[k])
          //开始截取下变标
          var beginIndex = 0;
          //while(){} 条件循环语句
          while(beginIndex < banner[k].length){
            //数据截取，返回一个新的数组
            var newArr = banner[k].slice(beginIndex,beginIndex+8)
            this.data.bannerType[k].push(newArr)
            beginIndex+=8;
          }
        }
        this.setData({
          bannerType:this.data.bannerType
        })
      },
      fail:err => {
        console.log("失败==>",err)
      }
    })
  }

})