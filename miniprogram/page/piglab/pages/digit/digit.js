const uploadFileUrl = require('../../../../config').uploadFileUrl

Page({
  onShareAppMessage() {
    return {
      title: '手写数字识别',
      path: 'page/piglab/pages/digit/digit'
    }
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
            'type': 'digit'
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
            if (res.status != 0) {
              wx.showToast({
                title: '上传失败' + res.status,
                icon: 'none',
                duration: 1000
              })
              return
            }
            const imageUrl = res.data['url']
            const imageDigit = res.data['label']
            const imageWeights = res.data['weight']
            const imageWeight = imageWeights[imageDigit]
            const imageIdx = res.data['idx']
            const imageMids = res.data['mid_imgs']
            console.log('uploadImage success, url:', res.data)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            self.setData({
              imageSrc, 
              imageUrl,
              imageDigit,
              imageWeight,
              imageWeights,
              imageIdx,
              imageMids
            })
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
