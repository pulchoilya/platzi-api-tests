const today = new Date();

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const twoDaysAgo = new Date();
twoDaysAgo.setDate(today.getDate() - 2);

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const newsTestData = [
  {
    q: 'Apple',
    from: formatDate(twoDaysAgo),
    sortBy: 'popularity',
  },
  {
    q: 'Apple',
    from: formatDate(yesterday),
    sortBy: 'popularity',
  },
  {
    q: 'Tesla',
    from: formatDate(yesterday),
    sortBy: 'publishedAt',
  },
  {
    q: 'AI',
    from: formatDate(yesterday),
    sortBy: 'relevancy',
  },
  {
    q: 'Google',
    from: formatDate(twoDaysAgo),
    sortBy: 'popularity',
  },
  {
    q: 'Amazon',
    from: formatDate(yesterday),
    sortBy: 'publishedAt',
  },
  {
    q: 'Nvidia',
    from: formatDate(yesterday),
    sortBy: 'relevancy',
  },
  {
    q: 'Apple',
    from: formatDate(tomorrow),
    sortBy: 'popularity',
  },
  {
    q: 'Microsoft',
    from: formatDate(yesterday),
    sortBy: 'popularity',
  },
  {
    q: 'Bitcoin',
    from: formatDate(yesterday),
    sortBy: 'publishedAt',
  },
];

export const invalidNewsTestData = {
  from: formatDate(today),
  sortBy: 'popularity',
};
