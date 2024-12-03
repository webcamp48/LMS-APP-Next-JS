import React, { FC } from 'react';
import UserAnalytics from '../Analytics/UserAnalytics';
import OrderAnalytics from '../Analytics/OrderAnalytics';
import { BiBorderLeft } from 'react-icons/bi';
import { Box, CircularProgress } from '@mui/material';
import AllInvoices from '../Order/AllInvoices';

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? 'info' : 'error'}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open, value }) => {
  return (
    <div className="min-h-screen px-6 lg:px-12 bg-gray-100 dark:bg-[#111c43]">
      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Analytics Section */}
        <div className="col-span-2 p-8 bg-white dark:bg-[#111c43] rounded-lg shadow-xl">
          <UserAnalytics />
        </div>

        {/* Right Widgets Section */}
        <div className="space-y-8">
          {/* Sales Widget */}
          <div className="w-full bg-white dark:bg-[#1e2a47] rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BiBorderLeft className="text-[#d4ed3b] dark:text-[#8aff72] text-[30px]" />
                <div>
                  <h5 className="text-2xl font-semibold text-black dark:text-white">
                    120
                  </h5>
                  <h5 className="text-sm text-black dark:text-white opacity-80">
                    Sales Obtained
                  </h5>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <CircularProgressWithLabel value={value} open={open} />
            </div>
            <h5 className="text-center pt-4 text-lg text-black dark:text-white">+120%</h5>
          </div>

          {/* New Users Widget */}
          <div className="w-full bg-white dark:bg-[#1e2a47] rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BiBorderLeft className="text-[#d4ed3b] dark:text-[#8aff72] text-[30px]" />
                <div>
                  <h5 className="text-2xl font-semibold text-black dark:text-white">
                    450
                  </h5>
                  <h5 className="text-sm text-black dark:text-white opacity-80">
                    New Users
                  </h5>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <CircularProgressWithLabel value={value} open={open} />
            </div>
            <h5 className="text-center pt-4 text-lg text-black dark:text-white">+150%</h5>
          </div>
        </div>
      </div>

      {/* Lower Section for Analytics & Invoices */}
      <div className="grid gap-8 mt-12">
        {/* Order Analytics */}
        <div className="col-span-2 bg-white dark:bg-[#111c43] rounded-lg shadow-xl p-6">
          <OrderAnalytics isDashboard={true} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white mb-10 dark:bg-[#1e2a47] rounded-lg shadow-xl p-6">
          <h5 className="text-xl font-semibold text-black dark:text-white pb-4">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
