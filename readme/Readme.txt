

Sending Email from GMAIL using less secure app 

https://myaccount.google.com/lesssecureapps


Tutorials to send email from GMAIL 

https://www.tutsmake.com/node-js-send-email-through-gmail-with-attachment-example/

https://seegatesite.com/the-steps-how-to-install-openssl-on-xampp-windows/

>keytool -genkey -keyalg RSA -alias selfsigned -keystore keystore.jks -storepass changeit -validity 360 -keysize 2048

keytool -export -alias selfsigned -keystore keystore.jks -rfc -file X509_certificate.cer

keytool -genkeypair -alias selfsigned -keyalg RSA -keysize 2048 -dname "CN=Jakob Jenkov, OU=Jenkov Aps, O=Jenkov Aps, L=Copenhagen, ST=Unknown, C=DK"
    -keypass changeit -validity 360 -storetype JKS -keystore keystore.jks -storepass changeit

keytool -genkeypair -alias selfsigned -keyalg RSA -keysize 2048 -dname "CN=www.google.com, OU=Web Development, O='Google, Inc.' L=Mountain View, ST=California, C=IN"
    -keypass changeit -validity 360 -storetype JKS -keystore keystore.jks -storepass changeit 

keytool -importkeystore -srckeystore keystore.jks -destkeystore keystore.p12 -deststoretype PKCS12

For apache ssl certificate file you need certificate only:

openssl pkcs12 -in keystore.p12 -nokeys -out my_key_store.crt

For ssl key file you need only keys:

openssl pkcs12 -in keystore.p12 -nocerts -nodes -out my_store.key


API KEY 
https://elasticemail.com/account#/settings/new/create-api
emailKey
F569FE6D630CB60C044A4D67CF934E44ABAD980EEA292CB8D65B0CC10D379D98203860B7C8138099CBCE881D5B3C3A87