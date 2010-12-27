# Google Checkout Dialog

This project is to help you explore and develop your google checkout application. 

After entering your (sandbox) merchant id and key, you can initiate purchases and send xml requests to Google Checkout. Notifications will be forwarded to the page so you can see server-to-server traffic. 

The root page has a form for the merchant id and key. Once these are filled out, an ajax call is made to get the channel token which corresponds to the merchant id and key. This allows requests by Google Checkout to the server to be relayed back to the page for inspection. 

Configure your google checkout sandbox account to use as a callback url this service name followed by the merchant id followed by a colon followed by the merchant key.
Ask for serial number notifications.

Source is at http://github.com/dpatru/checkout-dialog.
