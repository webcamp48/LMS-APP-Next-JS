import { useGetUsersAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import React from 'react';
import Loader from '../../Loader/Loader';
import { styles } from './../../../styles/style';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type AnalyticsData = {
  name: string;
  count: number;
};

type Props = {
  isDashboard?: boolean;
};

// Fallback data - Removed duplicate months
const fallbackData: AnalyticsData[] = [
  { name: 'Jun 2023', count: 3 },
  { name: 'Jul 2023', count: 5 },
  { name: 'Aug 2023', count: 8 },
  { name: 'Sep 2023', count: 6 },
  { name: 'Oct 2023', count: 7 },
  { name: 'Nov 2023', count: 4 },
  { name: 'Dec 2023', count: 4 }, 
];

const UserAnalytics: React.FC<Props> = ({ isDashboard }) => {
  const { data, isLoading, isError } = useGetUsersAnalyticsQuery({});

  // Handling API data or fallback data if API call fails
  const analyticsData: AnalyticsData[] = isLoading
    ? []
    : data?.users?.last12Months?.map((item: any) => ({
        name: item.month,
        count: item.count,
      })) || fallbackData;

  // Show error message if API call fails
  if (isError) {
    return <div className="text-center text-red-600">Failed to load analytics data</div>;
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${!isDashboard ? "mt-[50px]" : "mt-[50px] dark:bg-[#111c43] shadow-sm pb-5 rounded-sm"}`}>
          <div className={`${isDashboard ? "ml-8 mb-5" : ""}`}>
            <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'} px-5 text-center`}>Users Analytics</h1>
            {!isDashboard && (
              <p className={`${styles.title} !text-[16px] px-5 text-center`}>
                Last 12 Month Analytics Data
              </p>
            )}
          </div>
          <div className={`w-full ${isDashboard ? "h-[30vh]" : "h-screen"} flex items-center justify-center`}>
            <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={!isDashboard ? "50%" : "100%"}>
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4d62d9"
                  fill="#4d62d9"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnalytics;
