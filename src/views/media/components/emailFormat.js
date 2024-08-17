export const generateTableHtml = cards => {
  // fields which are not presents in api response
  // // <h3>SUN LIFE - TWITTER <span class="result-length">1 Result</span></h3>
  // <p class="statement">SENTIMENT <span class="statement-child">Positive</span></p>
  // <h3 class="report">Report 'Social Media - Sun Life ASC'</h3>
  // <p class="click-instruction">Please click on the button below to see the full report. A preview of results from the report is also available here below.</p>
  // ;<div class='hyperlink-container'>
  // <span class='hyperlink-child'>↖️Open Report</span>
  //</div>

  // footer
  // <div class="hyperlink-container">
  //       <span class="hyperlink-child">↖️Open Report</span>
  //     </div>
  //     <p class="complete-view">or visit the project to have a complete view:</p>
  //     <div class="button-wrapper">
  //      <button><a href="https://login.pnqonline.com/app/login">Login</a></button>
  //      </div>
  // <hr/>
  // ;<p class='unsubscribe'>
  //   Do you want to stop receiving this report?{' '}
  //   <a href='https://login.pnqonline.com/app/unsubscribe/9-fVwENuCs3A_DXC8LkjJJpNV_sCf6VOisk4ZTiT6F31XkuGUN8Y5v3oMiK3A9gb/65a6ef08-6aaa-4482-a2e0-f8c6e9b26b79/lgvuhfrx_gq0y2bjwcbvr/91bf1a39-7138-4039-8d39-29ac56afe835'>
  //     Click here
  //   </a>{' '}
  //   to unsubscribe.
  // </p>

  //  ;<div class='filter-card'>
  //    <img alt='logo' src='${card.publisherImage}' height='15px' width='15px' />
  //    <p>
  //      <span class='filter-card-child'>ACTIVE WIDGET FILTERS:</span>
  //      <span>channels : ${card.publisherName}</span>
  //    </p>
  //  </div>

  const getIconUrlByMediaType = mediaType => {
    switch (mediaType) {
      case 'youtube':
        return 'https://img.icons8.com/color/48/youtube--v1.png'
      case 'twitter':
        return 'https://img.icons8.com/ios-glyphs/30/twitterx--v1.png'
      case 'facebook':
        return 'https://img.icons8.com/ios-glyphs/30/facebook--v1.png'
      default:
        return ''
    }
  }

  const cardItems = cards
    .map(card => {
      const iconUrl = getIconUrlByMediaType(card.mediaType)

      return `
      <div class="main-container">


        <h1 class="text-center">
        <img src=${iconUrl} alt="logo" height="15px" width="15px" class="media-logo"/>
          <img alt='logo' src='${card.publisherImage}' height='15px' width='15px' />
          <a class="headline-user" href=${card.publisherLink}>@${card.publisherName}</a>
          <span class="headline-user-subtitle">${
            card.mediaType === 'twitter' ? 'retweeted an image' : 'shared video'
          }</span>
        </h1>
        <p class="main-paragraph">${card.title}</p>
        <p class="date-location">
          published on ${new Date(card.date).toLocaleDateString()} at ${new Date(card.date).toLocaleTimeString()} | ${
        card.mediaType
      } | ${card.publisherLocation || ''} | ${card.link}
        </p>

        <p class="metrics">METRICS ${card.stats.impression_count || card.stats.viewCount || 0} Engagement, ${
        card.stats.followersCount || 0
      } Potential Reach, ${card.stats.likeCount || card.stats.reactionCount || 0} Trending Score</p>
        <hr/>
      </div>
    `
    })
    .join('')

  return `
    <html>
      <head>
        <style>
          body {
            color: #546e7a;
          }
            a{
             text-decoration:none;
             color: gray;
            }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
          .logo {
            background-color: #afacac;
            padding: 20px 0;
            width: 100%;
            border-radius: 2px;
          }
            .text-center{
            text-align:center;
            }
          .child {
            text-align: center;
          }
            .media-logo{
            margin: 6px 0 0 0;
            }
          .perception {
            color: black;
            font-size: 20px;
          }
          .and {
            color: red;
            font-size: 14px;
            margin: 0 2px;
          }
          .quant {
            color: gray;
            font-size: 20px;
          }
          h3 {
            color: #37474f;
          }
          .report {
            text-align: center;
            font-size: 8.5pt;
            font-family: Roboto;
            color: #546e7a;
          }
          .click-instruction {
            text-align: center;
            font-size: 9.0pt;
            font-family: Roboto;
            color: #546e7a;
          }
          .hyperlink-container {
            text-align: center;

          }
          .hyperlink-child {
            background-color: #afacac;
            padding: 10px;
            border-radius: 2px;
            color: white;
            text-decoration: underline;
          }
          .main-container {
            margin: 0 50px;
          }
          .result-length {
            font-weight: 300;
            color: #546e7a;
          }
          .filter-card {
            background: #eceff1;
            color: #546e7a;
            text-align: center;
            margin:20px 0;
          }
          .filter-card-child {
            font-weight: 400;
          }
          .headline-user {
            color: gray;
            font-weight: 700;
            font-size: 16px;
            margin: 0 0 20px 0;
          }
          .headline-user-subtitle {
            color: #546e7a;
            font-size: 13px;
          }
          .main-paragraph {
            color: #546e7a;
          }
          .date-location {
            margin: 20px 0;
            color: #546e7a;
          }
          .statement {
            font-size: 8.5pt;
            font-family: Roboto;
            color: #b0bec5;
          }
          .statement-child {
            font-size: 8.5pt;
            font-family: Roboto;
            color: #26de81;
          }
          .metrics {
            font-size: 8.5pt;
            font-family: Roboto;
            color: #b0bec5;
          }
          .metrics-child {
            color: #546e7a;
          }
  .note{
    font-size: 10.5pt;
    font-family: Roboto;
    color: #90a4ae;
    text-align:center;
    }
  .complete-view{
    font-size: 9.0pt;
    font-family: Roboto;
    color: #546e7a;
    text-align:center;
    }
    .button-wrapper{
     text-align:center;
    }
    button{
     border: 1px solid gray;
     border-radius:3px;
     cursor:pointer;
    }
     .contact{
      text-align:center;
      font-size: 9.0pt;
    font-family: Roboto;
    color: #546e7a;
     }
      .unsubscribe{
       text-align:center;
       font-size: 7.0pt;
    font-family: Roboto;
    color: #546e7a;
      }
        </style>
      </head>
      <body>
        <p>
          <div class="logo">
            <div class="child">
              <span class="perception">PERCEPTION</span>
              <span class="and">&</span>
              <span class="quant">QUANT</span>
            </div>
          </div>
        </p>


        ${cardItems}
        <footer class="main-container">
         <p class="note">Note that some results may have been deleted from Twitter in the meantime, and are therefore not displayed</p>

      <p class="contact">
         If you need help or have any questions, check out at this
         <a href="https://www.cirrus.co.in/">link</a>
         or contact
        <a href="mailto:news@cirrus.co.in">Customer Support</a>.
      </p>

        </footer>
      </body>
    </html>
  `
}
