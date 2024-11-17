"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getFlights } from "@/lib/features/flightSlice";
import { Flight } from "@/_utils/types";
import UpdateFlightStatus from "@/components/UpdateFlightStatus";
import { removeAccessToken, removeRole } from "@/_utils/helpers/auth";
import { useRouter } from "next/navigation";

// Status badge color mapping
const statusBadgeColors: { [key: string]: string } = {
  Delayed: "bg-yellow-400 text-yellow-800",
  Cancelled: "bg-red-500 text-white",
  "In-flight": "bg-blue-500 text-white",
  "Scheduled/En Route": "bg-green-500 text-white",
  All: "bg-gray-300 text-gray-700", // Default for "All"
};

const statusOptions = [
  "Delayed",
  "Cancelled",
  "In-flight",
  "Scheduled/En Route",
  "All",
];
const airlineOptions = [
  "PIA",
  "Emirates",
  "Qatar Airlines",
  "Air India",
  "All",
];
const flightTypeOptions = ["Private", "Commercial", "Military", "All"];

const FlightTable = () => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [airline, setAirline] = useState("");
  const [flightType, setFlightType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { loading, error, flights, pagination } = useAppSelector(
    (state) => state.flight
  );

  const router = useRouter();

  useEffect(() => {
    // Retrieve role from localStorage
    const storedRole = localStorage.getItem("role");

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = () => {
      getAndSetFlight();
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    getAndSetFlight();
  }, [currentPage, searchQuery, limit, status, airline, flightType]);

  const getAndSetFlight = async () => {
    const params = {
      page: currentPage,
      search: searchQuery,
      status: status,
      airline: airline,
      flightType: flightType,
      limit: limit,
    };

    await dispatch(getFlights(params));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilter = (type: string, value: string) => {
    if (type === "status") {
      setStatus(value === "All" ? "" : value);
    }
    if (type === "airline") {
      setAirline(value === "All" ? "" : value);
    }
    if (type === "flightType") {
      setFlightType(value === "All" ? "" : value);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const openModal = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = () => {
    removeAccessToken();
    removeRole();
    localStorage.removeItem("role");
    router.replace("/login");
  };

  return (
    <div
      className="p-8 space-y-6 min-h-screen bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('airplane.jpg')" }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Flights Management
        </h1>

        {/* User Profile Icon with Dropdown */}
        {role && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-200"
            >
              {/* Simple User Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2a4 4 0 100 8 4 4 0 000-8zm0 14c-3.314 0-6 2.686-6 6v2h12v-2c0-3.314-2.686-6-6-6z"
                />
              </svg>

              {/* Display role text next to the icon */}
              <span className="text-gray-800 text-sm">{role}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 mt-4">
        <Input
          placeholder="Search flight here..."
          onChange={handleSearch}
          className="w-full max-w-md p-3 bg-white rounded-md shadow-md"
        />
        <Select onValueChange={(value: any) => handleFilter("status", value)}>
          <SelectTrigger className="p-2 bg-white rounded-md shadow-md w-48">
            <span>Flights Status</span>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value: any) => handleFilter("airline", value)}>
          <SelectTrigger className="p-2 bg-white rounded-md shadow-md w-48">
            <span>Airline</span>
          </SelectTrigger>
          <SelectContent>
            {airlineOptions.map((airline) => (
              <SelectItem key={airline} value={airline}>
                {airline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: any) => handleFilter("flightType", value)}
        >
          <SelectTrigger className="p-2 bg-white rounded-md shadow-md w-48">
            <span>Select Flight Type here</span>
          </SelectTrigger>
          <SelectContent>
            {flightTypeOptions.map((flightType) => (
              <SelectItem key={flightType} value={flightType}>
                {flightType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && !isModalOpen && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 py-4">
          <p>{error}</p>
        </div>
      )}

      {/* No Data Found */}
      {!loading && !error && flights.length === 0 && (
        <div className="text-center text-gray-600 py-4">
          <p>No Data Found</p>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-600">
          Total Flights: {pagination.totalFlights}
        </span>
        <div className="flex items-center space-x-2">
          <div
            onClick={handlePreviousPage}
            className={`p-2 rounded-md cursor-pointer ${
              currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </div>
          <span>
            Page {currentPage} of {pagination.totalPages}
          </span>
          <div
            onClick={handleNextPage}
            className={`p-2 rounded-md cursor-pointer ${
              currentPage >= pagination.totalPages
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={currentPage >= pagination.totalPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <h1>Record to dsiplay in page</h1>
          <select
            onChange={handleLimitChange}
            value={limit}
            className="p-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Flight Table */}
      {!loading && !error && flights.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full bg-white rounded-md shadow-md border-collapse">
            <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-left">
              <tr>
                <th className="p-4 text-sm font-semibold tracking-wide">
                  Flight Number
                </th>
                <th className="p-4 text-sm font-semibold tracking-wide">
                  Origin
                </th>
                <th className="p-4 text-sm font-semibold tracking-wide">
                  Destination
                </th>
                <th className="p-4 text-sm font-semibold tracking-wide">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold tracking-wide">
                  Airline
                </th>
                <th className="p-4 text-sm font-semibold tracking-wide">
                  Flight Type
                </th>
                {role === "admin" && (
                  <th className="p-4 text-sm font-semibold tracking-wide">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {flights.map((flight) => (
                <tr
                  key={flight._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition duration-150 ${
                    flight.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : ""
                  }`}
                >
                  <td className="p-4">{flight.flightNumber}</td>
                  <td className="p-4">{flight.origin}</td>
                  <td className="p-4">{flight.destination}</td>
                  <td className="p-4">
                    {/* Status Badge */}
                    <span
                      className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${
                        statusBadgeColors[flight.status]
                      }`}
                    >
                      {flight.status}
                    </span>
                  </td>
                  <td className="p-4">{flight.airline}</td>
                  <td className="p-4">{flight.flightType}</td>
                  {role === "admin" && (
                    <td className="p-4">
                      <div
                        onClick={() => openModal(flight)}
                        className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition"
                        title="Update Status"
                      >
                        {/* SVG Icon (Edit/Pencil Icon) */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <path d="M15 3l3 3-9 9h-3v-3l9-9z"></path>
                        </svg>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedFlight && (
        <UpdateFlightStatus
          isOpen={isModalOpen}
          onClose={closeModal}
          flight={selectedFlight}
        />
      )}
    </div>
  );
};

export default FlightTable;
