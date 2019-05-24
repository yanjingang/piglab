const requestUrl = require('../../../../config').requestUrl
Page({
  onShareAppMessage() {
    return {
      title: 'input',
      path: 'page/component/pages/input/input'
    }
  },

  data: {
    focus: false,
    inputValue: '',
    items: [
      {
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
      }
    ]
  },

  onSearch: function (e) {
    console.log(e)
    let word = e.detail.value;
    console.log(word)
    this.setData({
      items: []
    });
    if (word == '') {
      return;
    }
    wx.request({
      url: requestUrl,
      data: {
        'req_type': 'chengyu',
        'word': word
      },
      success(result) {
        wx.hideToast()
        console.log('request success: ', result)
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
})
