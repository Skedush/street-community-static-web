import React, { PureComponent } from 'react';
import styles from './index.less';
// import { connect } from 'dva';
import JurisdictionVilage from '@/components/WorkbenchComponents/JurisdictionVilage';
import CollectDate from '@/components/WorkbenchComponents/CollectData';
import SecurityBase from '@/components/WorkbenchComponents/SecurityBase';
import FastEntry from '@/components/WorkbenchComponents/FastEntry';

class Worbench extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  render() {
    return (
      <div className={styles.workBox}>
        <div className={styles.workLeftBox}>
          <JurisdictionVilage className={styles.workVillage} />
        </div>
        <div className={styles.workRightBox}>
          <FastEntry />
          <SecurityBase className={styles.securityBase} />
          <CollectDate className={styles.workCollectDate} />
        </div>
      </div>
    );
  }
}

export default Worbench;
