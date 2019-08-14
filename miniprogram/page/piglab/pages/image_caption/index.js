const uploadFileUrl = require('../../../../config').uploadFileUrl
const requestUrl = require('../../../../config').requestUrl

var app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: '目标检测-小猪实验室'
    }
  },
  data: {
    camera_position: 'back',   //默认后置
    camera_position_name: '前置', //操作按钮
    src: "",
    fengmian: "",
    videoSrc: "",
    who: "",
    openid: "",
    token: "",
    windowWidth: 0,
    trackshow: "追踪",
    canvasshow: true,
    res: {},  //最后一次检测结果
  },

  onLoad() {
    var that = this
    //登录状态
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    //屏幕宽度
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })
    that.ctx = wx.createCameraContext()
    console.log("onLoad")
  },

  onReady: function () {
    var that = this
    //打开就默认直接追踪
    that.setData({
      trackshow: "停止",
      canvasshow: true
    })
    that.interval = setInterval(that.takePhoto, 1000)
  },

  //追踪摄像头中的目标并识别 
  onTrack(e) {
    var that = this
    if (e.target.dataset.trackshow == "追踪") {
      that.setData({
        trackshow: "停止",
        canvasshow: true
      })
      that.takePhoto();
    } else {
      that.setData({
        trackshow: "追踪",
        canvasshow: false
      });
      clearInterval(that.interval);
    }
  },

  takePhoto() {
    console.log("takePhoto")
    var that = this
    clearInterval(that.interval); //本次拍照上传未得到返回前暂停定时任务
    var takephonewidth
    var takephoneheight

    /*const version = wx.getSystemInfoSync().SDKVersion
    console.log("version: " + version)
    if (version > '2.7.0') {
      const listener = that.ctx.onCameraFrame((frame) => {
        console.log(frame.data, frame.width, frame.height)
      })
      listener.start()
    }*/
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
            takephoneheight = res.height
          }
        })
        const imageSrc = res.tempImagePath
        if (that.data.canvasshow == false) {  //单次检测时先提前显示要上传的照片
          that.setData({
            src: imageSrc
          });
        }
        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'data',
          formData: {
            'type': 'object_detect',
            'tag_img': '1',  //在图片上标记目标位置
            'detect_face': '1',  //识别人脸
            'tts_caption': 'pos',  //图像描述语音合成
          },
          success(res) {
            console.log('uploadImage success, res is:', res)
            if (that.data.canvasshow == true) {
              console.log('start next takePhoto.');
              that.interval = setInterval(that.takePhoto, 1000)
            }
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络异常',
                icon: 'none',
                duration: 1000
              })
              var ctx = wx.createContext();
              ctx.setStrokeStyle('#00c853');
              ctx.lineWidth = 1;
              wx.drawCanvas({
                canvasId: 'canvas',
                actions: ctx.getActions()
              })
              return
            }
            res = JSON.parse(res.data);
            console.log('takePhoto success, res is:');
            console.log(res);
            if (res.status != 0) {
              wx.showToast({
                title: '上传失败' + res.status,
                icon: 'none',
                duration: 1000
              });
              var ctx = wx.createContext();
              ctx.setStrokeStyle('#00c853');
              ctx.lineWidth = 1;
              wx.drawCanvas({
                canvasId: 'canvas',
                actions: ctx.getActions()
              })
              return 
            }
            that.setData({  //更新最后一次识别结果
              res: res.data.res,
              src: res.data.url,
            });
            //播放tts合成声音
            let manager = wx.getBackgroundAudioManager();
            manager.title = res.data.res.caption.pos;
            manager.singer = '图像描述';
            manager.src = res.data.res.tts_caption;
          },
          fail({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
            if (that.data.canvasshow == true) {
              console.log('start next takePhoto.');
              that.interval = setInterval(that.takePhoto, 1000)
            }
          }
        })

      }
    })
  },
  //拍照并识别目标 
  onDetect() {
    var that = this
    //点击检测按钮时取消追踪
    that.setData({
      trackshow: "追踪",
      canvasshow: false
    });
    clearInterval(that.interval);
    that.takePhoto();
  },

  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      },
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        console.log(res)
        this.setData({
          fengmian: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  //前后摄像头切换
  onCameraPositionToggle() {
    this.setData({
      camera_position: this.data.camera_position === 'front'
        ? 'back' : 'front',
      camera_position_name: this.data.camera_position === 'front'
        ? '前置' : '后置'
    });
  },
  error(e) {
    console.log(e.detail)
  }

})