import React from "react";
import "./popup.scss";

export default function Popup(props) {
  return props.isOpen ? (
    <div className="popup">
      <h3>Полис с таким номером не обнаружен</h3>
      <p>Попробуйте изменить данные</p>
      <button type="button" onClick={props.onClose}>
        Ок
      </button>
    </div>
  ) : null;
}
