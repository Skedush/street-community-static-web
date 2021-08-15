import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Lightbox from 'react-images';
import styles from './index.less';
import Img from 'react-image';

const theme = {};
theme.container = {
  // antd Modal的zIndex最大值为99999999
  zIndex: 100000000,
};

class Gallery extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lightboxIsOpen: true,
      currentImage: this.props.currentImage || 0,
    };
  }

  renderGallery = () => {
    const { images } = this.props;
    if (!images) return;
    const gallery = images.map((obj, i) => {
      return (
        <a
          href={obj.src}
          className={styles.thumbnail}
          key={i}
          onClick={e => this.openLightbox(i, e)}
        >
          <Img src={obj.thumbnail} className={styles.source} />
        </a>
      );
    });

    return <div className={styles.gallery}>{gallery}</div>;
  };

  render() {
    return (
      <Lightbox
        {...this.props}
        className={styles.container}
        currentImage={this.state.currentImage}
        backdropClosesModal={true}
        closeButtonTitle={'关闭'}
        imageCountSeparator={'/'}
        leftArrowTitle={'上一张'}
        rightArrowTitle={'下一张'}
        onClickImage={this.onClickImage}
        onClickNext={this.onClickNext}
        onClickPrev={this.onClickPrev}
        onClickThumbnail={this.onClickThumbnail}
        onClose={this.onClose}
        theme={theme}
      />
    );
  }

  openLightbox = (index, event) => {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true,
    });
  };

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  onClickPrev = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
    this.props.onClickNext && this.props.onClickPrev();
  };

  onClickNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });

    this.props.onClickNext && this.props.onClickNext();
  };

  onClickThumbnail = index => {
    this.setState({
      currentImage: index,
    });
  };

  onClickImage = () => {
    if (!this.props.images) {
      return;
    }
    if (this.state.currentImage === this.props.images.length - 1) {
      return;
    }
    this.onClickNext();
  };
}

Gallery.propTypes = {
  backdropClosesModal: PropTypes.bool,
  currentImage: PropTypes.number,
  customControls: PropTypes.arrayOf(PropTypes.node),
  enableKeyboardInput: PropTypes.bool,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      srcSet: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      thumbnail: PropTypes.string,
    }),
  ).isRequired,
  isOpen: PropTypes.bool,
  onClickImage: PropTypes.func,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  preloadNextImage: PropTypes.bool,
  preventScroll: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  showImageCount: PropTypes.bool,
  showThumbnails: PropTypes.bool,
  width: PropTypes.number,
};

Gallery.defaultProps = {
  currentImage: 0,
  enableKeyboardInput: true,
  onClickShowNextImage: true,
  preloadNextImage: true,
  preventScroll: true,
  showCloseButton: true,
  showImageCount: true,
  width: 1024,
};

export default Gallery;
