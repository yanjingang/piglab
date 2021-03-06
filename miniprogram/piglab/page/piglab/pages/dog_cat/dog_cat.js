const uploadFileUrl = require('../../../../config').uploadFileUrl

Page({
  onShareAppMessage() {
    return {
      title: '猫狗识别-小猪实验室',
      path: 'page/piglab/pages/dog_cat/dog_cat'
    }
  },
  data: {
    url:'',
    requrl:'',
    res:{},
  },
  chooseImage() {
    const self = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success(res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])

        const imageSrc = res.tempFilePaths[0]

        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'data',
          formData: {
            'type': 'dog_cat'
          },
          success(res) {
            console.log('uploadImage success, res is:', res)
            if(res.statusCode!=200){
              wx.showToast({
                title: '网络异常',
                icon: 'none',
                duration: 1000
              })
              return
            }
            res = JSON.parse(res.data)
            console.log('res json, res is:', res)
            if (res.status != 0) {
              wx.showToast({
                title: '上传失败' + res.status,
                icon: 'none',
                duration: 1000
              })
              return
            }
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            self.setData(res.data)
          },
          fail({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      },

      fail({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  }
})
