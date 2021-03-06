import React from 'react';
import { Grid, withStyles, WithStyles, NoSsr } from '@material-ui/core';
import { InvestmentHistoryQuery, InvestmentRequestsQuery } from '~/queries/InvestorListQuery';

import Layout from '~/components/Layout';
import InvestorList from '~/components/InvestorList';
import { useScrapingQuery, proceedPaths } from '~/utils/useScrapingQuery';
import MaterialTable from 'material-table';
import { formatDate } from '~/utils/formatDate';
import { formatBigNumber } from '~/utils/formatBigNumber';
import TooltipNumber from '~/components/TooltipNumber';
import ShortAddress from '~/components/ShortAddress';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
});

type InvestorsProps = WithStyles<typeof styles>;

const Investors: React.FunctionComponent<InvestorsProps> = () => {
  const investmentHistoryResult = useScrapingQuery(
    [InvestmentHistoryQuery, InvestmentHistoryQuery],
    proceedPaths(['investmentHistories']),
    { ssr: false },
  );

  const investmentHistory = investmentHistoryResult.data?.investmentHistories || [];

  const investmentRequestsResult = useScrapingQuery(
    [InvestmentRequestsQuery, InvestmentRequestsQuery],
    proceedPaths(['investmentRequests']),
    { ssr: false },
  );

  const investmentRequests = (investmentRequestsResult.data?.investmentRequests || []).map((item) => {
    let expires = parseInt(item.requestTimestamp, 10) + 24 * 60 * 60;
    let status = item.status;
    if (new Date().getTime() > new Date(expires * 1000).getTime()) {
      status = 'EXPIRED';
      expires = undefined;
    }
    return {
      ...item,
      status,
      expires,
    };
  });

  return (
    <Layout title="Investors" page="investors">
      <Grid item={true} xs={12}>
        <InvestorList />
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12}>
        <NoSsr>
          <MaterialTable
            columns={[
              {
                title: 'Time',
                field: 'timestamp',
                render: (rowData) => {
                  return formatDate(rowData.timestamp, true);
                },
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Investor',
                render: (rowData) => {
                  return <ShortAddress address={rowData.owner.id} />;
                },
              },
              {
                title: 'Action',
                field: 'action',
              },
              {
                title: 'Fund',
                field: 'fund.name',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Amount',
                render: (rowData: any) => {
                  if (rowData.action === 'Redemption') {
                    return '';
                  }
                  return formatBigNumber(rowData.amount, rowData.asset.decimals, 3);
                },
                type: 'numeric',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
              {
                title: 'Asset',
                render: (rowData: any) => {
                  if (rowData.action === 'Redemption') {
                    return '(in kind)';
                  }
                  return rowData.asset.symbol;
                },
              },
              {
                title: 'Amount [ETH]',
                render: (rowData: any) => {
                  return formatBigNumber(rowData.amountInDenominationAsset, 18, 3);
                },
                type: 'numeric',
                cellStyle: {
                  whiteSpace: 'nowrap',
                },
                headerStyle: {
                  whiteSpace: 'nowrap',
                },
              },
            ]}
            data={investmentHistory}
            title="Latest investments and redemptions"
            options={{
              paging: true,
              pageSize: 10,
            }}
            isLoading={investmentHistoryResult.loading}
            onRowClick={(_, rowData: any) => {
              const url = '/investor?address=' + rowData.owner.id;
              window.open(url, '_self');
            }}
          />
        </NoSsr>
      </Grid>
      {investmentRequests && (
        <Grid item={true} xs={12}>
          <NoSsr>
            <MaterialTable
              columns={[
                {
                  title: 'Date',
                  render: (rowData: any) => {
                    return formatDate(rowData.requestTimestamp, true);
                  },
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
                {
                  title: 'Fund',
                  field: 'fund.name',
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
                {
                  title: 'Investor',
                  render: (rowData: any) => {
                    return <ShortAddress address={rowData.owner.id} />;
                  },
                },
                {
                  title: 'Shares',
                  render: (rowData: any) => {
                    return <TooltipNumber number={rowData.shares} />;
                  },
                  type: 'numeric',
                },
                {
                  title: 'Amount',
                  render: (rowData: any) => {
                    return <TooltipNumber number={rowData.amount} decimals={rowData.asset.decimals} />;
                  },
                  type: 'numeric',
                },
                {
                  title: 'Asset',
                  field: 'asset.symbol',
                },
                {
                  title: 'Status',
                  field: 'status',
                },
                {
                  title: 'Expires',
                  render: (rowData) => {
                    return rowData.expires && formatDate(rowData.expires, true);
                  },
                  cellStyle: {
                    whiteSpace: 'nowrap',
                  },
                },
              ]}
              data={investmentRequests}
              title="Pending investment request"
              options={{
                paging: false,
                search: false,
              }}
              isLoading={investmentRequestsResult.loading}
              onRowClick={(_, rowData) => {
                const url = '/investor?address=' + rowData.owner.id;
                window.open(url, '_self');
              }}
            />
          </NoSsr>
        </Grid>
      )}
    </Layout>
  );
};

export default withStyles(styles)(Investors);
