import React from 'react';
import PropTypes from 'prop-types';
import EmailListItem from './EmailListItem';

export default class EmailList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired,
    selectedMessage: PropTypes.shape({
      id: PropTypes.number.isRequired,
      direction: PropTypes.string.isRequired
    }),
    onSelectMessage: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    compose: PropTypes.func
  }

  static defaultProps = {
    selectedMessage: null,
    compose: null
  }

  render() {
    const {
      messages,
      selectedMessage
    } = this.props;

    return (
      <div className="email-list navbar-xs">
        <div className="navbar-primary sticky">
          <div className="navbar" role="navigation">
            <ul className="nav navbar-nav" style={{ float: 'right', marginRight: '10px' }}>
              {
                this.props.compose ?
                (
                  <li className="text-right">
                    <div
                      className="btn"
                      tabIndex={-1}
                      role="button"
                      onClick={() => {
                        this.props.compose();
                      }}
                    >
                      <i className="fa fa-envelope" />
                    </div>
                  </li>
                ) :
                null
              }
              {
                this.props.refresh ?
                (
                  <li className="text-right">
                    <div
                      className="btn"
                      tabIndex={-1}
                      role="button"
                      onClick={() => {
                        this.props.refresh();
                      }}
                    >
                      <i className="fa fa-refresh" />
                    </div>
                  </li>
                ) :
                null
              }
            </ul>
          </div>
        </div>
        {
          messages.map((m) => {
            return (<EmailListItem onEmailClicked={this.props.onSelectMessage} key={`${m.direction}_${m.id}`} {...m} selected={selectedMessage && m.id === selectedMessage.id && m.direction === selectedMessage.direction} />)
          })
        }
      </div>
    );
  }
}
