import React, { PureComponent } from 'react';
import { Row, Col, Input } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
// import LdButton from '@/components/My/Button/LdButton';
import { chunk } from 'lodash';
class InfoRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gutter: 20,
      col1: 8,
      col2: 16,
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      col: 12, // 8
    };
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      gutter,
      col1,
      col2,
      xs,
      sm,
      md,
      lg,
      col, // 8
    } = this.state;
    const { data } = this.props;
    const dataList = chunk(data, 2);
    return (
      <div className={styles.sectionBox}>
        {dataList.map((item, index) => (
          <Row gutter={gutter} className={styles.DetailDiv} key={index}>
            {item.map((e, index) => {
              // if (e.input) {
              return (
                <Col
                  className={classNames(styles.detail)}
                  xs={xs}
                  sm={sm}
                  md={md}
                  lg={lg}
                  xl={col}
                  key={index}
                >
                  <Col span={col1}>{e.title}</Col>
                  <Col span={col2} className={styles.detailInput}>
                    {e.intput ? <Input value={e.value ? e.value : ''} /> : null}
                  </Col>
                  {/* <Col span={col2}></Col> */}
                </Col>
              );
              // } else {
              //   return (
              //     <Col
              //       className={styles.detail}
              //       xs={xs}
              //       sm={sm}
              //       md={md}
              //       lg={lg}
              //       xl={col}
              //       key={index}
              //     >
              //       <Col span={col1}>{e.title}</Col>
              //       <Col span={col2}>{e.value ? e.value : ''}</Col>
              //       {/* <Col span={col2}></Col> */}
              //     </Col>
              //   );
              // }
            })}
          </Row>
        ))}
      </div>
    );
  }
}

export default InfoRow;
