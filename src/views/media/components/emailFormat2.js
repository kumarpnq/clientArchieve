export const generateTableHTML2 = (link, user) => {
  return `
  <html>
   <head>
   <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        background-color: #ccc7c7;
        padding: 20px;
        text-align: center;
      }
      .header-logo {
        color: #222;
        font-weight: bold;
        text-align: center;
        font-size: 18px; /* Reduced font size */
      }
      .header-logo .and {
        color: red;
      }
      .report-link {
        text-align: center;
        font-size: 14px;
        color: #595959;
        margin-top: 10px;
      }
      .report-link a {
        color: #595959;
        text-decoration: none;
      }
      .report-link a:hover {
        text-decoration: underline;
      }
      .title {
        background-color: #f0f0f0;
        padding: 20px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #595959;
      }
      .footer a {
        color: #595959;
        text-decoration: none;
        margin: 0 10px;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .footer-copy {
        font-size: 12px;
        color: #aaa;
        margin-top: 10px;
      }
   </style>
   </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-logo">PERCEPTION <span class="and">&</span> <span>QUANT</span></div>
        <div class="report-link">
          <a href=${link}>Open report</a>
        </div>
      </div>
      <div class="title">
        Social Media - ${user}
      </div>
      <div class="footer">
        <a href="https://www.cirrus.co.in/">Help center</a> |
        <a href="mailto:newsalert@cirrus.co.in">Customer support</a>
        <div class="footer-copy">
          © Copyright 2024 PERCEPTION & QUANT – All rights reserved.
        </div>
      </div>
    </div>
  </body>
  </html>
  `
}
