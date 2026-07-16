import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../../lib/constants';

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [hindiLogoFailed, setHindiLogoFailed] = useState(false);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['Manage Content']);

  const toggleMenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
        <div className="flex items-center min-w-0">
          {!logoFailed && (
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ravivar Vichar" className="h-9 w-auto shrink-0" onError={() => setLogoFailed(true)} />
          )}
    <div className="flex flex-col items-start justify-center">
      <div className="flex items-center">
        {!hindiLogoFailed && (
          <img src={`${import.meta.env.BASE_URL}logo-hindi.png`} alt="रविवार" className="h-7 w-auto -ml-1 translate-y-3" onError={() => setHindiLogoFailed(true)} />
        )}
        {hindiLogoFailed && (
          <p className="text-xs font-medium text-gray-300">रविवार</p>
        )}
      </div>
      <p className="text-[12px] text-gray-400 mt-3 -ml-12">Content Management</p>
    </div>
        </div>
        <button onClick={onMobileClose} className="text-gray-400 hover:text-white lg:hidden">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const expanded = expandedMenus.includes(item.label);
          const active = isActive(item.path, item.exact);

          if (hasChildren) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {expanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onMobileClose}
                          className={({ isActive: childActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              childActive
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`
                          }
                        >
                          <ChildIcon size={16} />
                          <span>{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onMobileClose}
              className={({ isActive: navActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  navActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 px-6 py-4">
        <p className="text-xs text-gray-500">Ravivar Vichar CMS v1.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 w-64">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
