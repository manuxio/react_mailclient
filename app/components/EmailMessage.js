import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import prettyBytes from 'pretty-bytes';
import cheerio from 'cheerio';
import { PulseLoader } from 'halogenium';
// import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import bootstrap from '../assets/less/bootstrap.less';
import allStyle from './style.scss';

export default class EmailMessage extends React.Component {
  static propTypes = {
    message: PropTypes.shape({
      id: PropTypes.string.isRequired,
      direction: PropTypes.string.isRequired
    }).isRequired,
    unselect: PropTypes.func.isRequired,
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
      .get(`/newsite/mailer/data/singlemessage.php?id=${id}`)
      .end((err, res) => {
        if (!err) {
          this.setState({
            loaded: true,
            message: res.body,
            lastId: id,
            lastDirection: direction
          });
        }
      });
    this.setState({
      loaded: false
    });
  }

  render() {
    const {
      loaded,
      message
    } = this.state;
    if (!loaded) {
      return (
        <div className={`${allStyle.messagePleaseWait}`}>
          <PulseLoader color="#4285f4" size="16px" margin="4px" loading />
        </div>
      );
    }

    const email = message;
    if (!email.text) {
      email.text = 'Errore durante la lettura del contenuto';
    }
    if (email.fromAsHtml) {
      const html = cheerio.load(email.fromAsHtml);
      html('a').attr('href', null);
      email.fromAsHtml = html('span').html();
    }
    if (email.toAsHtml) {
      const html = cheerio.load(`<span>${email.toAsHtml}</span>`);
      html('a').attr('href', null);
      email.toAsHtml = html('span').html();
    }
    return (
      <div className={`${allStyle.emailContent}`}>
        <div className={`${allStyle.emailContentHeader} ${allStyle.stickyheader}`}>
          {
            (window && window.parent && window.parent.contratto)
            ? (<span
              role="button"
              tabIndex={-1}
              onClick={() => {
                if (email.from && email.from.indexOf('@s97.srl') > -1) {
                  // console.log('There!');
                  this.props.sendReply(email.to, `c${window.parent.contratto.CodiceCliente}.p${window.parent.contratto.idcontratto}@s97.srl`, email.subject);
                } else {
                  // console.log('Here!');
                  this.props.sendReply(email.from, `c${window.parent.contratto.CodiceCliente}.p${window.parent.contratto.idcontratto}@s97.srl`, email.subject);
                }
              }}
              className={`${allStyle.deleteBtn} fa fa-mail-reply`}
            />)
            : null
          }
          <span
            role="button"
            tabIndex={-1}
            onClick={() => { this.props.unselect(); }}
            className={`${allStyle.closeBtn} fa fa-times`}
          />
          <div className={`${allStyle.emailContentFrom}`} style={{ marginRight: '15px' }}>
            <div className={`${bootstrap.colXs2} ${bootstrap.colSm1}`}><b>From</b></div>
            <div
              className={`${bootstrap.colXs10} ${bootstrap.colSm11}`}
              dangerouslySetInnerHTML={{ // eslint-disable-line
                __html: email.fromAsHtml || email.from
              }}
            />
          </div>
          <div className={`${allStyle.emailContentFrom}`}>
            <div className={`${bootstrap.colXs2} ${bootstrap.colSm1}`}><b>To</b></div>
            <div
              className={`${bootstrap.colXs10} ${bootstrap.colSm11}`}
              dangerouslySetInnerHTML={{ // eslint-disable-line
                __html: email.toAsHtml || email.to
              }}
            />
          </div>
          <div className={`${allStyle.emailContentSubject}`}>
            <div className={`${bootstrap.colXs2} ${bootstrap.colSm1}`}><b>Subject</b></div>
            <div className={`${bootstrap.colXs10} ${bootstrap.colSm11}`}>{email.subject}</div>
          </div>
          <div style={{ clear: 'both' }} />
        </div>
        <div className={`${allStyle.emailContentMessage}`}>
          {
            email.attachments && JSON.parse(email.attachments).length > 0
            ?
              <div className={`${allStyle.emailContentAttachments}`}>
                {
                  JSON.parse(email.attachments).map((att, pos) => {
                    return (
                      <div className={`${allStyle.emailContentSingleattachment}`} key={`${email.id}`}>

                        <a className={`${bootstrap.btn} ${bootstrap.btnDefault} ${bootstrap.btnXs}`} href={`/newsite/mailer/data/singleattachment.php?id=${email.id}&pos=${pos}`} target="_new">
                          <i className="fa fa-download" />
                          {' '}
                          {prettyBytes(att.size)}
                        </a>
                        {' '}
                        {att.filename}
                      </div>
                    );
                  })
                }
              </div>
            : null
          }
          <div
            dangerouslySetInnerHTML={{ // eslint-disable-line
              __html: email.html || email.text
            }}
          />
        </div>
      </div>
    );
  }
}
