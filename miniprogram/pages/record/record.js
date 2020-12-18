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
    today:'', //当天日期
    //用户填写信息
    info:{
      date:'',
      money:'',
      comment:''
    },
    isAuth:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取图标数据
    this.getBookingType();
    //获取当天日期
    this.getToday();
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //判断用户是否授权，如果没有授权，则不能添加数据
    wx.getSetting({
     success: res => {
       if(res.authSetting['scope.userInfo']){
         console.log("授权成功")
         this.data.isAuth = true
       }
     }
   })
 },
  titleTap(e){
    //console.log(e)
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
        //如果点击是支出标题的时候才执行以下代码
        if(type == "bookingTitle"){
          var sort = this.data[type][i].type;
          for(var i = 0; i<this.data.bannerType[sort].length; i++){
            for(var j = 0; j<this.data.bannerType[sort][i].length;j++){
              if(this.data.bannerType[sort][i][j].isAct){
                this.data.bannerType[sort][i][j].isAct = false;
                break;  //终止循环
              }
            }
          }
        }
        break;  //找到激活数据，即可终止循环
      }
    }
    //设置当前点击的数据为激活状态
    this.data[type][index].isAct = true;
    //数据响应重新设置
    this.setData({
      [type]:this.data[type],
      bannerType:this.data.bannerType
    })
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

          //添加激活字段
          v.isAct=false;

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
          //console.log(banner[k])
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
  },
  //轮播图点击事件
  bannerTap(e){
    //console.log(e)
    //获取点击的图标类型
    var type = e.currentTarget.dataset.type;
    //获取点击的对应华科的下标
    var index = e.currentTarget.dataset.index;
    //获取点击的图标对应的下标
    var id = e.currentTarget.dataset.id;
    //console.log(type,index,id)
    //console.log(this.data.bannerType)
    //判断当前点击的图标是否为激活状态，如果是则取消激活，不是则设置激活
    if(this.data.bannerType[type][index][id].isAct){
      this.data.bannerType[type][index][id].isAct = false
    }else{
      //取消上一个激活的图标
      for(var i = 0;i< this.data.bannerType[type].length;i++){
        for(var j = 0;j<this.data.bannerType[type][i].length;j++){
          if(this.data.bannerType[type][i][j].isAct){
            this.data.bannerType[type][i][j].isAct = false;
            break; //终止循环
          }
        }
      }
      //设置当前点击的图标为激活状态
      this.data.bannerType[type][index][id].isAct = true;
    }
    //数据响应
    this.setData({
      bannerType:this.data.bannerType
    })
  },
  //获取当天日期
  getToday(){
    //获取时间对象
    var time = new Date();
    //获取年份
    var y = time.getFullYear();
    //获取月份
    var m = time.getMonth()+1;
    //获取日
    var d = time.getDate();

    //数据响应
    this.setData({
      today:y+'-'+this.addZero(m)+'-'+this.addZero(d),
      'info.date':y+'-'+this.addZero(m)+'-'+this.addZero(d)
    })
    //console.log(this.data.today)
  },
  //补零函数
  addZero(num){
    return num<10 ? '0'+num : num;
  },
  //获取用户填写信息
  getInfo(e){
    //console.log(e);
    //获取当天修改的数据名称
    var type = e.currentTarget.dataset.type;
    //修改数据
    this.data.info[type] = e.detail.value;
    //数据响应
    this.setData({
      info:this.data.info
    })

  },
  //添加一条数据
  saveMsgData(){

   
    if(!this.data.isAuth){
      //未授权
      wx.showToast({
        title:"请先登入",
        icon:"none",
        duration:2000,
        mask:true
      })
      return;//未授权不执行一下代码
    }

    //存放数据
    var msgData = {};
    //获取收入支出标题数据
    for(var i = 0; i < this.data.bookingTitle.length; i++){
      if(this.data.bookingTitle[i].isAct){
        msgData.costTitle = this.data.bookingTitle[i].name;
        msgData.costType = this.data.bookingTitle[i].type;
        break;
      }
    }
    //判断用户是否有选择图标数据
    var isBanner = false
    //获取激活的图标数据
    for(var i = 0;i< this.data.bannerType[msgData.costType].length;i++){
      for(var j = 0;j<this.data.bannerType[msgData.costType][i].length;j++){
        if(this.data.bannerType[msgData.costType][i][j].isAct){
          msgData.iconImg = this.data.bannerType[msgData.costType][i][j].imgUrl;
          msgData.iconTitle = this.data.bannerType[msgData.costType][i][j].Title;
          isBanner = true;
          break; //终止循环
        }
      }
    }
    //如果用户没有激活图标，则终止代码，不提交数据
    if(!isBanner){
      wx.showToast({
        title:'请选择图标类型'
      })
      return; //终止代码
    }
    //获取账户选择数据
    for(var i = 0; i < this.data.accountData.length; i++){
      if(this.data.accountData[i].isAct){
        msgData.accountTitle = this.data.accountData[i].name;
        msgData.accountType = this.data.accountData[i].type;
      }
    }
    //判断金额是否为空
    if(this.data.info.money == ''){
      wx.showToast({
        title:'请输入记账金额'
      })
      return;
    }

    //获取用户填写的数据
    for(var k in this.data.info){
      //console.log(this.data.info[k])
      msgData[k] = this.data.info[k]
    }
    //显示加载框
    wx.showLoading({  //showLoading和showToast只能存在一个
      title:"正在保存",
      mask:true
    })

    //使用云函数，添加数据
    wx.cloud.callFunction({
      name:'add_msg_data',
      data:msgData,
      success:res=>{
        console.log("添加成功==>",res)
        //数据保存成功后充值数据
        this.resetData()

        wx.showToast({
          title:"添加成功",
          icon:"success",
          duration:2000,
          mask:true
        })
      },
      fail:err=>{
        console.log("添加失败==>",err)
      }
    })
    console.log(msgData)
  },
  //重置数据函数
  resetData(){
    //重置支出收入
    this.data.bookingTitle[0].isAct = true;
    this.data.bookingTitle[1].isAct = false;
    //重置图标数据
    for(var k in this.data.bannerType){
      for(var i = 0;i< this.data.bannerType[k].length;i++){
        for(var j = 0;j<this.data.bannerType[k][i].length;j++){
          if(this.data.bannerType[k][i][j].isAct){
            this.data.bannerType[k][i][j].isAct = false
            break; //终止循环
          }
        }
      }
    }
    //重置账户选择
    this.data.accountData[0].isAct = true;
    for(var i = 1; i< this.data.accountData.length;i++){
      this.data.accountData[i].isAct = false;
    }
    //数据响应
    this.setData({
      bookingTitle:this.data.bookingTitle,
      bannerType:this.data.bannerType,
      accountData:this.data.accountData,
      info:{
        date:this.data.today,
        money:'',
        comment:''
      }
    })
  }
})