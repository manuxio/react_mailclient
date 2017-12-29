import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class EmailListItem extends React.Component {
  static propTypes = {
    selected: PropTypes.boolean,
    id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    onEmailClicked: PropTypes.func.isRequired,
    // direction: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  }

  static defaultProps = {
    selected: false
  }

  render() {
    moment.locale('it');
    let classes = 'email-item';
    if (this.props.selected) {
      classes += ' selected';
    }
    return (
      <div tabIndex={0} role="button" onClick={() => { this.props.onEmailClicked(this.props.id, this.props.direction); }} className={classes}>
        <div className="email-item__subject truncate">{this.props.subject}</div>
        <div className="email-item__details">
          <span className="email-item__from truncate">{this.props.from}</span>
          <span className="email-item__time truncate">{moment(this.props.date).format('LLL')}</span>
        </div>
      </div>
    );
  }
}
