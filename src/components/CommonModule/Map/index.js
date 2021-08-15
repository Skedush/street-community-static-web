import { connect } from 'dva';
import React, { Suspense, Component } from 'react';
import { Skeleton } from 'antd';
import Page from './Page';
import styles from './index.less';
const getComponent = Component => props => (
  <Suspense fallback={<Skeleton title={false} active />}>
    <Component {...props} />
  </Suspense>
);
const ChinaMap = getComponent(React.lazy(() => import('./chinaMap')));
// const Option = Select.Option;

@connect(({ mapData }) => ({ mapData }))
class DistributionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.facthData();
  }

  render() {
    const { loading, columns = [], checkes, defaultKey } = this.props.mapData;
    const { data } = this.props;
    const _columns = columns.filter(item => {
      const { field } = item;
      return checkes[field] || field === 'name';
    });
    const _mapdata = {
      columns: _columns,
      rows: data.map(item => {
        const o = {};
        _columns.forEach(col => {
          const { field } = col;
          o[field] = item[field];
        });
        return o;
      }),
    };
    return (
      <Page flex>
        <div className={styles.mapBox}>
          <ChinaMap
            seriesName={this.props.population || '车辆分布'}
            data={_mapdata}
            target={defaultKey}
            loading={loading}
            unit={this.props.population === '人口分布' ? '人' : '辆'}
            style={{ felx: 1, height: 'none' }}
          />
        </div>
      </Page>
    );
  }

  facthData() {
    const { dispatch, population } = this.props;
    if (population === '人口分布') {
      dispatch({
        type: 'mapData/populationData',
      });
    } else {
      dispatch({
        type: 'mapData/distributionMap',
      });
    }
  }
}
export default DistributionMap;
