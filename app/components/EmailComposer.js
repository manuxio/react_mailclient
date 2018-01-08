import React from 'react';
import PropTypes from 'prop-types';
import ReactMde, {
  ReactMdeCommands
} from 'react-mde';
import 'react-mde/lib/styles/scss/react-mde-all.scss';
import {
  insertText
} from 'react-mde/lib/js/helpers/ReactMdeTextHelper';
import bootstrap from '../assets/less/bootstrap.less';
import allStyle from './style.scss';

const makeLinkCommand = {
  icon: 'link',
  tooltip: 'Insert a link',
  execute: (text, selection) => {
    const { newText, insertionLength } = insertText(text, '[', selection.start);
    const finalText = insertText(newText, '](http://www.s97.srl)', selection.end + insertionLength).newText;
    return {
      text: finalText,
      selection: {
        start: selection.start + insertionLength,
        end: selection.end + insertionLength
      }
    };
  }
};

export default class EmailComposer extends React.Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    // to: PropTypes.string.isRequired,
    send: PropTypes.func.isRequired,
    discard: PropTypes.func.isRequired,
    attachments: PropTypes.arrayOf({
      attachment_name: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      subject: props.subject,
      message: '',
      from: props.from,
      to: props.to,
      attachments: props.attachments
    };
  }

  render() {
    return (
      <div className={`${allStyle.emailComposer}`}>
        <form>
          <div className={`${bootstrap.formGroup}`}>
            <div>
              <div className={`${bootstrap.colXs3}`}>
                <label htmlFor="to">To</label>
              </div>
              <div className={`${bootstrap.colXs9}`}>
                <input type="text" style={{ borderRadius: '0px' }} id="to" className={`${bootstrap.formControl}`} placeholder="To" value={this.state.to} onChange={(e) => { this.setState({ to: e.target.value }); }} />
              </div>
            </div>
            <div className="">
              <div className={`${bootstrap.colXs3}`}>
                <label htmlFor="subject">Subject</label>
              </div>
              <div className={`${bootstrap.colXs9}`}>
                <input type="text" style={{ borderRadius: '0px' }} id="subject" className={`${bootstrap.formControl}`} placeholder="Subject" value={this.state.subject} onChange={(e) => { this.setState({ subject: e.target.value }); }} />
              </div>
            </div>
            <ReactMde
              textAreaProps={{
                id: 'ta1',
                name: 'ta1'
              }}
              visibility={{
                preview: false
              }}
              value={this.state.message}
              onChange={(value) => {
                this.setState({
                  message: value
                });
              }}
              commands={[
                [
                  // ReactMdeCommands.makeHeaderCommand,
                  ReactMdeCommands.makeBoldCommand,
                  ReactMdeCommands.makeItalicCommand,
                  makeLinkCommand,
                  ReactMdeCommands.makeUnorderedListCommand,
                  ReactMdeCommands.makeOrderedListCommand
                ]
              ]}
            />
          </div>
        </form>
        <div className="">
          <div className={`${bootstrap.colXs3}`}>
            <button
              className={`${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnWarning}`}
              onClick={() => {
                // console.log('this.props.discard', this.props.discard);
                this.state.attachments.forEach((att) => {
                  att.checked = false; // eslint-disable-line
                });
                this.props.discard();
              }}
            >
              Cancel
            </button>
          </div>
          <div className={`${bootstrap.colXs9} ${bootstrap.textRight}`}>
            <div
              className={`${bootstrap.btnGroup} ${bootstrap.dropup}`}
            >
              {
                this.state.attachments.length > 0
                ? (
                  <button
                    className={`${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnPrimary}`}
                    onClick={() => {
                      this.setState({
                        attachmentsOpen: !this.state.attachmentsOpen
                      });
                    }}
                  >
                    Attachments ({ this.state.attachments.filter(att => att.checked).length })
                    {' '}
                    <span className={bootstrap.caret} />
                  </button>
                )
                : null
              }
              {
                this.state.attachmentsOpen
                ? (
                  <ul className={bootstrap.dropdownMenu} style={{ display: 'block' }}>
                    {
                      this.state.attachments.map((att, pos) => {
                        return (
                          <li>
                            <input
                              type="checkbox"
                              id={att.attachment_name}
                              checked={att.checked}
                              style={{ marginLeft: '5px', marginRight: '5px', paddingTop: '3px' }}
                              value="1"
                              onChange={(e) => {
                                this.state.attachments[pos].checked = e.target.checked;
                                const { attachments } = this.state;
                                attachments[pos].checked = e.target.checked;
                                this.setState({
                                  attachments
                                });
                              }}
                            />
                            <label htmlFor={att.attachment_name}>{att.attachment_name}</label>
                          </li>
                        );
                      })
                    }
                  </ul>
                )
                : null
              }
              <button
                className={`${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnSuccess}`}
                onClick={() => {
                  // console.log('this.props.discard', this.props.discard);
                  // this.props.discard();
                  this.props.send(
                    this.state.from,
                    this.state.to,
                    this.state.subject,
                    this.state.message && this.state.message.text ? this.state.message.text : '',
                    this.state.attachments.filter(att => att.checked)
                  );
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
