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
    id: 1,
    q: 'Apple',
    from: formatDate(twoDaysAgo),
    sortBy: 'popularity',
  },
  {
    id: 2,
    q: 'Apple',
    from: formatDate(yesterday),
    sortBy: 'popularity',
  },
  { 
    id: 3,
    q: 'Tesla',
    from: formatDate(yesterday),
    sortBy: 'publishedAt',
  },
  {  
    id: 4,
    q: 'AI',
    from: formatDate(yesterday),
    sortBy: 'relevancy',
  },
  {
    id: 5,
    q: 'Google',
    from: formatDate(twoDaysAgo),
    sortBy: 'popularity',
  },
  {
    id: 6,
    q: 'Amazon',
    from: formatDate(yesterday),
    sortBy: 'publishedAt',
  },
  {
    id: 7,
    q: 'Nvidia',
    from: formatDate(yesterday),
    sortBy: 'relevancy',
  },
  {
  id: 8,
  q: 'Microsoft',
  from: formatDate(yesterday),
  sortBy: 'popularity',
  },
  {
    id: 9,
    q: 'Bitcoin',
    from: formatDate(yesterday),
    sortBy: 'publishedAt',
  },
  {
    id: 10,
    q: 'Meta',
    from: formatDate(yesterday),
    sortBy: 'popularity',
  },
];

export const invalidNewsTestData = {
  from: formatDate(today),
  sortBy: 'popularity',
};
