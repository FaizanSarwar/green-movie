import React from 'react';
import Button from "./Button";
const Modal = ({ isOpen, onClose, success, message, btnMessage}) => {
  const modalStyle = {
    display: isOpen ? 'block' : 'none',
    };
  return (  
    <div className="modal" style={modalStyle}>
      <div  className="modalContent"> <br/>
        {success ? <p className="modalPara" >{message}</p> : <p>Error: {message}</p>} <br/>
        {success? <Button className="modalButton" onClick={onClose}>{btnMessage}</Button>:<Button onClick={onClose}>{btnMessage}</Button> }
      </div>
    </div>
  );
}
 
export default Modal;