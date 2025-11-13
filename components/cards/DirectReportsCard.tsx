
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { User } from '../../types';
import { IconChevronRight, IconMoon, IconSun } from '../Icons';

const directReports: User[] = [
  { name: 'Jacob Mitchell', location: 'Switzerland', avatar: 'https://picsum.photos/id/1005/100/100', time: '10:30 AM', status: 'offline' },
  { name: 'Emma Wright', location: 'France', avatar: 'https://picsum.photos/id/1011/100/100', time: '11:20 PM', status: 'online' },
  { name: 'James Hayes', location: 'United State', avatar: 'https://picsum.photos/id/1012/100/100', time: '4:30 AM', status: 'offline' },
];

const DirectReportsCard: React.FC = () => {
    const { t, dir } = useTranslation();

    return (
        <Card padding="p-0">
            <div className="p-6">
                 <CardHeader
                    title={t('card.title.directReports')}
                    action={
                         <a href="#" className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800">
                            {t('reports.viewAll')}
                            <IconChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'transform -scale-x-100' : ''}`} />
                        </a>
                    }
                />
            </div>
            <ul className="divide-y divide-gray-200">
                {directReports.map((report) => (
                    <li key={report.name} className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                            <img src={report.avatar} alt={report.name} className="w-10 h-10 rounded-full" />
                            <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{report.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{report.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{report.time}</span>
                            {report.status === 'online' ? <IconSun className="w-4 h-4 text-yellow-500 ml-2" /> : <IconMoon className="w-4 h-4 text-gray-400 ml-2" />}
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default DirectReportsCard;
