const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000/api';

export interface UserProfile {
  id: number;
  wallet_address: string;
  name: string;
  email: string;
  profileType: 'donor' | 'charity';
  createdAt: string;
}

export interface Charity {
  id: number;
  name: string;
  description: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  onChainId?: number;
  creator: UserProfile;
  documents: {
    govId: string;
    approvalDoc: string;
  };
  createdAt: string;
}

export interface Donation {
  id: number;
  charity: Charity;
  donor: UserProfile;
  amount: number;
  transactionHash: string;
  message?: string;
  createdAt: string;
}

export class ApiService {
  static async getCharities(): Promise<Charity[]> {
    const response = await fetch(`${API_BASE_URL}/charities/`);
    if (!response.ok) throw new Error('Failed to fetch charities');
    return response.json();
  }

  static async getCharity(id: number): Promise<Charity> {
    const response = await fetch(`${API_BASE_URL}/charities/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch charity');
    return response.json();
  }

  static async createCharity(formData: FormData): Promise<Charity> {
    const response = await fetch(`${API_BASE_URL}/charities/create/`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create charity');
    return response.json();
  }

  static async updateCharityStatus(id: number, status: string): Promise<Charity> {
    const response = await fetch(`${API_BASE_URL}/charities/${id}/status/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update charity status');
    return response.json();
  }

  static async updateCharityOnChainId(id: number, onChainId: number): Promise<Charity> {
    const response = await fetch(`${API_BASE_URL}/charities/${id}/on-chain-id/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ on_chain_id: onChainId }),
    });
    if (!response.ok) throw new Error('Failed to update on-chain ID');
    return response.json();
  }

  static async getUserProfile(walletAddress: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/profile/${walletAddress}/`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }

  static async createUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user profile');
    return response.json();
  }

  static async createDonation(data: Partial<Donation>): Promise<Donation> {
    const response = await fetch(`${API_BASE_URL}/donations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create donation');
    return response.json();
  }

  static async getDonations(filters?: { charity?: number; donor?: string }): Promise<Donation[]> {
    const params = new URLSearchParams();
    if (filters?.charity) params.append('charity', filters.charity.toString());
    if (filters?.donor) params.append('donor', filters.donor);
    
    const response = await fetch(`${API_BASE_URL}/donations/list/?${params}`);
    if (!response.ok) throw new Error('Failed to fetch donations');
    return response.json();
  }
}
