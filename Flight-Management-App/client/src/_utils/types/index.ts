export interface Tokens {
  access_token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  data: {
    role: string;
    token?: string;
  };
  message?: string;
}
export interface SignupPayload {
  username: string;
  password: string;
}
export interface SignupResponse {
  success: boolean;
  user: {
    role: string;
    username: string;
  };
  message?: string;
}

export interface AuthState {
  access_token: string;
  role: string;
  loading: boolean;
  error: string | null | undefined;
}
export interface Flight {
  _id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledDepartureTime: string; // ISO string
  status: string;
  airline: string;
  flightType: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  __v: number;
}

export interface FlightResponse {
  success: boolean;
  data: {
    flights: Flight[];
    pagination: {
      totalFlights: number;
      totalPages: number;
      currentPage: number;
    };
  };
}

export interface FlightParams {
  status?: string;
  search?: string;
  airline?: string;
  flightType?: string;
  page?: number;
  limit?: number;
}

export interface FlightState {
  flights: Flight[];
  pagination: {
    totalFlights: number;
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  error: string | null | undefined;
}

export interface FlightUpdateResponse {
  success: boolean;
  message: string;
}

export interface FlightUpdatePayload {
  flightNumber: string;
  status: string;
}
