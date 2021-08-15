import React, { PureComponent } from 'react';
import Img from 'react-image';
import styles from './index.less';
import Gallery from '@/components/Gallery';
import classNames from 'classnames';
class LdImg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: [],
      openImage: false,
    };
  }

  render() {
    let {
      boxClassName,
      image,
      defaultImg,
      className,
      type,
      previewImg = true,
      ...options
    } = this.props;

    let opt = (
      <div
        className={classNames(className, styles.box, boxClassName)}
        style={this.props.style || null}
      >
        <Img
          src={[image, defaultImg]}
          loader={<span className={styles.imageStart}>正在加载...</span>}
          onClick={previewImg ? e => this.sendImage(image || defaultImg, e) : () => {}}
          className={styles.image}
          {...options}
        />
        <Gallery
          images={this.state.image}
          isOpen={this.state.openImage}
          onClose={this.handleClose}
        />
      </div>
    );
    try {
      switch (type) {
        case 'floatImg':
          opt = (
            <div className={classNames(className, styles.floatBox)}>
              <Img
                src={[image, defaultImg]}
                loader={<span className={styles.imageStart}>正在加载...</span>}
                onClick={previewImg ? e => this.sendImage(image || defaultImg, e) : ''}
                className={styles.floatImg}
                {...options}
              />
              <Gallery
                images={this.state.image}
                isOpen={this.state.openImage}
                onClose={this.handleClose}
              />
            </div>
          );
          break;
        case 'personImg':
          opt = (
            <div className={classNames(className, styles.personBox)}>
              <Img
                src={[image, defaultImg]}
                loader={<span className={styles.imageStart}>正在加载...</span>}
                onClick={previewImg ? e => this.sendImage(image || defaultImg, e) : ''}
                className={styles.personImg}
                {...options}
              />
              <Gallery
                images={this.state.image}
                isOpen={this.state.openImage}
                onClose={this.handleClose}
              />
            </div>
          );
          break;
      }
      return opt;
    } catch (error) {
      return opt;
    }
  }

  sendImage = (image, e) => {
    e.stopPropagation();
    this.setState({
      image: [{ src: image }],
      openImage: true,
    });
  };

  handleClose = () => {
    this.setState({
      openImage: false,
    });
  };
}

export default LdImg;
