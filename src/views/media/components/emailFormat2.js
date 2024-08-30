export const generateTableHTML2 = (link, user) => {
  return `
  <html>
   <head>
   <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #eef2f3;
      }
      .container {
        width: 90%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: #eef2f3;
        padding: 20px;
        text-align: center;
      }
      .header-logo {
        color: #333;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        letter-spacing: 1px;
      }
      .header-logo .and {
        color: red;
      }
      .report-link {
        text-align: center;
        font-size: 15px;
        color: #595959;
        margin-top: 15px;
      }
      .report-link a {
        color: #0073e6;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
      }
      .report-link a:hover {
        text-decoration: underline;
      }
      .report-link .link-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      .title {
        background-color: #f7f7f7;
        padding: 20px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #444;
      }
      .footer {
        background: #eef2f3;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #595959;
      }
      .footer a {
        color: #0073e6;
        text-decoration: none;
        margin: 0 10px;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .footer-copy {
        font-size: 12px;
        color: black;
        margin-top: 10px;
      }
   </style>
   </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-logo">PERCEPTION <span class="and">&</span> <span style="color:darkgray">QUANT</span></div>
        <div class="report-link">
          <a href="${link}">
            <span class="link-icon">🔗</span>Open report
          </a>
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
