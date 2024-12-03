import React from 'react';
import { useGetCourseAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import Loader from '../../Loader/Loader';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip, LabelList } from 'recharts';
import { styles } from '@/app/styles/style';

type AnalyticsData = {
  name: string;
  count: number;
};

const CourseAnalytics: React.FC = () => {
  const { data, isLoading, isError } = useGetCourseAnalyticsQuery({});

  const fallbackData: AnalyticsData[] = [
    { name: 'Jun 2023', count: 3 },
    { name: 'Feb 2023', count: 4 },
    { name: 'Mar 2023', count: 6 },
    { name: 'Apr 2023', count: 2 },
    { name: 'May 2023', count: 7 },
    { name: 'June 2023', count: 9 },
    { name: 'Jul 2023', count: 5 },
    { name: 'Aug 2023', count: 8 },
    { name: 'Sep 2023', count: 6 },
    { name: 'Oct 2023', count: 7 },
    { name: 'Nov 2023', count: 4 },
    { name: 'Dec 2023', count: 2 },
  ];

  const analyticsData: AnalyticsData[] = data
    ? data.courses.last12Months.map((item: any) => ({
        name: item.month,
        count: item.count,
      }))
    : fallbackData;

  if (isError) {
    return <div className="text-red-500 text-center mt-4">Failed to load analytics data.</div>;
  }

  if (analyticsData.every((item) => item.count === 0)) {
    return <div className="text-center mt-4 text-gray-500">No data available for the last 12 months.</div>;
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} text-3xl font-bold text-gray-900`}>Course Analytics</h1>
            <p className={`${styles.label} px-5 text-center`}>Last 12 Month Analytics</p>
          </div>
          <div className="w-full h-[90%] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="50%">
              <BarChart width={150} height={300} data={analyticsData}>
                <XAxis dataKey="name" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc' }}
                  labelStyle={{ color: '#000000' }}
                  cursor={{ fill: 'rgba(63, 175, 130, 0.2)' }}
                />
                <Bar dataKey="count" fill="#3faf82">
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAnalytics;
