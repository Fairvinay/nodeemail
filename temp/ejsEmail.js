



app.get("/hello", (req, res, next) => {
let emailTemplate;
let capitalizedFirstName = "John";
let userEmail = "John@example.com";

ejs
.renderFile(path.join(__dirname, "views/welcome-mail.ejs"),
{
  user_firstname: capitalizedFirstName,
  confirm_link: "http://www.mozenrat.in/confirm=" + userEmail
})
.then(result => {
  emailTemplate = result;
  res.send(emailTemplate);
})
.catch(err => {
  res.status(400).json({
      message: "Error Rendering emailTemplate",
      error: err
     });
  });

});