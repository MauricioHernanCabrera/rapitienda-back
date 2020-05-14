const nodemailer = require("nodemailer");
const config = require("./../config");

module.exports = function ({
  from = "no-replay@geco.com",
  to = "",
  subject,
  html = "",
  text = "",
}) {
  return new Promise(async (res, rej) => {
    try {
      const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        auth: {
          type: "OAuth2",
          user: config.nodemailer.user,
          clientId: config.nodemailer.clientId,
          clientSecret: config.nodemailer.clientSecret,
          access_token: config.nodemailer.accessToken,
          refreshToken: config.nodemailer.refreshToken,
          expires: config.nodemailer.expires,
        },
      });

      const mailOptions = {
        to,
        from,
        subject,
        html,
        text,
      };

      const result = await smtpTransport.sendMail(mailOptions);
      res(true);
    } catch (error) {
      rej(error);
    }
  });
};
