import './Successmodel.css';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  return (
    <div id="success-modal-wrapper">
      <div className="modal-backdrop">
        <div className="modal-box">
          <div className="modal-icon">✅</div>
          <h2>Success</h2>
          <p>You have registered successfully. Welcome aboard!</p>
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
