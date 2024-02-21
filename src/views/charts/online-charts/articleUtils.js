// articleUtils.js

export const filterArticlesByDateRange = (articles, dateRange) => {
  const currentDate = new Date()

  switch (dateRange) {
    case 'today':
      return articles.filter(article => article.date === currentDate.toISOString().split('T')[0])
    case 'last_week':
      const lastWeekDate = new Date(currentDate)
      lastWeekDate.setDate(currentDate.getDate() - 7)

      return articles.filter(article => new Date(article.date) > lastWeekDate)
    case 'last_month':
      const lastMonthDate = new Date(currentDate)
      lastMonthDate.setMonth(currentDate.getMonth() - 1)

      return articles.filter(article => new Date(article.date) > lastMonthDate)
    case 'last_three_months':
      const lastThreeMonthsDate = new Date(currentDate)
      lastThreeMonthsDate.setMonth(currentDate.getMonth() - 3)

      return articles.filter(article => new Date(article.date) > lastThreeMonthsDate)
    default:
      return articles
  }
}

export const filterArticlesByCompany = (articles, companyName) => {
  return articles.filter(article => article.company === companyName)
}

export const countArticlesByCompany = articles => {
  const articleCounts = {}

  articles.forEach(article => {
    const { company } = article
    if (articleCounts[company]) {
      articleCounts[company]++
    } else {
      articleCounts[company] = 1
    }
  })

  return Object.keys(articleCounts).map(company => ({
    company,
    articleCount: articleCounts[company]
  }))
}

export const calculateShareOfVoice = articles => {
  const articleCounts = countArticlesByCompany(articles)
  const totalArticles = articles.length

  const shareOfVoiceData = articleCounts.map(({ company, articleCount }) => ({
    company,
    shareOfVoice: (articleCount / totalArticles) * 100
  }))

  return shareOfVoiceData
}

export const calculateArticleCountsByCompany = articles => {
  const companies = [...new Set(articles.map(article => article.company))]

  return companies.map(company => {
    const companyArticles = filterArticlesByCompany(articles, company)

    return {
      company,
      articleCount: {
        today: filterArticlesByDateRange(companyArticles, 'today').length,
        lastWeek: filterArticlesByDateRange(companyArticles, 'last_week').length,
        lastMonth: filterArticlesByDateRange(companyArticles, 'last_month').length,
        lastThreeMonths: filterArticlesByDateRange(companyArticles, 'last_three_months').length
      }
    }
  })
}
