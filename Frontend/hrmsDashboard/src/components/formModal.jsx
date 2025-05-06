import React from "react";
import "./formModal.css";

const FormModal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="close-button" onClick={onClose}>×</div> 
        {children}
      </div>
    </div>
  );
};

export default FormModal;
