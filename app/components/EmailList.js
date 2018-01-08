import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import bootstrap from '../assets/less/bootstrap.less';
import EmailListItem from './EmailListItem';
import allStyle from './style.scss';

export default class EmailList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired,
    selectedMessage: PropTypes.shape({
      id: PropTypes.string.isRequired,
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
      <div className={`${allStyle.emailList} ${allStyle.navbarXs}`}>
        <div className={`${allStyle.sticky} ${allStyle.navbarPrimary}`}>
          <div
            className={`${allStyle.navbar}`}
            role="navigation"
            style={{
              backgroundColor: '#c3c3c3',
              borderRadius: '0px'
            }}
          >
            <ul className={`${bootstrap.nav} ${allStyle.navbarNav}`} style={{ float: 'right', margin: '0px 10px 0px 0px' }}>
              {
                (window && window.parent && window.parent.contratto) ?
                (
                  <li className={`${bootstrap.textRight}`} style={{ float: 'left' }}>
                    <CopyToClipboard text={`c${window.parent.contratto.CodiceCliente}.p${window.parent.contratto.idcontratto}@s97.srl`}>
                      <div className={`${bootstrap.btn}`}>
                        c{ window.parent.contratto.CodiceCliente }
                        .p{ window.parent.contratto.idcontratto }
                        @s97.srl
                      </div>
                    </CopyToClipboard>
                  </li>
                )
                : null
              }
              {
                (this.props.compose && (window && window.parent && window.parent.contratto)) ?
                (
                  <li className={`${bootstrap.textRight}`} style={{ float: 'left' }}>
                    <div
                      className={`${bootstrap.btn}`}
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
                  <li className={`${bootstrap.textRight}`} style={{ float: 'left' }}>
                    <div
                      className={`${bootstrap.btn}`}
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
            return (<EmailListItem
              onEmailClicked={this.props.onSelectMessage}
              key={`${m.direction}_${m.id}`}
              {...m}
              message={m}
              selected={
                selectedMessage
                && m.id === selectedMessage.id
                && m.direction === selectedMessage.direction
              }
            />);
          })
        }
        {
          messages.length === 0
          ? (
            <div className="">
              <div className={`${bootstrap.colXs12} ${bootstrap.textCenter}`}>Nessun messaggio di posta elettronica</div>
            </div>
          )
          : null
        }
      </div>
    );
  }
}
