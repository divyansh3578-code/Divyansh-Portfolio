
import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-heading">
          <span className="contact-tag">GET IN TOUCH</span>
          <h2>Let's Connect<span>.</span></h2>
          <p>
            Have an interesting opportunity, project idea, or just
            want to talk tech? My inbox is always open.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-row">
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            rows="6"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={status === "sending"}>
            {status === "sending"
              ? "Sending..."
              : "Send Message →"}
          </button>

          {status === "success" && (
            <p className="success-message">
              Message sent successfully! I'll get back to you soon.
            </p>
          )}

          {status === "error" && (
            <p className="error-message">
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        <div className="contact-email">
          Or reach me directly at{" "}
          <a href="mailto:divyansh3578@gmail.com">
            divyansh3578@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
