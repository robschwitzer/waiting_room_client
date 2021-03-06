import React, { Component } from 'react';
import {geolocated} from 'react-geolocated';
import Modal from 'react-responsive-modal';
import '../component-styles/MyClinic.css'

class MyClinic extends Component {

  state = {
    open: false,
    otherOpen: false,
    minutes: '',
    clinicName: ''
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false, otherOpen: false });
  };

  onButtonClick = (mins) => {
    this.props.waitMinutes(mins)
    this.onCloseModal()
    this.setState({
      otherOpen: true
    })
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  onKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.onButtonClick(this.state.minutes)
    }
  }

  getClinicNameForCurrentUser = () => {
    let clinName;
    this.props.clinic.map((clinic, index) => {
      if (clinic.id === this.props.currentUser.id) {
        clinName = clinic.name
      }
    })
    return clinName
  }

  render() {
    const { open, otherOpen } = this.state;
    return (
      <div className="clinic-portal">
        <div className="item" onClick={ this.onOpenModal }>
          My Clinic
        </div>
        <Modal
          className="my-clinic"
          open={open} onClose={ this.onCloseModal }
          center>
        <h1>Set Wait Time for { this.getClinicNameForCurrentUser() }</h1>
          <input className="number-selector"
            autoFocus={true}
            type="number"
            name="minutes"
            placeholder="mins"
            min="0"
            max="360"
            step="5"
            onKeyPress={ this.onKeyPress }
            onChange={e => this.handleChange(e)}>
          </input>
          <button className="update-button"
            type="submit"
            onClick={() => this.onButtonClick(this.state.minutes) }>
            Update
          </button>
        </Modal>
        <Modal
          className="my-clinic"
          open={ otherOpen } onClose={ this.onCloseModal }
          center>
          <div>Thank you. The wait time for { this.getClinicNameForCurrentUser() } has been set to { this.state.minutes } mins</div>
        </Modal>
      </div>
    )
  }
}


export default MyClinic;