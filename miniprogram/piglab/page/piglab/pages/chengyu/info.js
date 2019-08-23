const requestUrl = 'https://www.yanjingang.com/chengyu/api/info.php'
Page({
  onShareAppMessage() {
    return {
      title: data.name+'-成语信息-小猪实验室',
      path: 'page/piglab/pages/chengyu/info?id=' + data.id + '&name=' + data.name + '&py=' + data.py + '&info=' + data.info
    }
  },
  data: {
    /*id: "4bfd388fdf6b916a54348bafee4e8846",
    name: "天之骄子",
    py: "tianzhijiaozi",
    first: "tian",
    last: "zi",
    score: "10",
    info: "①汉时匈奴用以自称。后亦泛称强盛的边地少数民族或其首领。②比喻有才能、有影响的人。③现有时亦用于讥讽骄气十足的人。 ",
    next: [
        {
            id: "523b5175a0cf37468fa477640a18344b",
            name: "孜孜不倦",
            py: "zizibujuan",
            first: "zi",
            last: "juan",
            score: "10",
            info: "勤奋努力，不知疲倦。 "
        }, 
        {
            id: "421db31887c5b598e356287dde187cc2",
            name: "子虚乌有",
            py: "zixuwuyou",
            first: "zi",
            last: "you",
            score: "10",
            info: "指虚构的、不存在的事情。 "
        }
    ]*/
  },
  onLoad: function (data) {
    console.log(data)
    let that = this;
    this.setData(data);

    wx.request({
      url: requestUrl,
      data: {
        id: data.id
      },
      success(res) {
        wx.hideToast()
        console.log('request success: ', res)
        that.setData(res['data']['data']);
      },
      fail({
        errMsg
      }) {
        wx.hideToast()
        console.log('request fail: ', errMsg)
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 3000
        });
      }
    });
  },
  onInfo: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let py = e.currentTarget.dataset.py;
    let info = e.currentTarget.dataset.info;
    console.log(id);
    console.log(name);
    console.log(py);
    console.log(info);
    wx.navigateTo({
      url: 'info?id=' + id + '&name=' + name + '&py=' + py + '&info=' + info
    });
  },

})
