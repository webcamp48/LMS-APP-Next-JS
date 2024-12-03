import React from 'react';
import { useGetOrdersAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import Loader from '../../Loader/Loader'; 
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip, LabelList } from 'recharts';
type Props = {
  isDashboard? : boolean;
}

const OrderAnalytics: React.FC<Props> = () => {
  const { data, isLoading, isError } = useGetOrdersAnalyticsQuery({});

  const analyticsData =
    data?.orders?.last12Months?.map((item: any) => ({
      name: item.month,
      count: item.count,
    })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError || analyticsData.length === 0) {
    return (
      <div className="text-center mt-4 text-gray-500">
        {isError ? 'Failed to load analytics data.' : 'No data available for the last 12 months.'}
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="mt-[50px] text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Analytics</h1>
        <p className="text-gray-500 dark:text-white">Last 12 Month Analytics</p>
      </div>
      <div className="w-full h-[90%] flex items-center justify-center">
        <ResponsiveContainer width="90%" height="50%">
          <BarChart width={150} height={300} data={analyticsData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc' }}
              labelStyle={{ color: '#000000' }}
              cursor={{ fill: 'rgba(63, 175, 130, 0.2)' }}
            />
            <Bar dataKey="count" fill="#3faf82">
              <LabelList dataKey="count" position="top" className="text-sm font-bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderAnalytics;
