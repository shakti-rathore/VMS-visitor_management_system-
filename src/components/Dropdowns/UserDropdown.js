import React from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { PlayCircleIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // React Router for navigation

const userOptions = [
  { name: "Profile", href: "#", icon: PlayCircleIcon },
  { name: "Settings", href: "#", icon: PhoneIcon },
  { name: "Logout", href: "#", icon: PlayCircleIcon },
];

export default function UserDropdown() {
  const navigate = useNavigate(); // For redirecting after logout

  // Logout function
  const handleLogout = async () => {
    try {
  
       localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');

      // Optionally, redirect the user to the login page
      navigate('/login'); // You can adjust the route based on your app structure
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Popover className="relative">
      {/* Dropdown Button */}
      <PopoverButton className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300">
        <UserIcon className="h-6 w-6" aria-hidden="true" />
      </PopoverButton>

      {/* Dropdown Panel */}
      <PopoverPanel className="absolute left-0 -ml-28 z-10 mt-5 w-48 px-4 py-2 bg-white shadow-lg rounded-lg">
        <div>
          {userOptions.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-x-2 py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                if (item.name === "Logout") {
                  handleLogout(); // Call logout function if "Logout" is clicked
                }
              }}
            >
              <item.icon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              {item.name}
            </a>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
