import React, { useState } from "react";
import styles from "./index.module.scss";

const SubscribeForm = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const emailOptions = ["@gmail.com", "@yahoo.com", "@outlook.com", "@126.com"];

  const handleChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail && !newEmail.includes("@")) {
      setSuggestions(emailOptions.map((option) => newEmail + option));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setEmail(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubscribe(email);
  };

  return (
    <div className={styles.subscribeContainer}>
      <form onSubmit={handleSubmit} className={styles.subscribeForm}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          className={styles.emailInput}
          required
        />
        <button type="submit" className={styles.emailButton}>
          Subscribe
        </button>
      </form>
      {email && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscribeForm;
