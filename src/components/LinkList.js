import React, { useMemo, useCallback, Fragment } from 'react';
import Link from './Link';
import { useQuery, useSubscription } from 'urql';
import gql from 'graphql-tag';

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        description
        url
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const step = 3;

const LinkList = (props) => {
  const isNewPage = props.location.pathname.includes('new');
  const page = parseInt(props.match.params.page, step);

  const variables = useMemo(
    () => ({
      skip: isNewPage ? (page - 1) * step : 0,
      first: isNewPage ? step : 100,
      orderBy: isNewPage ? 'createdAt_DESC' : null,
    }),
    [isNewPage, page],
  );

  const [result] = useQuery({ query: FEED_QUERY, variables });
  const { data, fetching, error } = result;

  useSubscription({ query: NEW_VOTES_SUBSCRIPTION });
  useSubscription({ query: NEW_LINKS_SUBSCRIPTION });

  const linksToRender = useMemo(() => {
    if (!data) {
      return [];
    } else if (isNewPage) {
      return data.feed.links;
    } else {
      const rankedLinks = data.feed.links
        .slice()
        .sort((l1, l2) => l2.votes.length - l1.votes.length);
      return rankedLinks;
    }
  }, [data, isNewPage]);

  const pageIndex = isNewPage ? (page - 1) * step : 0;

  const nextPage = useCallback(() => {
    if (page <= data.feed.count / step) {
      props.history.push(`/new/${page + 1}`);
    }
  }, [props.history, data, page]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`);
    }
  }, [props.history, page]);

  if (fetching) return <div>Fetching...</div>;
  if (error) return <div>Error...</div>;

  return (
    <Fragment>
      <div>
        {linksToRender.map((link, index) => (
          <Link key={link.id} index={pageIndex + index} link={link} />
        ))}
      </div>
      {isNewPage && (
        <div className="flex ml4 mv3 grey">
          <div className="pointer mr2" onClick={previousPage}>
            Previous
          </div>
          <div className="pointer" onClick={nextPage}>
            Next
          </div>
        </div>
      )}
    </Fragment>
  );
};

export { LinkList as default, FEED_QUERY };
