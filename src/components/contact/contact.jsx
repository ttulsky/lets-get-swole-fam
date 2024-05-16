import React from "react";
import "./contact.css";
const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        If you have any questions or would like to get in touch, feel free to
        reach out!
      </p>

      <div className="contact-info">
        <p>
          <a href="mailto:letsgetswolefam@gmail.com">
            letsgetswolefam@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
