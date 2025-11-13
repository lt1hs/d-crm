
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { TimeOffRequest } from '../../types';
import { IconChevronDown } from '../Icons';

const timeOffRequests: TimeOffRequest[] = [
  { user: { name: 'Liam Bennett', location: 'USA', avatar: 'https://picsum.photos/id/1025/100/100' }, date: '4 Nov, 2024' },
  { user: { name: 'Noah Harrison', location: 'UK', avatar: 'https://picsum.photos/id/1027/100/100' }, date: '4 Nov, 2024' },
  { user: { name: 'Isabella Reed', location: 'Canada', avatar: 'https://picsum.photos/id/1028/100/100' }, date: '4 Nov, 2024' },
];

const TimeOffRequestsCard: React.FC = () => {
    const { t, dir } = useTranslation();

    return (
        <Card padding="p-0">
             <div className="p-6">
                <CardHeader
                    title={t('card.title.timeOffRequests')}
                    action={
                        <button className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                            {t('timeOff.next30Days')}
                            <IconChevronDown className="w-4 h-4 ml-1" />
                        </button>
                    }
                />
             </div>
            <ul className="divide-y divide-gray-200">
                {timeOffRequests.map((request, index) => (
                    <li key={index} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={request.user.avatar} alt={request.user.name} className="w-10 h-10 rounded-full" />
                                <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{request.user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{request.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    {t('timeOff.reject')}
                                </button>
                                <button className="text-sm font-medium text-white bg-teal-500 border border-teal-500 rounded-lg px-3 py-1.5 hover:bg-teal-600 transition-colors">
                                    {t('timeOff.approve')}
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default TimeOffRequestsCard;
