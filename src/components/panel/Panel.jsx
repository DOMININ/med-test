import React, { useState } from "react";
import "./panel.scss";
import Autosuggest from "react-autosuggest";
import data from "../../data/data.json";
import Popup from "../popup/Popup";

export default function Panel() {
  const [insuranceType, setInsuranceType] = useState("OMC");
  const [insuranceCompany, setInsuranceCompany] = useState("default");
  const [services, setServices] = useState([]);
  const [phone, setPhone] = useState();
  const [date, setDate] = useState();
  const [additional, setAdditional] = useState(false);
  const [policyValue, setPolicyValue] = useState("");
  const [reset, setReset] = useState(false);
  const [popup, setPopup] = useState(false);

  const templates = [
    /^(\d{4})(\s{1})(\d{8})$/,
    /^(\d{4})-(\d{6})-(\d{2})$/,
    /^(\d{2})-(\d{6})-(\d{4})$/,
    /^(\d{4})(\s{1})(\d{6})$/,
    /^(\d{2})-(\d{2})(\s{1})(\d{4})-(\d{2})$/,
    /^(\d{4})-(\d{6})$/
  ];

  const handlePolicyChange = event => {
    data.dataPolicy.forEach((item, index) => {
      setPolicyValue(event.target.value);

      let type = item.type;
      let company = item.company;

      if (templates[index].test(event.target.value)) {
        setInsuranceType(type);
        setInsuranceCompany(company);
        setPhone(item.phone);
        setDate(item.date);
      }
    });
  };

  const onInsuranceTypeChange = event => {
    setInsuranceType(event.target.value);
  };

  const onInsuranceCompanyChange = event => {
    setInsuranceCompany(event.value);
  };

  // ---------------------------------------------
  const [value, setValue] = useState("");
  const amenities = [...data.included, ...data.notIncluded];

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : amenities.filter(
          item => item.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => <div>{suggestion}</div>;

  const [suggestions, setSuggestions] = useState([]);

  const onServiceChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleServiceKeyPress = event => {
    if (event.which === 13 && services.length < 6) {
      if (event.target.value.trim() !== "") {
        setServices([...services, event.target.value]);
        setValue("");
      } else {
        setValue("");
      }
    }
  };

  const inputProps = {
    placeholder: "Введите запрашиваемую услугу для пациента",
    value,
    onChange: onServiceChange,
    onKeyPress: handleServiceKeyPress
  };

  const onDeleteClick = index => {
    setServices(services.filter((_, filterIndex) => filterIndex !== index));
  };

  const onButtonSubmit = event => {
    event.preventDefault();

    let included = false;

    data.dataPolicy.forEach(item => {
      if (item.number === policyValue) {
        included = true;
      }
    });

    if (included) {
      setAdditional(true);
      setReset(true);
    } else {
      setPopup(true);
    }
  };

  const onButtonReset = () => {
    setInsuranceType("OMC");
    setInsuranceCompany("default");
    setServices([]);
    setPhone();
    setDate();
    setPolicyValue("");
    setAdditional(false);
    setReset(false);
  };

  const renderIcon = item => {
    if (data.included.indexOf(item) !== -1) {
      return (
        <svg
          className="panel__services-icon"
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.13 1.15506C19.9233 0.948401 19.5882 0.948225 19.3816 1.15506L5.37797 15.1586L1.9034 11.684C1.69674 11.4773 1.36157 11.4773 1.15499 11.684C0.948335 11.8907 0.948335 12.2258 1.15499 12.4323L5.00382 16.2811C5.1071 16.3845 5.24258 16.4362 5.37806 16.4362C5.51354 16.4362 5.64893 16.3845 5.7523 16.2811L20.13 1.90346C20.3367 1.6968 20.3367 1.36172 20.13 1.15506Z"
            fill="#66D1C6"
            stroke="#66D1C6"
          />
        </svg>
      );
    } else if (data.notIncluded.indexOf(item) !== -1) {
      return (
        <svg
          className="panel__services-icon"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
            fill="#ED462F"
          />
          <path
            d="M13.5 9H4.5"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="panel__services-icon"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.90011 12.6H8.1001V14.4H9.90011V12.6Z" fill="#FFB800" />
          <path
            d="M8.99998 0C4.02945 0 0 4.02945 0 8.99998C0 13.9705 4.02945 18 8.99998 18C13.9705 18 18 13.9705 18 8.99998C18 4.02945 13.9705 0 8.99998 0ZM8.99998 16.371C4.9291 16.371 1.62898 13.0709 1.62898 8.99998C1.62898 4.9291 4.9291 1.62898 8.99998 1.62898C13.0688 1.63392 16.366 4.93112 16.371 8.99998C16.371 13.0709 13.0709 16.371 8.99998 16.371Z"
            fill="#FFB800"
          />
          <path
            d="M12.5009 6.34499C12.038 4.41141 10.0952 3.21928 8.16162 3.68224C6.53601 4.07146 5.39218 5.52845 5.39994 7.2H7.19995C7.28446 6.2059 8.15883 5.4685 9.15294 5.553C10.147 5.6375 10.8844 6.51188 10.7999 7.50599C10.6161 8.40053 9.81359 9.03186 8.90095 8.99997C8.45857 8.99997 8.09994 9.35861 8.09994 9.80098V11.7H9.89995V10.674C11.8035 10.1831 12.9613 8.25612 12.5009 6.34499Z"
            fill="#FFB800"
          />
        </svg>
      );
    }
  };

  return (
    <main className="panel">
      <h1 className="visually-hidden">Услуги страхования</h1>
      <form className={popup ? "panel__form--delete" : "panel__form"}>
        <h2>Проверка услуг медицинского страхования</h2>
        <ul className="panel__list">
          <li className="panel__item">
            <input
              className="visually-hidden panel__radio"
              type="radio"
              id="OMC"
              name="insurance"
              value="OMC"
              checked={insuranceType === "OMC"}
              onChange={onInsuranceTypeChange}
              disabled={additional}
            />
            <label htmlFor="OMC">ОМС</label>
          </li>
          <li className="panel__item">
            <input
              className="visually-hidden panel__radio"
              type="radio"
              id="DMC"
              name="insurance"
              value="DMC"
              checked={insuranceType === "DMC"}
              onChange={onInsuranceTypeChange}
              disabled={additional}
            />
            <label htmlFor="DMC">ДМС</label>
          </li>
        </ul>
        <div className="wrapper-input">
          <div>
            <input
              className="panel__policy input-field"
              type="text"
              placeholder="Введите номер полиса"
              value={policyValue}
              required
              onChange={handlePolicyChange}
              disabled={additional}
            />
            {additional ? <p>Дата окончания {date} г.</p> : null}
          </div>
          <div>
            <select
              value={insuranceCompany}
              className="panel__insurance input-field"
              onChange={onInsuranceCompanyChange}
              disabled={additional}
            >
              <option value="default" disabled hidden>
                Выберите страховую компанию
              </option>
              <option value="randevu">СК Рандеву</option>
              <option value="med">СК МЕД-АСКЕР</option>
              <option value="strah">Страх-трах</option>
            </select>
            {additional ? <p>Телефон {phone}</p> : null}
          </div>
        </div>
        <p className="panel__services">Выберите медицинские услуги</p>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <ul className="panel__services-list">
          {services.map((item, index) => (
            <React.Fragment key={index}>
              <li className="panel__services-item">
                {item}
                {additional ? (
                  renderIcon(item)
                ) : (
                  <svg
                    onClick={() => onDeleteClick(index)}
                    className="panel__services-delete"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 6.71875L14.2188 0L15 0.78125L8.28125 7.5L15 14.2188L14.2188 15L7.5 8.28125L0.78125 15L0 14.2188L6.71875 7.5L0 0.78125L0.78125 0L7.5 6.71875Z"
                      fill="#6B808C"
                    />
                  </svg>
                )}
              </li>
            </React.Fragment>
          ))}
        </ul>
        {!reset ? (
          <button
            type="button"
            id="verifyButton"
            className="panel__verify"
            onClick={onButtonSubmit}
            disabled={
              policyValue === "" ||
              services.length === 0 ||
              insuranceCompany === "default"
            }
          >
            Проверить
          </button>
        ) : (
          <button
            type="button"
            id="verifyButton"
            className="panel__reset"
            onClick={onButtonReset}
          >
            Новый запрос
          </button>
        )}
      </form>
      {popup ? <Popup isOpen={popup} onClose={() => setPopup(false)} /> : null}
    </main>
  );
}

// TODO:

// DMC:
// /^(\d{4})(\s{1})(\d{8})$/.test("1234 12345678");
// /^(\d{4})-(\d{6})-(\d{2})$/.test("1234-123456-78");
// /^(\d{2})-(\d{6})-(\d{4})$/.test("12-341234-5678");

// OMC:
// /^(\d{4})(\s{1})(\d{6})$/.test("9876 543210");
// /^(\d{2})-(\d{2})(\s{1})(\d{4})-(\d{2})$/.test("98-76 5432-10");
// /^(\d{4})-(\d{6})$/.test("9876-543210");
