"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { useTranslations } from 'next-intl'; // Import the useTranslations hook

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const t = useTranslations('Navbar'); // Initialize the translations hook for the 'Navbar' namespace

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dashboardUrl");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="pt-6 pb-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={"/assets/images/logo-full.png"}
              width={150}
              height={150}
            />
          </div>

          {/* Navigation Links */}
          <div className="md:flex items-center space-x-6 text-sm lg:text-base text-nowrap">
            <div>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">{t('profileAltText')}</span>
                    <img
                      alt=""
                      src="/assets/images/avatar.png"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
                >
                  <MenuItem key={"Your Profile"}>
                    <Link
                      href="/dashboard/user-profile"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      {t('profileLink')}
                    </Link>
                  </MenuItem>
                  <MenuItem key={"Careers"}>
                    <Link
                      href="/dashboard/careers"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      {t('careersLink')}
                    </Link>
                  </MenuItem>

                  <MenuItem key={"Sign Out"}>
                    <a
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      {t('signOutLink')}
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-75 z-50 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="w-64 h-full bg-white p-4">
          <button className="text-black float-right" onClick={toggleSidebar}>
            {t('sidebarCloseButton')}
          </button>
          <div className="mt-8">
            <a href="#" className="block py-2 text-black hover:bg-gray-200">
              {t('aboutUsLink')}
            </a>
            <a
              href="./login"
              className="block py-2 text-black hover:bg-gray-200"
            >
              {t('sidebarLogin')}
            </a>
            <select className="bg-transparent text-black mt-4">
              <option value="">{t('solutionsPlaceholder')}</option>
              <option value="">{t('options.option1')}</option>
              <option value="">{t('options.option2')}</option>
              <option value="">{t('options.option3')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
