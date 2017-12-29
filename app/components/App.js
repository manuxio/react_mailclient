import React from 'react';
// import PropTypes from 'prop-types';
import request from 'superagent';
import urlParse from 'url-parse';
import { PulseLoader } from 'halogenium';
import 'bootstrap/dist/css/bootstrap.css';

import EmailList from './EmailList';
import EmailMessage from './EmailMessage';
import EmailComposer from './EmailComposer';

import './style.scss';

export default class App extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const myPage = document.location;
    const myURL = urlParse(myPage, true);
    console.log(myURL);
    request
      .get(`messages.json?idcontratto=${myURL.query.idcontratto}`)
      .end((err, res) => {
        if (err) {
          this.setState({
            error: true
          });
        } else {
          console.log(res.body);
          this.setState({
            loading: false,
            loaded: true,
            messages: res.body.messages
            // total: res.body.total,
            // attachments: res.body.attachments
          })
        }
      });
    this.setState({
      loading: true
    });
  }

  selectMessage(msgId, direction) {
    console.log('selectMessage', msgId);
    this.setState({
      selectedMessage: {
        id: msgId,
        direction
      }
    });
  }

  sendMessage(to, from, subject) {
    this.setState({
      composing: true,
      newmsgto: to,
      newmsgsubject: `${subject ? `Re: ${subject}` : ''}`,
      newmsgfrom: from
    })
  }

  render() {
    const {
      loaded,
      loading,
      error,
      selectedMessage,
      composing
    } = this.state;
    if (loading || error || !loaded) {
      return (
        <div className="inbox-container">
          <div className="please-wait">
            <PulseLoader color="#4285f4" size="16px" margin="4px" loading />
          </div>
        </div>
      );
    }
    if (composing) {
      return (
        <div className="inbox-container">
          <EmailComposer
            from={this.state.newmsgfrom}
            to={this.state.newmsgto}
            subject={this.state.newmsgsubject}
            attachments={[]}
            discard={() => {
              console.log('Discarding!');
              this.setState({
                composing: false
              });
            }}
            send={() => {
              console.log('Send mail');
            }}
          />
        </div>
      );
    }
    if (selectedMessage) {
      console.log('selectedMessage', selectedMessage);
      return (
        <div className="inbox-container">
          <div className="inbox-list-short">
            <EmailList
              messages={this.state.messages}
              selectedMessage={selectedMessage}
              onSelectMessage={(msgId, direction) => {
                this.selectMessage(msgId, direction);
              }}
              refresh={() => {
                this.setState({
                  selectedMessage: null
                }, () => {
                  this.loadData();
                });
              }}
              compose={() => {
                this.sendMessage();
              }}
            />
          </div>
          <div className="inbox-message">
            <EmailMessage
              message={selectedMessage}
              sendReply={(...rest) => {
                this.sendMessage(...rest);
              }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="inbox-container">
        <div className="inbox-list">
          <EmailList
            messages={this.state.messages}
            selectedMessage={selectedMessage}
            onSelectMessage={(msgId, direction) => {
              this.selectMessage(msgId, direction);
            }}
            refresh={() => {
              this.setState({
                selectedMessage: null
              }, () => {
                this.loadData();
              });
            }}
            compose={() => {
              this.sendMessage();
            }}
          />
        </div>
      </div>
    );
  }
}
