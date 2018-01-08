import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
// import 'moment/src/locale/it';
import cheerio from 'cheerio';
// import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import bootstrap from '../assets/less/bootstrap.less';
import allStyle from './style.scss';

export default class EmailListItem extends React.Component {
  static propTypes = {
    selected: PropTypes.bool,
    id: PropTypes.string.isRequired,
    subject: PropTypes.string,
    from: PropTypes.string.isRequired,
    fromAsHtml: PropTypes.string,
    to: PropTypes.string.isRequired,
    toAsHtml: PropTypes.string.isRequired,
    seendate: PropTypes.string,
    // to: PropTypes.string.isRequired,
    // toAsHtml: PropTypes.string,
    onEmailClicked: PropTypes.func.isRequired,
    // direction: PropTypes.string.isRequired,
    attachments: PropTypes.string,
    direction: PropTypes.string.isRequired,
    incomingdate: PropTypes.string.isRequired
  }

  static defaultProps = {
    selected: false,
    subject: '',
    fromAsHtml: null,
    attachments: '',
    seendate: ''
  }

  render() {
    // moment.locale('it');
    let classes = allStyle.emailItem;
    if (this.props.selected) {
      classes += ` ${allStyle.selected}`;
    }
    let {
      fromAsHtml
    } = this.props;
    const {
      from,
      seendate,
      to,
      toAsHtml
    } = this.props;
    if (fromAsHtml) {
      const html = cheerio.load(fromAsHtml);
      html('a').attr('href', null);
      fromAsHtml = html('span').html();
    }
    // const seencolor = seendate ? '#000000' : '#d0d0d0';
    let myFrom = from;
    if (fromAsHtml) {
      myFrom = (
        <span
          dangerouslySetInnerHTML={{ // eslint-disable-line
            __html: fromAsHtml
          }}
        />
      );
    }
    let myTo = to;
    if (toAsHtml) {
      myTo = (
        <span
          dangerouslySetInnerHTML={{ // eslint-disable-line
            __html: toAsHtml
          }}
        />
      );
    }
    const fromLocal = from.indexOf('@s97.srl') > -1;
    let fullFrom = null;
    if (fromLocal) {
      fullFrom = seendate
        ? (
          <div>
            <span className={`fa fa-stack ${bootstrap.textDark}`}>
              <i className={`fa fa-check fa-stack-1x ${bootstrap.textPrimary}`} style={{ marginLeft: '4px' }} />
              <i className="fa fa-check fa-inverse fa-stack-1x" style={{ marginLeft: '-3px' }} />
              <i className={`fa fa-check fa-stack-1x ${bootstrap.textPrimary}`} style={{ marginLeft: '-4px' }} />
            </span>
            {myTo}
          </div>
        )
        : (
          <div>
            <span className={`fa fa-stack ${bootstrap.textMuted}`} style={{ color: '#c5c5c5' }}>
              <i className={`fa fa-check fa-stack-1x ${bootstrap.textSecondary}`} style={{ marginLeft: '4px' }} />
              <i className="fa fa-check fa-inverse fa-stack-1x" style={{ marginLeft: '-3px' }} />
              <i className={`fa fa-check fa-stack-1x ${bootstrap.textPrimary}`} style={{ marginLeft: '-4px' }} />
            </span>
            {myTo}
          </div>
        );
    } else {
      fullFrom = (
        <div>
          <span className={`fa fa-stack ${bootstrap.textDark}`}>
            <i className="fa fa-arrow-right fa-stack-1x" style={{ marginLeft: '4px' }} />
            <i className="fa fa-fw fa-inverse fa-stack-1x" style={{ marginLeft: '-3px' }} />
            <i className="fa fa-fw fa-stack-1x" style={{ marginLeft: '-4px' }} />
          </span>
          {myFrom}
        </div>
      );
    }
    console.log('this.props.attachments', this.props.attachments);
    return (
      <div
        tabIndex="0"
        role="button"
        onClick={() => { this.props.onEmailClicked(this.props.id, this.props.direction); }}
        className={classes}
      >
        <div className={`${bootstrap.row} ${allStyle['email-item__details']}`}>
          <div
            className={`${bootstrap.colXs8} ${bootstrap.colSm9} ${allStyle.mailtruncate}`}
          >
            {fullFrom}
          </div>
          <div
            className={`${bootstrap.colXs4} ${bootstrap.colSm3} ${allStyle.mailtruncate} ${bootstrap.textRight}`}
          >
            <span>
              {moment(this.props.incomingdate).format('DD/MM/YY HH:mm')}
              <i className="fa fa-fw fa-clock-o" style={{ marginLeft: '3px' }} />
            </span>
          </div>
        </div>
        <div className={`${bootstrap.row} ${allStyle['email-item__details']}`}>
          <div
            className={`${bootstrap.colXs8} ${bootstrap.colSm9} ${allStyle.mailtruncate}`}
          >
            {
              this.props.attachments && this.props.attachments.length > 0 && this.props.attachments !== '[]'
              ? (
                <span className={`fa fa-stack ${bootstrap.textDark}`}>
                  <i className="fa fa-paperclip fa-stack-1x" style={{ marginLeft: '4px' }} />
                  <i className="fa fa-fw fa-inverse fa-stack-1x" style={{ marginLeft: '-3px' }} />
                  <i className="fa fa-fw fa-stack-1x" style={{ marginLeft: '-4px' }} />
                </span>
              )
              : (
                <span className={`fa fa-stack ${bootstrap.textDark}`}>
                  <i className="fa fa-fw fa-stack-1x" style={{ marginLeft: '4px' }} />
                  <i className="fa fa-fw fa-inverse fa-stack-1x" style={{ marginLeft: '-3px' }} />
                  <i className="fa fa-fw fa-stack-1x" style={{ marginLeft: '-4px' }} />
                </span>
              )
            }
            {this.props.subject || ''}
          </div>
          <div
            className={`${bootstrap.colXs4} ${bootstrap.colSm3} ${allStyle.mailtruncate} ${bootstrap.textRight}`}
          >
            {seendate ? (
              <span>
                { moment(seendate).format('DD/MM/YY HH:mm') }
                <i className="fa fa-fw fa-eye" style={{ marginLeft: '3px' }} />
              </span>
            )
            : ''}
          </div>
        </div>
      </div>
    );
  }
}
