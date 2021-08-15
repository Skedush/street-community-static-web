import React, { Fragment, PureComponent } from 'react';
import { MAP_HOST_PROXY, SETTER_MAP_CONSTANTS, TILE_URL_CALLBACK } from 'utils/constant';
import { Map, Polygon, PolygonTool } from '@lidig/react-ld-amap';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './index.less';
import { isEmpty } from 'lodash';
import { Modal } from 'antd';

const POLYGON_STYLE = {
  fillColor: 'none',
  fillOpacity: '0.8',
  strokeColor: '#22c2fe',
  strokeOpacity: 0.5,
  strokeWeight: '6',
  strokeStyle: 'solid',
};

class AddMapUi extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      center: { longitude: 120.672111, latitude: 28.000575 },
      mapShow: false,
      boundaryFormat: [],
      polygonTool: false,
      btnShow: true,
    };
    this.map = null;
    this.selectedMarker = null;
    this.polygon = null;
    this.centerX = null;
    this.centerY = null;
    this.boundaryFormat = [];
    this.amapEvents = {
      created: this.onMapCreated,
      click: () => {
        if (this.selectedMarker) {
          this.selectedMarker.closeInfoWindow();
          this.selectedMarker = null;
        }
      },
    };

    this.polygonToolEvents = {
      created: instance => {
        this.polygonTool = instance;
      },
      addoverlay: evt => {
        this.polygon = evt.overlay;
      },

      removetool: evt => {
        // console.log('removetool evt: ', evt);
      },
    };

    this.polygonEvents = {
      created: instance => {
        // console.log('polygonEvents instance = ', instance);
      },
    };
  }

  renderPolygon() {
    const { boundaryFormat } = this.state;
    const path = this.props.boundaryFormat;
    if (!path) {
      return null;
    }
    if (this.props.type === 1) {
      if (isEmpty(this.state.boundaryFormat)) {
        return <Polygon events={this.polygonEvents} path={path} style={POLYGON_STYLE} />;
      } else {
        return <Polygon events={this.polygonEvents} path={boundaryFormat} style={POLYGON_STYLE} />;
      }
    } else {
      if (isEmpty(this.state.boundaryFormat)) {
        return;
      }
      return <Polygon events={this.polygonEvents} path={boundaryFormat} style={POLYGON_STYLE} />;
    }
  }

  renderPolygonTool = () => {
    const { polygonTool } = this.state;
    return (
      <PolygonTool
        events={this.polygonToolEvents}
        editabled={true}
        autoClose={true}
        visible={polygonTool}
      />
    );
  };
  renderModal(center) {
    const { mapShow, btnShow } = this.state;
    return (
      <Modal
        title="坐标刻画"
        visible={mapShow}
        onCancel={this.mapModalCancel}
        footer={false}
        destroyOnClose={true}
        wrapClassName={styles.modalPortrait}
      >
        <Map
          injectScript
          hostProxy={MAP_HOST_PROXY}
          minZoom={3}
          maxZoom={18}
          zoom={18}
          tileUrlCallback={TILE_URL_CALLBACK}
          center={center || this.state.center}
          events={this.amapEvents}
        >
          {this.renderPolygon()}
          {this.renderPolygonTool()}
        </Map>
        {btnShow ? (
          <div className={styles.mapBtn} onClick={this.beganDraw}>
            开始绘制
          </div>
        ) : (
          ''
        )}
      </Modal>
    );
  }

  render() {
    let center = {};
    if (this.props.longitude || this.props.latitude) {
      center.longitude = this.props.longitude;
      center.latitude = this.props.latitude;
    } else {
      center = this.state.center;
    }
    return (
      <Fragment>
        <div className={styles.map} onClick={this.showMapModal}>
          <Map
            injectScript
            hostProxy={MAP_HOST_PROXY}
            minZoom={3}
            maxZoom={18}
            zoom={18}
            tileUrlCallback={TILE_URL_CALLBACK}
            center={center || this.state.center}
            events={this.amapEvents}
          >
            {this.renderPolygon()}
          </Map>
        </div>

        {this.renderModal(center)}
      </Fragment>
    );
  }

  // 地图弹窗
  showMapModal = () => {
    this.setState({
      mapShow: true,
      polygonTool: false,
    });
  };

  mapModalCancel = () => {
    this.setState({
      btnShow: true,
    });
    if (!this.polygon) {
      this.setState({
        mapShow: false,
      });
      return;
    }
    const paths = this.polygon.getPath();
    let lat = [];
    let lng = [];
    let boundaryFormat = [];
    let boundary = '';
    paths.map(item => {
      const obj = {};
      obj.longitude = '';
      obj.latitude = '';
      obj.longitude = item.lng || '';
      obj.latitude = item.lat || '';
      boundary += '' + item.lng + ',' + item.lat + ',';
      lng.push(item.lng);
      lat.push(item.lat);
      boundaryFormat.push(obj);
    });
    try {
      boundary += '' + paths[0].lng || '' + ',' + paths[0].lat || '';
      this.boundaryFormat = boundaryFormat;
      // 最小
      let lowestX = lat.sort((a, b) => {
        return a - b;
      })[0];
      let lowestY = lng.sort((a, b) => {
        return a - b;
      })[0];
      // 最高
      let highestX = lat.sort((a, b) => {
        return b - a;
      })[0];
      let highestY = lng.sort((a, b) => {
        return b - a;
      })[0];
      this.centerX = lowestX + (highestX - lowestX) / 2;
      this.centerY = lowestY + (highestY - lowestY) / 2;
      this.setState({
        mapShow: false,
        center: { longitude: this.centerY, latitude: this.centerX },
        boundaryFormat: this.boundaryFormat,
      });

      const obj = {};
      obj.boundary = boundary;
      obj.center = { longitude: this.centerY, latitude: this.centerX };
      this.props.mapPaths(obj);
    } catch (error) {}
  };

  onMapCreated = instance => {
    this.map = instance;
    SETTER_MAP_CONSTANTS(window.IMAP.Constants);
    // this.getMapDeviceAll();
  };

  beganDraw = () => {
    const { polygonTool } = this.state;
    if (polygonTool) {
      return;
    }
    this.setState({
      polygonTool: true,
      btnShow: false,
    });
  };

  // 点位
  // getMapDeviceAll(payload) {
  //   const { dispatch } = this.props;
  //   // dispatch({
  //   //   type: 'mapData/getMapDeviceAll',
  //   //   payload,
  //   // });
  // }
}

export default AddMapUi;
