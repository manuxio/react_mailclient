import React from 'react';
import PropTypes from 'prop-types';
import ReactMde, {
  ReactMdeCommands
} from 'react-mde';
import 'react-mde/lib/styles/scss/react-mde-all.scss';
import {
  insertText
} from 'react-mde/lib/js/helpers/ReactMdeTextHelper';

const makeLinkCommand = {
  icon: 'link',
  tooltip:
  'Insert a link',
  execute:
  (text, selection) => {
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

export default class EmailMessage extends React.Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    // from: PropTypes.string.isRequired,
    // to: PropTypes.string.isRequired,
    // send: PropTypes.func.isRequired,
    discard: PropTypes.func.isRequired,
    attachments: PropTypes.arrayOf(PropTypes.shape({
      idcontratto: PropTypes.number,
      filename: PropTypes.string,
      type: PropTypes.string,
      id: PropTypes.number
    })).isRequired
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      subject: props.subject,
      message: '',
      to: props.to,
      attachments: props.attachments
    };
  }

  render() {
    return (
      <div className="email-composer">
        <form className="">
          <div className="form-group">
            <div className="">
              <div className="col-sm-3">
                <label htmlFor="subject">Subject</label>
              </div>
              <div className="col-sm-9">
                <input type="text" style={{ borderRadius: '0px' }} id="subject" className="form-control" placeholder="Subject" value={this.state.subject} onChange={(e) => { this.setState({ subject: e.target.value }); }} />
              </div>
            </div>
            <div className="">
              <div className="col-sm-3">
                <label htmlFor="to">To</label>
              </div>
              <div className="col-sm-9">
                <input type="text" style={{ borderRadius: '0px' }} id="to" className="form-control" placeholder="To" value={this.state.to} onChange={(e) => { this.setState({ to: e.target.value }); }} />
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
                  ReactMdeCommands.makeHeaderCommand,
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
          <div className="col-sm-6">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => {
                console.log('this.props.discard', this.props.discard);
                this.props.discard();
              }}
            >
              Cancel
            </button>
          </div>
          <div className="col-sm-6 text-right">
            <div className="btn-group dropup">
              {
                this.state.attachments.length > 0
                ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      this.setState({
                        attachmentsOpen: !this.state.attachmentsOpen
                      })
                    }}
                  >
                    Attachments
                    &nbsp;
                    <span className="caret" />
                  </button>
                )
                : null
              }
              {
                this.state.attachmentsOpen
                ? (
                  <ul className="dropdown-menu" style={{ display: 'block' }}>
                    {
                      this.state.attachments.map((att) => {
                        return (
                          <li>&nbsp;<input type="checkbox" checked={att.checked} /><label htmlFor="option">Option</label></li>
                        )
                      })
                    }
                  </ul>
                )
                : null
              }
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  console.log('this.props.discard', this.props.discard);
                  this.props.discard()
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
