
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card, { CardHeader } from '../Card';
import { IconChevronRight } from '../Icons';
import { TranslationKey } from '../../types';

const payrollData = [
  { labelKey: 'payroll.grossPay', amount: 20312, value: 40, color: 'bg-blue-500' },
  { labelKey: 'payroll.deductions', amount: 14896, value: 30, color: 'bg-teal-400' },
  { labelKey: 'payroll.taxes', amount: 10000, value: 20, color: 'bg-purple-500' },
  { labelKey: 'payroll.benefits', amount: 3000, value: 6, color: 'bg-yellow-400' },
  { labelKey: 'payroll.others', amount: 1896, value: 4, color: 'bg-red-400' },
];
const totalAmount = 50104;

const PayrollCard: React.FC = () => {
    const { t, dir } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
    }

    return (
        <Card>
            <CardHeader
                title={t('card.title.payroll')}
                action={
                    <a href="#" className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800">
                        {t('payroll.viewAll')}
                        <IconChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'transform -scale-x-100' : ''}`} />
                    </a>
                }
            />
            <div className="flex justify-between items-baseline mb-4">
                <span className="text-sm text-gray-500">{t('payroll.submissionToday')}</span>
                <span className="text-xl font-semibold text-gray-800">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="w-full flex h-3 rounded-full overflow-hidden mb-6">
                {payrollData.map((item, index) => (
                    <div key={index} className={item.color} style={{ width: `${item.value}%` }} title={`${t(item.labelKey as TranslationKey)}: ${formatCurrency(item.amount)}`}></div>
                ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-4">
                {payrollData.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center mb-1">
                            <span className={`w-2 h-2 rounded-full ${item.color} ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{t(item.labelKey as TranslationKey)}</span>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{formatCurrency(item.amount)}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PayrollCard;
