import React from 'react';

let logoImg = require('../images/logo.jpg');

class ImgFigure extends React.Component {
  render() {
    let styleObj = {};

    //根据imgFigure的arrange属性获取位置属性
    if(this.props.arrange) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure">
        <img src={this.props.data.imgSrc} style={styleObj} alt={this.props.data.title} />
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