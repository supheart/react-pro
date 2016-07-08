'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');

var imageDatas = require('../data/imageDatas.json');

//获取图片路径
imageDatas = (function getImageUrl(imageArr){
  for(var i = 0; i < imageArr.length; i++){
    var img = imageArr[i];
    img.imageURL = require('../images/' + img.fileName);
    imageArr[i] = img;
  }
  return imageArr;
})(imageDatas);

//获取某一范围的数值大小
function getRangeRandom(start, end){
  return Math.ceil(Math.random() * (end - start) + start);
}

//获取小于30度旋转的任意正负数值
function get30DegRandom(){
  return (Math.random() > 0.5 ? '+' : '-') + Math.ceil(Math.random() * 30);
}

//创建图片节点
var ImageFigure = React.createClass({
  //该图片节点的点击处理函数
  handleClick: function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render: function(){

    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate){
      (['MozTransform', 'msTransform', 'webkitTransform', 'transform']).forEach(function(value){
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    //如果改变图片居中，则让图片位置最上方
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    //根据属性inverse添加属性的css样式
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    //返回图片节点
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption >
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

//创建控制组建
var ControllerUnit = React.createClass({
  handleClick: function(e){
    //如果点击是当前点击状态，就翻转，否则就居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  },
  render: function(){
    var controllereUnitClassName = 'controller-unit';

    //如果图片是居中图片，显示居中图片样式
    if(this.props.arrange.isCenter){
      controllereUnitClassName += ' is-center';

      //如果是翻转图片，显示翻转样式
      if(this.props.arrange.isInverse) {
        controllereUnitClassName += ' is-inverse';
      }
    }
    return (
      <sapn className={controllereUnitClassName} onClick={this.handleClick}></sapn>
    );
  }
});

var TestReactApp = React.createClass({
  Constant: {
    //中心图片的位置
    centerPos: {
      left: 0,
      right: 0
    },
    //水平方向的位置取值范围，包括左右两个分区
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    //垂直方向的位置取值范围，指上分区
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },

  //根据图片序号翻转图片,闭包函数
  inverse: function(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      //根据当前的翻转状态来确定图片
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },

  rearrange: function (centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        //顶部图片数量随机取一个或不取
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中 中间（centerIndex）的图片，居中的图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        //取出要布局的上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        });

        //布局左右两侧的图片信息
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
          var hPosRangeLOR = null;

          //前半部分布局左边，右半部份布局右边
          if(i < k){
            hPosRangeLOR = hPosRangeLeftSecX;
          }else{
            hPosRangeLOR = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLOR[0], hPosRangeLOR[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  },

  //居中传入的图片
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },

  //初始化设置图片管理位置
  getInitialState: function(){
    return {
      imgsArrangeArr: [
        /*
        {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0, //旋转角度
          isInverse: true, //是否翻转
          isCenter: false, //是否为居中图片
        }
         */
      ]
    };
  },

  //componentDidMount方法，组建加载后调用，组建加载以后，为每张图片计算其位置的范围
  componentDidMount: function(){

    // 获取舞台的相关参数的大小
    var stageDom = React.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 获取图片的相关参数的大小
    var imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算水平方向的位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算垂直方向的位置取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  },

  //渲染图片的节点
  render: function() {
    var controllerUnits = [],
        imgFigures = [];
    //遍历图片，获取图片地址属性
    imageDatas.forEach(function(value, index){

      //初始化图片容器的内容
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      imgFigures.push(<ImageFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});
React.render(<TestReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = TestReactApp;
