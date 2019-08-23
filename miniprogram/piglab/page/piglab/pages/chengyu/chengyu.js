const requestUrl = 'https://www.yanjingang.com/chengyu/api/s.php'
Page({
  onShareAppMessage() {
    return {
      title: '成语接龙小助手-小猪实验室',
      path: 'page/piglab/pages/chengyu/chengyu'
    }
  },

  data: {
    focus: false,
    inputValue: '',
    items: [
      /*{
          id: "4bfd388fdf6b916a54348bafee4e8846",
          name: "天之骄子",
          py: "tianzhijiaozi",
          first: "tian",
          last: "zi"
      },
      {
          id: "2f2760014173c2613bd5c060b48cc1e8",
          name: "天南地北",
          py: "tiannandibei",
          first: "tian",
          last: "bei"
      },
      {
          id: "4d0f3d299b9cd3586c779e091c2284c1",
          name: "天涯海角",
          py: "tianyahaijiao",
          first: "tian",
          last: "jiao"
      }*/
    ]
  },
  onSearch: function (e) {
    console.log(e)
    let word = e.detail.value;
    let that = this;
    console.log(word)
    that.setData({
      items: []
    });
    if (word == '') {
      return;
    }
    wx.request({
      url: requestUrl,
      data: {
        'word': word
      },
      success(res) {
        wx.hideToast()
        console.log('request success: ', res)
        that.setData({
          items: res['data']['data']
        });
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
