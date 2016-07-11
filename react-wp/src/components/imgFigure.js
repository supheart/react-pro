import React from 'react';

class ImgFigure extends React.Component {

  //图片内容点击事件
  handleClick(e) {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    }else {
      this.props.center();
    }

    //停止事件的传播,阻止它被分派到其他 Document 节点
    e.stopPropagation();
    //通知 Web 浏览器不要执行与事件关联的默认动作
    e.preventDefault();
  }

  render() {
    let styleObj = {};

    //根据imgFigure的arrange属性获取位置属性
    if(this.props.arrange) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片有旋转角度，添加旋转角度样式
    if(this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      });
    }

    //如果改变图片居中，则让图片位置最上方
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    //根据属性inverse添加css样式
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imgSrc} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back">
            {this.props.data.desc}
          </div>
        </figcaption>
      </figure>
    );
  }
}

export default ImgFigure;