import React from 'react';
// import PropTypes from 'prop-types';
import request from 'superagent';
import urlParse from 'url-parse';
import { PulseLoader } from 'halogenium';
// import 'bootstrap/dist/css/bootstrap.css';

import EmailList from './EmailList';
import EmailMessage from './EmailMessage';
import EmailComposer from './EmailComposer';

import bootstrap from '../assets/less/bootstrap.less';
// import cleanslate from '../assets/less/cleanslate.less';
import allStyle from './style.scss';

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
    request
      .get(`/newsite/mailer/data/messages.php?idcontratto=${myURL.query.idcontratto || myURL.query.PPID}`)
      .end((err, res) => {
        if (err) {
          this.setState({
            error: true
          });
        } else {
          this.setState({
            loading: false,
            loaded: true,
            messages: res.body.messages
            // total: res.body.total,
            // attachments: res.body.attachments
          });
        }
      });
    this.setState({
      loading: true
    });
  }

  selectMessage(msgId, direction) {
    if (!this.state.selectedMessage || this.state.selectedMessage.id !== msgId) {
      this.setState({
        selectedMessage: {
          id: msgId,
          direction
        }
      });
    }
  }

  sendMessage(to, from, subject) {
    let newSubject = '';
    if (subject) {
      newSubject = subject;
      if (subject.toUpperCase().indexOf('RE:') !== 0) {
        newSubject = `Re: ${newSubject}`;
      }
    }
    this.setState({
      composing: true,
      newmsgto: to,
      newmsgsubject: newSubject,
      newmsgfrom: from
    });
  }

  smtp(from, to, subject, message, attachments) {
    this.setState({
      sending: true
    });
    const myPage = document.location;
    const myURL = urlParse(myPage, true);
    // console.log(`../send.php?idcontratto=${myURL.query.idcontratto}`);
    request
      .post(`/newsite/mailer/send.php?idcontratto=${myURL.query.idcontratto || myURL.query.PPID}`)
      .type('form')
      .send({
        from,
        to,
        subject,
        message,
        attachments: JSON.stringify(attachments)
      })
      .end((err, res) => {
        if (err) {
          this.setState({
            error: true,
            errorMessage: 'Errore di connessione'
          });
          return;
        }
        if (res.error) {
          this.setState({
            error: true,
            errorMessage: res.error
          });
        } else {
          attachments.forEach((att, pos) => {
            if (att.checked) {
              attachments[pos].checked = false; // eslint-disable-line
            }
          });
          this.setState({
            composing: false,
            sending: false,
            selectedMessage: null
          }, () => {
            this.loadData();
          });
        }
      });
  }

  render() {
    const {
      loaded,
      loading,
      error,
      selectedMessage,
      composing,
      sending
    } = this.state;
    if (loading || !loaded) {
      return (
        <div className={`${allStyle.wrapper} ${bootstrap.wrapper}`}>
          <div className={allStyle.inboxContainer}>
            <div className={allStyle.pleaseWait}>
              <PulseLoader color="#4285f4" size="16px" margin="4px" loading />
            </div>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className={`${allStyle.wrapper} ${bootstrap.wrapper}`}>
          <div className={allStyle.inboxContainer}>
            <div className={allStyle.pleaseWait}>
              <div className={`${allStyle.alert} ${allStyle.alertWarning}`}>{this.state.errorMessage || 'Si &egrave; verificato un errore!'}</div>
            </div>
          </div>
        </div>
      );
    }
    if (sending) {
      return (
        <div className={`${allStyle.wrapper} ${bootstrap.wrapper}`}>
          <div className={allStyle.inboxContainer}>
            <div className={allStyle.pleaseWait}>
              <PulseLoader color="#4285f4" size="16px" margin="4px" loading />
            </div>
          </div>
        </div>
      );
    }
    if (composing) {
      let attachments = [];
      if (window && window.parent && window.parent.contratto && window.parent.contratto.fax) {
        attachments = attachments.concat(window.parent.contratto.fax);
      }
      if (window && window.parent && window.parent.contratto && window.parent.contratto.lettere) {
        attachments = attachments.concat(window.parent.contratto.lettere);
      }
      return (
        <div className={`${allStyle.wrapper} ${bootstrap.wrapper}`}>
          <div className={allStyle.inboxContainer}>
            <EmailComposer
              from={this.state.newmsgfrom}
              to={this.state.newmsgto}
              subject={this.state.newmsgsubject}
              attachments={attachments}
              discard={() => {
                this.setState({
                  composing: false
                });
              }}
              send={(from, to, subject, message, sendattachments) => {
                this.smtp(from, to, subject, message, sendattachments);
              }}
            />
          </div>
        </div>
      );
    }
    if (selectedMessage) {
      return (
        <div className={`${allStyle.wrapper} ${bootstrap.wrapper}`}>
          <div className={allStyle.inboxContainer}>
            <div className={allStyle.inboxListShort}>
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
            <div className={allStyle.inboxMessage}>
              <EmailMessage
                message={selectedMessage}
                sendReply={(...rest) => {
                  this.sendMessage(...rest);
                }}
                unselect={() => {
                  this.setState({
                    selectedMessage: null
                  });
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    // console.log('allStyle', Object.keys(allStyle));
    return (
      <div className={`${allStyle.wrapper} ${bootstrap.wrapper}`}>
        <div className={allStyle.inboxContainer}>
          <div className={allStyle.inboxList}>
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
      </div>
    );
  }
}
