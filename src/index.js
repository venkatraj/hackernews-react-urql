import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, Client, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';
import App from './components/App';
import { getToken } from './token';
import { FEED_QUERY } from './components/LinkList';

const cache = new cacheExchange({
  updates: {
    Mutation: {
      post: ({ post }, _args, cache) => {
        const variables = { first: 3, skip: 0, orderBy: 'createdAt_DESC' };
        cache.updateQuery({ query: FEED_QUERY, variables }, (data) => {
          if (data !== null) {
            data.feed.links.unshift(post);
            data.feed.count++;
            return data;
          } else {
            return null;
          }
        });
      },
    },
  },
});

const client = new Client({
  url: 'http://localhost:4000',
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  exchanges: [dedupExchange, cache, fetchExchange],
});

ReactDOM.render(
  <BrowserRouter>
    <Provider value={client}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
