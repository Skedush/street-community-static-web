import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import IconFont from 'components/IconFont';
import { router, routeTree } from '@/utils';
import { connect } from 'dva';

@connect(({ app: { routeList }, loading: { effects } }) => ({
  routeList,
}))
class FastEntry extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  // eslint-disable-next-line max-lines-per-function
  render() {
    const { className, routeList } = this.props;
    let pathResult = routeTree(routeList, []);

    const fastEntryList = [
      {
        title: '事件预警',
        icon: 'icon-shequguanhuai',
        router: '/dashboard/thematicAnalysis/event/warning',
      },

      {
        title: '社区关怀',
        icon: 'icon-person',
        router: '/dashboard/thematicAnalysis/oldman',
      },
      {
        title: '实有人口',
        icon: 'icon-xiaoqu',
        router: '/dashboard/real/population',
      },
      {
        title: '小区网关',
        icon: 'icon-decice',
        router: '/dashboard/thematicAnalysis/village/gateway',
      },
    ];
    return (
      <div className={classNames(className, 'flexStart', 'flexWrap', styles.entrys)}>
        {fastEntryList.map(item => {
          const pathShow = pathResult.find(pathItem => pathItem.route === item.router);
          if (!pathShow) {
            return;
          }
          return (
            <div
              className={classNames(styles.entryItem, 'flexColCenter', 'itemCenter')}
              key={item.router}
            >
              <div
                className={classNames(styles.icon, 'flexColCenter', 'itemCenter')}
                onClick={() => this.clickEntry(item.router)}
              >
                <IconFont
                  type={item.icon}
                  style={{
                    fontSize: '40px',
                    color: '#22C2FE',
                  }}
                />
              </div>
              <div>{item.title}</div>
            </div>
          );
        })}
      </div>
    );
  }

  clickEntry = (url, type) => {
    router.push(url);
  };
}

export default FastEntry;
