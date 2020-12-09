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
    ]
  },

  titleTap(e){
    console.log(e)
    //获取当前点击的数据对应的下标
    var index = e.currentTarget.dataset.index;

    //判断当前点击的数据是否是激活状态，如果是则不执行任何操作
    if(this.data.bookingTitle[index].isAct){
      return; //终止所有代码
    }

    //取消上一个激活的数据
    for(var i =0;i<this.data.bookingTitle.length;i++){
      if(this.data.bookingTitle[i].isAct){
        this.data.bookingTitle[i].isAct = false;
        break;  //找到激活数据，即可终止循环
      }
    }

    //设置当前点击的数据为激活状态
    this.data.bookingTitle[index].isAct = true;
    
    //数据响应重新设置
    this.setData({bookingTitle:this.data.bookingTitle})
  }


})