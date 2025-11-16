
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import StatsCard from './admin/StatsCard';
import QuickActionsCard from './admin/QuickActionsCard';
import RecentContentCard from './admin/RecentContentCard';
import ContentManagementCard from './admin/ContentManagementCard';
import { 
    IconBook, IconNews, IconVideo, IconImage, IconSliders, IconActivity, 
    IconMagazine, IconArticle, IconGraduationCap, IconShoppingBag, 
    IconBarChart, IconQuote, IconHandshake, IconMenu, IconInfo,
    IconPlus, IconFileText
} from './Icons';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    // Stats data
    const stats = [
        { title: 'Total Content', value: '1,247', icon: IconFileText, color: 'bg-[#085383]', change: '+12.5%', changeType: 'increase' as const },
        { title: 'Published Today', value: '23', icon: IconNews, color: 'bg-[#074976]', change: '+5.2%', changeType: 'increase' as const },
        { title: 'Pending Review', value: '8', icon: IconActivity, color: 'bg-[#255176]', change: '-2.1%', changeType: 'decrease' as const },
        { title: 'Total Views', value: '45.2K', icon: IconBarChart, color: 'bg-[#053e69]', change: '+18.7%', changeType: 'increase' as const },
    ];

    // Quick actions
    const quickActions = [
        { title: 'New Article', description: 'Create a new article or blog post', icon: IconArticle, color: 'bg-[#085383]' },
        { title: 'Upload Video', description: 'Add a new video to the library', icon: IconVideo, color: 'bg-[#074976]' },
        { title: 'Add Course', description: 'Create a new online course', icon: IconGraduationCap, color: 'bg-[#255176]' },
        { title: 'New Product', description: 'Add a product to the store', icon: IconShoppingBag, color: 'bg-[#053e69]' },
    ];

    // Content sections
    const contentSections = [
        { id: 'menu', name: 'Menu', icon: IconMenu, count: 12, color: 'bg-[#085383]' },
        { id: 'slider', name: 'Sliders', icon: IconSliders, count: 5, color: 'bg-[#074976]' },
        { id: 'books', name: 'Books', icon: IconBook, count: 156, color: 'bg-[#255176]' },
        { id: 'news', name: 'News', icon: IconNews, count: 89, color: 'bg-[#053e69]' },
        { id: 'activities', name: 'Activities', icon: IconActivity, count: 34, color: 'bg-[#085383]' },
        { id: 'magazine', name: 'Magazine', icon: IconMagazine, count: 24, color: 'bg-[#074976]' },
        { id: 'articles', name: 'Articles', icon: IconArticle, count: 234, color: 'bg-[#255176]' },
        { id: 'courses', name: 'Courses', icon: IconGraduationCap, count: 45, color: 'bg-[#053e69]' },
        { id: 'products', name: 'Products', icon: IconShoppingBag, count: 78, color: 'bg-[#085383]' },
        { id: 'infographics', name: 'Infographics', icon: IconImage, count: 67, color: 'bg-[#074976]' },
        { id: 'videos', name: 'Videos', icon: IconVideo, count: 123, color: 'bg-[#255176]' },
        { id: 'testimonials', name: 'Testimonials', icon: IconQuote, count: 56, color: 'bg-[#053e69]' },
        { id: 'partners', name: 'Partners', icon: IconHandshake, count: 28, color: 'bg-[#085383]' },
        { id: 'footer', name: 'Footer', icon: IconMenu, count: 8, color: 'bg-[#074976]' },
        { id: 'about', name: 'About', icon: IconInfo, count: 6, color: 'bg-[#255176]' },
    ];

    // Recent content
    const recentContent = [
        { id: '1', title: 'Introduction to Modern Web Development', status: 'published' as const, lastModified: '2 hours ago', type: 'Article' },
        { id: '2', title: 'Understanding React Hooks in Depth', status: 'draft' as const, lastModified: '5 hours ago', type: 'Course' },
        { id: '3', title: 'New Summer Collection 2024', status: 'pending' as const, lastModified: '1 day ago', type: 'Product' },
        { id: '4', title: 'Building Scalable Applications', status: 'published' as const, lastModified: '2 days ago', type: 'Video' },
        { id: '5', title: 'Customer Success Stories', status: 'published' as const, lastModified: '3 days ago', type: 'Testimonial' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                        Content Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Manage all your website content from one place
                    </p>
                </div>
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
                    <IconPlus className="w-4 h-4" />
                    <span>New Content</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        change={stat.change}
                        changeType={stat.changeType}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Content Management */}
                <div className="xl:col-span-2 space-y-6">
                    <ContentManagementCard sections={contentSections} />
                    <RecentContentCard items={recentContent} />
                </div>

                {/* Right Column - Quick Actions */}
                <div className="space-y-6">
                    <QuickActionsCard actions={quickActions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
