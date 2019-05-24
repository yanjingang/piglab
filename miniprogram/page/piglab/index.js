Page({
  onShareAppMessage() {
    return {
      title: '小猪实验室',
      path: 'page/piglab/index'
    }
  },

  data: {
    list: [{
        id: 'image_ai',
        name: '图像识别',
        open: true,
        pages: [
          /*{
            zh: '手写数字识别',
            url: 'digit/digit'
          },*/
          {
            zh: '猫狗识别',
            url: 'dog_cat/dog_cat'
          },
          /*{
            zh: '图像分类',
            url: 'classification/classification'
          },*/
          {
            zh: '人脸识别',
            url: 'face/face'
          }
        ]
      },
      {
        id: 'game_ai',
        name: 'GameAI',
        open: true,
        pages: [{
            zh: '五子棋AI',
            url: 'gomoku/gomoku'
          },
          {
            zh: '国际象棋AI',
            url: 'chess/chess'
          },
          /*{
            zh: '打砖AI',
            url: 'digit/digit'
          }*/
        ]
      }
      ,
      {
        id: 'tools',
        name: '小工具',
        open: true,
        pages: [
          {
            zh: '成语接龙',
            url: 'chengyu/chengyu'
          }
        ]
      }
    ],
    isSetTabBarPage: false,
  },
  onShow() {
    this.leaveSetTabBarPage()
  },
  onHide() {
    this.leaveSetTabBarPage()
  },
  kindToggle(e) {
    const id = e.currentTarget.id;
    const
      list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        if (list[i].url) {
          wx.navigateTo({
            url: 'pages/' + list[i].url
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },
  enterSetTabBarPage() {
    this.setData({
      isSetTabBarPage: true
    })
  },
  leaveSetTabBarPage() {
    this.setData({
      isSetTabBarPage: false
    })
  },
})