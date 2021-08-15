import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './index.less';
import { Map, Polygon, Markers, PolygonTool } from '@lidig/react-ld-amap';
import { MAP_HOST_PROXY, SETTER_MAP_CONSTANTS, TILE_URL_CALLBACK } from 'utils/constant';
import ReactDOMServer from 'react-dom/server';

const ICON_URL = '/images/map/marker_normal.png';
const POLYGON_STYLE = {
  fillColor: 'none',
  fillOpacity: '0.8',
  strokeColor: '#22c2fe',
  strokeOpacity: 0.5,
  strokeWeight: '6',
  strokeStyle: 'solid',
};

@connect(({ mapData: { devceList } }) => ({
  // loading,
  devceList,
  // loading,
}))
class MapComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      // villageBulidFloor: {},
      mapPath: null,
      center: { latitude: 27.993358, longitude: 120.69928 },
      dragable: true,
    };
    this.map = null;
    this.selectedMarker = null;
    this.amapEvents = {
      created: this.onMapCreated,
      click: () => {
        if (this.selectedMarker) {
          this.selectedMarker.closeInfoWindow();
          this.selectedMarker = null;
        }
      },
    };

    this.markersEvents = {
      created: instance => {},
      click: (mapsOption, marker) => {
        this.selectedMarker = marker;
        const innerHTML = ReactDOMServer.renderToStaticMarkup(
          <div className={styles.infowindow}>
            <div>名称：{marker.extData.name}</div>
            <div>地址：{marker.extData.villageName}</div>
            <div>经度：{marker.extData.longitude}</div>
            <div>纬度：{marker.extData.latitude}</div>
          </div>,
        );

        // FIXME: 锚点设置无效，暂时先通过偏移对齐位置
        marker.openInfoWindow(innerHTML, {
          autoPan: true,
          offset: new window.IMAP.Pixel(-6, -30),
          anchor: [window.IMAP.Constants.TOP_CENTER],
          type: window.IMAP.Constants.OVERLAY_INFOWINDOW_CUSTOM,
        });
      },
    };

    this.polygonEvents = {
      created: instance => {
        this.polygonTool = instance;
      },
      addoverlay: evt => {
        // console.log('evt: ', evt);
        // const paths = evt.overlay.getPath();
        // console.log('paths: ', paths);
      },
      removetool: evt => {
        // console.log('removetool evt: ', evt);
      },
    };
  }

  componentDidMount() {
    this.getMapDeviceAll();
  }

  renderPolygon() {
    let { content } = this.props;
    if (!content || content.length <= 0) {
      return null;
    }

    return content.map((item, index) => {
      const boundaryFormat = item.boundaryFormat;
      if (!item || !item.boundaryFormat) {
        return;
      }

      if (boundaryFormat && boundaryFormat.length === 0) {
        return;
      }
      return <Polygon path={item.boundaryFormat} style={POLYGON_STYLE} key={index} />;
    });
  }

  renderMarkers = () => {
    if (!this.map) {
      return null;
    }

    const { devceList } = this.props;
    if (!devceList || devceList.length <= 0) {
      return null;
    }

    const markers = devceList.map(item => {
      return {
        position: { longitude: item.longitude, latitude: item.latitude },
        icon: { url: ICON_URL, size: { width: 36, height: 31 } },
        extData: item,
      };
    });
    // marker重绘保证数据干净
    this.selectedMarker = null;

    return <Markers useCluster={false} markers={markers} events={this.markersEvents} />;
  };

  renderPolygonTool = () => {
    return (
      <PolygonTool events={this.polygonEvents} editabled={true} autoClose={true} visible={true} />
    );
  };

  render = () => {
    let { center } = this.props;
    return (
      <div className={styles.map}>
        <Map
          injectScript
          hostProxy={MAP_HOST_PROXY}
          minZoom={3}
          maxZoom={18}
          zoom={16}
          tileUrlCallback={TILE_URL_CALLBACK}
          center={center.latitude === 0 ? this.state.center : center}
          events={this.amapEvents}
          dragable={this.state.dragable}
        >
          {this.renderPolygon()}
          {this.renderMarkers()}
          {/* {polygonTool ? this.renderPolygonTool() : ''} */}
        </Map>
      </div>
    );
  };

  onMapCreated = instance => {
    this.map = instance;
    SETTER_MAP_CONSTANTS(window.IMAP.Constants);
    this.getMapDeviceAll();
  };

  // 点位
  getMapDeviceAll(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapData/getMapDeviceAll',
      payload,
    });
  }
}
MapComponent.propTypes = {
  dispatch: PropTypes.func,
};

export default MapComponent;
