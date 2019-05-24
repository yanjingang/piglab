const uploadFileUrl = require('../../../../config').uploadFileUrl
const requestUrl = require('../../../../config').requestUrl

var app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: '人脸识别-小猪实验室',
      path: 'page/piglab/pages/face/face'
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
    detect_faces: [],  //最后一次拍照识别结果
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
    // this.takePhoto()
  },

  //追踪摄像头中的人脸并识别 
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
    var takephonewidth
    var takephoneheight
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
        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'data',
          formData: {
            'type': 'face'
          },
          success(res) {
            console.log('uploadImage success, res is:', res)
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
            /*wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })*/
            var ctx = wx.createContext();
            ctx.setStrokeStyle('#00c853');
            ctx.setFillStyle('#00c853');
            ctx.lineWidth = 1;
            for (let j = 0; j < res.data['faces'].length; j++) {
              var face = res.data['faces'][j];
              var x = face['rect'][0] / takephonewidth * that.data.windowWidth;
              var y = face['rect'][1] / takephoneheight * 300;
              var w = (face['rect'][2] - face['rect'][0]) / takephonewidth * that.data.windowWidth;
              var h = (face['rect'][3] - face['rect'][1]) / takephoneheight * 300;
              var tag = face['faceid'] + " " + face['weight'].toFixed(2);
              ctx.setFontSize(14);
              ctx.fillText(tag, x + 2, y + 15);
              ctx.strokeRect(x, y, w, h);
              console.log(x, y, w, h, takephonewidth, that.data.windowWidth, tag);
            }
            wx.drawCanvas({
              canvasId: 'canvas',
              actions: ctx.getActions()
            });
            //next take photo
            clearInterval(that.interval);
            if (that.data.canvasshow == true) {
              console.log('start next takePhoto.');
              that.interval = setInterval(that.takePhoto, 500)
            }
          },
          fail({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      }
    })
  },
  //拍照并识别人脸 
  onDetect() {
    var that = this;
    var takephonewidth;
    var takephoneheight;
    that.setData({//清空识别结果
      detect_faces: []
    });
    // clear
    var ctx = wx.createContext();
    ctx.setStrokeStyle('#00c853');
    ctx.setFillStyle('#00c853');
    ctx.lineWidth = 1;
    wx.drawCanvas({
      canvasId: 'canvasresult',
      actions: ctx.getActions()
    })
    that.ctx.takePhoto({
      quality: 'heigh',
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
        that.setData({
          src: res.tempImagePath
        })
        const imageSrc = res.tempImagePath
        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'data',
          formData: {
            'type': 'face'
          },
          success(res) {
            console.log('uploadImage success, res is:', res)
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
                canvasId: 'canvasresult',
                actions: ctx.getActions()
              })
              return
            }
            res = JSON.parse(res.data)
            console.log('onDetect success, res is:')
            console.log(res)
            if (res.status != 0) {
              wx.showToast({
                title: '上传失败' + res.status,
                icon: 'none',
                duration: 1000
              })
              var ctx = wx.createContext();
              ctx.setStrokeStyle('#00c853');
              ctx.lineWidth = 1;
              wx.drawCanvas({
                canvasId: 'canvasresult',
                actions: ctx.getActions()
              })
              return
            }
            /*wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })*/
            that.setData({//更新最后一次识别结果
              detect_faces: res.data['faces']
            });
            var ctx = wx.createContext();
            ctx.setStrokeStyle('#00c853');
            ctx.setFillStyle('#00c853');
            ctx.lineWidth = 1;
            for (let j = 0; j < res.data['faces'].length; j++) {
              var face = res.data['faces'][j];
              var x = face['rect'][0] / takephonewidth * that.data.windowWidth;
              var y = face['rect'][1] / takephoneheight * 300;
              var w = (face['rect'][2] - face['rect'][0]) / takephonewidth * that.data.windowWidth;
              var h = (face['rect'][3] - face['rect'][1]) / takephoneheight * 300;
              var tag = face['faceid'] + " " + face['weight'].toFixed(2);
              ctx.setFontSize(14);
              ctx.fillText(tag, x + 2, y + 15);
              ctx.strokeRect(x, y, w, h);
              console.log(x, y, w, h, takephonewidth, that.data.windowWidth, tag);
            }
            wx.drawCanvas({
              canvasId: 'canvasresult',
              actions: ctx.getActions()
            })
          },
          fail({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      }
    })

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
  //注册新的faceid
  onRegister(info) {
    const self = this;
    self.setData({
      userinfo: info.detail.userInfo
    });
    console.log(self.data.userinfo)
    wx.login({
      success() {
        app.globalData.hasLogin = true
        self.setData({
          hasLogin: true
        });
      }
    });
    if (self.data.detect_faces.length == 0 || !self.data.hasLogin || !self.data.userinfo) {
      wx.showToast({
        title: '请点击识别，待识别出人脸后再点击注册',
        icon: 'none',
        duration: 1000
      });
      //自动调整为前置摄像头
      self.setData({
        camera_position: 'front',
        camera_position_name: '后置'
      });
      return
    }
    var face_info = self.data.detect_faces[0];
    face_info['faceid'] = self.data.userinfo['nickName'];
    console.log(face_info);
    wx.request({
      url: requestUrl,
      data: {
        'req_type': 'face_register',
        'face_info': face_info
      },
      success(result) {
        wx.hideToast();
        console.log('req res: ', result)
        if (result['statusCode'] != 200) { //网络通信失败
          console.log('req http status err: ', result['statusCode'])
          self.setData({
            msg: '网络请求失败！ ' + result['statusCode']
          });
          wx.showToast({
            title: '网络请求失败',
            icon: 'none',
            duration: 3000
          });
        } else if (result['data']['code'] != 0) {  //状态异常
          console.log('req ret code err: ', result['data']['code'] + result['data']['msg'])
          self.setData({
            msg: result['data']['msg']
          });
          wx.showToast({
            title: result['data']['msg'],
            icon: 'none',
            duration: 3000
          });
        } else if (result['statusCode'] == 200 && result['data']['code'] == 0) { //执行Human走子
          self.data = result['data']['data']
          console.log('data: ', self.data)
          if (self.data['end']) {
            wx.showModal({
              title: 'FACEID注册',
              content: 'FACEID注册成功！',
              showCancel: false,
              confirmText: '确定'
            });
          }
        }
      },
      fail({
        errMsg
      }) {
        wx.hideToast();
        console.log('req fail: ', errMsg)
        self.setData({
          msg: '网络请求失败！ ' + errMsg
        });
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 3000
        })
      }
    });
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