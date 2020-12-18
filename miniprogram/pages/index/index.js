// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today:'', //当天日期
    dayMsgData:[], //某天数据
    isOnload:true,  //判断页面是否首次进入
    currentDate:'',  //当前选中的日期
    isToday:true,  //判断选中的日期是否当天
    dayMoney:{  //某天的总收入和总支出
      pay:0,
      income:0
    },
    currentMonth:'',  //当前选中月份
    monMoney:{    //当月的总收入于总支出
      pay:0,
      income:0
    },
    surplus:{    //本月结余数
      num:0,
      decimal:'00'
    },
    isAuth:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当天日期
    this.getToday();
    //获取当天数据
    wx.getSetting({
      success:res => {
        if(res.authSetting['scope.userInfo']){
          //授权成功获取数据
           this.getDayMsgData(this.data.today);
          //获取当前月份
          this.getMonMsgData(this.data.currentMonth);
          this.setData({
            isAuth:true
          })
        }else{
          wx.showToast({
            title:"请先登入",
            icon:"none",
            duration:2000,
            mask:true
          })
        }
      }
    })
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.isOnload){
      //首次进入
      this.data.isOnload = false;
    }else{
      //获取当天日期
      this.getToday();
      wx.getSetting({
        success:res => {
          if(res.authSetting['scope.userInfo']){
            //授权成功获取数据
             this.getDayMsgData(this.data.today);
            //获取当前月份
            this.getMonMsgData(this.data.currentMonth);
            this.setData({
              isAuth:true
            })
          }else{
            wx.showToast({
              title:"请先登入",
              icon:"none",
              duration:2000,
              mask:true
            })
          }
        }
      })
    }
    
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
      currentDate:m+'月'+d+'日',
      currentMonth:y+'-'+this.addZero(m)
    })
    //console.log(this.data.today)
  },
  //补零函数
  addZero(num){
    return num<10 ? '0'+num : num;
  },
  //获取某天数据
  getDayMsgData(day){
    //day:某天日期
    console.log(day)
    //清除本地缓存
    wx.clearStorage();

    //收入支出清零
    this.data.dayMoney.pay =0;
    this.data.dayMoney.income =0;
    //显示加载框
    wx.showLoading({
      title:'正在加载',
      mask:true
    })
    //调用云函数获取数据
    wx.cloud.callFunction({
      name:'get_msg_data',
      data:{
        time:day
      },
      success:res => {
        console.log("获取数据成功==>",res)
        //获取返回的数据
        var data = res.result.data
        //reverse()数据排序颠倒
        data.reverse();
        //调整金额格式
        data.forEach(v => {
          //console.log(v._id)
          //将每条数据存储在本地缓存里
          wx.setStorage({
            key:v._id,
            data:v
          })

          //toFixed:保留俩位小数
          v.money = Number(v.money).toFixed(2);
          // if(v.costType == 'pay'){
          //   this.data.dayMoney.pay += Number(v.money);
          // }else{
          //   this.data.dayMoney.income += Number(v.money);
          // }
          //简写
          this.data.dayMoney[v.costType] += Number(v.money);
        })
        //强制保留俩个小数位
        this.data.dayMoney.pay = Number(this.data.dayMoney.pay).toFixed(2);
        this.data.dayMoney.income = Number(this.data.dayMoney.income).toFixed(2);

        if(day == this.data.isToday){
          this.data.isToday = true
        }else{
          this.data.isToday = false
        }
        //数据响应
        this.setData({
          dayMsgData:data,
          isToday:this.data.isToday,
          dayMoney:this.data.dayMoney
        })
        //关闭加载框
        wx.hideLoading();
      },
      fail:err => {
        console.log("获取数据失败==>",err)
      }
    })
  },
  //选择日期函数
  selectDate(e){
    console.log(e)
    //split()分割字符串，返回一个数组
    var dateArr = e.detail.value.split('-');
    //获取今年年份
    var year = new Date().getFullYear();
    //判断选中日期是否为今年
    if(dateArr[0] == year){
      this.data.currentDate = Number(dateArr[1])+'月'+Number(dateArr[2])+'日';
    }else{
      this.data.currentDate = dateArr[0]+'年'+Number(dateArr[1])+'月'+Number(dateArr[2])+'日';
    }

    //数据响应
    this.setData({
      currentDate:this.data.currentDate
    })

    this.getDayMsgData(e.detail.value);
  },
  //获取月份数据
  getMonMsgData(month){

    //总收入总支出清零
    this.data.monMoney.pay = 0;
    this.data.monMoney.income = 0;

    // console.log("2020-12-01" < "2019-12-14")
    //获取月份数据的原理：集合的数据日期只要在当月1号到最后一天的范围之内，则这条数据就是符合要求的
    //只要集合数据的日期大于等于当月1号且小于等于当月最后一天，则条件符合

    //console.log(month)
    var start = month + "-01";//开始时间
    //console.log(new Date(2020,2,.).getDate()) //获取某月有多少天
    var dateArr = month.split('-');
    var dayNum = new Date(dateArr[0],dateArr[1],0).getDate();
    //结束时间 当月的最后一天
    var end = month + "-" +dayNum;
    console.log(start,end)

    //调用云函数，获取某月数据
    wx.cloud.callFunction({
      name:"get_msg_data",
      data:{
        startTime:start,
        endTime:end
      },
      success:res =>{
        console.log("获取某月数据成功==>",res)
        //获取返回的数据
        var data = res.result.data;
        ///console.log(data)
        data.forEach(v =>{
          this.data.monMoney[v.costType] += Number(v.money);
        })
        //结余 = 收入 - 支出
        var surNum = Number(this.data.monMoney.income - this.data.monMoney.pay).toFixed(2);
        //console.log(surNum)
        
        var surArr = surNum.split('.')
        //console.log(surArr)
        //强制保留俩个小数位
        this.data.monMoney.pay = Number(this.data.monMoney.pay).toFixed(2);
        this.data.monMoney.income = Number(this.data.monMoney.income).toFixed(2);

        this.setData({
          monMoney:this.data.monMoney,
          'surplus.num':surArr[0],
          'surplus.decimal':surArr[1]
        })
      },
      fail:err => {
        console.log("获取某月数据成功==>",err)
      }
    })
  },
  //跳转详情页面
  navToDetail(e){
    //console.log(e)
    //获取当前点击的数据ID
    var id = e.currentTarget.dataset.id;
    //console.log(id)
    wx.navigateTo({
      url:`../detail/detail?id=${id}`
    })
  }
})