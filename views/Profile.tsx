import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

export const Profile: React.FC<Props> = ({ onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle a class on the document body
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark pt-12 pb-8 px-4 rounded-b-[2rem] shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">My Profile</h1>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <span className="material-icons-round">settings</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white dark:border-gray-800">
                JD
             </div>
             <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
               <span className="material-icons-round text-xs">edit</span>
             </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h2>
            <p className="text-sm text-gray-500">Regional Manager • Karnataka</p>
            <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               Active now
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
           <div className="text-center">
             <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
             <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Regions</p>
           </div>
           <div className="text-center border-l border-r border-gray-100 dark:border-gray-700">
             <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
             <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Efficiency</p>
           </div>
           <div className="text-center">
             <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
             <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Team</p>
           </div>
        </div>
      </div>

      <main className="px-4 space-y-4">
        
        {/* Account Settings */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
           <MenuItem icon="person" label="Personal Information" />
           <MenuItem icon="lock" label="Login & Security" />
           <MenuItem icon="account_balance_wallet" label="My Incentive Dashboard" isLast />
        </section>

        {/* App Settings */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Preferences</h3>
           
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600">
                    <span className="material-icons-round text-lg">dark_mode</span>
                 </div>
                 <span className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-primary' : 'bg-gray-200'}`}
              >
                 <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
           </div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600">
                    <span className="material-icons-round text-lg">notifications</span>
                 </div>
                 <span className="text-sm font-medium text-gray-900 dark:text-white">Notifications</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${notifications ? 'bg-primary' : 'bg-gray-200'}`}
              >
                 <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
           </div>
        </section>

        <button className="w-full py-4 text-red-500 font-semibold bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
           Log Out
        </button>
        
        <p className="text-center text-xs text-gray-400 pt-4">App Version 2.4.0 (Build 202)</p>

      </main>
    </div>
  );
};

const MenuItem = ({ icon, label, isLast = false }: { icon: string, label: string, isLast?: boolean }) => (
  <button className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors ${!isLast ? 'mb-1' : ''}`}>
     <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600">
           <span className="material-icons-round text-lg">{icon}</span>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
     </div>
     <span className="material-icons-round text-gray-300">chevron_right</span>
  </button>
);
