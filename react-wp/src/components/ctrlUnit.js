import React from 'react';

class CtrlUnit extends React.Component {

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
    let ctrlUnitClassName = 'controller-unit';

    //如果图片是居中图片，显示居中图片样式
    if(this.props.arrange.isCenter){
      ctrlUnitClassName += ' is-center';

      //如果是翻转图片，显示翻转样式
      if(this.props.arrange.isInverse) {
        ctrlUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={ctrlUnitClassName} onClick={this.handleClick.bind(this)}></span>
    );
  }
}

export default CtrlUnit;