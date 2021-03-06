import gql from 'graphql-tag';

export const FundCountQuery = gql`
  query FundCountQuery($limit: Int!, $skip: Int!) {
    fundCounts(orderBy: timestamp, first: $limit, skip: $skip) {
      id
      active
      nonActive
      timestamp
    }
  }
`;

export const MelonNetworkHistoryQuery = gql`
  query MelonNetworkHistoryQuery($limit: Int!, $skip: Int!) {
    melonNetworkHistories(orderBy: timestamp, first: $limit, skip: $skip) {
      id
      timestamp
      gav
      validGav
    }
  }
`;

export const FundListQuery = gql`
  query FundListQuery($limit: Int!, $skip: Int!) {
    funds(orderBy: name, first: $limit, skip: $skip, where: { id_not: "0x1e3ef9a8fe3cf5b3440b0df8347f1888484b8dc2" }) {
      id
      name
      gav
      sharePrice
      totalSupply
      isShutdown
      createdAt
      investments {
        id
      }
      version {
        id
        name
      }
      accounting {
        id
        denominationAsset {
          id
          symbol
        }
      }
      calculationsHistory(orderBy: timestamp, orderDirection: desc, first: 2) {
        id
        sharePrice
        timestamp
      }
    }
  }
`;
