// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASSWORD exists:", !!process.env.SMTP_PASSWORD);

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  service: "gmail",
  //   host: "smtp.example.com",
  //   port: 587,
  //   secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});


interface BookingEmailData {
  email: string;
  guestName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

//BOOKING CONFIRMATION EMAIL
export const sendBookingConfirmation = async (booking: BookingEmailData) => {
  try {
    const info = await transporter.sendMail({
      from: `"RentRight" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: "Din bokning är bekräftad",
      html: `
      <h2>Tack för din bokning!</h2>

      <p>Hej ${booking.guestName},</p>

      <p>Din bokning har bekräftats.</p>

      <ul>
        <li><strong>Boende:</strong> ${booking.propertyTitle}</li>
        <li><strong>Incheckning:</strong> ${booking.checkIn}</li>
        <li><strong>Utcheckning:</strong> ${booking.checkOut}</li>
        <li><strong>Totalpris:</strong> ${booking.totalPrice} kr</li>
      </ul>

      <p>Vi önskar dig en trevlig vistelse!</p>

      <p>Med vänliga hälsningar,<br/>RentRight</p>
    `,
    });
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
  }
};

interface PaymentEmailData {
  email: string;
  guestName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}
//PAYMENT CONFIRMATION EMAIL
export const sendPaymentConfirmation = async (payment: PaymentEmailData) => {
    console.log("PAYMENT EMAIL DATA:", payment);

  try {
    await transporter.sendMail({
      from: `"RentRight" <${process.env.SMTP_USER}>`,
      to: payment.email,
      subject: "Betalning bekräftad - RentRight",
      html: `
        <h2>Betalning mottagen</h2>

        <p>Hej ${payment.guestName},</p>

        <p>Vi har mottagit din betalning.</p>

        <ul>
          <li><b>Boende:</b> ${payment.propertyTitle}</li>
          <li><b>Total betalning:</b> ${payment.totalPrice} kr</li>
        </ul>

        <p>Din bokning är nu bekräftad.</p>
      `,
    });
  } catch (error) {
    console.error("Payment email error:", error);
  }
};