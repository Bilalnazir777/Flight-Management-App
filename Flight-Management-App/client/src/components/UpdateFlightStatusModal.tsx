"use client";
import React, { useState } from "react";
import { Flight } from "@/_utils/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetError, updateFlight } from "@/lib/features/flightSlice";

interface UpdateFlightStatusModalProps {
  isOpen: boolean;
  flight: Flight;
  onClose: () => void;
}

const statusOptions = [
  "Delayed",
  "On Time",
  "Cancelled",
  "In-flight",
  "Scheduled/En Route",
];

const UpdateFlightStatusModal: React.FC<UpdateFlightStatusModalProps> = ({
  flight,
  isOpen,
  onClose,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(flight.status);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.flight);
  if (!isOpen) return null;

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateClick = async () => {
    dispatch(resetError());
    const response: any = await dispatch(
      updateFlight({
        flightNumber: flight.flightNumber,
        status: selectedStatus,
      })
    );
    if (response.payload.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-[#1a202c] to-[#2d3748] text-white rounded-lg w-full max-w-md md:max-w-2xl p-8 relative shadow-lg transform transition-all duration-300">
        {/* Modal Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Update Status for Flight Number{" "}
          <span className="inline-block py-1 px-4 bg-blue-600 rounded-full text-white text-lg font-bold">
            {flight.flightNumber}
          </span>
        </h2>

        {/* Status Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Select Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full px-4 py-3 bg-[#3B3F5C] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-[#4a5568]"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Update Button */}
        <div className="mt-4">
          <button
            onClick={handleUpdateClick}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-md text-lg transition duration-300 hover:from-blue-400 hover:to-teal-400"
          >
            {loading ? "Loading..." : "Update Status"}
          </button>
        </div>

        {/* Close Button Below the Update Button */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white py-3 rounded-md text-lg transition duration-300 hover:bg-red-500"
          >
            Close
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mt-4 p-4 bg-red-600 text-white rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateFlightStatusModal;
