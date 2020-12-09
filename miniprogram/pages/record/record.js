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
    ]
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
  }


})