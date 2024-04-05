import React from 'react';
import PropTypes from 'prop-types';
import './pickupPanel.scss'; // Import the corresponding SCSS file

const PickupPanel = ({ onClose, onSchedule }) => {
  return (
    <div className="pickupPanel__overlay">
      <div className="pickupPanel__container">
        <button className="pickupPanel__closeButton" onClick={onClose}>
          Close
        </button>
        <div className="pickupPanel__content">
          {/* Your panel content goes here */}
          <p>Schedule pickup or any other content...</p>
        </div>
        <div className="pickupPanel__buttons">
          <button onClick={onSchedule}>Schedule Pickup</button>
        </div>
      </div>
    </div>
  );
};

PickupPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSchedule: PropTypes.func.isRequired,
};

export default PickupPanel;
