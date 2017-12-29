import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import prettyBytes from 'pretty-bytes';

import { PulseLoader } from 'halogenium';

export default class EmailMessage extends React.Component {
  static propTypes = {
    message: PropTypes.shape({
      id: PropTypes.number.isRequired,
      direction: PropTypes.string.isRequired
    }).isRequired,
    sendReply: PropTypes.func.isRequired
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      lastId: null,
      lastDirection: null
    };
  }

  componentDidMount() {
    const { id, direction } = this.props.message;
    this.loadData(id, direction);
  }

  componentWillReceiveProps(newProps) {
    const { id, direction } = newProps.message;
    if (id !== this.state.lastId || direction !== this.state.lastDirection) {
      this.loadData(id, direction);
    }
  }

  loadData(id, direction) {
    request
      .get(`singlemessage.json?id=${id}&direction=${direction}`)
      .end((err, res) => {
        if (!err) {
          this.setState({
            loaded: true,
            message: res.body,
            lastId: id,
            lastDirection: direction
          })
        }
      });
    this.state = {
      loaded: false
    };
  }

  render() {
    const {
      loaded,
      message
    } = this.state;

    if (!loaded) {
      return (
        <div className="message-please-wait">
          <PulseLoader color="#4285f4" size="16px" margin="4px" loading />
        </div>
      )
    }

    const email = message;

    return (
      <div className="email-content">
        <div className="email-content__header">
          <h3 className="email-content__subject truncate">{email.subject}</h3>
          <span
            role="button"
            tabIndex={-1}
            onClick={() => {
              this.props.sendReply(email.from, email.to, email.subject);
            }}
            className="delete-btn fa fa-mail-reply"
          />
          <div className="email-content__time">{email.date}</div>
          <div className="email-content__from">From: {email.from}</div>
          <div className="email-content__from truncate">To: {email.to}</div>
        </div>
        <div className="email-content__message">
          <div className="email-content__attachments">
            {
              email.attachments.map((att, pos) => {
                return (
                  <div className="email-content__singleattachment" key={`${email.id}&direction=${email.direction}`}>

                    <a className="btn btn-default btn-xs" href={`attachment.php?id=${email.id}&direction=${email.direction}&pos=${pos}`} target="_new">
                      <i className="fa fa-download" />
                      &nbsp;
                      {prettyBytes(att.size)}
                    </a>
                    &nbsp;
                    {att.filename}
                  </div>
                );
              })
            }
          </div>
          {email.html || email.text}
        </div>
      </div>
    );
  }
}
