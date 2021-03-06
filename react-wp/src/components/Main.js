require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDom from 'react-dom';
import ImgFigure from './imgFigure';
import CtrlUnit from './ctrlUnit';
import Tools from '../lib/tools';
var tool = new Tools();

var imgs = require('../data/images.json');
imgs = (function (imgarr) {
  for (let i = 0; i < imgarr.length; i++) {
    let img = imgarr[i];
    img.imgSrc = require('../images/photo/' + imgarr[i].fileName);
    imgarr[i] = img;
  }
  return imgarr;
})(imgs);

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      /*
      {
        pos: {
          left: 0,
          top: 0
        },
        rotate: 0,
        isInverse: true,
        isCenter: false
      }
      */
      imgArr: []
    }
    this.Constant = {
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
    };
  }

  //根据中心位置排列图片，这里用闭包函数
  cneter(index) {
    return function() {
      this.rearrange(index);
    }.bind(this);
  }

  //根据是否处于中心位置翻转图片，这里用闭包函数
  inverse(index) {
    return function() {
      var imgArr = this.state.imgArr;
      imgArr[index].isInverse = !imgArr[index].isInverse;
      this.setState({
        imgArr: imgArr
      });
    }
  }

  //componentDidMount方法，组建加载后调用，组建加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    //获取舞台的相关参数的大小
    let stageDom = this.refs.stage;
    //舞台宽高
    let stageW = stageDom.scrollWidth;
    let stageH = stageDom.scrollHeight;
    //舞台一半的宽高
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);

    //获取图片的相关参数大小
    let imgFigureDom = ReactDom.findDOMNode(this.refs.imgFigure0);
    //图片宽高
    let imgW = imgFigureDom.scrollWidth;
    let imgH = imgFigureDom.scrollHeight;
    //图片一半的宽高
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算水平方向的图片位置范围
    this.Constant.hPosRange.leftSecX[0] = -Math.ceil(imgW / 3);
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - Math.ceil(imgW / 3 * 2);
    this.Constant.hPosRange.y[0] = -Math.ceil(imgH / 3);
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算垂直方法的图片位置范围
    this.Constant.vPosRange.topY[0] = -Math.ceil(imgH / 3);
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - halfImgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  //重新排列图片的样式方法
  rearrange(centerIndex) {
    let imgArr = this.state.imgArr;
    let Constant = this.Constant;
    
    //确定居中图片的位置
    let imgCenter = imgArr.splice(centerIndex, 1);
    imgCenter = {
      pos: Constant.centerPos,
      rotate: 0,
      isCenter: true
    }

    //随机顶部图片的数量
    let topImgNum = Math.floor(Math.random() * 2);
    //随机顶部图片的序号
    let topImgIndex = Math.ceil(Math.random() * imgArr.length - topImgNum);
    let imgTop = imgArr.splice(topImgIndex, topImgNum);
    if(topImgNum > 0){
      imgTop = {
        pos: {
          top: tool.getRangeRandom(Constant.vPosRange.topY[0], Constant.vPosRange.topY[1]),
          left: tool.getRangeRandom(Constant.vPosRange.x[0], Constant.vPosRange.x[1])
        },
        rotate: tool.get30DegRandom(),
        isCenter: false
      };
    }
    

    //布局左右的图片位置
    for(let i = 0, j = imgArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLOR = null;
      
      //选取一半图片放在左边
      if(i < k){
        hPosRangeLOR = Constant.hPosRange.leftSecX;
      }else {
        hPosRangeLOR = Constant.hPosRange.rightSecX;
      }

      imgArr[i] = {
        pos: {
          top: tool.getRangeRandom(Constant.hPosRange.y[0], Constant.hPosRange.y[1]),
          left: tool.getRangeRandom(hPosRangeLOR[0], hPosRangeLOR[1])
        },
        rotate: tool.get30DegRandom(),
        isCenter: false
      }
    }

    //将切碎的图片集再重新合并
    if(topImgNum > 0){
      imgArr.splice(topImgIndex, 0, imgTop);
    }
    
    imgArr.splice(centerIndex, 0, imgCenter);
    this.setState({
      imgArr: imgArr
    });

  }

  render() {
    //定义component数组
    var ctrlUtils = [], imgFigures = [];

    //遍历图片数组
    imgs.forEach(function(value, index) {
      //初始化图片位置容器信息
      if(!this.state.imgArr[index]) {
        this.state.imgArr[index] = {
          pos: {
            left: 0,
            right: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }

      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgArr[index]} inverse={this.inverse(index).bind(this)} center={this.cneter(index)} />);

      ctrlUtils.push(<CtrlUnit key={index} arrange={this.state.imgArr[index]} inverse={this.inverse(index).bind(this)} center={this.cneter(index)} />);
    }.bind(this));

    return (
      <div className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {ctrlUtils}
        </nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
