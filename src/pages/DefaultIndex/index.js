import React, { PureComponent } from 'react';
import { httpPort } from '@/utils/config';
import { connect } from 'dva';

@connect(({ loading }) => ({ loading }))
class DefaultIndex extends PureComponent {
  componentDidMount() {
    this.props
      .dispatch({
        type: 'app/query',
      })
      .then(data => {
        const { hostname } = window.location;
        if (data) {
          // protocol.startsWith('https:') && httpPort
          window.location.replace(
            `http://${hostname}:${httpPort}/#${data.indexMenuResps[0].defaultRoute}`,
          );
        }
      });
  }

  render() {
    // const { usbkeyModule, usernameModule } = this.state;
    return <div />;
  }
}

DefaultIndex.propTypes = {};

export default DefaultIndex;
