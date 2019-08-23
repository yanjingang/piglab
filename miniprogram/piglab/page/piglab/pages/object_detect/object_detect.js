const uploadFileUrl = require('../../../../config').uploadFileUrl

Page({
  onShareAppMessage() {
    return {
      title: '对象检测-小猪实验室',
      path: 'page/piglab/pages/object_detect/object_detect'
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
            'type': 'object_detect',
            'tag_img': '1',  //在图片上标记目标位置
            'detect_face':'0',  //识别人脸
            'tts_caption': 'pos',  //图像描述语音合成
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
            //播放tts合成声音
            let manager = wx.getBackgroundAudioManager();
            manager.title = res.data.res.caption.pos;
            manager.singer = '图像描述';
            manager.src = res.data.res.tts_caption;
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
