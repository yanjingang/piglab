const requestUrl = require('../../../../config').requestUrl
Page({
  onReady() {
    this.canvas_width = 306; //画布宽度
    this.piece_width = 5; //棋子半径
    this.border_width = 13; //边框宽度
    this.board_size = 8; //棋盘大小8*8
    this.line_width = (this.canvas_width - this.border_width * 2) / (this.board_size - 1); //网格线像素宽度
    this.session_id = Date.now()

    //canvas
    this.ctx = wx.createCanvasContext('board')
    //init board
    this.drawBoard()
    //move
    //this.drawPiece(4, 3, 0);
    //this.drawPiece(3, 4, 1);
    //clear
    //this.clearPiece(3, 4);
    //start play
    this.aiMove();
    // current info
    this.data = {'curr_player':0}
  },
  //绘制棋盘
  drawBoard() {
    this.ctx.beginPath();
    //背景图
    this.ctx.drawImage('../../../../image/background.jpeg', 0, 0, this.canvas_width, this.canvas_width)
    //网格
    for (var i = 0; i < this.board_size; i++) {
      var x = this.border_width + i * this.line_width;
      var y = this.canvas_width - this.border_width;
      this.ctx.lineWidth = 2;
      //竖线
      this.ctx.moveTo(x, this.border_width);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      //横线
      this.ctx.moveTo(this.border_width, x);
      this.ctx.lineTo(y, x);
      this.ctx.stroke();
      //标号
      this.ctx.setFontSize(10)
      //this.ctx.fillText(i, x - 4, y + this.border_width -2)  //底部
      //this.ctx.fillText(this.board_size - i - 1, y + 5, x + 5)  //右侧
      this.ctx.fillText(i, x - 2, this.border_width - 4) //顶部
      this.ctx.fillText(this.board_size - i - 1, this.border_width / 2 - 4, x + 5) //左侧
    }
    this.ctx.closePath();
    this.ctx.draw()
  },
  //绘制棋子
  drawPiece(h, w, player) {
    this.ctx.beginPath();
    var x = this.border_width + w * this.line_width;
    var y = this.border_width + (this.board_size - h - 1) * this.line_width;
    this.ctx.arc(x, y, this.border_width, 0, 2 * Math.PI); // 画圆
    //渐变
    var gradient = this.ctx.createCircularGradient(x + 1, y - 1, this.line_width - 1, x + 1, y - 1, 0);
    if (player == 1) { //黑
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#636766');
    } else {
      gradient.addColorStop(0, '#f1f1f1');
      gradient.addColorStop(1, '#f9f9f9');
    }
    this.ctx.fillStyle = gradient;
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.draw(true);
  },
  //消除棋子
  clearPiece(i, j) {
    //擦除该圆 (注：会连此区域的背景图都擦掉露出背景色，所以需要让convas的background-color与背景图rgb保持一致)
    this.ctx.clearRect((i) * this.line_width, (j) * this.line_width, this.border_width * 2, this.border_width * 2);
    // 重画该圆周围的格子
    this.ctx.beginPath();
    this.ctx.moveTo(this.border_width + i * this.line_width, j * this.line_width);
    this.ctx.lineTo(this.border_width + i * this.line_width, j * this.line_width + this.line_width);
    this.ctx.moveTo(i * this.line_width, j * this.line_width + this.border_width);
    this.ctx.lineTo((i + 1) * this.line_width, j * this.line_width + this.border_width);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.draw(true);
  },
  //棋盘点击事件
  onBoardClick(e) {
    //获取当前点击位置的坐标
    console.log(e)
    var x = e.touches[0].pageX - e.target.offsetLeft;// - this.border_width;
    var y = e.touches[0].pageY - e.target.offsetTop;// - this.border_width;
    var w = Math.floor(x / this.line_width);
    var h = this.board_size - Math.floor(y / this.line_width) - 1;
    console.log(h + ',' + w)
    //check是否可落子
    if (this.data['curr_player'] != 1 || this.data['end']) { //human固定执黑
      /*wx.showToast({
        title: '等待AI走子',
        icon: 'none',
        duration: 2000
      })*/
      return false;
    }
    var action = h * this.board_size + w;
    //console.log(action)
    //console.log(this.data['availables'].indexOf(action))
    if (this.data['availables'].indexOf(action) == -1) {
      /*wx.showToast({
        title: '错误的落子位置',
        icon: 'none',
        duration: 1000
      })*/
      return false;
    }
    //远端human走子+ai走子
    this.aiMove(h, w)
  },
  //获取AI走子
  aiMove(h, w) {
    const self = this
    var location = ''
    if (h !== undefined && w !== undefined) {
      //human走子提前画好
      this.drawPiece(h, w, 1)
      location = h + ',' + w
    }
    //请求ai走子
    wx.showToast({
      title: 'AI Loading',
      icon: 'loading',
      duration: 20000
    })
    this.data['curr_player'] = 0; //等待ai走子期间禁止人类走子
    wx.request({
      url: requestUrl,
      data: {
        'req_type': 'gomoku',
        'session_id': self.session_id,
        'location': location
      },
      success(result) {
        wx.hideToast()
        console.log('request success: ', result)
        //执行AI走子
        if (result['statusCode'] == 200 && result['data']['code'] == 0) {
          self.data = result['data']['data']
          console.log('data: ', self.data)
          self.drawPiece(self.data['location'][0], self.data['location'][1], self.data['player']);
          if (self.data['end']){
            var winner = ['白方','黑方'];
            wx.showModal({
              title: 'Game Over',
              content: '游戏结束，Winner is ' + winner[self.data['winner']],
              showCancel: false,
              confirmText: '确定'
            })
          }
        } else { //回滚human走子
          self.clearPiece(h, w);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail({
        errMsg
      }) {
        wx.hideToast()
        console.log('request fail: ', errMsg)
        //回滚human走子
        self.clearPiece(h, w);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }
})