import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-sub">We’d love to hear from you!</p>

      <div className="contact-card">
        <form className="contact-form">

          <label>Your Name</label>
          <input type="text" placeholder="Enter your name" required />

          <label>Your Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Your Message</label>
          <textarea rows="4" placeholder="Write something..." required></textarea>

          <button type="submit" className="contact-btn">
            Send Message
          </button>

        </form>
      </div>
    </div>
  );
}

export default Contact;
