import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
// import Lottie from './Lottie';
import data from './data.json';
import { AMapScene, LineLayer, Marker, SceneEvent, PolygonLayer } from '@antv/l7-react';
import { connect } from 'dva';
import Iframe from 'react-iframe';
import { isEmpty } from 'lodash';
import VillageBuildList from '../VillageBuildList';
import VillageStatistics from '../VillageStatistics';
import UnitStatistics from '../UnitStatistics';
import FloorStatistics from '../FloorStatistics';
import HouseDetail from '../HouseDetail';
import PersonDetail from '../PersonDetail';
import CarDetail from '../CarDetail';

import styles from './index.less';
@connect(({ dataStatistics: { villageList, view, villageStatistics } }) => ({
  villageList,
  view,
  villageStatistics,
}))
class Map extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      infoShow: 'village',
      detailShow: '',
      vrUrl: '',
      center: [120.810462, 27.928524],
      houseId: null,
      personId: null,
      carId: null,
      villageBulidFloor: {},
      villageUnitTreeFlag: false,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'dataStatistics/getCommunityVillageList',
    });
    dispatch({
      type: 'dataStatistics/getCommunityStatistics',
    });

    const receiveMessageFromIndex = event => {
      if (!event) {
        return;
      }
      if (typeof event.data !== 'string') {
        return;
      }
      if (
        !event.data.indexOf('buildId') &&
        !event.data.indexOf('floor') &&
        !event.data.indexOf('villageId')
      ) {
        return;
      }

      let villageBulidFloor;
      try {
        villageBulidFloor = JSON.parse(event.data);
      } catch {
        console.error('villageBulidFloor错误,VR点击楼层传递的数据错误', villageBulidFloor);
        villageBulidFloor = { buildId: '707', floor: '10', villageId: '2' };
      }
      this.setState({
        villageBulidFloor, // 2.给变量赋值
        infoShow: 'vr',
        villageUnitTreeFlag: !this.state.villageUnitTreeFlag,
      });
    };

    window.addEventListener('message', receiveMessageFromIndex, false);
  }

  onClickMap = e => {};

  renderVillageLayer() {
    const { villageStatistics } = this.props;
    let lnglat = [];
    if (!isEmpty(villageStatistics)) {
      lnglat = villageStatistics.boundaryFormat.map(item => [item.longitude, item.latitude]);
      lnglat.push([
        villageStatistics.boundaryFormat[0].longitude,
        villageStatistics.boundaryFormat[0].latitude,
      ]);
    }

    const villageLine = {
      type: 'FeatureCollection',
      name: 'dl2',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiLineString',
            coordinates: [lnglat],
          },
        },
      ],
    };

    const polygon = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [lnglat],
          },
        },
      ],
    };
    return (
      <>
        <PolygonLayer
          key={'2'}
          source={{
            data: polygon,
          }}
          size={{
            values: -10,
          }}
          color={{
            values: ['rgba(32,153,197,.6)', 'rgba(32,153,197,.2)'],
          }}
          shape={{
            values: 'extrude',
          }}
          style={{
            opacity: 1,
          }}
        />
        <LineLayer
          key={'1'}
          source={{
            data: villageLine,
          }}
          size={{
            values: 1.5,
          }}
          color={{
            values: '#2099c5',
          }}
          shape={{
            values: 'line',
          }}
          style={{
            opacity: 1,
          }}
          animate={{
            interval: 0.5, // 间隔
            duration: 2, // 持续时间，延时
            trailLength: 1.5, // 流线长度
          }}
        />
      </>
    );
  }

  renderCommunityLayer() {
    return (
      <LineLayer
        key={'1'}
        source={{
          data,
        }}
        size={{
          values: 1.5,
        }}
        color={{
          values: '#2099c5',
        }}
        shape={{
          values: 'line',
        }}
        style={{
          opacity: 1,
        }}
        animate={{
          interval: 0.5, // 间隔
          duration: 2, // 持续时间，延时
          trailLength: 1.5, // 流线长度
        }}
      />
    );
  }

  renderMarker() {
    const { villageList } = this.props;
    return (
      villageList &&
      villageList.map(item => (
        <Marker
          key={item.id}
          lnglat={[item.longitude, item.latitude]}
          onMarkerLoaded={this.onMarkerLoaded}
          option={{
            offsets: [0, -18],
            extData: { id: item.id, vrUrl: item.vrUrl },
          }}
        >
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              path: 'ae/marker/data.json',
            }}
            height={72}
            isStopped={false}
            isPaused={false}
          />
        </Marker>
      ))
    );
  }

  render() {
    const { view } = this.props;
    const { center } = this.state;

    return (
      <>
        <AMapScene
          map={{
            center: view === 'community' ? [120.810462, 27.928524] : center,
            pitch: 60,
            style: 'dark',
            zoom: view === 'community' ? 16 : 18,
            minZoom: 16,
            zoomEnable: true,
            keyboardEnable: false,
            resizeEnable: false,
            dragEnable: false,
            skyColor: '#000',
            isHotspot: false,
            defaultCursor: 'default',
          }}
          option={{ logoVisible: false }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <SceneEvent type="click" handler={this.onClickMap} />
          {view === 'village' && this.renderVillageLayer()}
          {view === 'community' && this.renderCommunityLayer()}
          {this.renderMarker()}
        </AMapScene>
        {view === 'village' && this.renderVillageInfo()}
      </>
    );
  }

  renderVillageInfo = () => {
    const {
      infoShow,
      detailShow,
      houseId,
      personId,
      carId,
      vrUrl,
      villageBulidFloor,
      villageUnitTreeFlag,
    } = this.state;
    return (
      <>
        <VillageBuildList setShow={this.setShow} villageUnitTreeFlag={villageUnitTreeFlag} />
        {infoShow === 'village' && <VillageStatistics />}
        {infoShow === 'unit' && <UnitStatistics onHouseClick={this.setDetailShow} />}
        {infoShow === 'vr' && (
          <FloorStatistics
            onHouseClick={this.setDetailShow}
            villageBulidFloor={villageBulidFloor}
          />
        )}
        {detailShow === 'house' && (
          <HouseDetail
            houseId={houseId}
            onCloseModal={this.closeDetail}
            onPersonClick={this.setDetailShow}
          />
        )}
        {detailShow === 'person' && (
          <PersonDetail
            personId={personId}
            onCloseModal={this.closeDetail}
            onHouseOrCarClick={this.setDetailShow}
          />
        )}
        {detailShow === 'car' && (
          <CarDetail
            carId={carId}
            onCloseModal={this.closeDetail}
            onPersonClick={this.setDetailShow}
          />
        )}
        {vrUrl !== '' && <Iframe url={this.state.vrUrl} id="myId" className={styles.iframe} />}
      </>
    );
  };

  closeDetail = () => {
    this.setState({
      detailShow: null,
      houseId: null,
      personId: null,
      carId: null,
    });
  };

  setDetailShow = payload => {
    this.setState({
      ...payload,
    });
  };

  setShow = info => {
    this.setState({
      ...info,
    });
  };

  onMarkerClick = async (villageId, vrUrl) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'dataStatistics/getVillageStatistics',
      payload: { villageId },
    });
    if (vrUrl !== '') {
      this.setState({
        vrUrl: vrUrl + '?villageId=' + villageId,
      });
    }

    dispatch({
      type: 'dataStatistics/updateState',
      payload: { view: 'village' },
    });
  };
  onMarkerLoaded = e => {
    e.on('click', event => {
      this.setState({
        center: [event.lngLat.lng, event.lngLat.lat],
      });
      this.onMarkerClick(event.data.id, event.data.vrUrl);
    });
  };
}
Map.propTypes = {
  dispatch: PropTypes.func,
};

export default Map;
