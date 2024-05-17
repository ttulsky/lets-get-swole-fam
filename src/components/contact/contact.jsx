import React from "react";
import "./contact.css";

const Contact = () => {
  return (
    <div>
      <h1>Want more Swole info?</h1>
      <div className="page-container">
        <div className="contact-container grid-item">
          <h2>Contact Us!</h2>
          <p>
            If you have any questions or would like to get in touch, feel free
            to reach out, and someone from our Swole Fam will hit you back!
          </p>
          <div className="contact-info">
            <p>
              <a href="mailto:letsgetswolefam@gmail.com">
                letsgetswolefam@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
