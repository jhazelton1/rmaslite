import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Station extends Component {
  render () {
    return (
      // <Router>
      <div className='station' id={this.props.station}>
        <h2>{this.props.station}</h2>

        <ul>
          <li>
            <Link
              to={this.props.station + '/' + this.props.station + '_SVR_IBLIST'}
            >
              Inbound
            </Link>
          </li>
          <li>
            <Link
              to={this.props.station + '/' + this.props.station + '_SVR_OBLIST'}
            >
              Outbound
            </Link>
          </li>
          <li>
            <Link
              to={this.props.station + '/' + this.props.station + '_SVR_SDLIST'}
            >
              Snow Desk
            </Link>
          </li>
        </ul>
        {/* <Route exact path={this.props.station + "/inbound"} component={App} /> */}
        {/* <Route exact path="/outbound" component={App} /> */}
        {/* <Route exact path="/snow" component={App} /> */}
      </div>
    )
  }
}

export default Station
